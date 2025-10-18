import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Alle Bankkonten abrufen
export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: { isDefault: 'desc' }
    });
    return NextResponse.json({ success: true, accounts });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bank accounts' },
      { status: 500 }
    );
  }
}

// POST - Neues Bankkonto erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Wenn isDefault true ist, alle anderen auf false setzen
    if (body.isDefault) {
      await prisma.bankAccount.updateMany({
        data: { isDefault: false }
      });
    }

    const account = await prisma.bankAccount.create({
      data: body
    });

    return NextResponse.json({ success: true, account }, { status: 201 });
  } catch (error) {
    console.error('Error creating bank account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bank account' },
      { status: 500 }
    );
  }
}

// PUT - Bankkonto aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Wenn isDefault true ist, alle anderen auf false setzen
    if (data.isDefault) {
      await prisma.bankAccount.updateMany({
        where: { id: { not: id } },
        data: { isDefault: false }
      });
    }

    const account = await prisma.bankAccount.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, account });
  } catch (error) {
    console.error('Error updating bank account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bank account' },
      { status: 500 }
    );
  }
}

// DELETE - Bankkonto löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Bank account ID required' },
        { status: 400 }
      );
    }

    await prisma.bankAccount.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bank account' },
      { status: 500 }
    );
  }
}

