// src/types/journal.ts

export type BlockType = 'text' | 'image' | 'button' | 'quote';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // HTML content from rich text editor
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  caption?: string;
}

export interface ButtonBlock extends BaseBlock {
  type: 'button';
  label: string;
  url: string;
  style: 'primary' | 'outline';
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  author?: string;
}

export type JournalBlock = TextBlock | ImageBlock | ButtonBlock | QuoteBlock;

export interface JournalPost {
  id: string;
  title: string;
  cover_image_url: string;
  excerpt: string;
  tags: string[];
  blocks: JournalBlock[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
