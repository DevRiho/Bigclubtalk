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
    onSuccess: () => {
      reset();
      alert("Thank you for subscribing to Big Club Talk!");
    }
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid items-center gap-8 border-y-4 border-brand-ink dark:border-slate-200 py-12 md:grid-cols-[1fr_.9fr] transition-colors duration-200">
        <div>
          <p className="text-[10px] font-black uppercase text-brand-red tracking-widest">Inbox edition</p>
          <h2 className="mt-2 font-headline text-4xl md:text-5xl font-black uppercase leading-none text-brand-ink dark:text-slate-100">
            Wake up inside the conversation
          </h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Get sharp football headlines, transfer reads, and club storylines from Big Club Talk editors.
          </p>
        </div>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="flex flex-col gap-3 sm:flex-row">
          <Input 
            type="email" 
            placeholder="you@club.com" 
            className="flex-grow" 
            aria-label="Email address"
            {...register("email", { required: true })} 
          />
          <Button type="submit" disabled={mutation.isPending} className="whitespace-nowrap">
            <Mail size={14} />
            {mutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </section>
  );
}
