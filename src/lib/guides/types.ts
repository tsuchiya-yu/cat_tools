import type { Tool } from '@/types/tool';

export type GuideCategory = 'food' | 'nutrition' | 'life-stage' | 'food-safety';

export type GuideReference = {
  label: string;
  url: string;
};

export type GuideAuthor = {
  name: string;
  url: string;
};

export type GuideMetadata = {
  title: string;
  description: string;
  category: GuideCategory;
  publishedAt: string;
  updatedAt: string;
  author: string;
  relatedTools: string[];
  relatedGuides: string[];
  references: GuideReference[];
  draft: boolean;
};

export type Guide = {
  slug: string;
  filePath: string;
  metadata: GuideMetadata;
  content: string;
};

export type GuideTool = Tool;
