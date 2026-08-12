import Link from "next/link";
import Logo from "./Logo";
import { AGENTS } from "@/lib/constants";

export default function Navbar() {
  return (
    <header className="border-b border-base-line">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="font-display font-semibold text-lg leading-tight">Call Quality Dashboard</div>
            <div className="text-xs text-base-muted leading-tight">Artium Academy · Alwarpet &amp; Thoraipakkam</div>
          </div>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-full bg-brand-gradient text-white font-semibold"
          >
            Overview
          </Link>
          {AGENTS.map((a) => (
            <Link
              key={a.id}
              href={`/agents/${a.id}`}
              className="text-base-muted hover:text-base-text transition-colors font-medium"
            >
              {a.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
