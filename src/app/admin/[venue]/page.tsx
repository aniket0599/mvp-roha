import { notFound } from "next/navigation";
import { AppBar } from "@/components/AppBar";
import { AutoRefresh } from "@/components/AutoRefresh";
import { ResetExperiment } from "@/components/ResetExperiment";
import { Icon } from "@/components/Icon";
import { getStore, usingSupabase } from "@/lib/store";

export const dynamic = "force-dynamic";

// Simple research dashboard for the founder. Anonymous, aggregate only.
export default async function AdminPage({
  params,
}: {
  params: { venue: string };
}) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const metrics = await store.getMetrics(space.id);
  const participants = await store.listVisibleProfiles(space.id);

  const stats: { label: string; value: number; hint?: string }[] = [
    { label: "Participants", value: metrics.participants, hint: "discoverable now" },
    { label: "Space joins", value: metrics.spaceJoins, hint: "tapped “join”" },
    { label: "Profiles viewed", value: metrics.profilesViewed },
    { label: "Unique profile views", value: metrics.uniqueProfileViews },
    { label: "Curious actions", value: metrics.curiosityActions, hint: "chose a reason to talk" },
    { label: "Interactions", value: metrics.interactionsRecorded },
    { label: "Connections", value: metrics.connections },
  ];

  return (
    <div className="min-h-dvh flex flex-col pb-stack-lg">
      <AutoRefresh seconds={10} />
      <AppBar title="Research" />
      <main className="flex-1 w-full max-w-container mx-auto px-margin-mobile md:px-margin-desktop pt-2">
        <div className="mb-stack-md border-b border-surface-variant pb-stack-md flex items-end justify-between flex-wrap gap-3">
          <div>
            <span className="label-caps block mb-2">Current space</span>
            <h2 className="font-display text-display-mobile text-primary uppercase tracking-tight">
              {space.name}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-label-md">Live · updates every 10s</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-stack-lg">
          {stats.map((s) => (
            <div key={s.label} className="card p-stack-md">
              <p className="font-display text-display-lg text-primary leading-none">{s.value}</p>
              <p className="text-body-md text-on-surface mt-2">{s.label}</p>
              {s.hint && <p className="text-label-md text-outline mt-0.5">{s.hint}</p>}
            </div>
          ))}
        </div>

        {/* Funnel */}
        <div className="card p-stack-md mb-stack-lg">
          <span className="label-caps block mb-stack-sm">Behavioural funnel</span>
          <Funnel
            steps={[
              { label: "Space joins", value: metrics.spaceJoins },
              { label: "Profiles viewed", value: metrics.profilesViewed },
              { label: "Curious actions", value: metrics.curiosityActions },
              { label: "Interactions", value: metrics.interactionsRecorded },
              { label: "Connections", value: metrics.connections },
            ]}
          />
        </div>

        {/* Participants */}
        <div className="card p-stack-md mb-stack-md">
          <span className="label-caps block mb-stack-sm">
            Discoverable participants ({participants.length})
          </span>
          <ul className="divide-y divide-surface-variant">
            {participants.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-2.5">
                <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-lg">
                  {p.avatarEmoji ?? "🙂"}
                </span>
                <span className="text-body-md text-on-surface flex-1">
                  {p.name}
                  {p.age != null && <span className="text-on-surface-variant">, {p.age}</span>}
                  <span className="text-on-surface-variant"> · {p.profession}</span>
                </span>
                <span className="text-label-md text-outline">{p.socialMode}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-label-md text-outline flex items-center gap-1.5">
            <Icon name="database" className="text-[16px]" />
            {usingSupabase() ? "Supabase (persistent)" : "In-memory (resets on restart)"}
          </p>
          <ResetExperiment venue={params.venue} />
        </div>
      </main>
    </div>
  );
}

function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(1, ...steps.map((s) => s.value));
  return (
    <div className="space-y-2">
      {steps.map((s) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-label-md text-on-surface-variant w-32 shrink-0">{s.label}</span>
          <div className="flex-1 h-6 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(s.value / max) * 100}%`, minWidth: s.value ? "8px" : 0 }}
            />
          </div>
          <span className="text-body-md text-on-surface w-8 text-right tabular-nums">{s.value}</span>
        </div>
      ))}
    </div>
  );
}
