import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Car, LayoutDashboard, Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location === path ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

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

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/" className={linkClass("/")} data-testid="link-home">
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 ${linkClass("/dashboard")}`}
              data-testid="link-dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            data-testid="button-menu-toggle"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-border bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                location === "/" ? "text-primary bg-primary/5" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
              data-testid="link-home-mobile"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                location === "/dashboard" ? "text-primary bg-primary/5" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
              data-testid="link-dashboard-mobile"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
