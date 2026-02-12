import type { ReactNode } from "react";

export const metadata = {
  title: "Automated Form Filler",
  description: "Document automation with OCR and AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
