import { getSiteUrl } from '@/config/site';

const HOME_LABEL = "ねこツールズ";

type BreadcrumbItemInput = {
  name: string;
  path: string;
};

type BreadcrumbListStructuredData = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

function toAbsoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

export function createHomeBreadcrumbList(): BreadcrumbListStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: HOME_LABEL,
        item: toAbsoluteUrl("/"),
      },
    ],
  };
}

export function createPageBreadcrumbList({
  name,
  path,
}: BreadcrumbItemInput): BreadcrumbListStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: HOME_LABEL,
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        item: toAbsoluteUrl(path),
      },
    ],
  };
}
