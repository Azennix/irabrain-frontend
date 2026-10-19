import MainLayout from "@/components/layout/MainLayout";
import {
  WorkspaceProvider,
} from "@/lib/workspace/WorkspaceContext";


interface ProtectedPageLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedPageLayout({
  children,
}: ProtectedPageLayoutProps) {
  return (
    <WorkspaceProvider>
    <MainLayout>
      <div
        className="
          flex
          h-[100dvh]
          min-h-0
          flex-col
          overflow-hidden
          bg-[var(--background)]
          text-[var(--foreground)]
        "
      >
        {/* ONLY PAGE CONTENT SCROLLS */}
        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
          "
        >
          {children}
        </div>
      </div>
    </MainLayout>
    </WorkspaceProvider>
  );
}