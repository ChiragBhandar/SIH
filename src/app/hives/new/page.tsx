"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import {
  Wheat,
  MapPin,
  Navigation,
  Mountain,
  Flower2,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function RegisterApiaryContent() {
  const router = useRouter();
  const { addApiary } = useTraceability();

  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [latitude, setLatitude] = React.useState("30.3956");
  const [longitude, setLongitude] = React.useState("79.3308");
  const [elevation, setElevation] = React.useState("1,750 m");
  const [dominantFlora, setDominantFlora] = React.useState("");
  const [hiveCount, setHiveCount] = React.useState("12");
  const [notes, setNotes] = React.useState("");
  const [status, setStatus] = React.useState<"active" | "inactive" | "quarantine">("active");

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleUseMockGps = () => {
    // Generate realistic Himalayan coordinates
    const lat = (30.1 + Math.random() * 0.5).toFixed(4);
    const lng = (79.1 + Math.random() * 0.5).toFixed(4);
    const elev = `${Math.floor(1600 + Math.random() * 800)} m`;
    setLatitude(lat);
    setLongitude(lng);
    setElevation(elev);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Apiary name is required.";
    if (!location.trim()) errs.location = "Geographical location is required.";
    if (!latitude.trim() || isNaN(Number(latitude))) errs.latitude = "Valid latitude is required.";
    if (!longitude.trim() || isNaN(Number(longitude))) errs.longitude = "Valid longitude is required.";
    if (!dominantFlora.trim()) errs.dominantFlora = "Dominant flora information is required.";
    if (!hiveCount.trim() || isNaN(Number(hiveCount)) || Number(hiveCount) < 0) {
      errs.hiveCount = "Initial hive count must be a non-negative number.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = addApiary({
        name: name.trim(),
        location: location.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        elevation: elevation.trim() || "1,500 m",
        dominantFlora: dominantFlora.trim(),
        hiveCount: parseInt(hiveCount, 10) || 0,
        status,
        notes: notes.trim(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/hives?apiary=${created.id}&registered=true`);
      }, 1200);
    } catch {
      setErrors({ form: "Failed to register apiary. Please check details." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button link */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/hives">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Hives & Apiaries</span>
          </Link>
        </Button>
      </div>

      {/* Success Modal / Banner */}
      {isSuccess && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-800 dark:text-emerald-200 animate-in fade-in-50 space-y-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">
                Apiary Successfully Registered!
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Saved <strong>{name}</strong> into Honey Chain local registry. Redirecting to apiary view...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wheat className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Register New Apiary
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Record geographical coordinates, botanical forage characteristics, and baseline hive capacity.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4 text-xs">
            {errors.form && (
              <div className="rounded-md bg-rose-500/10 border border-rose-500/30 p-3 text-rose-600 dark:text-rose-400">
                {errors.form}
              </div>
            )}

            {/* Section 1: Identity & Location */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Apiary Identity & Territory
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground">
                    Apiary Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Highland North Apiary or Valley Ridge Yard #2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.name ? (
                    <span className="text-[11px] text-rose-500">{errors.name}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      Unique physical yard or apiary cluster name.
                    </span>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground">
                    Geographical Location / Region <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chamoli, Uttarakhand or Kullu Valley, Himachal Pradesh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.location ? (
                    <span className="text-[11px] text-rose-500">{errors.location}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      District, state, or reserve location for honey provenance.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Geo Coordinates */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-primary" />
                  GPS Coordinates & Elevation
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseMockGps}
                  className="h-7 text-[11px] gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>Simulate GPS Fix</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    Latitude (°N) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="30.3956"
                    className="h-9 w-full font-mono rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.latitude && (
                    <span className="text-[11px] text-rose-500">{errors.latitude}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    Longitude (°E) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="79.3308"
                    className="h-9 w-full font-mono rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.longitude && (
                    <span className="text-[11px] text-rose-500">{errors.longitude}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground flex items-center gap-1">
                    <Mountain className="h-3 w-3 text-muted-foreground" />
                    Elevation
                  </label>
                  <input
                    type="text"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    placeholder="e.g. 1,850 m"
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Flora & Capacity */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flower2 className="h-3.5 w-3.5 text-primary" />
                Botanical Flora & Operational Setup
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground">
                    Floral Region / Dominant Flora <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Himalayan Wild Multifloral, White Clover, Wild Acacia, Pine"
                    value={dominantFlora}
                    onChange={(e) => setDominantFlora(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.dominantFlora ? (
                    <span className="text-[11px] text-rose-500">{errors.dominantFlora}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      Primary foraging plants surrounding this apiary within 3km flight radius.
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    Initial Number of Hives <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={hiveCount}
                    onChange={(e) => setHiveCount(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.hiveCount ? (
                    <span className="text-[11px] text-rose-500">{errors.hiveCount}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      Initial active colony capacity for this apiary.
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "active" | "inactive" | "quarantine")
                    }
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="active">Active (Operational & Foraging)</option>
                    <option value="quarantine">Quarantine / Observation</option>
                    <option value="inactive">Inactive / Seasonal Rest</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    Operational Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Terrain access details, solar fencing, weather hazards, or land-lease references..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
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
              <Link href="/hives">Cancel</Link>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isSuccess}
              className="text-xs min-w-[120px] shadow-xs cursor-pointer"
            >
              {isSubmitting ? "Saving Apiary..." : "Save Apiary"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function RegisterApiaryPage() {
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: "Honey Chain", href: "/dashboard" },
          { label: "Hives & Apiaries", href: "/hives" },
          { label: "Register Apiary", active: true },
        ]}
        defaultNavId="apiary"
      >
        <RegisterApiaryContent />
      </AppShell>
    </AuthGuard>
  );
}
