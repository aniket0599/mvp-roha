import Link from "next/link";
import { DEFAULT_VENUE } from "@/lib/seed";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center text-center px-margin-mobile">
      <h1 className="font-display text-display-mobile text-primary mb-2">Nothing here.</h1>
      <p className="text-body-lg text-on-surface-variant mb-stack-md max-w-phone">
        This space doesn&rsquo;t exist, or it isn&rsquo;t running an experiment right now. Scan a
        venue&rsquo;s QR code to join.
      </p>
      <Link href={`/join/${DEFAULT_VENUE}`} className="btn-primary max-w-phone">
        Go to Blue Tokai
      </Link>
    </div>
  );
}
