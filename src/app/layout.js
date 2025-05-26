import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/ui/Navbar'
import { AuthProvider } from "@/components/AuthProvider"; // <– nuevo import
import 'leaflet/dist/leaflet.css'
import NavbarMobile from "@/components/ui/NavbarMobile";
import { ToastProvider } from "@/components/ui/use-toast";




export const metadata = {
  title: {
    default: "unwork.",
    template: "%s | unwork."
  },
  description: "Encuentra y reserva espacios de coworking cerca de ti de forma sencilla y rápida.",
   icons: {
    // Favicon principal para navegadores (32×32 y 16×16)
    icon: [
      { url: "/unwork-favicon-32x32.png",  type: "image/png", sizes: "32x32" },
      { url: "/unwork-favicon-16x16.png",  type: "image/png", sizes: "16x16" }
    ],
    // Apple Touch Icon (180×180)
    apple: "/unwork-apple-touch-icon.png"
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    type:    "website",
    locale:  "es_AR",
    url:     "https://4a88-181-1-62-201.ngrok-free.app",
    siteName:"unwork.",
    title:   "unwork. — Reserva tu espacio de coworking",
    description: "Encuentra y reserva espacios de coworking cerca de ti de forma sencilla y rápida.",
    images: [
      {
        url:    "/og-unwork.png",
        width:  1200,
        height: 630,
        alt:    "unwork. — Coworking hecho fácil"
      }
    ]
  },
  twitter: {
    card:        "summary_large_image",
    site:        "@tuCuentaTwitter",
    creator:     "@tuCuentaTwitter",
    title:       "unwork. — Reserva tu espacio de coworking",
    description: "Encuentra y reserva espacios de coworking cerca de ti de forma sencilla y rápida.",
    images:      ["/og-unwork.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className=" text-black"
      >
        
        <AuthProvider>
         <Navbar></Navbar>
         <main className="max-w-7xl mx-auto px-6 py-5">
          
          {children}
         </main>
         <NavbarMobile />
        </AuthProvider>
        <ToastProvider/>
      </body>
    </html>
  );
}
