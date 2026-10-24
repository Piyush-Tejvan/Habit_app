import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Do.Theory — Small actions. Real life.",
    template: "%s · Do.Theory",
  },
  description:
    "Keep starting and stopping? Test one small action for seven days. A private, guided practice pilot. Try a free action-plan sample.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <footer className="site-footer container">
          <div>
            <Link href="/" className="wordmark">
              do<span className="wordmark-dot">.</span>theory
              <span className="wordmark-star" aria-hidden="true">
                ✳
              </span>
            </Link>
            <p>Less theory. A little more doing.</p>
          </div>
          <div className="footer-right">
            <span>An idea in practice. A pilot, not a promise.</span>
            <div>
              <Link href="/sample">Try a sample</Link>
              <Link href="/privacy">Privacy draft</Link>
              <span>© {new Date().getFullYear()} Do.Theory</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
