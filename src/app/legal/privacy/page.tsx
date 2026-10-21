
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | IRABRAIN",
  description:
    "Learn how IRABRAIN handles personal information when you use its services.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#121110] text-[#EEE3D1]">
      <header className="border-b border-[#EEE3D1]/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold tracking-wide">
            IRABRAIN
          </Link>
          <Link href="/login" className="text-sm text-[#EEE3D1]/70 hover:text-[#EEE3D1]">
            Sign in
          </Link>
        </nav>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[#EEE3D1]/60">
          Legal information
        </p>

        <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-5 text-sm text-[#EEE3D1]/50">
          Effective date: To be confirmed before publication
        </p>

        <p className="mt-8 leading-8 text-[#EEE3D1]/75">
          This Privacy Policy explains how IRABRAIN may collect, use,
          store, and protect information when you visit or use the
          service. The final policy must reflect IRABRAIN's actual data
          practices.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-medium">1. Information we handle</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Depending on the features you use, information may include
            account details, information you submit, content you create,
            and technical data needed to operate and secure the service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">2. How information is used</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Information may be used to provide requested features,
            maintain accounts, respond to support requests, protect
            service security, troubleshoot problems, and meet applicable
            legal obligations.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">3. AI features and content</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Information submitted to AI features may be processed to
            provide requested responses. The final policy should identify
            the relevant service providers and explain any applicable
            storage, retention, and model-training practices accurately.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">4. Sharing and service providers</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Some information may need to be processed by providers that
            support hosting, authentication, AI functionality, payments,
            or security. The final policy must identify relevant
            categories and describe actual sharing practices.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">5. Security and retention</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Information should be retained only as appropriate for the
            stated purposes and applicable requirements. No online
            service can guarantee absolute security.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">6. Your choices and rights</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            Depending on applicable law, you may have rights to request
            access, correction, deletion, or other actions concerning
            your personal information. Requests can be sent to the
            contact address below.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-medium">7. Contact</h2>
          <p className="mt-3 leading-7 text-[#EEE3D1]/70">
            For privacy questions, contact{" "}
            <a
              href="mailto:azennixai@gmail.com"
              className="underline underline-offset-4"
            >
              azennixai@gmail.com
            </a>.
          </p>
        </section>

        <div className="mt-12 rounded-xl border border-[#EEE3D1]/15 bg-[#171716] p-5 text-sm leading-6 text-[#EEE3D1]/60">
          Publication note: Before publishing, confirm the actual
          information collected, AI and hosting providers, payment
          processing arrangements, retention periods, user rights
          process, and applicable legal requirements. This draft must
          not replace an accurate description of real practices.
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

