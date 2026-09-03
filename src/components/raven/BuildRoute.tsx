import { useState } from "react";
import { usePlaces } from "@/lib/places-store";
import { addRoute } from "@/lib/routes-store";
import { useNavigate } from "@tanstack/react-router";

export function BuildRoute({ initialFrom = "", initialTo = "" }: { initialFrom?: string; initialTo?: string }) {
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [distance, setDistance] = useState("");
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [currentStopInput, setCurrentStopInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const allPlaces = usePlaces();
  const navigate = useNavigate();

  function handleAddStop() {
    const matched = allPlaces.find(p => p.name.toLowerCase() === currentStopInput.trim().toLowerCase());
    if (matched && !selectedStops.includes(matched.id)) {
      setSelectedStops([...selectedStops, matched.id]);
      setCurrentStopInput("");
    }
  }

  function handleRemoveStop(id: string) {
    setSelectedStops(selectedStops.filter(s => s !== id));
  }

  const canSubmit = from.trim().length > 0 && to.trim().length > 0 && selectedStops.length >= 2 && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    try {
      await addRoute({
        from_text: from.trim(),
        to_text: to.trim(),
        distance: distance.trim() || "Unknown distance",
        stop_ids: selectedStops,
      });
      // Force a full reload via standard window.location to ensure fresh state 
      // if router doesn't pick up the navigation to the same route path.
      window.location.href = `/journey?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}`;
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-8 rounded-sm border border-border p-5 shadow-quiet bg-secondary/10">
      <h2 className="font-display text-2xl">Build a new route</h2>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="rule-label block">Origin City</label>
            <input 
              value={from} 
              onChange={e => setFrom(e.target.value)}
              className="mt-2 w-full border-b border-input bg-transparent py-2 text-sm outline-none focus:border-ring"
            />
          </div>
          <div>
            <label className="rule-label block">Destination City</label>
            <input 
              value={to} 
              onChange={e => setTo(e.target.value)}
              className="mt-2 w-full border-b border-input bg-transparent py-2 text-sm outline-none focus:border-ring"
            />
          </div>
        </div>

        <div>
          <label className="rule-label block">Approximate Distance</label>
          <input 
            value={distance} 
            onChange={e => setDistance(e.target.value)}
            placeholder="e.g. 150 km"
            className="mt-2 w-full border-b border-input bg-transparent py-2 text-sm outline-none focus:border-ring"
          />
        </div>

        <div className="border-t border-border pt-5">
          <label className="rule-label block">Stops Builder</label>
          <p className="mt-1 text-xs text-muted-foreground">Select at least 2 places to form the route timeline.</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedStops.map((stopId, index) => {
              const place = allPlaces.find(p => p.id === stopId);
              if (!place) return null;
              return (
                <div key={stopId} className="flex items-center gap-2 rounded-sm border border-border-strong bg-background px-3 py-1.5 text-sm">
                  <span className="text-muted-foreground text-xs">{index + 1}.</span>
                  <span>{place.name}</span>
                  <button type="button" onClick={() => handleRemoveStop(stopId)} className="ml-1 text-muted-foreground hover:text-foreground">
                    &times;
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <input 
              list="raven-places-build"
              value={currentStopInput} 
              onChange={e => setCurrentStopInput(e.target.value)}
              placeholder="Search places..."
              className="w-full border-b border-input bg-transparent py-2 text-sm outline-none focus:border-ring"
            />
            <datalist id="raven-places-build">
              {allPlaces.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
            <button 
              type="button" 
              onClick={handleAddStop}
              className="rounded-sm border border-border-strong px-4 py-2 text-sm transition-colors hover:bg-accent"
            >
              Add stop
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            type="submit"
            disabled={!canSubmit}
            className="rounded-sm bg-foreground px-6 py-2.5 text-sm text-background disabled:opacity-50 transition-opacity"
          >
            Create Journey
          </button>
        </div>
      </form>
    </div>
  );
}
