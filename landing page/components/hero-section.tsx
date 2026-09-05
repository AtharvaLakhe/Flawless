'use client'

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import {Button} from '@/components/ui/button'
import {TextEffect} from "@/components/motion-primitives/text-effect";
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";
import DecryptedText from "@/components/DecryptedText";
import {ArrowRight, ChevronRight, GitCommitHorizontal, ShieldCheck} from 'lucide-react'

const SCORE = 78
const RING_RADIUS = 60
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

function useCountUp(target: number, duration = 1500) {
    const [value, setValue] = useState(0)
    useEffect(() => {
        let raf: number
        const start = performance.now()
        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(target * eased))
            if (progress < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [target, duration])
    return value
}

function GateVisual() {
    const [ready, setReady] = useState(false)
    const score = useCountUp(SCORE)

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 400)
        return () => clearTimeout(t)
    }, [])

    const ringOffset = ready
        ? RING_CIRCUMFERENCE * (1 - SCORE / 100)
        : RING_CIRCUMFERENCE

    const breakdown = [
        {label: 'CRITICAL', count: 1, color: 'text-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/30'},
        {label: 'HIGH', count: 2, color: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30'},
        {label: 'MEDIUM', count: 4, color: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30'},
        {label: 'LOW', count: 7, color: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'},
    ]

    return (
        <div
            className={`relative z-2 w-full max-w-3xl overflow-hidden rounded-2xl border bg-background/60 shadow-2xl backdrop-blur transition-colors duration-700 ${
                ready ? 'border-red-500/40 shadow-red-500/10' : 'border-border'
            }`}>
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-border bg-background/80 px-5 py-3">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <span className="size-3 rounded-full bg-red-500/80"/>
                        <span className="size-3 rounded-full bg-amber-500/80"/>
                        <span className="size-3 rounded-full bg-emerald-500/80"/>
                    </div>
                    <DecryptedText
                        text="flawless / security-release-gate / PR #482"
                        animateOn="view"
                        revealDirection="start"
                        sequential
                        useOriginalCharsOnly={false}
                        speed={60}
                        className="font-mono text-xs text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-8 p-6 sm:p-8">
                {/* Flow: push -> gate -> verdict */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center gap-2">
                        <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-background">
                            <GitCommitHorizontal className="size-5 text-muted-foreground"/>
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Push</span>
                    </div>

                    <div className="flex flex-1 items-center justify-center px-2 sm:px-6">
                        <div className="flex w-full items-center">
                            <div className="h-px flex-1 bg-border"/>
                            <ChevronRight className="size-4 animate-pulse text-foreground/60"/>
                            <div className="h-px flex-1 bg-border"/>
                        </div>
                    </div>

                    <div className="z-3 flex items-center gap-2 rounded-full border border-foreground/30 bg-background px-4 py-2 shadow-lg shadow-foreground/10">
                        <ShieldCheck className="size-4 text-foreground"/>
                        <span className="font-mono text-xs font-semibold tracking-wide">Flawless Gate</span>
                    </div>

                    <div className="flex flex-1 items-center justify-center px-2 sm:px-6">
                        <div className="flex w-full items-center">
                            <div className="h-px flex-1 bg-border"/>
                            <ChevronRight className="size-4 animate-pulse text-foreground/60"/>
                            <div className="h-px flex-1 bg-border"/>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-background">
                            <ShieldCheck className="size-5 text-red-400"/>
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Verdict</span>
                    </div>
                </div>

                {/* Score + breakdown */}
                <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-background/80 p-6 sm:flex-row sm:justify-around">
                    <div className="relative size-36 shrink-0">
                        <svg viewBox="0 0 140 140" className="size-full -rotate-90">
                            <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke="currentColor"
                                    className="text-border" strokeWidth="8"/>
                            <circle
                                cx="70" cy="70" r={RING_RADIUS} fill="none"
                                stroke="currentColor"
                                className={ready ? 'text-red-500' : 'text-muted-foreground'}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={RING_CIRCUMFERENCE}
                                strokeDashoffset={ringOffset}
                                style={{transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1), color 0.5s ease'}}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-mono text-4xl font-bold text-red-500">{score}</span>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Risk score</span>
                        </div>
                    </div>

                    <div className="grid w-full max-w-xs grid-cols-1 gap-3">
                        {breakdown.map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-3 text-sm">
                                <span className={`w-20 rounded border px-2 py-0.5 text-center font-mono text-[10px] font-bold ${row.badge}`}>
                                    {row.label}
                                </span>
                                <span className="flex-1 text-xs text-muted-foreground">findings this run</span>
                                <span className="font-mono font-bold text-foreground">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Verdict banner */}
                <div className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-all duration-700 ${
                    ready ? 'border-red-500/30 bg-red-500/5' : 'border-border'
                }`}>
                    <div className="flex items-center gap-4">
                        <span className={`flex size-9 items-center justify-center rounded-full text-lg font-bold transition-colors duration-700 ${
                            ready ? 'bg-red-500 text-background' : 'bg-muted text-muted-foreground'
                        }`}>✕</span>
                        <div>
                            <div className="text-sm font-semibold text-foreground">Release blocked</div>
                            <div className="text-xs text-muted-foreground">1 critical finding requires remediation</div>
                        </div>
                    </div>
                    <span className={`font-mono text-xs font-bold tracking-widest ${
                        ready ? 'bg-red-500 px-3 py-1.5 rounded text-background' : 'text-muted-foreground'
                    }`}>
                        {ready ? 'BLOCKED' : 'ANALYZING'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default function HeroSection() {
    return (
        <main className="overflow-x-hidden">
            <section className="relative">
                <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-16 pt-32 text-center md:pb-24 lg:pt-44">
                    <TextEffect
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h1"
                        className="max-w-4xl text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl xl:text-7xl">
                        Every scanner finds problems.
                    </TextEffect>
                    <TextEffect
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.2}
                        as="h1"
                        className="max-w-4xl text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl xl:text-7xl">
                        We decide which ones matter.
                    </TextEffect>

                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.4}
                        as="p"
                        className="mt-8 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
                        Your pipeline already runs the scanners. Flawless reads everything they find, ranks what's
                        actually dangerous, and decides whether this release is safe to ship — automatically.
                    </TextEffect>

                    <AnimatedGroup
                        preset="fade"
                        className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            asChild
                            size="lg"
                            className="px-6 text-base">
                            <Link href="#gate">
                                <span>See it catch a real vulnerability</span>
                                <ArrowRight className="size-4"/>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="ghost"
                            className="bg-black/30 px-6 text-base backdrop-blur-sm hover:bg-black/40">
                            <Link href="#how-it-works">
                                <span>How it works</span>
                            </Link>
                        </Button>
                    </AnimatedGroup>

                    <div className="mt-14 w-full sm:mt-16">
                        <GateVisual/>
                    </div>

                    {/* The scanners the gate reads — real tools, no invented logos */}
                    <div className="mt-12 flex flex-col items-center gap-4">
                        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                            Reads your existing scanners
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            {[
                                {name: 'Trivy', role: 'CVE scanning'},
                                {name: 'Gitleaks', role: 'secret detection'},
                                {name: 'Semgrep', role: 'code patterns'},
                            ].map((s) => (
                                <span key={s.name}
                                      className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5">
                                    <span className="size-1.5 rounded-full bg-emerald-400"/>
                                    <span className="font-mono text-sm font-semibold">{s.name}</span>
                                    <span className="hidden text-xs text-muted-foreground sm:inline">· {s.role}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}