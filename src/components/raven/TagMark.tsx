import { toneFor } from "@/lib/raven-data";

const dotClass: Record<string, string> = {
  positive: "bg-positive",
  caution: "bg-caution",
  neutral: "bg-border-strong",
};

const textClass: Record<string, string> = {
  positive: "text-positive",
  caution: "text-caution",
  neutral: "text-muted-foreground",
};

export function TagMark({
  tag,
  count,
  strong = false,
}: {
  tag: string;
  count?: number;
  strong?: boolean;
}) {
  const tone = toneFor(tag);
  return (
    <span className="flex min-w-0 items-baseline gap-2.5">
      <span
        className={`mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full ${dotClass[tone]}`}
        aria-hidden
      />
      <span className={strong ? `text-base ${textClass[tone]}` : "text-sm text-foreground"}>
        {tag}
      </span>
      {count !== undefined && (
        <span className="shrink-0 text-sm text-muted-foreground">
          {count} {count === 1 ? "woman" : "women"}
        </span>
      )}
    </span>
  );
}
