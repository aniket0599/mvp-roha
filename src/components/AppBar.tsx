"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./Icon";

// Editorial top bar: optional back button + the "Around" masthead (Playfair).
export function AppBar({
  title = "Around",
  back,
  href,
}: {
  title?: string;
  /** Show a back button. If `href` is set it navigates there, else router.back(). */
  back?: boolean;
  href?: string;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 flex items-center w-full bg-background/90 backdrop-blur px-margin-mobile py-stack-sm">
      {back && (
        <button
          aria-label="Back"
          onClick={() => (href ? router.push(href) : router.back())}
          className="mr-3 -ml-2 p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center"
        >
          <Icon name="arrow_back" />
        </button>
      )}
      <h1 className="font-display text-headline font-semibold text-primary tracking-tight">
        {title}
      </h1>
    </header>
  );
}
