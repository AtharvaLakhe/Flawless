import React from "react"
import type {Metadata} from 'next'
import {Geist, Geist_Mono} from 'next/font/google'
import {Analytics} from '@vercel/analytics/next'
import './globals.css'
import FooterSection from "@/components/footer";
import {HeroHeader} from "@/components/header";

const _geist = Geist({subsets: ["latin"]});
const _geistMono = Geist_Mono({subsets: ["latin"]});

export const metadata: Metadata = {
    title: 'Flawless — AI Security Release Gate',
    description: 'Your pipeline already runs the scanners. Flawless reads everything they find, ranks what\'s actually dangerous, and decides whether this release is safe to ship — automatically.',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
        <body className="relative bg-background font-sans antialiased">
        <div className="relative z-10">
            <HeroHeader/>
            {children}
            <FooterSection/>
        </div>
        <Analytics/>
        </body>
        </html>
    )
}