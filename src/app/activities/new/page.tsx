"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { ActivityType, QueenStatus } from "@/types/traceability";
import {
  Activity,
  ArrowLeft,
  Wifi,
  CloudSun,
  Thermometer,
  Droplets,
  Flower2,
  CheckCircle2,
  Layers,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function CaptureActivityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedHiveId = searchParams.get("hiveId") || "";

  const { apiaries, hives, getHive, addActivity } = useTraceability();

  const preselectedHive = React.useMemo(() => {
    return preselectedHiveId ? getHive(preselectedHiveId) : undefined;
  }, [preselectedHiveId, getHive]);

  const [userSelectedApiaryId, setUserSelectedApiaryId] = React.useState<string>("");
  const [userSelectedHiveId, setUserSelectedHiveId] = React.useState<string>("");
  const [userQueenStatus, setUserQueenStatus] = React.useState<QueenStatus | null>(null);

  const selectedApiaryId =
    userSelectedApiaryId ||
    preselectedHive?.apiaryId ||
    (apiaries.length > 0 ? apiaries[0].id : "");

  // Available hives for currently selected apiary
  const availableHives = React.useMemo(() => {
    if (!selectedApiaryId) return hives;
    return hives.filter((h) => h.apiaryId === selectedApiaryId);
  }, [hives, selectedApiaryId]);

  const selectedHiveId =
    userSelectedHiveId && availableHives.some((h) => h.id === userSelectedHiveId)
      ? userSelectedHiveId
      : preselectedHive && availableHives.some((h) => h.id === preselectedHive.id)
      ? preselectedHive.id
      : availableHives[0]?.id || "";

  const selectedHive = availableHives.find((h) => h.id === selectedHiveId);
  const queenStatus = userQueenStatus ?? selectedHive?.queenStatus ?? "Active & Laying";

  const [activityType, setActivityType] = React.useState<ActivityType>("Inspection");
  const [dateTime, setDateTime] = React.useState(
    new Date().toISOString().slice(0, 16)
  );
  const [weather, setWeather] = React.useState("Clear & Sunny");
  const [temperature, setTemperature] = React.useState("22");
  const [humidity, setHumidity] = React.useState("46");
  const [floralObservation, setFloralObservation] = React.useState(
    "High pollen foraging from white clover and mountain thyme."
  );
  const [notes, setNotes] = React.useState("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!selectedHiveId) errs.hive = "Please select a hive to log activity.";
    if (!notes.trim()) errs.notes = "Inspection notes and field findings are required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      addActivity({
        type: activityType,
        hiveId: selectedHiveId,
        weather,
        temperature: `${temperature}°C`,
        humidity: `${humidity}%`,
        floralObservation: floralObservation.trim(),
        queenStatus,
        notes: notes.trim(),
        recordedBy: "Chirag Operator (Beekeeper)",
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/hives/${selectedHiveId}`);
      }, 1000);
    } catch {
      setErrors({ form: "Failed to save activity log." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href={selectedHiveId ? `/hives/${selectedHiveId}` : "/activities"}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to {selectedHiveId ? "Hive Detail" : "Activities"}</span>
          </Link>
        </Button>
      </div>

      {/* Offline Status Simulation Pill */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">
            Field Capture Simulation Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] py-0 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-mono"
          >
            ● Offline capture ready
          </Badge>
          <Badge
            variant="secondary"
            className="text-[10px] py-0 text-muted-foreground font-mono"
          >
            Will sync when online
          </Badge>
        </div>
      </div>

      {/* Success Notification */}
      {isSuccess && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-200 animate-in fade-in-50 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Activity logged successfully.</span> Added to the hive timeline and synchronized with Honey Chain local state.
          </div>
        </div>
      )}

      {/* Activity Capture Form Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Capture Field Activity
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Record yard inspections, pest treatments, brood assessments, and foraging bloom observations.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4 text-xs">
            {errors.form && (
              <div className="rounded-md bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-600 dark:text-rose-400">
                {errors.form}
              </div>
            )}

            {/* Target Apiary and Hive Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  Apiary Location <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedApiaryId}
                  onChange={(e) => {
                    setUserSelectedApiaryId(e.target.value);
                    setUserSelectedHiveId("");
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {apiaries.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Layers className="h-3 w-3 text-primary" />
                  Target Hive <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedHiveId}
                  onChange={(e) => {
                    setUserSelectedHiveId(e.target.value);
                    const h = getHive(e.target.value);
                    if (h) setUserQueenStatus(h.queenStatus);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {availableHives.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.identifier} ({h.internalCode} • {h.status})
                    </option>
                  ))}
                </select>
                {errors.hive && (
                  <span className="text-[11px] text-rose-500">{errors.hive}</span>
                )}
              </div>
            </div>

            {/* Activity Type and Timestamp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  Activity Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Inspection">Routine Inspection</option>
                  <option value="Queen observation">Queen Observation / Brood Assessment</option>
                  <option value="Feeding">Supplemental / Booster Feeding</option>
                  <option value="Pest treatment">Pest Treatment (Varroa / Mites)</option>
                  <option value="Floral observation">Floral & Foraging Observation</option>
                  <option value="Harvest Preparation">Harvest Super Preparation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">
                  Date & Time of Capture
                </label>
                <input
                  type="datetime-local"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Weather & Environmental Conditions */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CloudSun className="h-3.5 w-3.5 text-amber-500" />
                Yard Weather & Environmental Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Weather</label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="Clear & Sunny">Clear & Sunny</option>
                    <option value="Partly Cloudy">Partly Cloudy</option>
                    <option value="Breezy & Sunny">Breezy & Sunny</option>
                    <option value="Overcast">Overcast</option>
                    <option value="Light Mountain Mist">Light Mountain Mist</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-rose-500" />
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-sky-500" />
                    Humidity (%)
                  </label>
                  <input
                    type="number"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Floral Observation & Queen Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <label className="font-medium text-foreground flex items-center gap-1">
                  <Flower2 className="h-3 w-3 text-amber-500" />
                  Floral Observation
                </label>
                <input
                  type="text"
                  placeholder="e.g. White clover bloom, acacia flow, heavy pollen intake"
                  value={floralObservation}
                  onChange={(e) => setFloralObservation(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Queen Status</label>
                <select
                  value={queenStatus}
                  onChange={(e) => setUserQueenStatus(e.target.value as QueenStatus)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Active & Laying">Active & Laying</option>
                  <option value="Virgin">Virgin</option>
                  <option value="Supersedure">Supersedure</option>
                  <option value="Queenless">Queenless</option>
                  <option value="Requeening Needed">Requeening Needed</option>
                </select>
              </div>
            </div>

            {/* Field Notes */}
            <div className="space-y-1 pt-2 border-t border-border/60">
              <label className="font-medium text-foreground">
                Inspection Notes & Action Taken <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detail brood pattern, honeycomb fill level, temperament, treatment applied..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.notes && (
                <span className="text-[11px] text-rose-500">{errors.notes}</span>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 pb-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <Link href={selectedHiveId ? `/hives/${selectedHiveId}` : "/activities"}>
                Cancel
              </Link>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isSuccess}
              className="text-xs min-w-[120px] shadow-xs cursor-pointer"
            >
              {isSubmitting ? "Logging Activity..." : "Save Activity"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function CaptureActivityPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Traceability", href: "#" },
          { label: "Capture Activity", active: true },
        ]}
        defaultNavId="activities"
      >
        <CaptureActivityContent />
      </AppShell>
    </AuthGuard>
  );
}
