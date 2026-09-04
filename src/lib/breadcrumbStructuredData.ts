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

export function createBreadcrumbList(
  items: BreadcrumbItemInput[],
): BreadcrumbListStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.path),
    })),
  };
}

export function createHomeBreadcrumbList(): BreadcrumbListStructuredData {
  return createBreadcrumbList([{ name: HOME_LABEL, path: "/" }]);
}

export function createPageBreadcrumbList({
  name,
  path,
}: BreadcrumbItemInput): BreadcrumbListStructuredData {
  return createBreadcrumbList([
    { name: HOME_LABEL, path: "/" },
    { name, path },
  ]);
}
