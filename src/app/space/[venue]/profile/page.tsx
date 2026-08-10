import { notFound } from "next/navigation";
import Link from "next/link";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { ProfileControls } from "@/components/ProfileControls";
import { Icon } from "@/components/Icon";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

// The participant's own profile + privacy controls.
export default async function MyProfilePage({
  params,
}: {
  params: { venue: string };
}) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const uid = getUserId();
  const me = uid ? await store.getProfile(uid) : null;

  return (
    <div className="min-h-dvh flex flex-col pb-24">
      <AppBar />
      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2">
        <div className="mb-stack-md border-b border-surface-variant pb-stack-md">
          <h2 className="font-display text-display-mobile text-primary mb-1">Your profile</h2>
          <p className="text-body-lg text-on-surface-variant">
            {me ? `Visible at ${space.name}` : `You haven't joined ${space.name} yet`}
          </p>
        </div>

        {!me ? (
          <div className="card bg-surface-container-low p-stack-md text-center">
            <Icon name="badge" className="text-4xl text-outline mb-3" />
            <p className="text-body-lg text-on-surface mb-1">No profile yet</p>
            <p className="text-body-md text-on-surface-variant mb-stack-md">
              Create one to become discoverable and see what you share with people here.
            </p>
            <Link href={`/join/${params.venue}/create`} className="btn-primary">
              Create my profile
            </Link>
          </div>
        ) : (
          <>
            {/* Summary card */}
            <div className="card p-stack-md mb-stack-md flex items-start gap-stack-sm">
              <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center border border-surface-variant text-3xl shrink-0">
                {me.avatarEmoji ?? "🙂"}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-headline text-primary">
                  {me.name}
                  {me.age != null && <span>, {me.age}</span>}
                </h3>
                <p className="text-body-md text-on-surface-variant">{me.profession}</p>
                {me.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {me.interests.map((i) => (
                      <span key={i} className="chip text-label-md py-1">
                        {i}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <ProfileControls
              venue={params.venue}
              initialMode={me.socialMode}
              initialVisible={me.visible}
            />
          </>
        )}
      </main>
      <BottomNav venue={params.venue} active="profile" />
    </div>
  );
}
