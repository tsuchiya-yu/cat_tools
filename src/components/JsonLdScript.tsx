type JsonLdData = Record<string, unknown> | Array<Record<string, unknown>>;

type JsonLdScriptProps = {
  data: JsonLdData;
};

export default function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
