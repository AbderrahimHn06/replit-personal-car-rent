import { Link, useLocation } from "wouter";
import { Car, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Link href="/" className="mr-8 flex items-center gap-2" data-testid="link-logo">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Car className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-primary text-base">
            EliteRide
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location === "/" ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="link-home"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
              location === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="link-dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
