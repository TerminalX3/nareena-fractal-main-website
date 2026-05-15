import Link from "next/link";
import clsx from "clsx";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About the Fractal" },
  { href: "/research", label: "Research" },
  { href: "/visualizer", label: "Visualizer" },
] as const;

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={clsx(
        "sticky top-0 z-40 border-b border-border/70 bg-background/55 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg tracking-[0.12em] text-foreground/95 sm:text-xl"
        >
          NAREENA FRACTAL
        </Link>
        <nav
          aria-label="Primary"
          className="hidden gap-8 text-[11px] uppercase tracking-[0.22em] text-muted md:flex md:justify-end"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav
        aria-label="Primary mobile"
        className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border/70 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-muted md:hidden"
      >
        {nav.slice(1).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition-colors hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
