"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Carte" },
  { href: "/draft", label: "Simulatore Pescata" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-amber-800/30 bg-gradient-to-r from-amber-950/50 to-red-950/30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
            TM Calculator
          </Link>
          <nav className="flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-amber-800/40 text-amber-300"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          Calcola il valore reale delle carte di Terraforming Mars
        </p>
      </div>
    </header>
  );
}
