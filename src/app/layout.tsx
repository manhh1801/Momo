import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {cn} from "@/lib/utils";
import '@/styles/globals.css'
import Navbar from "@/components/Navbar"
import {Toaster} from "@/components/ui/Toaster";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Momo",
    description: "A peach?",
    icons: {
        icon: '@/../public/icon.png'
    }
}

export default function RootLayout({
    children,
    authModal
}: Readonly<{
    children: React.ReactNode
    authModal: React.ReactNode
}>) {
    return (
        <html lang="en" className={cn("bg-white text-slate-900 antialiased light", inter.className)}>
            <body className="min-h-screen pt-12 bg-slate-50 antialiased">
                <Providers>
                    <Navbar/>
                    {authModal}
                    <div className={"container max-w-7xl mx-auto h-full pt-12"}>
                        {children}
                    </div>
                    <Toaster/>
                </Providers>
            </body>
        </html>
    )
}
