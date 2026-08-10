import { notFound } from "next/navigation";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Icon } from "@/components/Icon";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], { month: "long", day: "numeric" });
}

// Lightweight shared-history log. A research feature: turning familiar unknowns
// into acquaintances, and acquaintances into shared history.
export default async function ConnectionsPage({
  params,
}: {
  params: { venue: string };
}) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const uid = getUserId();
  const connections = uid ? await store.listConnections(uid) : [];

  return (
    <div className="min-h-dvh flex flex-col pb-24">
      <AppBar />
      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2">
        <div className="mb-stack-md border-b border-surface-variant pb-stack-md">
          <h2 className="font-display text-display-mobile text-primary mb-1">Connections</h2>
          <p className="text-body-lg text-on-surface-variant">
            People you&rsquo;ve actually met.
          </p>
        </div>

        {connections.length === 0 ? (
          <div className="text-center py-stack-lg text-on-surface-variant">
            <Icon name="waving_hand" className="text-4xl text-outline mb-3" />
            <p className="text-body-lg mb-1">No connections yet.</p>
            <p className="text-body-md text-outline">
              When you meet someone here, you can save it from their profile.
            </p>
          </div>
        ) : (
          <ul className="space-y-gutter">
            {connections.map((c) => (
              <li key={c.id} className="card p-stack-md">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-headline text-primary">{c.otherUserName}</h3>
                  <span className="text-label-md text-outline whitespace-nowrap">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="text-label-md text-on-surface-variant mb-stack-sm">
                  Met at {c.spaceName}
                </p>
                {c.types.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-stack-sm">
                    {c.types.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {c.note && (
                  <blockquote className="border-l-2 border-outline-variant pl-4 text-body-md italic text-on-surface">
                    &ldquo;{c.note}&rdquo;
                  </blockquote>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <BottomNav venue={params.venue} active="connections" />
    </div>
  );
}
