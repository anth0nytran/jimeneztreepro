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
  title: "3D Fence & Welding | Houston's Experts in Fencing & Automatic Gates",
  description: "Premier Houston fence contractor specializing in custom driveway gates, automatic gate openers, wood privacy fences, and professional welding fabrication. 15+ years of quality service. Call (281) 748-1111 for a free estimate today.",
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
        url: '/images/hero-bg.png', // Fallback to hero image, ensure this exists or use a dedicated OG image
        width: 1200,
        height: 630,
        alt: '3D Fence & Welding Projects in Houston',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "3D Fence & Welding | Houston's Trust Fence Contractor",
    description: "Expert fence installation, custom gates, and welding services in Houston, TX. Licensed & Insured.",
    images: ['/images/hero-bg.png'],
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
              "priceRange": "$$"
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
