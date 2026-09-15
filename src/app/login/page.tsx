"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Hexagon, Eye, EyeOff, ArrowRight, ShieldCheck, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthSession } from "@/context/auth-session-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hasSelectedOrg, hasSelectedRole, user } = useAuthSession();

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
        setErrorMessage(result.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
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
      <header className="flex h-16 w-full items-center justify-between px-6 border-b border-border/60 bg-background/80 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Hexagon className="h-4 w-4 fill-current stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-foreground">Honey Chain</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
              Traceability Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Network Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Sign-in Card */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
            {/* Header */}
            <div className="space-y-1.5 text-center mb-6">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Hexagon className="h-6 w-6 fill-primary/20 stroke-[2]" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Sign in to Honey Chain
              </h1>
              <p className="text-xs text-muted-foreground">
                Enter your credentials to access the honey supply chain registry
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
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Password recovery link has been simulated. In production, an email with a reset token is dispatched.</span>
              </div>
            )}

            {/* Active session reminder banner if already signed in */}
            {isAuthenticated && user && (
              <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
                <p className="font-medium text-foreground">Active session detected: {user.email}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">
                  You can re-authenticate below or{" "}
                  <Link
                    href={hasSelectedOrg && hasSelectedRole ? "/dashboard" : "/select-organisation"}
                    className="text-primary font-semibold underline hover:opacity-80"
                  >
                    continue to session →
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
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="operator@honeychain.io"
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
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordNotice(true)}
                    className="text-xs text-primary hover:underline transition-colors"
                  >
                    Forgot password?
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                  Remember this device for 30 days
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-10 gap-2 text-xs font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="mt-5 border-t border-border pt-4">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">
                Quick Test Credentials:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill("operator@honeychain.io")}
                  className="flex items-center justify-between rounded-md border border-input bg-muted/30 px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted transition-colors text-left"
                >
                  <span className="truncate">operator@honeychain.io</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill("beekeeper@highland.org")}
                  className="flex items-center justify-between rounded-md border border-input bg-muted/30 px-2.5 py-1.5 text-[11px] text-foreground hover:bg-muted transition-colors text-left"
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
              <span>Enterprise Supply Chain Verification</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Honey Chain delivers immutable batch provenance, accredited laboratory purity certification, and tamper-evident custody verification from hive to retail shelf.
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        <span>© 2026 Honey Chain Trust Platform • Internal B2B Traceability</span>
      </footer>
    </div>
  );
}
