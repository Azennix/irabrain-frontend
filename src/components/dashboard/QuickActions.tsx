"use client";

import {
  CalendarDays,
  BookOpen,
  Lightbulb,
  UserRound,
} from "lucide-react";

const actions = [
  {
    title: "Plan my day",
    icon: CalendarDays,
  },
  {
    title: "Explain a concept",
    icon: BookOpen,
  },
  {
    title: "Help me think through a decision",
    icon: Lightbulb,
  },
  {
    title: "Give me a fresh perspective",
    icon: UserRound,
  },
];

export default function QuickActions() {
  return (
    <section className="mx-auto w-full max-w-[1050px] px-4 pb-8 sm:px-6 md:px-8">
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              className="
                flex
                min-h-[72px]
                items-center
                gap-3
                rounded-xl
                border
                border-[#EEE3D1]/20
                bg-transparent
                px-4
                py-3
                text-left
                transition
                hover:border-[#EEE3D1]/35
                hover:bg-[#EEE3D1]/[0.025]
                active:scale-[0.99]
                sm:min-h-[80px]
                sm:px-5
              "
            >
              <Icon
                size={25}
                strokeWidth={1.5}
                className="shrink-0 text-[#EEE3D1]"
              />

              <span className="text-[13px] leading-5 text-[#EEE3D1] sm:text-sm">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}