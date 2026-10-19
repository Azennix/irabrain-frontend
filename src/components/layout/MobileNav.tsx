"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  MessageCircle,
  Brain,
  Folder,
  MoreHorizontal,
} from "lucide-react";
import MoreMenu from "./MoreMenu";

const navigation = [
  {
    name: "Chat",
    href: "/chat",
    icon: MessageCircle,
  },
  {
    name: "Memory",
    href: "/memory",
    icon: Brain,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: Folder,
  },
  {
    name: "More",
    href: "/settings",
    icon: MoreHorizontal,
  },
];

export default function MobileNav() {
  const pathname = usePathname();
   const [moreOpen, setMoreOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#EEE3D1]/10 bg-[#0F0E0C]/95 backdrop-blur-xl md:hidden">
     
     {moreOpen && (
  <>
    <button
      type="button"
      aria-label="Close More menu"
      onClick={() => setMoreOpen(false)}
      className="fixed inset-0 bottom-[68px] bg-black/45 backdrop-blur-[2px]"
    />

    <div className="fixed bottom-[76px] left-3 right-3 z-10 max-h-[calc(100dvh-100px)] overflow-y-auto rounded-2xl border border-[#EEE3D1]/10 bg-[#171512] p-2 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <MoreMenu
        onClose={() => setMoreOpen(false)}
      />
    </div>
  </>
)}

      <div className="mx-auto flex h-[68px] w-full max-w-md items-center justify-around px-2">

        {navigation.map((item) => {
  const Icon = item.icon;

  const active =
    item.href === "/chat"
      ? pathname === "/chat"
      : item.name === "More"
        ? moreOpen
        : pathname.startsWith(item.href);

  if (item.name === "More") {
    return (
      <button
        key={item.name}
        type="button"
        onClick={() => setMoreOpen((open) => !open)}
        className={`relative flex min-w-[62px] flex-col items-center justify-center gap-1.5 transition ${
          active
            ? "text-[#EEE3D1]"
            : "text-[#EEE3D1]/40"
        }`}
      >
        {active && (
          <span className="absolute -top-[1px] h-[2px] w-7 rounded-full bg-[#8A0303]" />
        )}

        <Icon
          size={20}
          strokeWidth={1.6}
        />

        <span className="text-[10px]">
          {item.name}
        </span>
      </button>
    );
  }

  return (
    <Link
      key={item.name}
      href={item.href}
      className={`relative flex min-w-[62px] flex-col items-center justify-center gap-1.5 transition ${
        active
          ? "text-[#EEE3D1]"
          : "text-[#EEE3D1]/40"
      }`}
    >
      {active && (
        <span className="absolute -top-[1px] h-[2px] w-7 rounded-full bg-[#8A0303]" />
      )}

      <Icon
        size={20}
        strokeWidth={1.6}
      />

      <span className="text-[10px]">
        {item.name}
      </span>
    </Link>
  );
})}

      </div>

    </nav>
  );
}