import { NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';

// In-memory storage for demo purposes
// In production, this would be stored in a database
let locations: any[] = [];

// Initialize with default data
const initializeLocations = async () => {
  if (locations.length === 0) {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gems`);
      const data = await response.json();
      locations = data.points.map((point: any, index: number) => ({
        ...point,
        id: `loc_${index + 1}`
      }));
    } catch (error) {
      console.error('Error initializing locations:', error);
    }
  }
};

export async function GET() {
  try {
    await initializeLocations();
    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await getSessionWithUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initializeLocations();
    const body = await request.json();
    const { site, country, gem, lat, lon } = body;

    // Validate required fields
    if (!site || !country || !gem || lat === undefined || lon === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new location
    const newLocation = {
      id: `loc_${Date.now()}`,
      site,
      country,
      gem,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    };

    locations.push(newLocation);
    
    return NextResponse.json({ 
      message: 'Location added successfully',
      location: newLocation 
    });
  } catch (error) {
    console.error('Error adding location:', error);
    return NextResponse.json({ error: 'Failed to add location' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await getSessionWithUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initializeLocations();
    const body = await request.json();
    const { id, site, country, gem, lat, lon } = body;

    // Find and update location
    const locationIndex = locations.findIndex(loc => loc.id === id);
    if (locationIndex === -1) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    locations[locationIndex] = {
      ...locations[locationIndex],
      site,
      country,
      gem,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    };

    return NextResponse.json({ 
      message: 'Location updated successfully',
      location: locations[locationIndex]
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await getSessionWithUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await initializeLocations();
    const body = await request.json();
    const { id } = body;

    // Find and remove location
    const locationIndex = locations.findIndex(loc => loc.id === id);
    if (locationIndex === -1) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const deletedLocation = locations.splice(locationIndex, 1)[0];

    return NextResponse.json({ 
      message: 'Location deleted successfully',
      location: deletedLocation
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Failed to delete location' }, { status: 500 });
  }
}
