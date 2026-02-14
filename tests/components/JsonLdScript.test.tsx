import { render } from '@testing-library/react';
import JsonLdScript from '@/components/JsonLdScript';

describe('JsonLdScript', () => {
  it('renders JSON-LD script with escaped characters', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '</script><script>alert(1)</script>',
        },
      ],
    };

    render(<JsonLdScript data={data} />);
    const script = document.querySelector('script[type="application/ld+json"]');

    expect(script).toBeInTheDocument();
    expect(script?.textContent).toContain('\\u003c/script>');
    expect(script?.textContent).not.toContain('</script>');
    expect(script?.textContent ? JSON.parse(script.textContent) : null).toEqual(data);
  });
});
