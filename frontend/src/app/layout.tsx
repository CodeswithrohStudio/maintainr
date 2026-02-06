import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SimpleProviders } from "@/components/providers-simple";
import { PrivyProviderWrapper } from "@/providers/privy-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Maintainr - OSS Funding Platform",
  description: "Buy Me a Coffee for Open Source with Web3. Enable maintainers to receive USDC funding through seamless on-chain experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PrivyProviderWrapper>
          <SimpleProviders>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </SimpleProviders>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
