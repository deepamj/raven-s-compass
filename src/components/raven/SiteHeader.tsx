import { Link } from "@tanstack/react-router";
import { RavenMark } from "./RavenMark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/92 backdrop-blur-[2px]">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <RavenMark className="h-4 w-9 shrink-0 text-foreground" />
          <span className="font-display truncate text-2xl leading-none">Raven</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-5 text-sm">
          <Link
            to="/journey"
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Explore
          </Link>
          <Link
            to="/contribute"
            search={{}}
            className="border border-border-strong px-3.5 py-1.5 text-foreground transition-colors hover:bg-accent"
            activeProps={{ className: "bg-accent" }}
          >
            Contribute
          </Link>
        </nav>
      </div>
    </header>
  );
}
