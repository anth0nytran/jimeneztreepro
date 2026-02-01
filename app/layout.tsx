import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://3dfencehouston.com'),
  title: "3D Fence & Welding | Houston Fence Installation & Custom Gates | (281) 748-1111",
  description: "Houston's trusted fence company for 15+ years. Cedar fence installation, custom iron gates, automatic driveway gates & LiftMaster openers. Serving Katy, The Woodlands, Sugar Land. Free estimates!",
  keywords: ["Fence Installation Houston", "Driveway Gates", "Automatic Gate Openers", "Wrought Iron Fences", "Cedar Fencing", "Welding Services Houston", "Fence Repair"],
  openGraph: {
    title: "3D Fence & Welding | Houston's Experts in Fencing & Automatic Gates",
    description: "Premier Houston fence contractor specializing in custom driveway gates, automatic gate openers, wood privacy fences, and professional welding fabrication. 15+ years experience.",
    url: 'https://3dfencehouston.com',
    siteName: '3D Fence & Welding',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/reallogo.png',
        width: 1200,
        height: 630,
        alt: '3D Fence & Welding Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "3D Fence & Welding | Houston's Trust Fence Contractor",
    description: "Expert fence installation, custom gates, and welding services in Houston, TX. Licensed & Insured.",
    images: ['/images/reallogo.png'],
  },
  icons: {
    icon: '/images/logo-icon.svg',
    shortcut: '/images/logo-icon.svg',
    apple: '/images/logo-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "3D Fence & Welding",
              "image": "https://3dfencehouston.com/images/hero-bg.png",
              "@id": "https://3dfencehouston.com",
              "url": "https://3dfencehouston.com",
              "telephone": "+12817481111",
              "description": "Houston's trusted fence company for 15+ years. Cedar fence installation, custom iron gates, automatic driveway gates & LiftMaster openers.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Houston Area",
                "addressLocality": "Houston",
                "addressRegion": "TX",
                "postalCode": "77001",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 29.7604,
                "longitude": -95.3698
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Houston",
                  "@id": "https://en.wikipedia.org/wiki/Houston"
                },
                {
                  "@type": "City",
                  "name": "Katy"
                },
                {
                  "@type": "City",
                  "name": "The Woodlands"
                },
                {
                  "@type": "City",
                  "name": "Sugar Land"
                },
                {
                  "@type": "City",
                  "name": "Cypress"
                },
                {
                  "@type": "City",
                  "name": "Missouri City"
                },
                {
                  "@type": "City",
                  "name": "Richmond"
                }
              ],
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              },
              "sameAs": [
                "https://www.google.com/search?q=3D+Fence+%26+Welding+Houston"
              ],
              "priceRange": "$$",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "48"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Fence and Gate Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Fence Installation & Custom Gates"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Automatic Driveway Gates"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Electric Gate Openers"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Commercial & Residential Welding"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Fence Repair & Maintenance"
                    }
                  }
                ]
              }
            })
          }}
        />
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        {/* Google Search Console Verification Placeholder */}
        <meta name="google-site-verification" content="Your_Verification_Code_Here" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
