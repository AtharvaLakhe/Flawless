import React from 'react'
import {TextEffect} from "@/components/motion-primitives/text-effect";

const noiseFindings: { severity: string; badge: string; text: string; source: string }[] = [
    {severity: 'CRIT', badge: 'bg-red-500/10 text-red-400 border-red-500/30', text: 'CVE-2024-38816 in spring-webmvc:6.1.2', source: 'Snyk'},
    {severity: 'CRIT', badge: 'bg-red-500/10 text-red-400 border-red-500/30', text: 'CVE-2024-39338 in axios:1.6.0', source: 'Trivy'},
    {severity: 'HIGH', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', text: 'Hardcoded AWS key in config.py:12', source: 'Gitleaks'},
    {severity: 'HIGH', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', text: 'SQL injection in routes/search.js:47', source: 'Semgrep'},
    {severity: 'MED', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', text: 'CVE-2024-6409 in openssl', source: 'Trivy'},
    {severity: 'MED', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', text: 'Secret detected in .env.example', source: 'Gitleaks'},
    {severity: 'MED', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', text: 'Unsafe regex — ReDoS in validators.ts', source: 'Semgrep'},
    {severity: 'LOW', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', text: 'TLS 1.1 minimum version in tls.config', source: 'Trivy'},
    {severity: 'LOW', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', text: 'CVE-2023-26136 in jsonwebtoken', source: 'Snyk'},
    {severity: 'LOW', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', text: 'Weak cipher suites in nginx.conf', source: 'Trivy'},
    {severity: 'INFO', badge: 'bg-muted text-muted-foreground border-border', text: '3 advisories in package-lock.json', source: 'npm'},
    {severity: 'INFO', badge: 'bg-muted text-muted-foreground border-border', text: 'Deprecated md5 hashing in auth.js', source: 'Semgrep'},
    {severity: 'CRIT', badge: 'bg-red-500/10 text-red-400 border-red-500/30', text: 'CVE-2024-4577 in php-cgi', source: 'Trivy'},
    {severity: 'HIGH', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', text: 'Hardcoded DB password in db.js:88', source: 'Gitleaks'},
]

const rankedFindings = [
    {
        rank: '#1',
        badge: 'bg-red-500/10 text-red-400 border-red-500/30',
        title: 'Leaked AWS key in config.py',
        reasoning: 'Internet-facing service, high blast radius. Anyone with the key can read production data.',
        tags: ['secret-leak', 'internet-exposed'],
    },
    {
        rank: '#2',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        title: 'Critical CVE in lodash@4.17.11',
        reasoning: 'Used only in a dev-only build script — lower real-world exposure. Fix on the next sprint.',
        tags: ['CVE', 'dev-only'],
    },
    {
        rank: '#3',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        title: 'TLS 1.1 minimum in tls.config',
        reasoning: 'Internal services only, low exploitability today. Track it, don\'t block on it.',
        tags: ['config', 'informational'],
    },
]

export default function ProblemSection() {
    return (
        <section id="problem" className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                <div className="max-w-3xl">
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="h2"
                        className="text-balance text-4xl font-semibold lg:text-5xl">
                        Scanners give you a list. Not an answer.
                    </TextEffect>
                    <TextEffect
                        triggerOnView
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={0.3}
                        as="p"
                        className="mt-6 text-pretty text-base text-muted-foreground sm:text-lg">
                        A single pipeline run can flag dozens of issues — vulnerable dependencies, exposed secrets,
                        risky code patterns — across three or four different tools that don&apos;t talk to each other.
                        Every finding looks urgent. Most engineers either drown in the noise or start ignoring it
                        entirely.
                    </TextEffect>
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-2">
                    {/* Raw wall */}
                    <div className="overflow-hidden rounded-2xl border border-border bg-background/60">
                        <div className="flex items-center justify-between border-b border-border bg-background/80 px-5 py-3">
                            <span className="font-mono text-xs font-bold tracking-wide text-red-400">
                                ⚠ Raw scanner findings
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">27 alerts · 4 tools</span>
                        </div>
                        <div className="flex max-h-[520px] flex-col gap-1.5 overflow-y-auto p-4">
                            {noiseFindings.map((f, i) => (
                                <div key={i}
                                     className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2 opacity-60">
                                    <span className={`w-12 shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-[10px] font-bold ${f.badge}`}>
                                        {f.severity}
                                    </span>
                                    <span className="truncate font-mono text-xs text-muted-foreground">{f.text}</span>
                                    <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground/70">{f.source}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ranked signal */}
                    <div className="overflow-hidden rounded-2xl border border-border bg-background/60">
                        <div className="flex items-center justify-between border-b border-border bg-background/80 px-5 py-3">
                            <span className="font-mono text-xs font-bold tracking-wide text-foreground">
                                ◈ Flawless ranked view
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">3 actionable items</span>
                        </div>
                        <div className="flex flex-col gap-4 p-5">
                            {rankedFindings.map((f) => (
                                <div key={f.rank}
                                     className="flex flex-col gap-2 rounded-xl border border-border bg-background/80 p-5">
                                    <div className="flex items-center gap-3">
                                        <span className={`rounded border px-2 py-0.5 font-mono text-xs font-bold ${f.badge}`}>{f.rank}</span>
                                        <span className="text-sm font-semibold text-foreground">{f.title}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        <span className="text-foreground">Why {f.rank.toLowerCase()}:</span> {f.reasoning}
                                    </p>
                                    <div className="flex gap-2">
                                        {f.tags.map((t) => (
                                            <span key={t}
                                                  className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <p className="px-1 font-mono text-[11px] leading-relaxed text-muted-foreground">
                                27 raw alerts → 3 findings worth acting on. The rest was noise.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}