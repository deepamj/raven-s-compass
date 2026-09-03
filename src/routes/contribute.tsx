import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/raven/SiteHeader";
import { TagMark } from "@/components/raven/TagMark";
import { EXPERIENCE_TAGS } from "@/lib/raven-data";
import { usePlaces, addPlace } from "@/lib/places-store";
import { addExperience } from "@/lib/experience-store";
import { PlacePickerMap } from "@/components/raven/PlacePickerMap";
import { supabase } from "@/lib/supabase";

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
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<{ placeId: string | null; name: string } | null>(null);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const places = usePlaces();

  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newPlaceArea, setNewPlaceArea] = useState("");
  const [newPlaceCoord, setNewPlaceCoord] = useState<{lat: number, lng: number} | null>(null);
  const [newPlaceError, setNewPlaceError] = useState<string | null>(null);

  const toggle = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const matched = places.find((p) => p.name.toLowerCase() === placeName.trim().toLowerCase());
  const canSubmit = placeName.trim().length > 1 && tags.length > 0;
  const isUnmatched = placeName.trim().length >= 2 && !matched;

  async function handleSaveNewPlace() {
    if (!newPlaceArea.trim() || !newPlaceCoord) return;
    setNewPlaceError(null);
    try {
      await addPlace({
        name: placeName.trim(),
        area: newPlaceArea.trim(),
        lat: newPlaceCoord.lat,
        lng: newPlaceCoord.lng
      });
      setIsAddingPlace(false);
      setNewPlaceArea("");
      setNewPlaceCoord(null);
      setPlaceError(null);
    } catch (err) {
      setNewPlaceError("Failed to save place.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setPlaceError(null);
    setSubmitError(null);

    if (!matched) {
      setPlaceError("Please select a place Raven already knows");
      return;
    }

    const display = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    
    try {
      // Upload each photo to Supabase Storage and collect public URLs
      const imageUrls: string[] = [];
      for (const file of photos) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("experience-photos")
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("experience-photos")
          .getPublicUrl(path);
        imageUrls.push(urlData.publicUrl);
      }

      await addExperience({
        placeId: matched.id,
        date: display,
        iso: date,
        tags,
        ...(note.trim() ? { text: note.trim() } : {}),
        traveller: "Solo traveller",
        ...(imageUrls.length ? { images: imageUrls } : {}),
      });
      setSubmitted({ placeId: matched.id, name: placeName.trim() });
    } catch (err) {
      setSubmitError("Something went wrong saving your experience — try again");
    }
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
                <p className="text-foreground">{photos.length > 0 ? `${photos.length} photo${photos.length > 1 ? "s" : ""} attached` : "No photo attached"}</p>
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
                {placeError ? (
                  <span className="text-foreground">{placeError}</span>
                ) : matched ? (
                  `Matched a place Raven already knows: ${matched.area}`
                ) : (
                  "Example: Munnar Bus Stand"
                )}
              </p>

              {isUnmatched && (
                <div className="mt-4">
                  {!isAddingPlace ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingPlace(true)}
                      className="text-sm text-foreground underline underline-offset-4"
                    >
                      This place isn't on Raven yet — add it?
                    </button>
                  ) : (
                    <div className="rounded-sm border border-border p-5 shadow-quiet bg-secondary/10">
                      <p className="font-display text-lg">Add {placeName.trim()}</p>
                      <div className="mt-4">
                        <label className="rule-label block">Area / City</label>
                        <input
                          value={newPlaceArea}
                          onChange={(e) => setNewPlaceArea(e.target.value)}
                          placeholder="e.g. Munnar"
                          className="mt-2 w-full border-b border-input bg-transparent py-2 outline-none focus:border-ring text-sm"
                        />
                      </div>
                      <div className="mt-6">
                        <p className="rule-label mb-3">Pin the exact location</p>
                        <PlacePickerMap onPick={(lat, lng) => setNewPlaceCoord({ lat, lng })} />
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="text-xs text-caution">{newPlaceError}</span>
                        <button
                          type="button"
                          onClick={handleSaveNewPlace}
                          disabled={!newPlaceArea.trim() || !newPlaceCoord}
                          className="rounded-sm bg-foreground px-5 py-2 text-sm text-background disabled:opacity-50 transition-opacity"
                        >
                          Save place
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="when" className="rule-label block">
                When?
              </label>
              <input
                id="when"
                type="date"
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="mt-3 w-full border-b border-input bg-transparent py-2.5 text-lg outline-none focus:border-ring"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Recency matters more than anything else here.
              </p>
            </div>

            <div>
              <p className="rule-label">Add photos — optional</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-3 flex min-h-[10rem] w-full items-center justify-center rounded-sm border border-dashed border-border-strong bg-surface text-sm text-muted-foreground transition-colors hover:bg-accent"
              >
                {photoPreviews.length > 0 ? (
                  <div className="flex w-full flex-wrap gap-2 p-2">
                    {photoPreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Selected photo ${i + 1}`}
                        className="h-24 w-28 rounded-sm object-cover"
                      />
                    ))}
                    <span className="flex h-24 w-28 items-center justify-center rounded-sm border border-dashed border-border text-xs text-muted-foreground">
                      + Add more
                    </span>
                  </div>
                ) : (
                  "Add photos of this place"
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  if (!files.length) return;
                  setPhotos((prev) => [...prev, ...files]);
                  setPhotoPreviews((prev) => [
                    ...prev,
                    ...files.map((f) => URL.createObjectURL(f)),
                  ]);
                  // Reset so the same file can be re-added after clearing
                  e.target.value = "";
                }}
              />
              {photos.length > 0 && (
                <p className="mt-2 flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                  <span>{photos.length} photo{photos.length > 1 ? "s" : ""} selected</span>
                  <button
                    type="button"
                    onClick={() => { setPhotos([]); setPhotoPreviews([]); }}
                    className="shrink-0 underline underline-offset-4 hover:text-foreground"
                  >
                    Remove all
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
              {submitError && (
                <p className="text-sm text-foreground">{submitError}</p>
              )}
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
