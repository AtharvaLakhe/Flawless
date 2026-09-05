import React from 'react'
import Link from 'next/link'
import {ShieldCheck} from 'lucide-react'

const links = [
    {label: 'Problem', href: '#problem'},
    {label: 'How it works', href: '#how-it-works'},
    {label: 'Verdict', href: '#verdict'},
    {label: 'Gate', href: '#gate'},
]

export default function FooterSection() {
    return (
        <footer className="border-t border-border py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                    <Link href="/" aria-label="go home" className="flex items-center gap-2">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
                            <ShieldCheck className="size-5"/>
                        </span>
                        <span className="font-mono text-lg font-semibold tracking-tight">Flawless</span>
                    </Link>

                    <ul className="flex flex-wrap justify-center gap-6 text-sm">
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href} className="text-muted-foreground hover:text-primary block transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Your pipeline already runs the scanners. Flawless decides whether this release is safe to ship.
                    </p>
                    <p className="font-mono text-xs text-muted-foreground/70">
                        Built for a hackathon — no fabricated stats, logos, or claims.
                    </p>
                </div>
            </div>
        </footer>
    )
}