import fs from "fs";
import path from "path";
import yaml from "yaml";

export type Paper = {
  slug: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract?: string;
  url?: string;
  doi?: string;
  pdf?: string;
  topic?: string;
  foundational?: boolean;
};

export function loadPapers(): Paper[] {
  const fp = path.join(process.cwd(), "data", "papers.yml");
  const raw = fs.readFileSync(fp, "utf8");
  const parsed = yaml.parse(raw) as { papers: Paper[] };
  return parsed.papers ?? [];
}

export function getPaperBySlug(slug: string): Paper | undefined {
  return loadPapers().find((p) => p.slug === slug);
}
