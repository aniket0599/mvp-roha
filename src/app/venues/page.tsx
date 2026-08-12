import Link from "next/link";
import { AppBar } from "@/components/AppBar";
import { Icon } from "@/components/Icon";
import { SEED_SPACES } from "@/lib/seed";
import { facilityConfig } from "@/lib/facilities";

export const dynamic = "force-dynamic";

// Founder overview: every configured facility, its type, and its links. Handy
// for generating one QR per venue and jumping to each dashboard.
export default function VenuesPage() {
  return (
    <div className="min-h-dvh flex flex-col pb-stack-lg">
      <AppBar title="Venues" />
      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2">
        <div className="mb-stack-md border-b border-surface-variant pb-stack-md">
          <h2 className="font-display text-display-mobile text-primary mb-1">Your facilities</h2>
          <p className="text-body-lg text-on-surface-variant">
            Each has its own QR (the join link), its own people, and a facility type that
            shapes what the app prioritizes.
          </p>
        </div>

        <ul className="space-y-gutter">
          {SEED_SPACES.map((space) => {
            const f = facilityConfig(space.facilityType);
            return (
              <li key={space.id} className="card p-stack-md">
                <div className="flex items-start justify-between gap-2 mb-stack-sm">
                  <div>
                    <h3 className="font-display text-headline text-primary">{space.name}</h3>
                    <p className="text-label-md text-on-surface-variant">
                      {f.emoji} {f.label}
                    </p>
                  </div>
                  <span className="chip">{space.venueId}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/join/${space.venueId}`}
                    className="flex items-center gap-2 text-body-md text-primary"
                  >
                    <Icon name="qr_code_2" className="text-[20px]" /> Join link (put this on the QR)
                  </Link>
                  <Link
                    href={`/admin/${space.venueId}`}
                    className="flex items-center gap-2 text-body-md text-on-surface-variant"
                  >
                    <Icon name="insights" className="text-[20px]" /> Research dashboard
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-label-md text-outline mt-stack-lg">
          Add a new facility by adding a row to <code>SEED_SPACES</code> in{" "}
          <code>src/lib/seed.ts</code> (a new slug + name + facility type), plus its seed
          people. Its QR is then <code>/join/&lt;slug&gt;</code>.
        </p>
      </main>
    </div>
  );
}
