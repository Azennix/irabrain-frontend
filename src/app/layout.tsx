import type { Metadata, Viewport } from "next";
import { AuthProvider } from "../lib/auth/AuthProvider";
import { AuthModalProvider } from "../lib/auth/AuthModalContext";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
  themeColor: "#111111",
};

export const metadata: Metadata = {
  title: "IRABRAIN",
  description: "Your AI Brain",
  applicationName: "IRABRAIN",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/irabrain-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/irabrain-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "IRABRAIN",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <AuthModalProvider>
              {children}
            </AuthModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
