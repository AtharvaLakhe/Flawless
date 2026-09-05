'use client'

import React, {useState} from 'react'
import {TextEffect} from "@/components/motion-primitives/text-effect";
import {Copy, Check} from 'lucide-react'

const findingOneFix = 'Remove the hardcoded AWS key in config.py line 12, replace with an environment variable read via os.environ, and add config.py to .gitignore if not already present.'

async function copyTextToClipboard(text: string): Promise<boolean> {
    // Some environments (headless previews, older browsers) hang or reject
    // on the async Clipboard API, so race it against a timeout and fall back
    // to the legacy synchronous copy path.
    const attempt = (): Promise<boolean> =>
        navigator.clipboard
            ? navigator.clipboard.writeText(text).then(() => true)
            : Promise.resolve(false)

    const withTimeout = (p: Promise<boolean>, ms: number) =>
        new Promise<boolean>((resolve) => {
            const timer = setTimeout(() => resolve(false), ms)
            p.then((v) => {
                clearTimeout(timer)
                resolve(v)
            }).catch(() => {
                clearTimeout(timer)
                resolve(false)
            })
        })

    if (await withTimeout(attempt(), 500)) return true

    try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(textarea)
        return ok
    } catch {
        return false
    }
}

function CopyFixButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)
    return (
        <button
            type="button"
            onClick={() => {
                copyTextToClipboard(text).then((ok) => {
                    setCopied(ok)
                    setTimeout(() => setCopied(false), 2000)
                })
            }}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground">
            {copied ? <Check className="size-3 text-emerald-400"/> : <Copy className="size-3"/>}
            {copied ? 'Copied!' : 'Copy prompt'}
        </button>
    )
}

export default function VerdictSection() {
    return (
        <section id="verdict" className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-3xl">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        One screen. The whole picture.
                    </TextEffect>
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.3}
                        as="p"
                        className="mt-6 text-pretty text-base text-muted-foreground sm:text-lg">
                        Every finding with its reasoning, ranked by real-world risk, and a fix you can hand
                        straight to your AI coding assistant.
                    </TextEffect>
                </div>

                <div className="mt-14 overflow-hidden rounded-2xl border border-border bg-background/60">
                    {/* Top bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/80 px-5 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                            flawless / <span className="text-foreground">verdict-report #482</span>
                        </span>
                        <span className="font-mono text-xs font-bold tracking-widest text-red-400">
                            VERDICT: BLOCKED (78/100)
                        </span>
                    </div>

                    <div className="grid lg:grid-cols-[280px_1fr]">
                        {/* Summary sidebar */}
                        <aside className="flex flex-col gap-5 border-b border-border bg-background/40 p-6 lg:border-b-0 lg:border-r">
                            <div>
                                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Risk</div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="font-mono text-5xl font-bold text-red-500">78</span>
                                    <span className="font-mono text-sm text-muted-foreground">/100</span>
                                </div>
                                <span className="mt-3 inline-block rounded bg-red-500 px-2.5 py-1 font-mono text-xs font-bold tracking-widest text-background">
                                    BLOCK
                                </span>
                            </div>

                            <div>
                                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Summary</div>
                                <dl className="mt-3 space-y-1.5 text-sm">
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">PR</dt><dd className="font-mono">#482</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Branch</dt><dd className="font-mono">feature/search-v2</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Findings</dt><dd className="font-mono">14 scanned</dd></div>
                                    <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Actionable</dt><dd className="font-mono">2</dd></div>
                                </dl>
                            </div>

                            <div>
                                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Scanners evaluated</div>
                                <ul className="mt-3 space-y-1.5 font-mono text-xs text-muted-foreground">
                                    <li className="flex justify-between"><span>✓ Snyk SAST</span><span>(12)</span></li>
                                    <li className="flex justify-between"><span>✓ Semgrep</span><span>(8)</span></li>
                                    <li className="flex justify-between"><span>✓ Gitleaks</span><span>(1)</span></li>
                                    <li className="flex justify-between"><span>✓ Trivy</span><span>(42)</span></li>
                                </ul>
                            </div>
                        </aside>

                        {/* Findings */}
                        <div className="flex flex-col gap-4 p-6">
                            {/* Finding 1 */}
                            <div className="overflow-hidden rounded-xl border border-red-500/30 bg-background/80">
                                <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
                                    <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-red-400">#1</span>
                                    <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-red-400">CRITICAL</span>
                                    <span className="text-sm font-semibold text-foreground">Leaked AWS key in config.py</span>
                                </div>
                                <div className="flex flex-col gap-3 p-5">
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        A production AWS access key is hardcoded in <code className="font-mono text-foreground">config.py</code> line 12.
                                        The service is internet-facing, so anyone with the key can read production data.
                                    </p>
                                    <div className="flex flex-wrap gap-2 font-mono text-[11px] text-muted-foreground">
                                        <span className="rounded border border-border bg-background px-2 py-0.5">exploitability: high</span>
                                        <span className="rounded border border-border bg-background px-2 py-0.5">blast radius: high</span>
                                        <span className="rounded border border-border bg-background px-2 py-0.5">secret-leak</span>
                                    </div>
                                    <div className="rounded-lg border border-border">
                                        <div className="flex items-center justify-between border-b border-border bg-background/80 px-3 py-2">
                                            <span className="font-mono text-[11px] font-bold tracking-widest text-foreground">AI-READY FIX PROMPT</span>
                                            <CopyFixButton text={findingOneFix}/>
                                        </div>
                                        <p className="px-3 py-3 font-mono text-xs leading-relaxed text-muted-foreground">{findingOneFix}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Finding 2 */}
                            <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-background/80">
                                <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
                                    <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-400">#2</span>
                                    <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-400">HIGH</span>
                                    <span className="text-sm font-semibold text-foreground">Critical CVE in lodash@4.17.11</span>
                                </div>
                                <div className="flex flex-col gap-3 p-5">
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        lodash 4.17.11 has a known prototype-pollution CVE, but it&apos;s only imported by a
                                        dev-only build script. No production path reaches it, so the real-world exposure
                                        is lower than the severity label suggests.
                                    </p>
                                    <div className="flex flex-wrap gap-2 font-mono text-[11px] text-muted-foreground">
                                        <span className="rounded border border-border bg-background px-2 py-0.5">exposure: low</span>
                                        <span className="rounded border border-border bg-background px-2 py-0.5">dev-only</span>
                                        <span className="rounded border border-border bg-background px-2 py-0.5">CVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}