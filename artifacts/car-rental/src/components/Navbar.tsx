import { Link, useLocation } from "wouter";
import { Car } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { label: "Home", href: "/" },
    { label: "Our Cars", href: "/cars" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="container flex h-16 items-center mx-auto px-4">
        <Link href="/" className="mr-10 flex items-center gap-2 flex-shrink-0" data-testid="link-logo">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Car className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-primary text-base">EliteRide</span>
        </Link>

        <div className="flex items-center gap-7">
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
      </div>
    </nav>
  );
}
