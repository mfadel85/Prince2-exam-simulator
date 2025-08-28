import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRINCE2 Exam Simulator",
  description: "Practice PRINCE2 Foundation exam with timed questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
