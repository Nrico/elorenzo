import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Trash2, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import type { JournalBlock, TextBlock, ImageBlock, ButtonBlock, QuoteBlock } from '../../types/journal';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

interface BlockEditorProps {
  blocks: JournalBlock[];
  onChange: (blocks: JournalBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const addBlock = (type: JournalBlock['type']) => {
    let newBlock: JournalBlock;
    const base = { id: nanoid(6), type };
    
    switch (type) {
      case 'text':
        newBlock = { ...base, type: 'text', content: '' } as TextBlock;
        break;
      case 'image':
        newBlock = { ...base, type: 'image', url: '', caption: '' } as ImageBlock;
        break;
      case 'button':
        newBlock = { ...base, type: 'button', label: 'Click Here', url: '', style: 'primary' } as ButtonBlock;
        break;
      case 'quote':
        newBlock = { ...base, type: 'quote', text: '', author: '' } as QuoteBlock;
        break;
    }
    
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<JournalBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates } as JournalBlock;
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => (
        <div key={block.id} className="relative border-l-4 border-slate-200 pl-6 group">
          
          {/* Block Controls */}
          <div className="absolute -left-12 top-0 bottom-0 w-8 flex flex-col justify-start opacity-0 group-hover:opacity-100 transition-opacity gap-2 py-2">
            <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">
              <ArrowUp size={16} />
            </button>
            <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">
              <ArrowDown size={16} />
            </button>
            <button onClick={() => removeBlock(index)} className="p-1 text-red-500 hover:bg-red-50 rounded mt-auto">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1">
              {block.type} Block
            </span>
          </div>

          {/* Block Content Editors */}
          {block.type === 'text' && (
            <RichTextEditor
              value={block.content}
              onChange={(val) => updateBlock(index, { content: val })}
            />
          )}

          {block.type === 'image' && (
            <div className="space-y-4">
              <ImageUploader
                label="Block Image"
                value={block.url}
                onChange={(url) => updateBlock(index, { url })}
              />
              <input
                type="text"
                placeholder="Image Caption (Optional)"
                value={block.caption || ''}
                onChange={(e) => updateBlock(index, { caption: e.target.value })}
                className="w-full bg-transparent border-b border-black text-sm p-2 outline-none"
              />
            </div>
          )}

          {block.type === 'button' && (
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Button Label"
                value={block.label}
                onChange={(e) => updateBlock(index, { label: e.target.value })}
                className="bg-slate-50 border-none p-4 text-sm outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="text"
                placeholder="URL (e.g., https://...)"
                value={block.url}
                onChange={(e) => updateBlock(index, { url: e.target.value })}
                className="bg-slate-50 border-none p-4 text-sm outline-none focus:ring-1 focus:ring-black"
              />
              <select
                value={block.style}
                onChange={(e) => updateBlock(index, { style: e.target.value as 'primary' | 'outline' })}
                className="bg-slate-50 border-none p-4 text-sm outline-none focus:ring-1 focus:ring-black"
              >
                <option value="primary">Primary (Solid)</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          )}

          {block.type === 'quote' && (
            <div className="space-y-4">
              <textarea
                placeholder="Quote Text"
                value={block.text}
                onChange={(e) => updateBlock(index, { text: e.target.value })}
                className="w-full bg-slate-50 border-none p-4 text-lg font-serif italic outline-none focus:ring-1 focus:ring-black resize-none min-h-[100px]"
              />
              <input
                type="text"
                placeholder="Author (Optional)"
                value={block.author || ''}
                onChange={(e) => updateBlock(index, { author: e.target.value })}
                className="w-full bg-transparent border-b border-black text-sm p-2 outline-none"
              />
            </div>
          )}
        </div>
      ))}

      {/* Add Block Menu */}
      <div className="border-t-2 border-dashed border-slate-200 pt-8 mt-12 pb-12">
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mr-4">Add Block:</span>
          <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase tracking-widest transition-colors"><Plus size={14} /> Text</button>
          <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase tracking-widest transition-colors"><Plus size={14} /> Image</button>
          <button onClick={() => addBlock('button')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase tracking-widest transition-colors"><Plus size={14} /> Button</button>
          <button onClick={() => addBlock('quote')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold uppercase tracking-widest transition-colors"><Plus size={14} /> Quote</button>
        </div>
      </div>
    </div>
  );
}
