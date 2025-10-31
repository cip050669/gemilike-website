import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { alt = '', ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />
  },
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'de',
}))

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()

// Polyfill for Request/Response using undici (Node 18+ has built-in fetch)
// For older Node versions or Jest environments, use undici
if (typeof global.Request === 'undefined') {
  try {
    // Check if undici is available
    const undici = require('undici')
    // undici exports fetch, not directly Request/Response in older versions
    // But in newer versions, we can use the global fetch which includes Request/Response
    if (global.fetch && global.fetch.constructor) {
      // If fetch exists, Request/Response might be available via other means
      try {
        // Try to get Request from fetch
        const testReq = new global.fetch.constructor('https://example.com')
        // If this works, Request is available
      } catch {
        // Fallback: set up basic polyfill
        global.Request = class Request {
          constructor(input, init = {}) {
            const url = typeof input === 'string' ? input : (input && input.url) || ''
            Object.defineProperty(this, 'url', { value: url, writable: false, enumerable: true, configurable: false })
            Object.defineProperty(this, 'method', { value: init.method || 'GET', writable: false, enumerable: true })
            this.headers = new Headers(init.headers)
            this.body = init.body || null
            this.bodyUsed = false
          }
          async json() { return this.body ? JSON.parse(this.body) : {} }
          async text() { return this.body || '' }
        }
        global.Response = class Response {
          constructor(body, init = {}) {
            this.body = body
            Object.defineProperty(this, 'status', { value: init.status || 200, writable: false })
            Object.defineProperty(this, 'ok', { value: (init.status || 200) < 400, writable: false })
            this.headers = new Headers(init.headers)
          }
          async json() { return typeof this.body === 'string' ? JSON.parse(this.body) : this.body }
          async text() { return typeof this.body === 'string' ? this.body : JSON.stringify(this.body) }
        }
      }
    }
  } catch (e) {
    // Fallback polyfill
    global.Request = class Request {
      constructor(input, init = {}) {
        const url = typeof input === 'string' ? input : (input && input.url) || ''
        Object.defineProperty(this, 'url', { value: url, writable: false, enumerable: true, configurable: false })
        Object.defineProperty(this, 'method', { value: init.method || 'GET', writable: false, enumerable: true })
        this.headers = new Headers(init.headers || {})
        this.body = init.body || null
        this.bodyUsed = false
      }
      async json() { return this.body ? (typeof this.body === 'string' ? JSON.parse(this.body) : this.body) : {} }
      async text() { return typeof this.body === 'string' ? this.body : (this.body ? JSON.stringify(this.body) : '') }
    }
    
    global.Response = class Response {
      constructor(body, init = {}) {
        this.body = body || null
        Object.defineProperty(this, 'status', { value: init.status || 200, writable: false, enumerable: true })
        Object.defineProperty(this, 'statusText', { value: init.statusText || 'OK', writable: false, enumerable: true })
        Object.defineProperty(this, 'ok', { value: (init.status || 200) >= 200 && (init.status || 200) < 300, writable: false, enumerable: true })
        this.headers = new Headers(init.headers || {})
        this.bodyUsed = false
      }
      async json() { return typeof this.body === 'string' ? JSON.parse(this.body) : (this.body || {}) }
      async text() { return typeof this.body === 'string' ? this.body : (this.body ? JSON.stringify(this.body) : '') }
    }
  }
}
