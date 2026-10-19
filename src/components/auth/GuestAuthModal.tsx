"use client";

import LoginForm from "./LoginForm";

interface GuestAuthModalProps {
  onClose?: () => void;
}

export default function GuestAuthModal({
  onClose,
}: GuestAuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-md" />

      {/* Auth container */}
      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-2xl border border-[#EEE3D1]/10 bg-[#171716] shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
        <LoginForm />
      </div>
    </div>
  );
}