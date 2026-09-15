import {
  LandingNavbar,
  HeroSection,
  ProductShowcase,
  ValueProposition,
  WorkflowSection,
  FeatureShowcase,
  VisualFeatureSections,
  FinalCTA,
  LandingFooter,
} from "@/components/landing";

export default function RootLandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Top Sticky Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero Section with Live Quick-Verify */}
        <HeroSection />

        {/* Interactive Product Showcase & Mockup */}
        <ProductShowcase />

        {/* 4 Core Value Propositions */}
        <ValueProposition />

        {/* 5-Stage Supply Chain Workflow */}
        <WorkflowSection />

        {/* Feature Showcase (Bento Grid) */}
        <FeatureShowcase />

        {/* Deep-dive Visual Feature Splits */}
        <VisualFeatureSections />

        {/* Final High-Converting CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
