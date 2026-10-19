"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollFade({
  children,
  className = "",
}: ScrollFadeProps) {
  const scrollRef =
    useRef<HTMLDivElement>(null);

  const [showTopFade, setShowTopFade] =
    useState(false);

  const [showBottomFade, setShowBottomFade] =
    useState(false);

  function updateFade() {
    const element =
      scrollRef.current;

    if (!element) {
      return;
    }

    const hasOverflow =
      element.scrollHeight >
      element.clientHeight + 2;

    const atTop =
      element.scrollTop <= 2;

    const atBottom =
      element.scrollTop +
        element.clientHeight >=
      element.scrollHeight - 2;

    setShowTopFade(
      hasOverflow && !atTop
    );

    setShowBottomFade(
      hasOverflow && !atBottom
    );
  }

  useEffect(() => {
    const element =
      scrollRef.current;

    if (!element) {
      return;
    }

    updateFade();

    element.addEventListener(
      "scroll",
      updateFade,
      { passive: true }
    );

    const resizeObserver =
      new ResizeObserver(updateFade);

    resizeObserver.observe(element);

    return () => {
      element.removeEventListener(
        "scroll",
        updateFade
      );

      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`relative min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      <div
        className={`
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          z-20
          h-12
          bg-gradient-to-b
          from-[var(--background)]
          to-transparent
          transition-opacity
          duration-300
          ${
            showTopFade
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {children}

      <div
        className={`
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-20
          h-16
          bg-gradient-to-t
          from-[var(--background)]
          to-transparent
          transition-opacity
          duration-300
          ${
            showBottomFade
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />
    </div>
  );
}