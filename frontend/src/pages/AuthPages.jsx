import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { authService } from "../services/authService";

function AuthFrame({ title, children, footer }) {
  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_.9fr]">
      <div>
        <p className="text-xs font-black uppercase text-brand-red">Big Club Talk Account</p>
        <h1 className="mt-2 font-headline text-6xl font-black uppercase leading-none text-brand-ink">{title}</h1>
        <p className="mt-4 max-w-xl text-slate-600">Join the newsroom conversation, save stories, follow writers, and manage publishing access.</p>
      </div>
      <div className="border border-slate-200 p-6 bg-white shadow-sm">
        {children}
        {footer && <p className="mt-5 text-sm text-slate-600">{footer}</p>}
      </div>
    </main>
  );
}

function SocialAuthSection() {
  const { socialLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "social-auth-success") {
        const { provider, token, email, name } = event.data.payload;
        try {
          setError("");
          await socialLogin({ provider, token, email, name });
          navigate("/dashboard");
        } catch (err) {
          setError(err.response?.data?.message || err.message || "Social Sign-In failed");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [socialLogin, navigate]);

  const handleProviderClick = (provider) => {
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    
    window.open(
      `/social-popup?provider=${provider}`,
      `social_login_${provider}`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div className="mt-6">
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <span className="relative px-3 bg-white text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Or continue with
        </span>
      </div>

      {error && (
        <div className="mb-4 border-l-4 border-brand-red bg-red-50 p-3 text-xs font-bold text-brand-red">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {/* Google */}
        <button
          type="button"
          onClick={() => handleProviderClick("google")}
          className="flex items-center justify-center px-4 py-2.5 border border-slate-200 rounded bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Google
        </button>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      await login(values);
      const redirect = searchParams.get("redirect") || "/dashboard";
      window.location.href = redirect;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Sign In" footer={<><span>New here? </span><Link className="font-bold text-brand-red" to="/register">Create an account</Link></>}>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="border border-brand-red bg-red-50 p-3 text-sm text-brand-red font-bold uppercase rounded font-sans">
            {error}
          </div>
        )}
        <Input type="email" placeholder="Email" {...register("email", { required: true })} />
        <Input type="password" placeholder="Password" {...register("password", { required: true })} />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Login"}
        </Button>
        <Link className="text-sm font-bold text-brand-red" to="/forgot-password">Forgot password?</Link>
      </form>
      <SocialAuthSection />
    </AuthFrame>
  );
}

export function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const { register: createAccount } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);
    try {
      await createAccount(values);
      window.location.href = "/verify-email";
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <AuthFrame title="Create Account" footer={<><span>Already have access? </span><Link className="font-bold text-brand-red" to="/login">Sign in</Link></>}>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="border border-brand-red bg-red-50 p-3 text-sm text-brand-red font-bold uppercase rounded font-sans">
            {error}
          </div>
        )}
        <Input placeholder="Name" {...register("name", { required: true })} />
        <Input type="email" placeholder="Email" {...register("email", { required: true })} />
        <Input type="password" placeholder="Password" {...register("password", { required: true })} />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>
      <SocialAuthSection />
    </AuthFrame>
  );
}

export function VerifyEmailPage() {
  const { register, handleSubmit } = useForm();
  return (
    <AuthFrame title="Verify Email">
      <form className="grid gap-4" onSubmit={handleSubmit((values) => authService.verifyEmail(values))}>
        <Input type="email" placeholder="Email" {...register("email", { required: true })} />
        <Input placeholder="Six digit code" {...register("otp", { required: true })} />
        <Button type="submit">Verify</Button>
      </form>
    </AuthFrame>
  );
}

export function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();
  return (
    <AuthFrame title="Reset Password">
      <form className="grid gap-4" onSubmit={handleSubmit((values) => authService.forgotPassword(values))}>
        <Input type="email" placeholder="Email" {...register("email", { required: true })} />
        <Button type="submit">Send reset link</Button>
      </form>
    </AuthFrame>
  );
}

export function ResetPasswordPage() {
  const { register, handleSubmit } = useForm();
  const params = new URLSearchParams(window.location.search);
  return (
    <AuthFrame title="New Password">
      <form className="grid gap-4" onSubmit={handleSubmit((values) => authService.resetPassword({ ...values, token: params.get("token"), email: params.get("email") }))}>
        <Input type="password" placeholder="New password" {...register("password", { required: true })} />
        <Button type="submit">Update password</Button>
      </form>
    </AuthFrame>
  );
}
