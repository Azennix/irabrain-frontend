import type { Metadata } from "next";
import { AuthProvider } from "../lib/auth/AuthProvider";
import {
  AuthModalProvider,
} from "../lib/auth/AuthModalContext";
import { ThemeProvider } from "../components/theme/ThemeProvider";
import "./globals.css";


export const viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "IRABrain",
  description: "Your AI Brain",
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