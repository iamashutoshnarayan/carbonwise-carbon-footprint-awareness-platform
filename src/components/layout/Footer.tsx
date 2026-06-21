import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-eco text-primary-foreground">
              <Leaf className="h-4 w-4" aria-hidden />
            </span>
            CarbonWise
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Measure, understand, and shrink your carbon footprint with science-backed insights.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Calculator</li>
            <li>Dashboard</li>
            <li>Recommendations</li>
            <li>Challenges</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Learn</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Climate basics</li>
            <li>Sustainable living</li>
            <li>Green energy</li>
            <li>Waste reduction</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>About</li>
            <li>Methodology</li>
            <li>Privacy</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CarbonWise. Built for a cooler planet.
      </div>
    </footer>
  );
}
