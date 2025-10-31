import { render, screen, fireEvent } from '@testing-library/react'
import { GemstoneGrid, type ShopGemstone } from '@/components/shop/GemstoneGrid'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/shop',
  useParams: () => ({ locale: 'de' }),
}))

jest.mock('@/lib/store/cart', () => ({
  useCartStore: () => ({
    addItem: jest.fn(),
    isOpen: false,
  }),
}))

jest.mock('@/components/shop/AddToCartButton', () => ({
  AddToCartButton: ({ item }: { item: { id: string } }) => (
    <button data-testid={`add-to-cart-${item.id}`}>Add to Cart</button>
  ),
}))

jest.mock('@/components/cart/WishlistButton', () => ({
  WishlistButton: ({ item }: { item: { id: string } }) => (
    <button data-testid={`wishlist-${item.id}`}>Wishlist</button>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('@/components/shop/MediaGallery', () => ({
  MediaGallery: () => <div data-testid="media-gallery">Media Gallery</div>,
}))

const createShopGemstone = (overrides: Partial<ShopGemstone> = {}): ShopGemstone => ({
  id: 'gem-1',
  slug: 'test-gem',
  name: 'Test Gemstone',
  category: 'Diamond',
  type: 'cut',
  price: 100,
  currency: 'EUR',
  weight: 1.5,
  weightUnit: 'ct',
  origin: 'Test Origin',
  color: 'White',
  inStock: true,
  isSold: false,
  stock: 10,
  isNew: false,
  images: ['/images/test.jpg'],
  videos: [],
  ...overrides,
})

describe('GemstoneGrid Component', () => {
  const mockGemstones: ShopGemstone[] = [
    createShopGemstone({ id: 'gem-1', name: 'Gemstone 1' }),
    createShopGemstone({ id: 'gem-2', name: 'Gemstone 2' }),
    createShopGemstone({ id: 'gem-3', name: 'Gemstone 3' }),
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render gemstones', () => {
    render(<GemstoneGrid gemstones={mockGemstones} />)
    
    expect(screen.getByText('Gemstone 1')).toBeInTheDocument()
    expect(screen.getByText('Gemstone 2')).toBeInTheDocument()
    expect(screen.getByText('Gemstone 3')).toBeInTheDocument()
  })

  it('should render empty state when no gemstones', () => {
    const { container } = render(<GemstoneGrid gemstones={[]} />)
    
    // Should render empty grid (no articles)
    const articles = container.querySelectorAll('article')
    expect(articles.length).toBe(0)
  })

  it('should render correct number of gemstones', () => {
    const { container } = render(<GemstoneGrid gemstones={mockGemstones} />)
    
    const articles = container.querySelectorAll('article')
    expect(articles.length).toBe(3)
  })

  it('should open modal when gemstone is clicked', () => {
    render(<GemstoneGrid gemstones={mockGemstones} />)
    
    const detailButtons = screen.getAllByText('Details öffnen')
    fireEvent.click(detailButtons[0])
    
    // Modal should open (check for dialog or modal content)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('should display price for each gemstone', () => {
    render(<GemstoneGrid gemstones={mockGemstones} />)
    
    // Prices should be formatted and displayed - multiple elements exist
    const prices = screen.getAllByText(/100,00.*€|€.*100,00/i)
    expect(prices.length).toBeGreaterThan(0)
  })

  it('should display category for each gemstone', () => {
    render(<GemstoneGrid gemstones={mockGemstones} />)
    
    // Multiple gemstones have the same category, so use getAllBy
    const categories = screen.getAllByText('Diamond')
    expect(categories.length).toBeGreaterThan(0)
  })

  it('should show "Verkauft" badge for sold gemstones', () => {
    const soldGemstone = createShopGemstone({ id: 'sold-1', isSold: true })
    render(<GemstoneGrid gemstones={[soldGemstone]} />)
    
    expect(screen.getByText('Verkauft')).toBeInTheDocument()
  })

  it('should show "Neu" badge for new gemstones', () => {
    const newGemstone = createShopGemstone({ id: 'new-1', isNew: true })
    render(<GemstoneGrid gemstones={[newGemstone]} />)
    
    expect(screen.getByText('Neu')).toBeInTheDocument()
  })

  it('should render AddToCartButton for each gemstone', () => {
    render(<GemstoneGrid gemstones={mockGemstones} />)
    
    expect(screen.getByTestId('add-to-cart-gem-1')).toBeInTheDocument()
    expect(screen.getByTestId('add-to-cart-gem-2')).toBeInTheDocument()
  })

  it('should render WishlistButton for each gemstone', () => {
    render(<GemstoneGrid gemstones={mockGemstones} />)
    
    expect(screen.getByTestId('wishlist-gem-1')).toBeInTheDocument()
    expect(screen.getByTestId('wishlist-gem-2')).toBeInTheDocument()
  })

  it('should display weight when available', () => {
    const gemstoneWithWeight = createShopGemstone({ 
      weight: 2.5, 
      weightUnit: 'ct' 
    })
    render(<GemstoneGrid gemstones={[gemstoneWithWeight]} />)
    
    expect(screen.getByText(/2\.50.*ct/i)).toBeInTheDocument()
  })
})

