"use client";

import {
  ArrowLeft,
  Brain,
  Building2,
  ChevronRight,
  LogOut,
  Palette,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
export default function SettingsPage() {
  const router = useRouter();
  const { logout } = useAuth();

  const sections = [
    {
      title: "Appearance",
      items: [
        {
          icon: Palette,
          title: "Theme",
          description: "Choose how IRABRAIN looks",
          href: "/settings/theme",
        },
        {
          icon: SlidersHorizontal,
          title: "Interface preferences",
          description: "Customize your experience",
          href: "/settings/interface",
        },
      ],
    },

    {
      title: "Memory",
      items: [
        {
          icon: Brain,
          title: "Memory settings",
          description: "Manage how IRABRAIN remembers you",
          href: "/settings/memory",
        },
      ],
    },

    {
      title: "Workspace",
      items: [
        {
          icon: Building2,
          title: "Workspace preferences",
          description: "Manage workspace settings",
          href: "/settings/workspace",
        },
      ],
    },

    {
      title: "Privacy",
      items: [
        {
          icon: Shield,
          title: "Data & privacy",
          description: "Control your data and privacy",
          href: "/settings/privacy",
        },
      ],
    },
  ];

  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-10 pt-28 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">

          {/* HEADER */}
          <div className="mb-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back"
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-lg
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface-soft)]
                hover:text-[var(--foreground)]
              "
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>

            <div>
              <h1 className="text-xl font-medium text-[var(--foreground)]">
                Settings
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage your IRABRAIN preferences.
              </p>
            </div>
          </div>

          {/* SETTINGS */}
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2
                  className="
                    mb-3 px-1
                    text-xs font-medium
                    uppercase tracking-[0.12em]
                    text-[var(--muted)]
                  "
                >
                  {section.title}
                </h2>

                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                  "
                >
                  {section.items.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => router.push(item.href)}
                        className={`
                          flex w-full items-center gap-4
                          px-5 py-4
                          text-left
                          transition
                          hover:bg-[var(--surface-soft)]
                          ${
                            index !== section.items.length - 1
                              ? "border-b border-[var(--border)]"
                              : ""
                          }
                        `}
                      >
                        <div
                          className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-lg
                            bg-[var(--surface-soft)]
                            text-[var(--muted)]
                          "
                        >
                          <Icon size={17} strokeWidth={1.5} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-[var(--foreground)]">
                            {item.title}
                          </p>

                          <p className="mt-0.5 text-xs text-[var(--muted)]">
                            {item.description}
                          </p>
                        </div>

                        <ChevronRight
                          size={17}
                          strokeWidth={1.5}
                          className="shrink-0 text-[var(--muted)]"
                        />
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
                    </div>

          {/* LOG OUT */}
          <div className="mt-10 border-t border-[var(--border)] pt-8">
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
              className="
                flex w-full items-center gap-4
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
                px-5 py-4
                text-left
                transition
                hover:bg-[var(--surface-soft)]
              "
            >
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-lg
                  bg-[var(--surface-soft)]
                  text-[var(--muted)]
                "
              >
                <LogOut size={17} strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-[var(--foreground)]">
                  Log out
                </p>

                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  Sign out of your IRABRAIN account
                </p>
              </div>
            </button>
          </div>

        </div>
      </main>
    </MainLayout>
  );
}