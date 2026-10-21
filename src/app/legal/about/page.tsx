import Link from "next/link";

export const metadata = {
  title: "About IRABRAIN",
  description:
    "Learn about IRABRAIN, an AI-powered workspace for thinking, learning, creating, and getting work done.",
};

export default function PublicAboutPage() {
  return (
    <main className="min-h-screen bg-[#121110] text-[#EEE3D1]">
      <header className="border-b border-[#EEE3D1]/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-semibold tracking-wide">
            IRABRAIN
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-[#EEE3D1]/20 px-5 py-2 text-sm hover:bg-[#EEE3D1]/10"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#EEE3D1]/60">
          About us
        </p>

        <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
          Meet IRABRAIN.
          <br />
          Your AI workspace.
        </h1>

        <p className="mt-8 text-lg leading-8 text-[#EEE3D1]/75">
          IRABRAIN is a personal AI system designed to help people think,
          plan, build, learn, and grow with greater clarity.
        </p>

        <p className="mt-5 leading-8 text-[#EEE3D1]/65">
          It brings conversations, memory, projects, and intelligent
          assistance together to help users move from ideas to meaningful
          action.
        </p>

        <section className="mt-14 border-t border-[#EEE3D1]/10 pt-8">
          <h2 className="text-2xl font-medium">Our purpose</h2>
          <p className="mt-4 leading-7 text-[#EEE3D1]/70">
            Our goal is to make AI capabilities useful and accessible for
            everyday work, learning, creativity, and problem-solving.
          </p>
        </section>

        <section className="mt-10 border-t border-[#EEE3D1]/10 pt-8">
          <h2 className="text-2xl font-medium">Explore IRABRAIN</h2>
          <p className="mt-4 leading-7 text-[#EEE3D1]/70">
            Visit IRABRAIN to learn about the platform and sign in to
            explore its available features.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-full bg-[#EEE3D1] px-6 py-3 font-medium text-[#121110] hover:opacity-90"
          >
            Get started
          </Link>
        </section>
      </section>

      <footer className="border-t border-[#EEE3D1]/10">
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-x-6 gap-y-3 px-6 py-6 text-sm text-[#EEE3D1]/65">
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
