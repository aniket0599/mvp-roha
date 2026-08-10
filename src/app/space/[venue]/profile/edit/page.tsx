import { notFound, redirect } from "next/navigation";
import { AppBar } from "@/components/AppBar";
import { ProfileForm } from "@/components/ProfileForm";
import { initialFromProfile } from "@/lib/profileFormModel";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function EditProfilePage({
  params,
}: {
  params: { venue: string };
}) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const uid = getUserId();
  const me = uid ? await store.getProfile(uid) : null;
  if (!me) redirect(`/join/${params.venue}/create`);

  return (
    <div className="min-h-dvh flex flex-col">
      <AppBar title="Edit profile" back href={`/space/${params.venue}/profile`} />
      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2">
        <ProfileForm venue={params.venue} mode="edit" initial={initialFromProfile(me)} />
      </main>
    </div>
  );
}
