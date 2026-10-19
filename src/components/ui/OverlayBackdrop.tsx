"use client";

interface OverlayBackdropProps {
  onClick?: () => void;
  className?: string;
  zIndex?: number;
}

export default function OverlayBackdrop({
  onClick,
  className = "",
  zIndex = 90,
}: OverlayBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        fixed
        inset-0
        bg-black/65
        ${className}
      `}
      style={{ zIndex }}
      onClick={onClick}
    />
  );
}