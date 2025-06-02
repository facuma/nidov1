'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/ui/Navbar'
import { AuthProvider } from "@/components/AuthProvider"; // <– nuevo import
import 'leaflet/dist/leaflet.css'
import NavbarMobile from "@/components/ui/NavbarMobile";
import { ToastProvider } from "@/components/ui/use-toast";
import { usePathname } from 'next/navigation'
import { redirect } from 'next/navigation'






export default function RootLayout({ children }) {
  
const pathname = usePathname()

  if (pathname.startsWith('/lp')) {
    return (<html lang="en">
      <body>{children}</body></html>)
  }
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
