import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SearchFilters } from '../advanced/route';

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

// In-memory storage for demo purposes
// In production, you would use a database
const savedSearches: SavedSearch[] = [];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's saved searches
    const userSearches = savedSearches
      .filter(search => search.userId === session.user.id)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return NextResponse.json({ searches: userSearches });

  } catch (error) {
    console.error('Get saved searches error:', error);
    return NextResponse.json(
      { error: 'Failed to get saved searches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { name, filters } = await request.json();

    if (!name || !filters) {
      return NextResponse.json(
        { error: 'Name and filters are required' },
        { status: 400 }
      );
    }

    // Check if user already has a search with this name
    const existingSearch = savedSearches.find(
      search => search.userId === session.user.id && search.name === name
    );

    if (existingSearch) {
      return NextResponse.json(
        { error: 'A search with this name already exists' },
        { status: 409 }
      );
    }

    const newSearch: SavedSearch = {
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      filters,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };

    savedSearches.push(newSearch);

    return NextResponse.json({ search: newSearch }, { status: 201 });

  } catch (error) {
    console.error('Save search error:', error);
    return NextResponse.json(
      { error: 'Failed to save search' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id, name, filters } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      );
    }

    const searchIndex = savedSearches.findIndex(
      search => search.id === id && search.userId === session.user.id
    );

    if (searchIndex === -1) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    // Update the search
    if (name) savedSearches[searchIndex].name = name;
    if (filters) savedSearches[searchIndex].filters = filters;
    savedSearches[searchIndex].updatedAt = new Date();

    return NextResponse.json({ search: savedSearches[searchIndex] });

  } catch (error) {
    console.error('Update saved search error:', error);
    return NextResponse.json(
      { error: 'Failed to update search' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Search ID is required' },
        { status: 400 }
      );
    }

    const searchIndex = savedSearches.findIndex(
      search => search.id === id && search.userId === session.user.id
    );

    if (searchIndex === -1) {
      return NextResponse.json(
        { error: 'Search not found' },
        { status: 404 }
      );
    }

    savedSearches.splice(searchIndex, 1);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete saved search error:', error);
    return NextResponse.json(
      { error: 'Failed to delete search' },
      { status: 500 }
    );
  }
}
