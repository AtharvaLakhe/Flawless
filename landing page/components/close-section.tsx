import React from 'react'
import {TextEffect} from "@/components/motion-primitives/text-effect";

export default function CloseSection() {
    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-3xl px-6 text-center">
                <TextEffect
                    triggerOnView
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h2"
                    className="text-balance text-4xl font-semibold lg:text-5xl">
                    Built for one problem: knowing what actually matters before you ship.
                </TextEffect>
                <TextEffect
                    triggerOnView
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    delay={0.3}
                    as="p"
                    className="mt-6 text-pretty text-base text-muted-foreground sm:text-lg">
                    Flawless doesn&apos;t replace your scanners — it&apos;s the layer that turns everything they find
                    into a decision you can trust.
                </TextEffect>
            </div>

            {/* Giant outlined wordmark — stroke-only letters, orange glow fading into the background */}
            <div aria-hidden="true" className="pointer-events-none mt-20 select-none overflow-hidden text-center">
                <span
                    className="block font-sans font-black leading-[0.85] tracking-[-0.05em]"
                    style={{
                        fontSize: 'clamp(90px, 18vw, 260px)',
                        color: 'transparent',
                        WebkitTextStroke: '1.5px rgba(255, 107, 53, 0.45)',
                        backgroundImage: 'linear-gradient(180deg, rgba(255, 107, 53, 0.20) 0%, rgba(255, 59, 92, 0.10) 45%, transparent 80%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 40px rgba(255, 107, 53, 0.25))',
                    }}
                >
                    Flawless
                </span>
            </div>
        </section>
    )
}