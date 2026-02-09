import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bodyFont = Barlow({
  variable: "--font-app-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const displayFont = Barlow_Condensed({
  variable: "--font-app-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-app-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://elitehomerepairs.us'),
  title: "Home Repair Contractor in Kingwood, TX | Elite Home Repairs",
  description: "Helping homeowners in Kingwood, Humble, The Woodlands, Spring, Atascocita, and Houston with siding, roofing, painting, and window repairs. Licensed, insured, and free estimates.",
  alternates: {
    canonical: '/',
  },
  keywords: ["Home Repairs Kingwood", "Siding Installation", "Roofing Contractor", "Painting Services", "Window Replacement", "Elite Home Repairs", "Houston Home Remodeling"],
  openGraph: {
    title: "Kingwood Home Repair Services for Homeowners | Elite Home Repairs",
    description: "Trusted siding, roofing, painting, and window repairs for homeowners in Kingwood and nearby service areas. Call for a free estimate.",
    url: 'https://elitehomerepairs.us',
    siteName: 'Elite Home Repairs',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/hero-bg.webp',
        width: 1200,
        height: 630,
        alt: 'Elite Home Repairs - Premium Craftsmanship',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kingwood Home Repair Services | Elite Home Repairs",
    description: "Helping homeowners protect and improve their homes with siding, roofing, painting, and window services.",
    images: ['/images/hero-bg.webp'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gscVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Elite Home Repairs",
              "image": "https://elitehomerepairs.us/images/hero-bg.webp",
              "@id": "https://elitehomerepairs.us",
              "url": "https://elitehomerepairs.us",
              "telephone": "+17132838138",
              "description": "Home repair services for homeowners in Kingwood and surrounding Houston areas. Siding, roofing, painting, and windows.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "4102 Valley Haven Dr",
                "addressLocality": "Kingwood",
                "addressRegion": "TX",
                "postalCode": "77339",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 30.0166, // Kingwood coords
                "longitude": -95.1803
              },
              "areaServed": [
                { "@type": "City", "name": "Kingwood" },
                { "@type": "City", "name": "Humble" },
                { "@type": "City", "name": "The Woodlands" },
                { "@type": "City", "name": "Houston" },
                { "@type": "City", "name": "Spring" },
                { "@type": "City", "name": "Atascocita" },
                { "@type": "City", "name": "Porter" },
                { "@type": "City", "name": "Conroe" },
                { "@type": "City", "name": "Tomball" },
                { "@type": "City", "name": "Katy" },
                { "@type": "City", "name": "Sugar Land" },
                { "@type": "City", "name": "Cypress" }
              ],
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "07:00",
                "closes": "20:00"
              },
              "priceRange": "$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "50"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Home Repair Services",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Siding Installation" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roofing Services" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Painting" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Window Replacement" } }
                ]
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Elite Home Repairs",
              "alternateName": ["Elite Home Repairs Kingwood", "EliteHomeRepairs.us"],
              "url": "https://elitehomerepairs.us"
            })
          }}
        />
        {gaId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        ) : null}
        {gscVerification ? (
          <meta name="google-site-verification" content={gscVerification} />
        ) : null}
      </head>
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} antialiased`}
      >
        {children}
      </body>
    </html >
  );
}
