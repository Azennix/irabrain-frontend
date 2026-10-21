
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | IRABRAIN",
  description:
    "Read the terms and conditions governing the use of IRABRAIN.",
};

export default function TermsPage() {
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
          Legal information
        </p>

        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Terms & Conditions
        </h1>

        <p className="mt-5 text-sm text-[#EEE3D1]/50">
          Effective date: To be confirmed before publication
        </p>

        <p className="mt-8 leading-8 text-[#EEE3D1]/75">
          These Terms & Conditions govern access to and use of IRABRAIN.
          By accessing or using the service, you agree to comply with the
          applicable terms. Please read this page carefully before using
          the service or making a purchase.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-medium">1. The service</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            IRABRAIN is an AI-powered workspace designed to assist with
            activities such as thinking, planning, learning, creating,
            organizing information, and working with AI-assisted tools.
            Available features may change as the service develops.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">2. Accounts and security</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            You are responsible for providing accurate account
            information and keeping your sign-in credentials secure.
            You must not misuse the service, attempt unauthorized access,
            or interfere with its operation.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">3. AI-generated content</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            AI-generated responses may be incomplete, inaccurate, or
            unsuitable for a particular purpose. Review important
            information independently and use appropriate judgment
            before relying on generated content.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">4. Payments and recharge</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            If paid plans or Brain Recharge options are offered, their
            applicable prices, included usage, validity, and other
            conditions must be disclosed before purchase. Payments are
            subject to the terms shown at checkout and the applicable
            refund and cancellation policy.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">5. Acceptable use</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            You must use IRABRAIN lawfully and must not use it to
            violate others' rights, compromise service security, or
            engage in fraudulent or harmful activity.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">6. Service availability</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            We may update, maintain, or modify features from time to
            time. Temporary interruptions may occur. Specific service
            commitments, if any, will be stated separately.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">7. Contact and updates</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            These terms should be reviewed periodically for updates.
            For questions about these terms, contact
            {" "}
            <a
              href="mailto:azennixai@gmail.com"
              className="underline underline-offset-4"
            >
              azennixai@gmail.com
            </a>.
          </p>
        </section>

        <div className="mt-12 rounded-xl border border-[#EEE3D1]/15 bg-[#171716] p-5 text-sm leading-6 text-[#EEE3D1]/60">
          Publication note: The effective date, legal business identity,
          governing law, dispute process, termination rules, and any
          other applicable legal requirements must be confirmed before
          this draft is published as the final terms.
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

