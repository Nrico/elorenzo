import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TOOLS = [
  { cmd: 'bold',          icon: 'B',       title: 'Bold',       class: 'font-black' },
  { cmd: 'italic',        icon: 'I',       title: 'Italic',     class: 'italic' },
  { cmd: 'underline',     icon: 'U',       title: 'Underline',  class: 'underline' },
  { cmd: 'formatBlock',   icon: 'H2',      title: 'Heading 2',  value: 'h2' },
  { cmd: 'formatBlock',   icon: 'H3',      title: 'Heading 3',  value: 'h3' },
  { cmd: 'formatBlock',   icon: 'P',       title: 'Paragraph',  value: 'p' },
  { cmd: 'insertUnorderedList', icon: '≡',  title: 'Bullet list' },
  { cmd: 'insertOrderedList',   icon: '1.', title: 'Numbered list' },
  { cmd: 'indent',        icon: '→',       title: 'Indent' },
  { cmd: 'outdent',       icon: '←',       title: 'Outdent' },
  { cmd: 'removeFormat',  icon: '✕',       title: 'Clear format' },
] as const;

export default function RichTextEditor({ value, onChange, placeholder, minHeight = '300px' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, [value]);

  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  };

  return (
    <div className="border border-slate-200 rounded-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-slate-50 border-b border-slate-200">
        {TOOLS.map((tool) => (
          <button
            key={tool.icon}
            type="button"
            title={tool.title}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(tool.cmd, (tool as any).value);
            }}
            className={`px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-black hover:text-white rounded-sm transition-colors ${(tool as any).class || ''}`}
          >
            {tool.icon}
          </button>
        ))}
        <button
          type="button"
          title="Add link"
          onMouseDown={(e) => { e.preventDefault(); handleLink(); }}
          className="px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-black hover:text-white rounded-sm transition-colors"
        >
          🔗
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (editorRef.current) onChange(editorRef.current.innerHTML); }}
        data-placeholder={placeholder}
        className="
          w-full p-4 text-sm leading-relaxed text-slate-700 outline-none
          [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-slate-400
          prose prose-sm max-w-none
        "
        style={{ minHeight }}
      />
    </div>
  );
}
