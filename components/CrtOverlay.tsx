"use client";

export default function CrtOverlay() {
  return (
    <>
      <div className="scanlines" />
      <div className="fixed inset-0 pointer-events-none z-[9998] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
    </>
  );
}
