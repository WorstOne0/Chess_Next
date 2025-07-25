"use client";

// Next
import { Nunito } from "next/font/google";
// Services
import { ThemeProvider } from "@/services";
// Styles
import "@/styles/global.css";

const nunito = Nunito({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange> */}
      <body className={`w-full flex flex-col ${nunito.className} antialiased`}>
        <div className="min-h-0 grow">{children}</div>
      </body>
      {/* </ThemeProvider> */}
    </html>
  );
}
