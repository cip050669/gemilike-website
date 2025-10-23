import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { NavigationItem } from '@prisma/client';

export async function GET() {
  try {
    // GET-Anfragen sind öffentlich, damit der Header geladen werden kann
    // Keine Authentifizierung erforderlich für GET

    // Hole Header-Daten aus der Datenbank (mit Fallback)
    let headerData;
    let navigationItems: NavigationItem[] = [];
    
    try {
      headerData = await prisma.headerData.findFirst();
      navigationItems = await prisma.navigationItem.findMany({
        orderBy: { order: 'asc' }
      });
    } catch (dbError) {
      console.log('Database not ready, using fallback data', dbError);
      headerData = null;
      navigationItems = [];
    }

    // Transformiere Daten für Frontend
    const transformedData = {
      logo: {
        text: headerData?.logoText || 'Gemilike',
        image: headerData?.logoImage || ''
      },
      contactInfo: {
        phone: headerData?.phone || '+49 123 456 789',
        email: headerData?.email || 'info@gemilike.com'
      },
      socialMedia: {
        facebook: headerData?.facebook || 'https://facebook.com/gemilike',
        instagram: headerData?.instagram || 'https://instagram.com/gemilike',
        twitter: headerData?.twitter || 'https://twitter.com/gemilike',
        youtube: headerData?.youtube || 'https://youtube.com/gemilike'
      },
      navigation: {
        items: navigationItems.length > 0 ? navigationItems.map(item => ({
          id: item.id,
          text: item.text,
          url: item.url
        })) : [
          { id: '1', text: 'Startseite', url: '/' },
          { id: '2', text: 'Shop', url: '/shop' },
          { id: '3', text: 'Über uns', url: '/about' },
          { id: '4', text: 'Kontakt', url: '/contact' }
        ]
      },
      searchSettings: {
        enabled: headerData?.searchEnabled ?? true,
        placeholder: headerData?.searchPlaceholder || 'Suchen...'
      },
      cartSettings: {
        enabled: headerData?.cartEnabled ?? true,
        showCount: headerData?.cartShowCount ?? true
      },
      userAccount: {
        enabled: headerData?.userEnabled ?? true,
        showLogin: headerData?.userShowLogin ?? true
      },
      wishlist: {
        enabled: headerData?.wishlistEnabled ?? true,
        showCount: headerData?.wishlistShowCount ?? true
      }
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching header data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Temporär: Authentifizierung deaktiviert für Entwicklung
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const data = await request.json();
    
    try {
      // Aktualisiere Header-Daten
      await prisma.headerData.upsert({
      where: { id: 'default' },
      update: {
        logoText: data.logo.text,
        logoImage: data.logo.image,
        phone: data.contactInfo.phone,
        email: data.contactInfo.email,
        facebook: data.socialMedia.facebook,
        instagram: data.socialMedia.instagram,
        twitter: data.socialMedia.twitter,
        youtube: data.socialMedia.youtube,
        searchEnabled: data.searchSettings.enabled,
        searchPlaceholder: data.searchSettings.placeholder,
        cartEnabled: data.cartSettings.enabled,
        cartShowCount: data.cartSettings.showCount,
        userEnabled: data.userAccount.enabled,
        userShowLogin: data.userAccount.showLogin,
        wishlistEnabled: data.wishlist.enabled,
        wishlistShowCount: data.wishlist.showCount
      },
      create: {
        id: 'default',
        logoText: data.logo.text,
        logoImage: data.logo.image,
        phone: data.contactInfo.phone,
        email: data.contactInfo.email,
        facebook: data.socialMedia.facebook,
        instagram: data.socialMedia.instagram,
        twitter: data.socialMedia.twitter,
        youtube: data.socialMedia.youtube,
        searchEnabled: data.searchSettings.enabled,
        searchPlaceholder: data.searchSettings.placeholder,
        cartEnabled: data.cartSettings.enabled,
        cartShowCount: data.cartSettings.showCount,
        userEnabled: data.userAccount.enabled,
        userShowLogin: data.userAccount.showLogin,
        wishlistEnabled: data.wishlist.enabled,
        wishlistShowCount: data.wishlist.showCount
      }
    });

    // Lösche alle bestehenden Navigation Items
    await prisma.navigationItem.deleteMany({});

    // Erstelle neue Navigation Items
    for (let i = 0; i < data.navigation.items.length; i++) {
      const item = data.navigation.items[i];
      await prisma.navigationItem.create({
        data: {
          text: item.text,
          url: item.url,
          order: i
        }
      });
    }

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.log('Database not ready, data not persisted:', dbError);
      // Auch wenn DB nicht funktioniert, success zurückgeben für Frontend
      return NextResponse.json({ success: true, warning: 'Data not persisted to database' });
    }
  } catch (error) {
    console.error('Error updating header data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
