import type { CurrentActivity, Profile, SocialMode } from "./types";

// Shared (server-safe) model + helper for the profile form. Kept out of the
// "use client" component file so server components can call it directly.
export interface ProfileFormInitial {
  name: string;
  age: string;
  profession: string;
  interests: string[];
  currentActivity: CurrentActivity | "";
  interesting: string;
  askMeAbout: string;
  recently: string;
  lookingFor: string[];
  socialMode: SocialMode;
}

export function initialFromProfile(p: Profile | null): ProfileFormInitial {
  return {
    name: p?.name ?? "",
    age: p?.age != null ? String(p.age) : "",
    profession: p?.profession ?? "",
    interests: p?.interests ?? [],
    currentActivity: p?.currentActivity ?? "",
    interesting: p?.interesting ?? "",
    askMeAbout: p?.askMeAbout?.join(", ") ?? "",
    recently: p?.recently ?? "",
    lookingFor: p?.lookingFor ?? [],
    socialMode: p?.socialMode ?? "open",
  };
}
