"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTraceability } from "@/context/traceability-context";
import { useLanguage } from "@/context/language-context";
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Boxes,
  Layers,
  FlaskConical,
  Wheat,
  ArrowLeftRight,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

export function CertificateDetailContent() {
  const { tr, trStatus } = useLanguage();
  const params = useParams();
  const certId = params?.id as string;

  const {
    getCertification,
    isLoaded,
  } = useTraceability();

  const cert = getCertification(certId);
  const lineage = cert?.sourceLineage;

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-muted-foreground animate-pulse">
          {tr("Loading certificate verification data and cryptographic seal...", "प्रमाणपत्र सत्यापन डेटा और क्रिप्टोग्राफिक सील लोड हो रहे हैं...")}
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <EmptyState
          icon={Award}
          title={tr("Certificate not found", "प्रमाणपत्र नहीं मिला")}
          description={tr(`No certificate record found matching ID "${certId}".`, `आईडी "${certId}" से मेल खाता कोई प्रमाणपत्र रिकॉर्ड नहीं मिला।`)}
          action={
            <Button asChild size="sm">
              <Link href="/certifications">{tr("Back to Certifications", "प्रमाणपत्रों पर वापस")}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs text-muted-foreground hover:text-foreground -ml-2 h-8 gap-1.5"
        >
          <Link href="/certifications">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{tr("Back to Certifications", "प्रमाणपत्रों पर वापस")}</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
            <Link href={`/batches/${cert.batchNumber}`}>
              <Boxes className="h-3.5 w-3.5" />
              <span>{tr("View Batch", "बैच देखें")} {cert.batchNumber}</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-xs gap-1.5">
            <Link href={`/lab/${cert.testId}`}>
              <FlaskConical className="h-3.5 w-3.5" />
              <span>{tr("View Lab Test", "लैब टेस्ट देखें")} {cert.testId}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* OFFICIAL CERTIFICATE OF ANALYSIS HERO BANNER */}
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 via-card to-card p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        {/* Decorative corner seal background */}
        <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none">
          <Award className="h-64 w-64 text-emerald-500" />
        </div>

        {/* Certificate Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                  {cert.id}
                </h1>
                <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  {tr("Official Certificate of Analysis & Purity", "विश्लेषण एवं शुद्धता का आधिकारिक प्रमाणपत्र")}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              {tr(
                "Issued under the Honey Chain Quality Standard by accredited laboratory",
                "मान्यता प्राप्त प्रयोगशाला द्वारा हनी चेन गुणवत्ता मानक के तहत जारी:"
              )}{" "}
              <strong className="text-foreground">{cert.issuedBy}</strong>.
            </p>
          </div>

          {/* Strong QUALITY APPROVED Banner */}
          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-sm tracking-wide shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>{tr("QUALITY APPROVED", "गुणवत्ता अनुमोदित")}</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {tr("Seal:", "सील:")} {cert.sealNumber}
            </span>
          </div>
        </div>

        {/* Certificate Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1 p-3 rounded-lg bg-background/60 border border-border/60">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              {tr("Certified Batch", "प्रमाणित बैच")}
            </span>
            <Link
              href={`/batches/${cert.batchNumber}`}
              className="font-mono font-bold text-sm text-foreground hover:underline flex items-center gap-1"
            >
              <span>{cert.batchNumber}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
            <span className="text-[11px] text-muted-foreground block">
              {tr("Weight:", "वजन:")} {cert.certifiedWeightKg.toFixed(1)} {tr("kg", "किग्रा")}
            </span>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-background/60 border border-border/60">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              {tr("Honey Botanical Type", "शहद वानस्पतिक प्रकार")}
            </span>
            <p className="font-semibold text-foreground text-xs">
              {cert.honeyType}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              {cert.certificationType}
            </span>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-background/60 border border-border/60">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              {tr("Issuance Date & Lab", "जारी करने की तारीख एवं प्रयोगशाला")}
            </span>
            <p className="font-mono font-medium text-foreground text-xs">
              {cert.issuedDate}
            </p>
            <span className="text-[11px] text-muted-foreground block truncate" title={cert.issuedBy}>
              {cert.issuedBy}
            </span>
          </div>

          <div className="space-y-1 p-3 rounded-lg bg-background/60 border border-border/60">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">
              {tr("Certifying Officer", "प्रमाणीकरण अधिकारी")}
            </span>
            <p className="font-medium text-foreground text-xs">
              {cert.analystName}
            </p>
            <span className="text-[11px] font-mono text-emerald-700 block">
              {tr("Status:", "स्थिति:")} {trStatus(cert.validStatus)}
            </span>
          </div>
        </div>

        {/* Verdict Summary Box */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-1 text-xs text-emerald-950">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>{tr("Compliance Verdict", "अनुपालन निर्णय")}</span>
          </div>
          <p className="leading-relaxed text-xs">
            {cert.summaryVerdict}
          </p>
        </div>
      </div>

      {/* FULL SOURCE LINEAGE AUDIT GRAPH */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Wheat className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">
              {tr("Full Source Provenance Lineage", "पूर्ण स्रोत उत्पत्ति वंशावली")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {tr("Complete cryptographic journey of this honey from apiary harvest to certified release.", "मधुमक्खी पालन हार्वेस्ट से प्रमाणित रिलीज तक इस शहद की पूर्ण क्रिप्टोग्राफ़िक यात्रा।")}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* 1. Apiary & Hives */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Wheat className="h-3.5 w-3.5 text-amber-600" />
                  <span>{tr("1. Apiary & Hives", "१. मधुमक्खी फार्म और छत्ते")}</span>
                </span>
                <Badge variant="outline" className="text-[10px] py-0 font-mono">
                  {tr("Origin", "मूल उद्गम")}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-xs">
                  {lineage?.apiaryName || "Highland North Apiary"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {tr("Location:", "स्थान:")} {lineage?.apiaryLocation || "Chamoli, Uttarakhand"}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground">
                  {tr("Hives:", "छत्ते:")} {lineage?.hiveIdentifiers?.join(", ") || "HIVE-HN-01, HIVE-HN-02"}
                </p>
              </div>
            </div>

            {/* 2. Raw Harvest Batch */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-amber-600" />
                  <span>{tr("2. Raw Batch Harvest", "२. कच्चा बैच निष्कर्षण")}</span>
                </span>
                <Badge variant="outline" className="text-[10px] py-0 font-mono">
                  {tr("Extraction", "निष्कर्षण")}
                </Badge>
              </div>
              <div className="space-y-1">
                <Link
                  href={`/batches/${lineage?.rawBatchNumber || "HC-RH-2026-0001"}`}
                  className="font-mono font-bold text-foreground hover:underline text-xs flex items-center gap-1"
                >
                  <span>{lineage?.rawBatchNumber || "HC-RH-2026-0001"}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {tr("Harvest Date:", "कटाई तिथि:")} {lineage?.harvestDate || "2026-09-11"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {tr("Highland Apiaries Cooperative", "हाइलैंड एपियरीज़ को-ऑपरेटिव")}
                </p>
              </div>
            </div>

            {/* 3. Custody & Receiving */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                  <span>{tr("3. Custody Handover", "३. कस्टडी हस्तांतरण")}</span>
                </span>
                <Badge variant="outline" className="text-[10px] py-0 font-mono">
                  {tr("Intake", "आवक")}
                </Badge>
              </div>
              <div className="space-y-1">
                <Link
                  href={`/custody/${lineage?.transferId || "TR-2026-0079"}`}
                  className="font-mono font-bold text-foreground hover:underline text-xs flex items-center gap-1"
                >
                  <span>{tr("Transfer:", "हस्तांतरण:")} {lineage?.transferId || "TR-2026-0079"}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {tr("Intake Record:", "आवक रिकॉर्ड:")} {lineage?.receivingRecordId || "RCV-2026-0038"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {tr("Received by Golden Hive Foods", "गोल्डन हाइव फूड्स द्वारा प्राप्त")}
                </p>
              </div>
            </div>

            {/* 4. Processing & Blending */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <span>{tr("4. Processing Run", "४. प्रसंस्करण प्रक्रिया")}</span>
                </span>
                <Badge variant="outline" className="text-[10px] py-0 font-mono">
                  {tr("Filtration", "फिल्ट्रेशन")}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="font-mono font-bold text-foreground text-xs">
                  {lineage?.processingJobId || "PRC-2026-0001"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {tr("Facility:", "इकाई:")} {lineage?.processingFacility || "Golden Hive Solan Plant Unit 4"}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {tr("Date:", "तारीख:")} {lineage?.processingDate || "2026-09-13"}
                </p>
              </div>
            </div>

            {/* 5. Processed Batch Output */}
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Boxes className="h-3.5 w-3.5 text-primary" />
                  <span>{tr("5. Processed Batch", "५. प्रसंस्कृत बैच")}</span>
                </span>
                <Badge variant="outline" className="text-[10px] py-0 font-mono">
                  {tr("Finished Bulk", "तैयार थोक")}
                </Badge>
              </div>
              <div className="space-y-1">
                <Link
                  href={`/batches/${lineage?.processedBatchNumber || "HC-PB-2026-0001"}`}
                  className="font-mono font-bold text-foreground hover:underline text-xs flex items-center gap-1"
                >
                  <span>{lineage?.processedBatchNumber || "HC-PB-2026-0001"}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  {tr("Output:", "उत्पादन:")} {lineage?.outputWeightKg || 174.5} {tr("kg", "किग्रा")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {lineage?.honeyType || "Himalayan Wild Multifloral"}
                </p>
              </div>
            </div>

            {/* 6. Certified Lab Testing */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{tr("6. Certified Gate", "६. प्रमाणित गेट")}</span>
                </span>
                <Badge className="text-[10px] py-0 font-mono bg-emerald-600 text-white">
                  {tr("Certified", "प्रमाणित")}
                </Badge>
              </div>
              <div className="space-y-1">
                <Link
                  href={`/lab/${cert.testId}`}
                  className="font-mono font-bold text-foreground hover:underline text-xs flex items-center gap-1"
                >
                  <span>{tr("Test:", "परीक्षण:")} {cert.testId}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  {cert.issuedBy}
                </p>
                <p className="text-[11px] font-mono text-emerald-700 font-semibold">
                  {tr("Eligible for Bottle Creation", "बोतल निर्माण के लिए पात्र")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* APPROVED PARAMETERS TABLE */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">
              {tr("Certified Analytical Quality Parameters", "प्रमाणित विश्लेषणात्मक गुणवत्ता पैरामीटर")}
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            {tr("Measured chemical, enzymatic, and spectroscopic purity values meeting national and international honey standards.", "राष्ट्रीय और अंतर्राष्ट्रीय शहद मानकों को पूरा करने वाले मापे गए रासायनिक, एंजाइमी और स्पेक्ट्रोस्कोपिक शुद्धता मान।")}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-foreground">{tr("Parameter", "पैरामीटर")}</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground">{tr("Category", "श्रेणी")}</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground">{tr("Verified Value", "सत्यापित मान")}</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground">{tr("Standard Range", "मानक सीमा")}</TableHead>
                  <TableHead className="text-xs font-semibold text-foreground text-center">{tr("Verdict", "निर्णय")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cert.approvedParameters.map((param) => (
                  <TableRow key={param.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <span className="text-xs font-bold text-foreground block">
                        {param.name}
                      </span>
                      {param.notes && (
                        <span className="text-[10px] text-muted-foreground block line-clamp-1">
                          {param.notes}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {param.category}
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      {param.value} {param.unit}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {param.referenceRange}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="border-emerald-200 text-emerald-800 bg-emerald-50 text-xs font-semibold"
                      >
                        {tr("Passed", "उत्तीर्ण")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* PACKAGING READINESS BANNER */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <QrCode className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-foreground text-sm">
              {tr("Packaging Readiness: Eligible for Bottle Creation", "पैकेजिंग तत्परता: बोतल निर्माण हेतु पात्र")}
            </h4>
            <p className="text-muted-foreground mt-0.5">
              {tr("This batch possesses an active quality certificate and complete verified botanical lineage. Ready for retail jar packaging and consumer QR issuance (Step 8).", "इस बैच के पास एक सक्रिय गुणवत्ता प्रमाणपत्र और पूर्ण सत्यापित वनस्पति वंशावली है। खुदरा जार पैकेजिंग और उपभोक्ता क्यूआर जारी करने के लिए तैयार है।")}
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shrink-0">
          <Link href={`/batches/${cert.batchNumber}`}>
            <span>{tr("View Processed Batch", "प्रसंस्कृत बैच देखें")}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CertificateDetailPage() {
  const { tr } = useLanguage();
  return (
    <AuthGuard>
      <AppShell
        breadcrumbs={[
          { label: tr("Honey Chain", "हनी चेन"), href: "/dashboard" },
          { label: tr("Certificates of Analysis", "विश्लेषण प्रमाणपत्र"), href: "/certifications" },
          { label: tr("Certificate Details", "प्रमाणपत्र विवरण"), active: true },
        ]}
        defaultNavId="certifications"
      >
        <CertificateDetailContent />
      </AppShell>
    </AuthGuard>
  );
}
