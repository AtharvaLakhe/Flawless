import React from 'react'
import {TextEffect} from "@/components/motion-primitives/text-effect";
import {AnimatedGroup} from "@/components/motion-primitives/animated-group";

const steps = [
    {
        number: '01',
        title: 'Scan',
        description: 'Existing tools — Trivy, Gitleaks, Semgrep — check your code for CVEs, leaked secrets, and insecure patterns. No migration, the gate reads what you already run.',
        tags: ['Trivy', 'Gitleaks', 'Semgrep'],
    },
    {
        number: '02',
        title: 'Normalize',
        description: 'Overlapping and duplicate findings across tools get merged into one clear picture. One finding, one identity — no more triple-reporting the same bug.',
        tags: ['dedupe', 'merge'],
    },
    {
        number: '03',
        title: 'Score',
        description: 'Each finding is ranked by real-world risk — exploitability, exposure, blast radius — not just a raw severity label stamped on by the scanner.',
        tags: ['exploitability', 'exposure', 'blast radius'],
    },
    {
        number: '04',
        title: 'Decide',
        description: 'A verdict is issued: ship, ship with warnings, or block — and it\'s enforced on the pull request, not just suggested in a report someone might not read.',
        tags: ['ship', 'warn', 'block'],
    },
]

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-3xl">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        From noise to a decision, in four steps
                    </TextEffect>
                </div>

                <AnimatedGroup
                    triggerOnView
                    preset="blur-slide"
                    className="mt-14 grid gap-4 sm:grid-cols-2"
                >
                    {steps.map((step) => (
                        <div key={step.number}
                             className="flex flex-col gap-4 rounded-2xl border border-border bg-background/60 p-7">
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-foreground">{step.number}</span>
                                <div className="h-px flex-1 bg-border"/>
                            </div>
                            <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                            <div className="mt-auto flex flex-wrap gap-2 pt-2">
                                {step.tags.map((t) => (
                                    <span key={t}
                                          className="rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px] text-muted-foreground">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </AnimatedGroup>
            </div>
        </section>
    )
}