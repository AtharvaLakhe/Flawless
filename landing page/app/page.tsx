import HeroSection from "@/components/hero-section";
import ProblemSection from "@/components/problem-section";
import HowItWorksSection from "@/components/how-it-works-section";
import VerdictSection from "@/components/verdict-section";
import GateSection from "@/components/gate-section";
import CloseSection from "@/components/close-section";
import {AnalyzeAnimation} from "@/components/AITriangleAnimation";

export default function Home() {
    return (
        <>
            <div className="relative overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 z-0"
                    style={{
                        maskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 140px), transparent 100%)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 140px), transparent 100%)",
                    }}
                >
                    <AnalyzeAnimation shape="triangle" />
                </div>
                <div className="relative z-10">
                    <HeroSection/>
                    <ProblemSection/>
                    <HowItWorksSection/>
                    <VerdictSection/>
                    <GateSection/>
                </div>
            </div>
            <CloseSection/>
        </>
    )
}