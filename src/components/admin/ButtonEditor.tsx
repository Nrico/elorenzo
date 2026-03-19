export interface ButtonEntry {
  label: string;
  url: string;
  style: 'primary' | 'outline';
}

interface ButtonEditorProps {
  value: ButtonEntry[];
  onChange: (buttons: ButtonEntry[]) => void;
}

const EMPTY: ButtonEntry = { label: '', url: '', style: 'primary' };

export default function ButtonEditor({ value, onChange }: ButtonEditorProps) {
  const add = () => onChange([...value, { ...EMPTY }]);

  const update = (index: number, field: keyof ButtonEntry, val: string) => {
    const updated = value.map((b, i) => i === index ? { ...b, [field]: val } : b);
    onChange(updated);
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Buttons / CTAs
        </label>
        <button
          type="button"
          onClick={add}
          className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all"
        >
          + Add Button
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-[11px] text-slate-400 italic">No buttons yet.</p>
      )}

      {value.map((btn, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
          <input
            type="text"
            value={btn.label}
            onChange={(e) => update(i, 'label', e.target.value)}
            placeholder="Label"
            className="border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors"
          />
          <input
            type="url"
            value={btn.url}
            onChange={(e) => update(i, 'url', e.target.value)}
            placeholder="https://…"
            className="border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:border-black transition-colors"
          />
          <select
            value={btn.style}
            onChange={(e) => update(i, 'style', e.target.value as 'primary' | 'outline')}
            className="border border-slate-200 px-2 py-2 text-[10px] font-bold uppercase focus:outline-none focus:border-black transition-colors"
          >
            <option value="primary">Primary</option>
            <option value="outline">Outline</option>
          </select>
          <button
            type="button"
            onClick={() => remove(i)}
            className="px-2 py-2 text-slate-400 hover:text-red-500 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Preview */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
          {value.map((btn, i) => (
            btn.label && (
              <div key={i} className={`text-[10px] font-bold uppercase tracking-widest px-6 py-3 transition-all pointer-events-none ${
                btn.style === 'primary'
                  ? 'bg-black text-white'
                  : 'border-2 border-black text-black'
              }`}>
                {btn.label}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
