import type { Profile, PublicProfile } from "./types";

/** Strip a profile down to what other participants are allowed to see. */
export function toPublicProfile(p: Profile): PublicProfile {
  return {
    id: p.id,
    name: p.name,
    age: p.age,
    profession: p.profession,
    avatarEmoji: p.avatarEmoji,
    interests: p.interests,
    nowLines: p.nowLines,
    askMeAbout: p.askMeAbout,
    lookingFor: p.lookingFor,
    recently: p.recently,
    socialMode: p.socialMode,
    usuallyHere: p.usuallyHere,
  };
}
