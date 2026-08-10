import { redirect } from "next/navigation";
import { DEFAULT_VENUE } from "@/lib/seed";

// The real entry point is a venue QR code (/join/<venue>). For anyone landing on
// the bare domain we route to the first experiment's venue.
export default function Home() {
  redirect(`/join/${DEFAULT_VENUE}`);
}
