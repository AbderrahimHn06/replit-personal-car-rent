import React from "react";
import { Link, useLocation } from "wouter";
import { Crown, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Crown className="h-6 w-6 text-primary" />
          <span className="hidden font-bold tracking-tight text-primary uppercase sm:inline-block">
            EliteRide
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-1 transition-colors hover:text-primary ${location === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
