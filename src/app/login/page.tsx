"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthSession } from "@/context/auth-session-context";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hasSelectedOrg, hasSelectedRole, user } = useAuthSession();
  const { t } = useLanguage();

  const [email, setEmail] = React.useState("operator@honeychain.io");
  const [password, setPassword] = React.useState("password123");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [forgotPasswordNotice, setForgotPasswordNotice] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Successfully authenticated, route to organisation selection step
        router.push("/select-organisation");
      } else {
        setErrorMessage(result.error || t.loginPage.errorDefault);
      }
    } catch {
      setErrorMessage(t.loginPage.errorUnexpected);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Top minimal navigation */}
      <header className="flex h-16 w-full items-center justify-between px-4 sm:px-6 border-b border-border/60 bg-background/80 backdrop-blur-xs">
        <BrandLogo href="/" size="sm" subtitle={t.loginPage.traceabilityPlatform} priority />

        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
          <LanguageSwitcher />
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.loginPage.networkActive}
          </span>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 text-xs gap-1.5 border-border/80 bg-background/90 text-foreground hover:bg-muted cursor-pointer rounded-lg shadow-2xs"
          >
            <Link href="/">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">{t.loginPage.backToHome}</span>
              <span className="xs:hidden sm:hidden">Home</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Sign-in Card */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            {/* Header */}
            <div className="space-y-1.5 text-center mb-6">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/40 border border-border/60 shadow-2xs p-2.5">
                <BrandLogo variant="mark" size="sm" imageClassName="h-8 w-auto" priority />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {t.loginPage.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t.loginPage.subtitle}
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Forgot password notification */}
            {forgotPasswordNotice && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{t.loginPage.forgotPasswordNotice}</span>
              </div>
            )}

            {/* Active session reminder banner if already signed in */}
            {isAuthenticated && user && (
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
                <p className="font-medium text-foreground">
                  {t.loginPage.activeSessionDetected} {user.email}
                </p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  {t.loginPage.reauthPrompt}{" "}
                  <Link
                    href={hasSelectedOrg && hasSelectedRole ? "/dashboard" : "/select-organisation"}
                    className="text-primary font-semibold underline hover:opacity-80"
                  >
                    {t.loginPage.continueToSession}
                  </Link>
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-foreground block"
                >
                  {t.loginPage.emailLabel}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.loginPage.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-foreground"
                  >
                    {t.loginPage.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordNotice(true)}
                    className="text-xs text-primary hover:underline transition-colors"
                  >
                    {t.loginPage.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-10 text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? t.loginPage.hidePassword : t.loginPage.showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  {t.loginPage.rememberMe}
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-10 gap-2 text-xs font-semibold cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>{t.loginPage.signingIn}</span>
                ) : (
                  <>
                    <span>{t.loginPage.signInBtn}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="mt-5 border-t border-border pt-4">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                {t.loginPage.quickCredentials}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill("operator@honeychain.io")}
                  className="flex items-center justify-between rounded-md border border-input bg-muted/30 px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
                >
                  <span className="truncate">operator@honeychain.io</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill("beekeeper@highland.org")}
                  className="flex items-center justify-between rounded-md border border-input bg-muted/30 px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted transition-colors text-left cursor-pointer"
                >
                  <span className="truncate">beekeeper@highland.org</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product / Trust Description */}
          <div className="rounded-xl border border-border/80 bg-background/50 p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-foreground">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span>{t.loginPage.trustHeading}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {t.loginPage.trustDescription}
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        <span>{t.loginPage.footerCopyright}</span>
      </footer>
    </div>
  );
}
