import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/clerk-react";
import { ArrowRight, Eye, EyeOff, Globe, Lock, Mail, MapPinned, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { cn } from "@/lib/utils";
import AuthPageBackdrop from "./AuthPageBackdrop";

const ADMIN_EMAIL = "admin@gmail.com";

const RegisterPage = () => {
  const { user, loading } = useAuth();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isLoaded, signUp, setActive } = useSignUp();
  const password = watch("password", "");
  const navigate = useNavigate();
  const strength = Math.min(100, password.length * 12.5);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accountKind, setAccountKind] = useState("citizen");

  if (!loading && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const onSubmit = async (values) => {
    if (!isLoaded) return;
    if (values.email?.trim().toLowerCase() === ADMIN_EMAIL) {
      toast.error("This email is reserved for admin login.");
      return;
    }
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: values.email,
        password: values.password,
        firstName: values.name,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Registered successfully");
        navigate("/citizen", { replace: true });
        return;
      }

      toast.error("Sign-up requires verification in Clerk. Complete verification and sign in.");
      navigate("/login");
    } catch (error) {
      const message = error?.errors?.[0]?.longMessage || "Registration failed";
      toast.error(message);
    }
  };

  const signUpWithGoogle = async () => {
    if (!isLoaded) return;
    try {
      const origin = window.location.origin;
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: `${origin}/sso-callback`,
        redirectUrlComplete: `${origin}/citizen`,
      });
    } catch (error) {
      const message = error?.errors?.[0]?.longMessage || error?.errors?.[0]?.message || "Google sign up failed";
      toast.error(message);
    }
  };

  const inputWrap =
    "relative flex items-center rounded-xl border border-slate-200/90 bg-slate-50/90 transition focus-within:border-orange-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/15";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      <AuthPageBackdrop />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-8 px-5 py-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:py-12">
        <section className="hidden flex-col justify-center lg:flex lg:pr-6">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25">
              <MapPinned className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SCCMS</span>
          </div>

          <h1 className="max-w-xl text-balance text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 xl:text-5xl xl:leading-[1.06]">
            Smart complaint routing for{" "}
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">modern cities</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-500">
            One place for residents to report issues and for teams to track, assign, and resolve them—with clarity from submission to closure.
          </p>
        </section>

        <section className="flex flex-col justify-center lg:pl-4">
          <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-8 shadow-[0_24px_64px_-12px_rgba(15,23,42,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] sm:p-9">
            <div id="clerk-captcha" className="mb-1 min-h-[1px]" aria-hidden />

            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Register</h2>
            <p className="mt-1 text-sm text-slate-500">Create your account to submit and track municipal complaints.</p>

            <div className="mt-6 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setAccountKind("citizen")}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-semibold transition",
                  accountKind === "citizen"
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setAccountKind("staff")}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-semibold transition",
                  accountKind === "staff"
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                Staff
              </button>
            </div>

            {accountKind === "staff" ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm leading-relaxed text-slate-600">
                <p className="font-medium text-slate-800">Municipal staff accounts</p>
                <p className="mt-2">
                  Employee profiles are created by your city administrator. If you were invited, use{" "}
                  <Link to="/login" className="font-semibold text-orange-600 underline-offset-2 hover:underline">
                    Sign in
                  </Link>{" "}
                  with the email you were given.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <button
                  type="button"
                  onClick={signUpWithGoogle}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Globe className="h-4 w-4 text-slate-500" />
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" />
                  or email
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Full name</label>
                  <div className={inputWrap}>
                    <User className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" aria-hidden />
                    <input
                      {...register("name", { required: "Name required" })}
                      autoComplete="name"
                      className="w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                      placeholder="Jane Cooper"
                    />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</label>
                  <div className={inputWrap}>
                    <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" aria-hidden />
                    <input
                      {...register("email", { required: "Email required" })}
                      type="email"
                      autoComplete="email"
                      className="w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                      placeholder="you@city.gov"
                    />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Password</label>
                  <div className={inputWrap}>
                    <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" aria-hidden />
                    <input
                      type={showPw ? "text" : "password"}
                      {...register("password", { required: true, minLength: { value: 8, message: "At least 8 characters" } })}
                      autoComplete="new-password"
                      className="w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-2.5 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400 transition-[width] duration-200"
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Confirm password</label>
                  <div className={inputWrap}>
                    <Lock className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" aria-hidden />
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...register("confirmPassword", { required: "Confirm your password" })}
                      autoComplete="new-password"
                      className="w-full rounded-xl border-0 bg-transparent py-3 pl-11 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-2.5 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-xs text-rose-600">{errors.confirmPassword.message}</p>}
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
                >
                  Sign up
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </form>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-slate-900 underline-offset-2 hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-8 px-1 lg:hidden">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20">
                <MapPinned className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">SCCMS</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Smart complaint routing for <span className="font-semibold text-orange-600">modern cities</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
