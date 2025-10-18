'use client'

import Script from 'next/script'
import { generateStructuredData, structuredDataConfig } from '@/lib/structured-data'

interface SEOHeadProps {
  structuredData?: any[]
  locale?: string
}

export function SEOHead({ structuredData = [], locale = 'de' }: SEOHeadProps) {
  // Standard strukturierte Daten
  const defaultStructuredData = [
    generateStructuredData(structuredDataConfig.organization),
    generateStructuredData(structuredDataConfig.website),
    generateStructuredData(structuredDataConfig.localBusiness)
  ]

  const allStructuredData = [...defaultStructuredData, ...structuredData]

  return (
    <>
      {/* Strukturierte Daten */}
      {allStructuredData.map((data, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}

      {/* Google Analytics (wenn konfiguriert) */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager (wenn konfiguriert) */}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        </>
      )}
    </>
  )
}

