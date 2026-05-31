import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Car, Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Our Cars", href: "/cars" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0"
          onClick={() => setOpen(false)}
          data-testid="link-logo"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-primary text-base">EliteRide</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(({ label, href }) => {
            const isActive = href !== "#contact" && location === href;
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`link-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          data-testid="button-mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {links.map(({ label, href }) => {
            const isActive = href !== "#contact" && location === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-testid={`mobile-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
