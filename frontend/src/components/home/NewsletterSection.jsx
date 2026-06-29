import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { metaService } from "../../services/metaService";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export function NewsletterSection() {
  const { register, handleSubmit, reset } = useForm();
  const mutation = useMutation({
    mutationFn: ({ email }) => metaService.newsletter(email),
    onSuccess: () => reset()
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid items-center gap-8 border-y-4 border-brand-ink py-10 md:grid-cols-[1fr_.9fr]">
        <div>
          <p className="text-xs font-black uppercase text-brand-red">Inbox edition</p>
          <h2 className="mt-2 font-headline text-5xl font-black uppercase leading-none text-brand-ink">Wake up inside the conversation</h2>
          <p className="mt-4 max-w-2xl text-slate-600">Get sharp football headlines, transfer reads, and club storylines from Big Club Talk editors.</p>
        </div>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-3 sm:flex-row">
          <Input type="email" placeholder="you@club.com" {...register("email", { required: true })} />
          <Button type="submit" disabled={mutation.isPending}>
            <Mail size={16} />
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
