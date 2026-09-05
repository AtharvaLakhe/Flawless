'use client'

import React, {useState} from 'react'
import {TextEffect} from "@/components/motion-primitives/text-effect";
import {Check, X, RotateCcw} from 'lucide-react'

function CheckRow({passed, name, detail}: { passed: boolean; name: string; detail: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background/80 px-4 py-3">
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
            }`}>
                {passed ? <Check className="size-3.5"/> : <X className="size-3.5"/>}
            </span>
            <div>
                <div className="text-sm font-semibold text-foreground">{name}</div>
                <div className="font-mono text-[11px] text-muted-foreground">{detail}</div>
            </div>
        </div>
    )
}

export default function GateSection() {
    const [blocked, setBlocked] = useState(true)

    return (
        <section id="gate" className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        It doesn&apos;t just tell you. It stops it.
                    </TextEffect>
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.3}
                        as="p"
                        className="mt-6 text-pretty text-base text-muted-foreground sm:text-lg">
                        A high-risk release doesn&apos;t just get flagged in a report someone might not read — it fails
                        the check, the same way a broken test would. Fix the top issue, push again, and the gate
                        opens.
                    </TextEffect>
                </div>

                <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-2xl border border-border bg-background/60">
                    {/* Card header */}
                    <div className="flex items-center justify-between border-b border-border bg-background/80 px-5 py-3">
                        <span className="text-sm font-semibold text-foreground">GitHub Status Checks — PR #482</span>
                        <span className="font-mono text-[11px] text-muted-foreground">3 checks</span>
                    </div>

                    {/* Checks */}
                    <div className="flex flex-col gap-2.5 p-5">
                        <CheckRow passed name="build / compile" detail="Build succeeded in 42s"/>
                        <CheckRow passed name="test / unit-tests" detail="142 tests passed in 1m 12s"/>
                        <CheckRow
                            passed={!blocked}
                            name="Flawless / Security Release Gate"
                            detail={blocked ? '1 critical finding — release blocked' : 'All critical findings resolved — release approved'}
                        />
                    </div>

                    {/* Merge bar */}
                    <div className="flex items-center justify-between gap-3 border-t border-border bg-background/80 px-5 py-4">
                        <span className={`text-sm font-semibold transition-colors duration-300 ${
                            blocked ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                            {blocked ? 'Merging is blocked by Flawless' : 'All checks passed — ready to merge'}
                        </span>
                        <button
                            type="button"
                            disabled={blocked}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                                blocked
                                    ? 'cursor-not-allowed bg-muted text-muted-foreground/60'
                                    : 'bg-emerald-500 text-background hover:bg-emerald-400'
                            }`}>
                            Merge pull request
                        </button>
                    </div>
                </div>

                {/* Simulate toggle */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => setBlocked(!blocked)}
                        className="inline-flex items-center gap-2 rounded-xl border border-foreground/30 bg-background px-6 py-3 font-mono text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background">
                        <RotateCcw className="size-4"/>
                        {blocked ? 'Simulate: fix findings & re-run gate' : 'Simulate: revert to blocked state'}
                    </button>
                </div>
            </div>
        </section>
    )
}