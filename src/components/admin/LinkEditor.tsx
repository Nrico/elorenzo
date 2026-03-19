export interface LinkEntry {
  label: string;
  url: string;
}

interface LinkEditorProps {
  value: LinkEntry[];
  onChange: (links: LinkEntry[]) => void;
}

const EMPTY: LinkEntry = { label: '', url: '' };

export default function LinkEditor({ value, onChange }: LinkEditorProps) {
  const add = () => onChange([...value, { ...EMPTY }]);

  const update = (index: number, field: keyof LinkEntry, val: string) => {
    const updated = value.map((l, i) => i === index ? { ...l, [field]: val } : l);
    onChange(updated);
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Resource Links
        </label>
        <button
          type="button"
          onClick={add}
          className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all"
        >
          + Add Link
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-[11px] text-slate-400 italic">No links yet.</p>
      )}

      {value.map((link, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
          <input
            type="text"
            value={link.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            placeholder="Link label"
            className="border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors"
          />
          <input
            type="url"
            value={link.url}
            onChange={(e) => update(i, 'url', e.target.value)}
            placeholder="https://…"
            className="border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-2 py-2 text-slate-400 hover:text-red-500 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
