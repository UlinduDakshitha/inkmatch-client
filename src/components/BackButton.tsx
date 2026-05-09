"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white transition hover:bg-neutral-800"
    >
      ← Back
    </button>
  );
}
