type JsonLdData = Record<string, unknown> | Array<Record<string, unknown>>;

type JsonLdScriptProps = {
  data: JsonLdData;
};

function stringifyJsonLd(data: JsonLdData) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: stringifyJsonLd(data) }}
    />
  );
}
