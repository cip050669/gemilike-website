import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

type NormalizedError = {
  message?: string;
  code?: string;
  meta?: unknown;
  stack?: string;
};

function normalizeError(error: unknown): NormalizedError {
  if (error && typeof error === 'object') {
    const errObj = error as Record<string, unknown>;
    return {
      message: typeof errObj.message === 'string' ? errObj.message : undefined,
      code: typeof errObj.code === 'string' ? errObj.code : undefined,
      meta: errObj.meta,
      stack: typeof errObj.stack === 'string' ? errObj.stack : undefined,
    };
  }
  return {};
}

export async function GET() {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json({ success: true, addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: {
        customerId: customer.id,
      },
      orderBy: {
        isDefault: 'desc'
      }
    });

    const transformed = addresses.map(({ street, street2, ...rest }) => ({
      ...rest,
      address1: street ?? '',
      address2: street2 ?? '',
    }));

    return NextResponse.json({
      success: true,
      addresses: transformed,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, session } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      console.error(`User with id ${userId} does not exist in database`);
      return NextResponse.json(
        { success: false, error: 'User not found. Please log in again.' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      // Create customer if it doesn't exist
      try {
        // Generate customer number
        const customerCount = await prisma.customer.count();
        const customerNumber = `CUST-${String(customerCount + 1).padStart(6, '0')}`;

        // Split name if available
        const nameParts = session?.user?.name?.split(' ') || [];
        const firstName = nameParts[0] || null;
        const lastName = nameParts.slice(1).join(' ') || null;

        customer = await prisma.customer.create({
          data: {
            userId,
            customerNumber,
            firstName,
            lastName,
            email: session?.user?.email ?? null,
          },
          select: { id: true },
        });
        console.log(`Created customer for user ${userId}`);
      } catch (createError) {
        console.error('Error creating customer:', createError);
        return NextResponse.json(
          { success: false, error: 'Failed to create customer record' },
          { status: 500 }
        );
      }
    }

    const body = await request.json();
    console.log('Received address data:', body);
    
    const { type, firstName, lastName, company, address1, address2, city, state, postalCode, country, phone, isDefault } = body;

    // Validate required fields
    if (!firstName || !lastName || !address1 || !city || !postalCode || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: firstName, lastName, address1, city, postalCode, country' },
        { status: 400 }
      );
    }

    // Convert type to uppercase enum value
    let addressType: 'BILLING' | 'SHIPPING' | 'OTHER' | null = null;
    if (type) {
      const upperType = type.toUpperCase();
      if (upperType === 'BILLING' || upperType === 'SHIPPING' || upperType === 'OTHER') {
        addressType = upperType as 'BILLING' | 'SHIPPING' | 'OTHER';
      } else {
        // Default to SHIPPING if invalid type provided
        addressType = 'SHIPPING';
      }
    } else {
      addressType = 'SHIPPING';
    }

    // If this is set as default, unset other defaults of the same type
    if (isDefault && addressType) {
      await prisma.address.updateMany({
        where: {
          customerId: customer.id,
          type: addressType
        },
        data: {
          isDefault: false
        }
      });
    }

    try {
      const address = await prisma.address.create({
        data: {
          customerId: customer.id,
          type: addressType,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          company: company?.trim() || null,
          street: address1.trim(),
          street2: address2?.trim() || null,
          city: city.trim(),
          state: state?.trim() || null,
          postalCode: postalCode.trim(),
          country: country.trim() || 'DE',
          phone: phone?.trim() || null,
          isDefault: Boolean(isDefault)
        }
      });

      console.log('Address created successfully:', address.id);

      return NextResponse.json({
        success: true,
        address: {
          ...address,
          address1: address.street ?? '',
          address2: address.street2 ?? '',
        }
      });
    } catch (dbError: unknown) {
      const normalizedError = normalizeError(dbError);
      console.error('Database error creating address:', dbError);
      console.error('Error details:', {
        message: normalizedError.message,
        code: normalizedError.code,
        meta: normalizedError.meta,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: `Database error: ${normalizedError.message || 'Failed to create address'}` 
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const normalizedError = normalizeError(error);
    console.error('Error creating address:', error);
    console.error('Error stack:', normalizedError.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: normalizedError.message || 'Failed to create address' 
      },
      { status: 500 }
    );
  }
}
