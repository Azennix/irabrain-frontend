
import Link from "next/link";

export const metadata = {
  title: "Contact IRABRAIN",
  description:
    "Contact IRABRAIN customer support for product, account, and payment questions.",
};

export default function ContactPage() {
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
          Customer support
        </p>

        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Contact IRABRAIN
        </h1>

        <p className="mt-6 leading-8 text-[#EEE3D1]/70">
          Need help with IRABRAIN, your account, or a payment? Contact our
          support team using the official email address below.
        </p>

        <div className="mt-10 rounded-2xl border border-[#EEE3D1]/15 bg-[#171716] p-6">
          <h2 className="text-lg font-medium">Email support</h2>

          <a
            href="mailto:azennixai@gmail.com"
            className="mt-4 inline-block break-all text-[#EEE3D1] underline underline-offset-4 hover:opacity-80"
          >
            azennixai@gmail.com
          </a>

          <p className="mt-4 text-sm leading-6 text-[#EEE3D1]/60">
            Please include relevant details about your question. Never
            send your password, OTP, or payment credentials by email.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-[#EEE3D1]/70 underline underline-offset-4 hover:text-[#EEE3D1]"
        >
          Return to IRABRAIN
        </Link>
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

