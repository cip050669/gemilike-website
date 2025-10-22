type StructuredDataType = 'Organization' | 'WebSite' | 'WebPage' | 'Product' | 'BreadcrumbList' | 'LocalBusiness';

interface StructuredDataProps {
  type: StructuredDataType;
  data: Record<string, unknown>;
}

export function generateStructuredData({ type, data }: StructuredDataProps): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}

// Vordefinierte strukturierte Daten
export const structuredDataConfig = {
  organization: {
    type: 'Organization' as const,
    data: {
      name: 'Gemilike',
      alternateName: 'Gemilike - Heroes in Gems',
      url: 'https://gemilike.de',
      logo: 'https://gemilike.de/logo.png',
      description: 'Exklusive Edelsteine und Luxus-Schmuck in höchster Qualität. Über 20 Jahre Erfahrung in der Edelsteinbranche.',
      foundingDate: '2000',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Musterstraße 123',
        addressLocality: 'Musterstadt',
        postalCode: '12345',
        addressCountry: 'DE'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+49-123-456789',
        contactType: 'customer service',
        email: 'info@gemilike.com',
        availableLanguage: ['German', 'English']
      },
      sameAs: [
        'https://www.facebook.com/gemilike',
        'https://www.instagram.com/gemilike',
        'https://www.linkedin.com/company/gemilike'
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Edelsteine und Schmuck',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Diamanten'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Rubine'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Smaragde'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Saphire'
            }
          }
        ]
      }
    }
  },

  website: {
    type: 'WebSite' as const,
    data: {
      name: 'Gemilike - Heroes in Gems',
      url: 'https://gemilike.de',
      description: 'Exklusive Edelsteine und Luxus-Schmuck online kaufen',
      inLanguage: ['de-DE', 'en-US'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://gemilike.de/de/shop?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    }
  },

  localBusiness: {
    type: 'LocalBusiness' as const,
    data: {
      name: 'Gemilike',
      image: 'https://gemilike.de/logo.png',
      telephone: '+49-123-456789',
      email: 'info@gemilike.com',
      url: 'https://gemilike.de',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Musterstraße 123',
        addressLocality: 'Musterstadt',
        postalCode: '12345',
        addressCountry: 'DE'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 52.5200,
        longitude: 13.4050
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:00',
          closes: '16:00'
        }
      ],
      priceRange: '€€€',
      paymentAccepted: ['Cash', 'Credit Card', 'PayPal', 'SEPA'],
      currenciesAccepted: 'EUR'
    }
  }
}

// Hilfsfunktion für Breadcrumbs
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return generateStructuredData({
    type: 'BreadcrumbList',
    data: {
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `https://gemilike.de${item.url}`
      }))
    }
  })
}

// Hilfsfunktion für Produktdaten
export function generateProductStructuredData(product: {
  name: string
  description: string
  image: string
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  sku: string
  brand: string
  category: string
}) {
  return generateStructuredData({
    type: 'Product',
    data: {
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: product.brand
      },
      category: product.category,
      sku: product.sku,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
        seller: {
          '@type': 'Organization',
          name: 'Gemilike'
        }
      }
    }
  })
}
