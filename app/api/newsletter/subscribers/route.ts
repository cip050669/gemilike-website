import { NextRequest, NextResponse } from 'next/server';
import { getSubscribers, deleteSubscriber, updateSubscriber } from '@/lib/newsletter-storage';

export async function GET(request: NextRequest) {
  try {
    const subscribers = getSubscribers();
    return NextResponse.json({ subscribers }, { status: 200 });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }
    
    const success = deleteSubscriber(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Subscriber deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Subscriber ID is required' },
        { status: 400 }
      );
    }
    
    const updatedSubscriber = updateSubscriber(id, updates);
    
    if (!updatedSubscriber) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { subscriber: updatedSubscriber, message: 'Subscriber updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

