"use client";

import Link from "next/link";
import {
  FileText,
  Compass,
  Activity,
  Sparkles,
  HelpCircle,
  Info,
} from "lucide-react";

interface MoreMenuProps {
  onClose?: () => void;
}

const sections = [
  {
    title: "CAPABILITIES",
    items: [
      {
        name: "Notes",
        href: "/notes",
        icon: FileText,
      },
      {
        name: "Explore IRABRAIN",
        href: "/explore",
        icon: Compass,
      },
    ],
  },
  {
    title: "MANAGE",
    items: [
      {
        name: "Activity",
        href: "/activity",
        icon: Activity,
      },
    ],
  },
  {
    title: "PRODUCT",
    items: [
      {
        name: "What's New",
        href: "/whats-new",
        icon: Sparkles,
      },
      {
        name: "Help & Support",
        href: "/help",
        icon: HelpCircle,
      },
      {
        name: "About IRABRAIN",
        href: "/about",
        icon: Info,
      },
    ],
  },
];

export default function MoreMenu({
  onClose,
}: MoreMenuProps) {
  return (
    <div className="w-full max-h-[calc(100vh-390px)] overflow-y-auto rounded-xl border border-[#EEE3D1]/10 bg-[#171512] p-3 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {sections.map((section, sectionIndex) => (
        <div
          key={section.title}
          className={
            sectionIndex === 0
              ? ""
              : "mt-3 border-t border-[#EEE3D1]/10 pt-3"
          }
        >
          <div className="px-2 pb-2 text-[9px] tracking-[0.25em] text-[#EEE3D1]/35">
            {section.title}
          </div>

          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] text-[#EEE3D1]/65 transition hover:bg-[#EEE3D1]/[0.04] hover:text-[#EEE3D1]"
                >
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}