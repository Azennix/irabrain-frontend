import {
  Brain,
  Search,
  Code2,
  BarChart3,
} from "lucide-react";

const capabilities = [
  {
    title: "Memory",
    description: "Remember what matters across your journey.",
    icon: Brain,
  },
  {
    title: "Research",
    description: "Find useful information and opportunities.",
    icon: Search,
  },
  {
    title: "Build",
    description: "Turn ideas into products and projects.",
    icon: Code2,
  },
  {
    title: "Analyze",
    description: "Understand data, decisions, and possibilities.",
    icon: BarChart3,
  },
];

export default function Capabilities() {
  return (
    <section className="mx-auto w-full max-w-5xl min-w-0 px-5 pb-12 sm:px-8 md:px-10">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-[#EEE3D1]/55">
          Capabilities
        </h2>

        <span className="h-px w-7 shrink-0 bg-[#8A0303]" />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((capability) => {
          const Icon = capability.icon;

          return (
            <div
              key={capability.title}
              className="
                group
                min-w-0
                min-h-[150px]
                rounded-xl
                border
                border-[#EEE3D1]/10
                bg-[#EEE3D1]/[0.02]
                p-5
                transition-colors
                hover:border-[#EEE3D1]/20
                hover:bg-[#EEE3D1]/[0.035]
              "
            >
              <Icon
                size={20}
                strokeWidth={1.5}
                className="text-[#EEE3D1]/65 transition-colors group-hover:text-[#EEE3D1]"
              />

              <h3 className="mt-8 text-sm font-medium text-[#EEE3D1]">
                {capability.title}
              </h3>

              <p className="mt-2 break-words text-xs leading-5 text-[#EEE3D1]/40">
                {capability.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}