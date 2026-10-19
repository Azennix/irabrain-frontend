"use client";

import {
  ArrowLeft,
  Bell,
  Bug,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Info,
  KeyRound,
  Link2,
  Settings,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useState } from "react";
import BrainRechargeModal from "@/components/brain/BrainRechargeModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isBrainRechargeOpen, setIsBrainRechargeOpen] =
  useState(false);

  const fullName =
  user?.full_name?.trim() ||
  user?.email?.split("@")[0] ||
  "Account";

const email = user?.email || "";

const displayInitial =
  fullName.charAt(0).toUpperCase();
 

  const profileItems = [
    {
      icon: UserRound,
      title: "Personal information",
      description: "Name, email, profile details",
      href: "/profile/personal-information",
    },
    {
      icon: KeyRound,
      title: "Security",
      description: "Password and 2FA",
      href: "/profile/security",
    },
    {
     icon: CreditCard,
    title: "Brain Recharge",
     description: "Manage your Brain tier and capacity",
     href: "/brain-recharge",
},
    {
      icon: Link2,
      title: "Connected accounts",
      description: "Manage integrations",
      href: "/profile/connected-accounts",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Manage your notifications",
      href: "/profile/notifications",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Appearance, memory and workspace",
      href: "/settings",
      mobileOnly: true,
    },
  ];

  const supportItems = [
    {
      icon: CircleHelp,
      title: "Help & Support",
      description: "Get help or contact support",
      href: "/help",
    },
    {
      icon: Bug,
      title: "Bug Report",
      description: "Report a problem with IRABRAIN",
      href: "/bug-report",
    },
    {
      icon: Info,
      title: "About IRABRAIN",
      description: "Learn more about IRABRAIN",
      href: "/about",
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
                Profile
              </h1>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage your account and personal details.
              </p>
            </div>
          </div>

          {/* IDENTITY */}
          <button
  type="button"
  onClick={() =>
    router.push("/profile/personal-information")
  }
  className="
    mb-8
    flex w-full items-center gap-4
    rounded-2xl
    border border-[var(--border)]
    bg-[var(--surface)]
    px-5 py-5
    text-left
    transition
    hover:bg-[var(--surface-soft)]
  "
>
            <div
              className="
                flex h-16 w-16 shrink-0
                items-center justify-center
                rounded-full
                border border-[var(--border)]
                bg-[var(--background)]
                text-lg font-medium
                text-[var(--foreground)]
              "
            >
              {displayInitial}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-medium text-[var(--foreground)]">
                {fullName}
              </h2>

              <p className="mt-1 truncate text-sm text-[var(--muted)]">
                {email}
              </p>
            </div>
          </button>

          {/* PROFILE OPTIONS */}
          <section
            className="
              overflow-hidden
              rounded-2xl
              border border-[var(--border)]
              bg-[var(--surface)]
            "
          >
            {profileItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => {
  if (item.title === "Brain Recharge") {
    setIsBrainRechargeOpen(true);
    return;
  }

  if (item.href) {
    router.push(item.href);
  }
}}
                  className={`
                    flex w-full items-center gap-4
                    px-5 py-4
                    text-left
                    transition
                    hover:bg-[var(--surface-soft)]
                    ${item.mobileOnly ? "md:hidden" : ""}
                    ${
                      index !== profileItems.length - 1
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
          </section>

          {/* SUPPORT — MOBILE ONLY */}
          <section className="mt-8 md:hidden">
            <p className="mb-3 px-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Support
            </p>

            <div
              className="
                overflow-hidden
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
              "
            >
              {supportItems.map((item, index) => {
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
                        index !== supportItems.length - 1
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

        </div>
      </main>

       <BrainRechargeModal
        open={isBrainRechargeOpen}
        onClose={() => setIsBrainRechargeOpen(false)}
        onPaymentSuccess={() => {
          setIsBrainRechargeOpen(false);
        }}
      />
    </MainLayout>
  );
}