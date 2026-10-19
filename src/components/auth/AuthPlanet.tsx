"use client";

import Image from "next/image";

export default function AuthPlanet() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src="/auth-planet1.png"
        alt=""
        width={1536}
        height={1024}
        priority
        className="
          absolute
          bottom-5
          left-[-290]
          h-auto
          w-[1000px]
          max-w-none
        "
      />
    </div>
  );
}