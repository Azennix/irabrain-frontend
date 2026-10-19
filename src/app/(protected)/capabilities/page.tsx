"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

export default function CapabilitiesPage() {
  return (
    <MainLayout>
      <main className="min-h-full px-5 pb-8 pt-[76px] md:px-10 md:py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-medium text-[#EEE3D1]">
              Capabilities
            </h1>

            <p className="mt-2 text-sm text-[#EEE3D1]/45">
              Tools and capabilities available inside IRABRAIN.
            </p>
          </div>

          <Link
            href="/notes"
            className="group block max-w-sm rounded-2xl border border-[#EEE3D1]/10 bg-[#171716] p-5 transition hover:border-[#EEE3D1]/20 hover:bg-[#1b1916]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#EEE3D1]/10">
                <FileText
                  size={20}
                  strokeWidth={1.5}
                  className="text-[#EEE3D1]/75"
                />
              </div>

              <div>
                <h2 className="text-[15px] font-medium text-[#EEE3D1]">
                  Notes
                </h2>

                <p className="mt-1 text-[13px] leading-5 text-[#EEE3D1]/45">
                  Create, organize, search, and manage your notes.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </MainLayout>
  );
}