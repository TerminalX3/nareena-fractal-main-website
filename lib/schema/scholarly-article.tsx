import type { Paper } from "@/lib/papers";
import { getSiteUrl } from "@/lib/site";

export function ScholarlyArticleJsonLd({
  paper,
  slug,
}: {
  paper: Paper;
  slug: string;
}) {
  const base = getSiteUrl();
  const url = `${base}/research/${slug}`;
  const doiUrl =
    paper.doi && /^10\.\S+\/\S+$/.test(paper.doi)
      ? `https://doi.org/${paper.doi}`
      : undefined;
  const sameAs = [paper.url, doiUrl].filter(Boolean) as string[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    name: paper.title,
    abstract: paper.abstract,
    author: paper.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    datePublished: `${paper.year}-01-01`,
    isPartOf: {
      "@type": "Periodical",
      name: paper.journal,
    },
    publisher: {
      "@type": "Organization",
      name: "Nareena Fractal",
      url: base,
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(doiUrl
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "DOI",
            value: paper.doi as string,
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(paper.pdf ? { associatedMedia: [{ "@type": "MediaObject", contentUrl: paper.pdf }] } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
