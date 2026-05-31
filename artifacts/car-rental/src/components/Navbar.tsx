import { Link, useLocation } from "wouter";
import { Crown, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Crown className="h-5 w-5 text-primary" />
          <span className="font-bold tracking-widest text-foreground uppercase text-sm">
            EliteRide
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
            data-testid="link-home"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}
            data-testid="link-dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
