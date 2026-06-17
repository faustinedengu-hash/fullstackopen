import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Full Stack Open 2026",
  description: "Learning Next.js App Router",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-black text-white flex flex-col font-sans">
        {/* GLOBAL NAVIGATION HEADER */}
        <nav className="border-b border-zinc-800 bg-zinc-950 px-8 py-4">
          <div className="max-w-xl mx-auto flex gap-6 text-sm font-medium">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
              About
            </Link>
            {/* 👇 NEW: Link to the blogs list required by Exercise 1 */}
            <Link href="/blogs" className="text-zinc-400 hover:text-white transition-colors">
              Blogs
            </Link>
          </div>
        </nav>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}