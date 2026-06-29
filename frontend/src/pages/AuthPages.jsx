import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
      <div className="border border-slate-200 p-6">
        {children}
        {footer && <p className="mt-5 text-sm text-slate-600">{footer}</p>}
      </div>
    </main>
  );
}

export function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthFrame title="Sign In" footer={<><span>New here? </span><Link className="font-bold text-brand-red" to="/register">Create an account</Link></>}>
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => { await login(values); navigate("/dashboard"); })}>
        <Input type="email" placeholder="Email" {...register("email", { required: true })} />
        <Input type="password" placeholder="Password" {...register("password", { required: true })} />
        <Button type="submit">Login</Button>
        <Link className="text-sm font-bold text-brand-red" to="/forgot-password">Forgot password?</Link>
      </form>
    </AuthFrame>
  );
}

export function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();

  return (
    <AuthFrame title="Create Account" footer={<><span>Already have access? </span><Link className="font-bold text-brand-red" to="/login">Sign in</Link></>}>
      <form className="grid gap-4" onSubmit={handleSubmit(async (values) => { await createAccount(values); navigate("/verify-email"); })}>
        <Input placeholder="Name" {...register("name", { required: true })} />
        <Input type="email" placeholder="Email" {...register("email", { required: true })} />
        <Input type="password" placeholder="Password" {...register("password", { required: true })} />
        <Button type="submit">Register</Button>
      </form>
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
