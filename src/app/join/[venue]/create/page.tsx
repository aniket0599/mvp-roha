import { notFound } from "next/navigation";
import { AppBar } from "@/components/AppBar";
import { ProfileForm } from "@/components/ProfileForm";
import { initialFromProfile } from "@/lib/profileFormModel";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";
import { facilityConfig } from "@/lib/facilities";

export const dynamic = "force-dynamic";

// Profile creation — designed to take ~60 seconds, not a social-network onboarding.
export default async function CreatePage({ params }: { params: { venue: string } }) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const uid = getUserId();
  const existing = uid ? await store.getProfile(uid) : null;
  const facility = facilityConfig(space.facilityType);

  return (
    <div className="min-h-dvh flex flex-col">
      <AppBar title="Profile Setup" back href={`/join/${params.venue}`} />
      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2">
        <h2 className="font-display text-display-mobile text-primary mb-2">
          Create your social profile.
        </h2>
        <p className="text-body-lg text-on-surface-variant mb-stack-lg">
          Introduce yourself to the people at {space.name}. Be genuine, be curious.
        </p>
        <ProfileForm
          venue={params.venue}
          mode="create"
          initial={initialFromProfile(existing)}
          prompts={facility.onboarding}
        />
      </main>
    </div>
  );
}
