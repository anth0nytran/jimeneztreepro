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
  metadataBase: new URL('https://jimeneztreepro.com'),
  title: "Tree Service in Pasadena & Houston, TX | Jimenez Tree Pro",
  description: "Tree removal, tree trimming, stump grinding, and storm damage cleanup for homeowners in Pasadena, Houston, Pearland, Friendswood, League City, and Clear Lake. 24/7 emergency service and free estimates.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Professional Tree Service for Houston Area Homeowners | Jimenez Tree Pro",
    description: "Done right. Done safely. Done today. Emergency tree removal, large tree trimming, stump grinding, and storm cleanup. Call for a free estimate.",
    url: 'https://jimeneztreepro.com',
    siteName: 'Jimenez Tree Pro',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/tree_pro/og-tree.jpg',
        width: 1200,
        height: 630,
        alt: 'Jimenez Tree Pro - Professional Tree Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tree Service in Pasadena & Houston | Jimenez Tree Pro",
    description: "24/7 emergency tree service. Tree removal, tree trimming, stump grinding, and storm cleanup for Houston area homeowners.",
    images: ['/tree_pro/og-tree.jpg'],
  },
  icons: {
    icon: '/tree_pro/tree_logo.svg',
    shortcut: '/tree_pro/tree_logo.svg',
    apple: '/tree_pro/tree_logo.svg',
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
              "name": "Jimenez Tree Pro",
              "image": "https://jimeneztreepro.com/tree_pro/og-tree.jpg",
              "@id": "https://jimeneztreepro.com",
              "url": "https://jimeneztreepro.com",
              "telephone": "+18329667045",
              "description": "Professional tree removal, trimming, and storm damage cleanup for homeowners in Pasadena and surrounding Houston areas. 24/7 emergency service.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Pasadena",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 29.6911,
                "longitude": -95.2091
              },
              "areaServed": [
                { "@type": "City", "name": "Pasadena" },
                { "@type": "City", "name": "Houston" },
                { "@type": "City", "name": "Alvin" },
                { "@type": "City", "name": "Pearland" },
                { "@type": "City", "name": "Friendswood" },
                { "@type": "City", "name": "League City" },
                { "@type": "City", "name": "Clear Lake" }
              ],
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
              },
              "priceRange": "$$",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Tree Services",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Emergency & Large Tree Removal" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Large Tree Trimming & Structural Pruning" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Storm Damage Cleanup & Debris Hauling" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Stump Grinding" } }
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
              "name": "Jimenez Tree Pro",
              "alternateName": ["Jimenez Tree Pro Pasadena", "JimenezTreePro.com"],
              "url": "https://jimeneztreepro.com"
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
