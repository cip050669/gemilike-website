import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all select options from database
export async function GET() {
  try {
    const options = await prisma.selectOption.findMany({
      orderBy: [
        { category: 'asc' },
        { order: 'asc' }
      ]
    });
    
    return NextResponse.json({ success: true, options });
  } catch (error) {
    console.error('Error fetching select options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch select options' },
      { status: 500 }
    );
  }
}

// POST - Create new select option
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { value, label, category, isActive = true, order = 0 } = body;

    if (!value || !category) {
      return NextResponse.json(
        { success: false, error: 'Value and category are required' },
        { status: 400 }
      );
    }

    const newOption = await prisma.selectOption.create({
      data: {
        value,
        label: label || value,
        category,
        isActive,
        order,
      }
    });

    return NextResponse.json({ success: true, option: newOption });
  } catch (error) {
    console.error('Error creating select option:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create select option' },
      { status: 500 }
    );
  }
}

// PUT - Update select option
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, value, label, category, isActive, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (value !== undefined) updateData.value = value;
    if (label !== undefined) updateData.label = label;
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const updatedOption = await prisma.selectOption.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, option: updatedOption });
  } catch (error) {
    console.error('Error updating select option:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update select option' },
      { status: 500 }
    );
  }
}

// DELETE - Delete select option
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.selectOption.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting select option:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete select option' },
      { status: 500 }
    );
  }
}
