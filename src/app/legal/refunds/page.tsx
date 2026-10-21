
import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy | IRABRAIN",
  description:
    "Read the refund and cancellation policy for IRABRAIN services and Brain Recharge purchases.",
};

export default function RefundsPage() {
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

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[#EEE3D1]/60">
          Customer information
        </p>

        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Refund & Cancellation Policy
        </h1>

        <p className="mt-5 text-sm text-[#EEE3D1]/50">
          Effective date: To be confirmed before publication
        </p>

        <p className="mt-8 leading-8 text-[#EEE3D1]/75">
          This policy explains how refund and cancellation requests for
          eligible IRABRAIN purchases are handled. Please review the
          applicable plan details and conditions before making a payment.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-medium">1. Cancellation requests</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            If you wish to cancel a purchase or request a refund, contact
            our support team using the email address below. Include your
            registered email address and relevant transaction details.
            Never send passwords, OTPs, or complete card details.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">2. Refund eligibility</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Refund eligibility depends on the purchase, applicable law,
            and the terms disclosed when the payment was made. The final
            policy must clearly state which purchases qualify, any
            applicable time limits, and any lawful exclusions.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">3. Duplicate or failed payments</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            If you believe you were charged more than once or a payment
            was debited without the expected confirmation, contact
            support with the transaction reference and payment date so
            the issue can be investigated.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">4. Processing approved refunds</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Approved refunds will be processed using the applicable
            payment-provider procedure. The time taken for the funds to
            appear may depend on the payment method and financial
            institution. Any specific processing timelines must be
            confirmed before publication.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">5. Contact support</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            For refund, cancellation, or payment questions, contact{" "}
            <a
              href="mailto:azennixai@gmail.com"
              className="underline underline-offset-4"
            >
              azennixai@gmail.com
            </a>.
          </p>
        </section>

        <div className="mt-12 rounded-xl border border-[#EEE3D1]/15 bg-[#171716] p-5 text-sm leading-6 text-[#EEE3D1]/60">
          Publication note: Before accepting live payments, confirm and
          publish the actual refund eligibility rules, request deadlines,
          cancellation procedure, and any applicable processing timelines.
          This draft intentionally does not promise automatic refunds or
          invent a specific refund period.
        </div>
      </article>

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

