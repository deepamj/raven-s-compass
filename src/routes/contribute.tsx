import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/raven/SiteHeader";
import { TagMark } from "@/components/raven/TagMark";
import { EXPERIENCE_TAGS, places } from "@/lib/raven-data";
import { addExperience } from "@/lib/experience-store";

export const Route = createFileRoute("/contribute")({
  validateSearch: (search: Record<string, unknown>): { place?: string } =>
    typeof search["place"] === "string" ? { place: search["place"] } : {},
  head: () => ({
    meta: [
      { title: "Tell other women what you experienced | Raven" },
      {
        name: "description",
        content:
          "Share a recent first-hand experience of a place or stop you travelled through, so the next woman knows what to expect.",
      },
      { property: "og:title", content: "Tell other women what you experienced | Raven" },
      {
        property: "og:description",
        content: "Add a recent, first-hand travel experience to Raven.",
      },
    ],
  }),
  component: ContributePage,
});

function ContributePage() {
  const { place: prefill } = Route.useSearch();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [placeName, setPlaceName] = useState(prefill ?? "");
  const [date, setDate] = useState("2026-08-30");
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{ placeId: string | null; name: string } | null>(null);

  const toggle = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const matched = places.find((p) => p.name.toLowerCase() === placeName.trim().toLowerCase());
  const canSubmit = placeName.trim().length > 1 && tags.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const display = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (matched) {
      addExperience({
        placeId: matched.id,
        date: display,
        iso: date,
        tags,
        ...(note.trim() ? { text: note.trim() } : {}),
        traveller: "Solo traveller",
        evidence: photo ? "date + photo" : "date",
      });
    }
    setSubmitted({ placeId: matched?.id ?? null, name: placeName.trim() });
  }

  if (submitted) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-24 sm:px-8">
          <p className="rule-label">Experience recorded</p>
          <h1 className="font-display mt-4 text-5xl leading-tight">Thank you.</h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            Your experience of <span className="text-foreground">{submitted.name}</span> has been
            recorded with the date you travelled, so the next woman can judge its recency.
          </p>
          <div className="mt-8 border-y border-border py-5">
            <p className="rule-label">Contribution trust signals</p>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-foreground">First-hand report</p>
                <p className="mt-1 text-xs text-muted-foreground">Travel date supplied by traveller</p>
              </div>
              <div>
                <p className="text-foreground">{photo ? "Photo attached" : "No photo attached"}</p>
                <p className="mt-1 text-xs text-muted-foreground">Optional supporting evidence</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Raven does not label a report “verified” just because it was submitted. Future review can
              combine date and photo evidence, duplicate detection, and community flagging.
            </p>
          </div>
          <ul className="mt-8 space-y-3 border-y border-border py-6">
            {tags.map((t) => (
              <li key={t}>
                <TagMark tag={t} />
              </li>
            ))}
          </ul>
          {note.trim() && (
            <p className="font-display mt-6 text-xl leading-snug">“{note.trim()}”</p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            {submitted.placeId && (
              <Link
                to="/place/$placeId"
                params={{ placeId: submitted.placeId }}
                className="border border-border-strong bg-primary px-5 py-3 text-sm text-primary-foreground transition-colors hover:opacity-90"
              >
                See it on {submitted.name}
              </Link>
            )}
            <Link
              to="/journey"
              className="border border-border-strong px-5 py-3 text-sm transition-colors hover:bg-accent"
            >
              Back to the route
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <p className="rule-label">Contribute</p>
        <h1 className="font-display mt-4 max-w-2xl text-5xl leading-tight sm:text-6xl">
          Tell other women what you experienced.
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 grid gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-10">
            <div className="border-l-2 border-primary pl-4">
              <p className="rule-label">Keep reports trustworthy</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Share when you were there. A photo is optional. Raven surfaces recent reports first and
                keeps the evidence attached to each contribution.
              </p>
            </div>

            <div>
              <label htmlFor="place" className="rule-label block">
                Where did you go?
              </label>
              <input
                id="place"
                list="raven-places"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="Munnar Bus Stand"
                className="mt-3 w-full border-b border-input bg-transparent py-2.5 text-lg outline-none focus:border-ring"
              />
              <datalist id="raven-places">
                {places.map((p) => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
              <p className="mt-2 text-xs text-muted-foreground">
                {matched
                  ? `Matched a place Raven already knows: ${matched.area}`
                  : "Example: Munnar Bus Stand"}
              </p>
            </div>

            <div>
              <label htmlFor="when" className="rule-label block">
                When?
              </label>
              <input
                id="when"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-3 w-full border-b border-input bg-transparent py-2.5 text-lg outline-none focus:border-ring"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Recency matters more than anything else here.
              </p>
            </div>

            <div>
              <p className="rule-label">Add a photo — optional</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-3 flex h-40 w-full items-center justify-center rounded-sm border border-dashed border-border-strong bg-surface text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Your selected travel photo"
                    className="h-full w-full rounded-sm object-cover"
                  />
                ) : (
                  "Add a photo of this place"
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPhoto(URL.createObjectURL(file));
                  setPhotoName(file.name);
                }}
              />
              {photoName && (
                <p className="mt-2 flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{photoName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoName(null);
                    }}
                    className="shrink-0 underline underline-offset-4 hover:text-foreground"
                  >
                    Remove
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <p className="rule-label">What would you tell other women?</p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {EXPERIENCE_TAGS.map(({ label }) => {
                  const active = tags.includes(label);
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => toggle(label)}
                        aria-pressed={active}
                        className={`flex w-full items-center gap-4 py-3.5 text-left transition-colors ${
                          active ? "bg-accent/70" : "hover:bg-secondary/60"
                        }`}
                      >
                        <span
                          className={`ml-1 grid h-4 w-4 shrink-0 place-items-center border ${
                            active ? "border-foreground bg-foreground" : "border-border-strong"
                          }`}
                        >
                          {active && (
                            <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 text-background">
                              <path
                                d="M1 5.4 3.6 8 9 2"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                              />
                            </svg>
                          )}
                        </span>
                        <TagMark tag={label} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                Select as many as apply · {tags.length} selected
              </p>
            </div>

            <div>
              <label htmlFor="note" className="rule-label block">
                Anything else you'd like another traveller to know? — optional
              </label>
              <textarea
                id="note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Staff helped me find a shared taxi."
                className="mt-3 w-full resize-none rounded-sm border border-input bg-surface p-3.5 text-[0.95rem] outline-none focus:border-ring"
              />
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <button
                type="submit"
                disabled={!canSubmit}
                className="border border-border-strong bg-primary px-6 py-3.5 text-sm tracking-wide text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Submit experience
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/journey" })}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
