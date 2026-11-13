import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useCartStore } from '@/lib/store/cart';
import { useWishlistStore } from '@/lib/store/wishlist';

jest.mock('@/lib/store/cart');
jest.mock('@/lib/store/wishlist');
jest.mock('@/components/cart/Cart', () => ({
  Cart: () => null,
}));
jest.mock('@/components/ui/DarkModeToggle', () => ({
  DarkModeToggle: ({ className }: { className?: string }) => (
    <button type="button" aria-label="Dark Mode umschalten" className={className} />
  ),
}));

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockedUseCartStore = useCartStore as jest.MockedFunction<typeof useCartStore>;
const mockedUseWishlistStore = useWishlistStore as jest.MockedFunction<typeof useWishlistStore>;

const mockToggleCart = jest.fn();
const mockFetchCart = jest.fn().mockResolvedValue(undefined);
const mockFetchWishlist = jest.fn().mockResolvedValue(undefined);

function mockStores() {
  mockedUseCartStore.mockImplementation((selector: any) => {
    const state = {
      summary: { id: 'c1', currency: 'EUR', items: [], totalPrice: 0, totalQuantity: 0 },
      items: [],
      isOpen: false,
      isLoading: false,
      error: null,
      toggleCart: mockToggleCart,
      fetchCart: mockFetchCart,
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
    };
    return typeof selector === 'function' ? selector(state) : state;
  });

  mockedUseWishlistStore.mockImplementation((selector: any) => {
    const state = {
      summary: { id: 'w1', items: [], totalItems: 0 },
      totalItems: 0,
      fetchWishlist: mockFetchWishlist,
    };
    return typeof selector === 'function' ? selector(state) : state;
  });
}

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStores();
    mockedUsePathname.mockReturnValue('/de/');

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        navigation: {
          items: [
            { id: '1', text: 'Startseite', url: '/' },
            { id: '2', text: 'Shop', url: '/shop' },
            { id: '3', text: 'Wissenswertes', url: '/wissenswertes' },
          ],
        },
        cartSettings: { enabled: true, showCount: true },
        wishlist: { enabled: true, showCount: true },
      }),
    }) as jest.Mock;
  });

  it('rendert Hauptnavigation mit Shop und Download', async () => {
    render(<Header />);

    await waitFor(() => {
      expect(screen.getByRole('navigation', { name: 'Hauptnavigation' })).toBeInTheDocument();
    });

    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' });
    expect(nav).toHaveClass('flex');
    expect(nav.className.split(/\s+/)).not.toContain('hidden');

    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/de\/shop\/?$/)
    );
    expect(screen.getByRole('link', { name: 'Download' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/de\/downloads\/?$/)
    );
    expect(screen.getByRole('link', { name: 'Fundorte' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/de\/worldmap\/?$/)
    );
  });

  it('setzt Locale- und Auth-Actions als normale Links (ohne Router-Push)', async () => {
    render(<Header />);

    const language = await screen.findAllByRole('link', { name: 'Sprache wechseln' });
    expect(language[0]).toHaveAttribute('href', expect.stringMatching(/^\/en\/?$/));

    const signIn = screen.getAllByRole('link', { name: 'Anmelden' });
    expect(signIn[0]).toHaveAttribute('href', expect.stringMatching(/^\/de\/auth\/signin\/?$/));

    const wishlist = screen.getAllByRole('link', { name: 'Wunschliste' });
    expect(wishlist[0]).toHaveAttribute('href', expect.stringMatching(/^\/de\/wishlist\/?$/));
  });

  it('nutzt einheitliche Action-Icon-Klassen (kein Link-Blau)', async () => {
    render(<Header />);

    const language = await screen.findAllByRole('link', { name: 'Sprache wechseln' });
    expect(language[0].className).toMatch(/actionIcon/);
  });

  it('öffnet den Warenkorb über den Cart-Button', async () => {
    render(<Header />);

    const cartButtons = await screen.findAllByRole('button', { name: 'Warenkorb' });
    fireEvent.click(cartButtons[0]);
    expect(mockToggleCart).toHaveBeenCalled();
  });
});
