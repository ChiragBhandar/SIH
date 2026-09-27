"use client";

import * as React from "react";
import {
  Wheat,
  Boxes,
  Truck,
  FlaskConical,
  QrCode,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { BeehiveCluster } from "@/components/landing/beehive-pattern";
import { useLanguage } from "@/context/language-context";

const stepIcons = [Wheat, Boxes, Truck, FlaskConical, QrCode];

export function WorkflowSection() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = t.workflow.steps.map((step, idx) => ({
    ...step,
    icon: stepIcons[idx] || Wheat,
  }));

  const currentStep = steps[activeStep] || steps[0];
  const StepIcon = currentStep.icon;

  return (
    <section id="workflow" className="py-16 md:py-24 border-b border-border/70 relative overflow-hidden">
      {/* Subtle Ambient Honeycomb Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <BeehiveCluster 
          className="top-10 -right-20 w-[420px] h-[380px]"
          strokeColor="#E6D3B1"
          strokeWidth={1.4}
          opacity={0.18}
        />
        <BeehiveCluster 
          className="-bottom-16 -left-20 w-[350px] h-[330px]"
          strokeColor="#E6D3B1"
          strokeWidth={1.4}
          opacity={0.16}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7E3DB] bg-white px-3.5 py-1 text-[11px] font-bold text-[#143D2B] shadow-2xs">
            <Layers className="h-3.5 w-3.5 text-[#D97706]" />
            <span>{t.workflow.badge}</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.12]">
            {t.workflow.heading}
          </h2>
          <p className="text-base text-[#5F6B64] leading-relaxed">
            {t.workflow.subheading}
          </p>
        </div>

        {/* Visual 5-Stage Horizontal Progression Tracker */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#D97706] bg-white shadow-sm ring-1 ring-[#D97706]/30"
                      : "border-[#E7E3DB] bg-white/70 hover:bg-white hover:border-[#D97706]/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isSelected ? "text-[#D97706]" : "text-[#5F6B64]"
                      }`}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-[#FEF6E8] text-[#B45309]"
                          : "bg-[#FAF8F5] text-[#5F6B64]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div
                    className={`font-heading text-xs font-bold leading-snug line-clamp-1 ${
                      isSelected ? "text-foreground" : "text-[#5F6B64]"
                    }`}
                  >
                    {step.shortTitle}
                  </div>
                  <span className="text-[10px] text-[#5F6B64] truncate mt-0.5 font-medium">
                    {step.actor.split("&")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Focused Active Stage Card */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#E7E3DB] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
            {/* Stage Title and Actor Lockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E3DB] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5]">
                  <StepIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FEF6E8] text-[#B45309] border border-[#FCDDB5] text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {t.workflow.stagePrefix} {currentStep.number} of 05
                    </span>
                    <span className="text-xs text-[#5F6B64]">
                      {t.workflow.roleLabel}: <strong className="text-foreground font-semibold">{currentStep.actor}</strong>
                    </span>
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-1">
                    {currentStep.title}
                  </h3>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-mono uppercase text-[#5F6B64] block font-semibold">{t.workflow.ledgerOutput}</span>
                <span className="font-mono text-xs font-bold text-[#143D2B] bg-[#EAF3EE] border border-[#C6DDD0] px-2 py-0.5 rounded-md inline-block mt-0.5">
                  ✓ {currentStep.sampleData.status}
                </span>
              </div>
            </div>

            {/* Plain-Language Summary paired with technical context */}
            <div className="bg-[#FAF8F5] rounded-xl p-3.5 border border-[#E7E3DB] text-xs text-[#5F6B64] flex items-start gap-2.5">
              <div className="h-2 w-2 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
              <div>
                <strong className="text-foreground font-semibold">{t.workflow.whatHappensHere} </strong>
                {currentStep.plainLanguage}{" "}
                <span className="text-[#5F6B64]/90 block sm:inline mt-1 sm:mt-0 font-normal">
                  ({currentStep.shortDesc})
                </span>
              </div>
            </div>

            {/* Stage Verification Controls Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6B64] block font-mono">
                {t.workflow.verifiedStageControls}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentStep.details.map((detail, dIdx) => (
                  <div
                    key={dIdx}
                    className="flex items-start gap-2 p-3 rounded-xl bg-white border border-[#E7E3DB] text-xs text-foreground/90 shadow-2xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#143D2B] shrink-0 mt-0.5" />
                    <span className="leading-snug">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Ledger Mock Proof Artifact */}
            <div className="rounded-xl border border-[#E7E3DB] bg-[#FAF8F5] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-[10px] text-[#5F6B64] uppercase font-mono block font-semibold">{t.workflow.onChainIdentifier}</span>
                <span className="font-mono font-bold text-foreground text-xs">{currentStep.sampleData.code}</span>
              </div>
              <div className="text-left sm:text-right font-mono text-[11px] text-[#5F6B64]">
                {currentStep.sampleData.meta}
              </div>
            </div>

            {/* Next / Previous Stepper Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E7E3DB]">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="text-xs text-[#5F6B64] hover:text-foreground disabled:opacity-30 cursor-pointer font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t.workflow.prevStage}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {steps.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActiveStep(dotIdx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeStep === dotIdx ? "w-6 bg-[#D97706]" : "w-2 bg-[#E7E3DB] hover:bg-[#D97706]/40"
                    }`}
                    aria-label={`Go to step ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="text-xs text-[#D97706] hover:text-[#B45309] disabled:opacity-30 cursor-pointer font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>{t.workflow.nextStage}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
