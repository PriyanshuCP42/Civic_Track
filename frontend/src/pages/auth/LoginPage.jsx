import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, Globe, Eye, EyeOff, MapPinned } from "lucide-react";
import { useSignIn } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import AuthPageBackdrop from "./AuthPageBackdrop";

const HERO_HEADLINE_PREFIX = "Complaints management for ";
const HERO_HEADLINE_FULL = `${HERO_HEADLINE_PREFIX}modern cities`;
const HERO_ANIMATION_DURATION_MS = 2800;

/**
 * Determine whether reduced motion is preferred by current browser settings.
 * @returns {boolean}
 */
const prefersReducedMotion = () =>
  Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);

const LoginPage = () => {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: { email: "", password: "", verifyCode: "" } });
  const [show, setShow] = useState(false);
  const [needsCode, setNeedsCode] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { user, loginWithHardcodedAdmin } = useAuth();
  const navigate = useNavigate();
  const [heroTypedLen, setHeroTypedLen] = useState(() =>
    prefersReducedMotion() ? HERO_HEADLINE_FULL.length : 0,
  );

  useEffect(() => {
    const fullLen = HERO_HEADLINE_FULL.length;
    if (prefersReducedMotion()) return undefined;

    const start = performance.now();
    let raf = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / HERO_ANIMATION_DURATION_MS);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
      const next = t >= 1 ? fullLen : Math.min(fullLen, Math.floor(eased * fullLen));
      setHeroTypedLen(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const completeWithSession = async (step) => {
    const sessionId = step.createdSessionId || signIn.createdSessionId;
    if (step.status !== "complete" || !sessionId) {
      toast.error(`Sign-in incomplete (${step.status}). Please try again.`);
      return;
    }
    await setActive({ session: sessionId });
    setNeedsCode(false);
    toast.success("Welcome back");
    navigate("/", { replace: true });
  };

  const onSubmit = async (values) => {
    const adminLogin = loginWithHardcodedAdmin(values);
    if (adminLogin) {
      toast.success("Welcome, Admin");
      navigate("/admin", { replace: true });
      return;
    }

    if (!isLoaded) return;

    try {
      // --- Step 2: user is entering the email verification code ---
      if (needsCode) {
        const code = values.verifyCode?.replace(/\s/g, "") || "";
        if (!code) {
          toast.error("Enter the verification code sent to your email.");
          return;
        }

        // Try email_code first, fall back to other strategies
        const factors = signIn.supportedSecondFactors ?? [];
        const emailFactor = factors.find((f) => f.strategy === "email_code");
        const totpFactor = factors.find((f) => f.strategy === "totp");

        let step;
        if (emailFactor) {
          step = await signIn.attemptSecondFactor({ strategy: "email_code", code });
        } else if (totpFactor) {
          step = await signIn.attemptSecondFactor({ strategy: "totp", code });
        } else {
          // Try email_code anyway as a fallback
          step = await signIn.attemptSecondFactor({ strategy: "email_code", code });
        }
        await completeWithSession(step);
        return;
      }

      // --- Step 1: normal email + password login ---
      const email = values.email.trim();
      const password = values.password;

      let step = await signIn.create({ identifier: email });

      if (step.status === "needs_first_factor") {
        const factors = step.supportedFirstFactors ?? signIn.supportedFirstFactors ?? [];
        const hasPassword = factors.some((f) => f.strategy === "password");
        if (!hasPassword) {
          toast.error("Password sign-in is not available for this account. Try Google.");
          return;
        }
        step = await signIn.attemptFirstFactor({ strategy: "password", password });
      }

      // Clerk requires a second step (email verification code)
      if (step.status === "needs_second_factor") {
        // Try to prepare the email code factor so Clerk sends the email
        const factors = step.supportedSecondFactors ?? signIn.supportedSecondFactors ?? [];
        const emailFactor = factors.find((f) => f.strategy === "email_code");
        if (emailFactor) {
          await signIn.prepareSecondFactor({ strategy: "email_code" });
        }
        setNeedsCode(true);
        setValue("verifyCode", "");
        toast("A verification code was sent to your email.");
        return;
      }

      await completeWithSession(step);
    } catch (error) {
      const message = error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || error?.message || "Login failed";
      toast.error(message);
    }
  };

  const signInWithGoogle = async () => {
    if (!isLoaded) return;
    try {
      const origin = window.location.origin;
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${origin}/sso-callback`,
        redirectUrlComplete: `${origin}/`,
      });
    } catch (error) {
      const message = error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || "Google sign in failed";
      toast.error(message);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <AuthPageBackdrop />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-5 py-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:py-12">
        <section
          className="relative hidden flex-col justify-center lg:flex lg:pr-6"
          style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
        >
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
              <MapPinned className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SCCMS</span>
          </div>
          <h1 className="max-w-xl text-balance text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl xl:leading-[1.06]">
            <span className="text-slate-900">
              {heroTypedLen <= HERO_HEADLINE_PREFIX.length
                ? HERO_HEADLINE_FULL.slice(0, heroTypedLen)
                : HERO_HEADLINE_PREFIX}
            </span>
            {heroTypedLen > HERO_HEADLINE_PREFIX.length ? (
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {HERO_HEADLINE_FULL.slice(HERO_HEADLINE_PREFIX.length, heroTypedLen)}
              </span>
            ) : null}
            {heroTypedLen < HERO_HEADLINE_FULL.length ? (
              <span
                className="ml-1 inline-block h-[0.82em] w-[2px] translate-y-[0.06em] rounded-full bg-orange-500 align-middle motion-reduce:opacity-90 motion-safe:animate-caret-soft"
                aria-hidden
              />
            ) : null}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-500">
            Bridging citizens and municipal authorities. Track issues, route work by department, and close the loop with clarity.
          </p>
          <ul className="mt-10 space-y-4 text-base font-medium leading-snug tracking-tight text-slate-700">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-sm shadow-orange-500/40 ring-1 ring-orange-400/50" />
              Real-time complaint visibility
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-sm shadow-orange-500/40 ring-1 ring-orange-400/50" />
              Department-aware assignment
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500 shadow-sm shadow-orange-500/40 ring-1 ring-orange-400/50" />
              Resolution-first operations
            </li>
          </ul>
        </section>

        <section className="flex flex-col justify-center lg:pl-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] sm:p-9"
          >
            <div id="clerk-captcha" className="mb-1 min-h-[1px]" aria-hidden />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">Use your work email or Google to continue.</p>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="mb-4 mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Globe className="h-4 w-4 text-slate-500" /> Continue with Google
            </button>

            <div className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              or email
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <input
              {...register("email", { required: !needsCode })}
              readOnly={needsCode}
              placeholder="Email"
              className={`mb-3 w-full rounded-xl border border-slate-200/90 bg-slate-50/90 px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-500/15 ${needsCode ? "bg-slate-100 opacity-60" : ""}`}
            />
            <div className="relative mb-3">
              <input
                type={show ? "text" : "password"}
                {...register("password", { required: !needsCode })}
                readOnly={needsCode}
                placeholder="Password"
                className={`w-full rounded-xl border border-slate-200/90 bg-slate-50/90 px-3 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-500/15 ${needsCode ? "bg-slate-100 opacity-60" : ""}`}
              />
              <button type="button" className="absolute right-2.5 top-2.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600" onClick={() => setShow((s) => !s)}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {needsCode && (
              <>
                <label className="mb-1 block text-xs font-medium text-slate-600">Verification code (check your email)</label>
                <input
                  {...register("verifyCode", { required: needsCode })}
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="6-digit code"
                  className="mb-2 w-full rounded-xl border border-orange-300 bg-white px-3 py-3 text-sm shadow-sm outline-none ring-2 ring-orange-500/15 focus:border-orange-400 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNeedsCode(false);
                    setValue("verifyCode", "");
                  }}
                  className="mb-3 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  ← Back to login
                </button>
              </>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              {needsCode ? "Verify and sign in" : "Sign in"}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <p className="mt-8 text-center text-sm text-slate-500">
              No account?{" "}
              <Link to="/register" className="font-semibold text-slate-900 underline-offset-2 hover:underline">
                Register
              </Link>
            </p>
          </form>

          <div className="mt-8 px-1 lg:hidden">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20">
                <MapPinned className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">SCCMS</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Sign in to route and resolve complaints for{" "}
              <span className="font-semibold text-orange-600">modern cities</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
