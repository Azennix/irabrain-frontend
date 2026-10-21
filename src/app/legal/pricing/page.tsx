
import Link from "next/link";

export const metadata = {
  title: "Pricing & Brain Recharge | IRABRAIN",
  description:
    "Explore IRABRAIN and learn about Brain Recharge plans and usage options.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#121110] text-[#EEE3D1]">
      <header className="border-b border-[#EEE3D1]/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold tracking-wide">
            IRABRAIN
          </Link>

          <Link
            href="/login"
            className="text-sm text-[#EEE3D1]/70 hover:text-[#EEE3D1]"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <p className="text-xs uppercase tracking-[0.25em] text-[#EEE3D1]/60">
          Pricing & usage
        </p>

        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Brain Recharge
        </h1>

        <p className="mt-6 text-lg leading-8 text-[#EEE3D1]/70">
          IRABRAIN is designed to help you work with AI capabilities
          through a personal workspace. Available features and usage
          options may depend on your account and the plan offered.
        </p>

        <div className="mt-10 rounded-2xl border border-[#EEE3D1]/15 bg-[#171716] p-6 sm:p-8">
          <h2 className="text-xl font-medium">Available plans</h2>

          <p className="mt-4 leading-7 text-[#EEE3D1]/70">
            Please sign in to IRABRAIN to review the currently available
            Brain Recharge options, their prices, and the usage included
            with each option.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-[#EEE3D1] px-6 py-3 font-medium text-[#121110] hover:opacity-90"
          >
            View available options
          </Link>
        </div>

        <p className="mt-8 text-sm leading-6 text-[#EEE3D1]/55">
          Review the applicable terms, usage conditions, and refund
          policy before making a purchase. Any applicable taxes and
          charges will be shown during checkout where required.
        </p>
      </section>

      <footer className="border-t border-[#EEE3D1]/10">
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-5 px-6 py-6 text-sm text-[#EEE3D1]/60">
          <Link href="/legal/about">About</Link>
          <Link href="/legal/contact">Contact</Link>
          <Link href="/legal/pricing">Pricing</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/refunds">Refunds</Link>
        </nav>
      </footer>
    </main>
  );
}

