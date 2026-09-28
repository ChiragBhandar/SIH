"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
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
  const { tr, trNav } = useLanguage();

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
    if (!name.trim()) errs.name = tr("Apiary name is required.", "मधुमक्खी पालन केंद्र का नाम आवश्यक है।");
    if (!location.trim()) errs.location = tr("Geographical location is required.", "भौगोलिक स्थान आवश्यक है।");
    if (!latitude.trim() || isNaN(Number(latitude))) errs.latitude = tr("Valid latitude is required.", "मान्य अक्षांश आवश्यक है।");
    if (!longitude.trim() || isNaN(Number(longitude))) errs.longitude = tr("Valid longitude is required.", "मान्य देशांतर आवश्यक है।");
    if (!dominantFlora.trim()) errs.dominantFlora = tr("Dominant flora information is required.", "प्रमुख वनस्पति जानकारी आवश्यक है।");
    if (!hiveCount.trim() || isNaN(Number(hiveCount)) || Number(hiveCount) < 0) {
      errs.hiveCount = tr("Initial hive count must be a non-negative number.", "प्रारंभिक छत्तों की संख्या अऋणात्मक होनी चाहिए।");
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
      setErrors({ form: tr("Failed to register apiary. Please check details.", "मधुमक्खी पालन केंद्र पंजीकृत करने में विफल। कृपया विवरण जांचें।") });
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
            <span>{tr("Back to Hives & Apiaries", "छत्ते और मधुमक्खी फार्म पर वापस")}</span>
          </Link>
        </Button>
      </div>

      {/* Success Modal / Banner */}
      {isSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/90 p-4 text-emerald-800 animate-in fade-in-50 space-y-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                {tr("Apiary Successfully Registered!", "मधुमक्खी पालन केंद्र सफलतापूर्वक पंजीकृत!")}
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                {tr("Saved", "सहेजा गया")} <strong>{name}</strong> {tr("into Honey Chain local registry. Redirecting to apiary view...", "हनी चेन स्थानीय रजिस्ट्री में। केंद्र दृश्य पर पुनः निर्देशित किया जा रहा है...")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Registration Card */}
      <Card className="border-border bg-card shadow-2xs">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Wheat className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                {tr("Register New Apiary", "नया मधुमक्खी पालन केंद्र पंजीकृत करें")}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {tr("Record geographical coordinates, botanical forage characteristics, and baseline hive capacity.", "भौगोलिक निर्देशांक, वानस्पतिक चारा विशेषताएँ और आधारभूत छत्ता क्षमता दर्ज करें।")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-4 text-xs">
            {errors.form && (
              <div className="rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-medium">
                {errors.form}
              </div>
            )}

            {/* Section 1: Identity & Location */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {tr("Apiary Identity & Territory", "केंद्र पहचान और क्षेत्र")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground">
                    {tr("Apiary Name", "मधुमक्खी फार्म का नाम")} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tr("e.g. Highland North Apiary or Valley Ridge Yard #2", "उदा. हाइलैंड नॉर्थ एपियरी या वैली रिज यार्ड #2")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.name ? (
                    <span className="text-[11px] text-rose-500">{errors.name}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {tr("Unique physical yard or apiary cluster name.", "अद्वितीय भौतिक यार्ड या केंद्र समूह का नाम।")}
                    </span>
                  )}
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground">
                    {tr("Geographical Location / Region", "भौगोलिक स्थान / क्षेत्र")} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tr("e.g. Chamoli, Uttarakhand or Kullu Valley, Himachal Pradesh", "उदा. चमोली, उत्तराखंड या कुल्लू घाटी, हिमाचल प्रदेश")}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.location ? (
                    <span className="text-[11px] text-rose-500">{errors.location}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {tr("District, state, or reserve location for honey provenance.", "शहद की उत्पत्ति के लिए जिला, राज्य या आरक्षित स्थान।")}
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
                  {tr("GPS Coordinates & Elevation", "जीपीएस निर्देशांक और ऊंचाई")}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseMockGps}
                  className="h-7 text-[11px] gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>{tr("Simulate GPS Fix", "जीपीएस सिमुलेशन")}</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    {tr("Latitude (°N)", "अक्षांश (°N)")} <span className="text-rose-500">*</span>
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
                    {tr("Longitude (°E)", "देशांतर (°E)")} <span className="text-rose-500">*</span>
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
                    {tr("Elevation", "ऊंचाई")}
                  </label>
                  <input
                    type="text"
                    value={elevation}
                    onChange={(e) => setElevation(e.target.value)}
                    placeholder={tr("e.g. 1,850 m", "उदा. 1,850 मी")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Flora & Capacity */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Flower2 className="h-3.5 w-3.5 text-primary" />
                {tr("Botanical Flora & Operational Setup", "वानस्पतिक वनस्पति और परिचालन व्यवस्था")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground">
                    {tr("Floral Region / Dominant Flora", "पुष्पीय क्षेत्र / प्रमुख वनस्पति")} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tr("e.g. Himalayan Wild Multifloral, White Clover, Wild Acacia, Pine", "उदा. हिमालयी वन्य मल्टीफ्लोरल, सफेद तिपतिया, बबूल, चीड़")}
                    value={dominantFlora}
                    onChange={(e) => setDominantFlora(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  {errors.dominantFlora ? (
                    <span className="text-[11px] text-rose-500">{errors.dominantFlora}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">
                      {tr("Primary foraging plants surrounding this apiary within 3km flight radius.", "3 किमी उड़ान त्रिज्या के भीतर इस केंद्र के आसपास प्राथमिक चारा पौधे।")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    {tr("Initial Number of Hives", "छत्तों की प्रारंभिक संख्या")} <span className="text-rose-500">*</span>
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
                      {tr("Initial active colony capacity for this apiary.", "इस केंद्र के लिए प्रारंभिक सक्रिय कॉलोनी क्षमता।")}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">{tr("Initial Status", "प्रारंभिक स्थिति")}</label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "active" | "inactive" | "quarantine")
                    }
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="active">{tr("Active (Operational & Foraging)", "सक्रिय (परिचालन और चारा)")}</option>
                    <option value="quarantine">{tr("Quarantine / Observation", "संगरोध / निगरानी")}</option>
                    <option value="inactive">{tr("Inactive / Seasonal Rest", "निष्क्रिय / मौसमी विश्राम")}</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-medium text-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    {tr("Operational Notes", "परिचालन टिप्पणियाँ")}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={tr("Terrain access details, solar fencing, weather hazards, or land-lease references...", "भूभाग विवरण, सौर बाड़, मौसम के खतरे, या पट्टा संदर्भ...")}
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
              <Link href="/hives">{tr("Cancel", "रद्द करें")}</Link>
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || isSuccess}
              className="text-xs min-w-[120px] shadow-xs cursor-pointer"
            >
              {isSubmitting ? tr("Saving Apiary...", "सहेज रहा है...") : tr("Save Apiary", "केंद्र सहेजें")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function RegisterApiaryPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard requiredLevel="full">
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Hives & Apiaries", "छत्ते और मधुमक्खी फार्म"), href: "/hives" },
          { label: tr("Register Apiary", "केंद्र पंजीकृत करें"), active: true },
        ]}
        defaultNavId="apiary"
      >
        <RegisterApiaryContent />
      </AppShell>
    </AuthGuard>
  );
}

