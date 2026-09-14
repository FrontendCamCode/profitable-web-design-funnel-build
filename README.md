# Funnel Page Templates

A clone-and-edit library of five high-fidelity funnel page templates captured from the approved reference flow. Each page is independent and can be copied into a new campaign without using a page builder or a custom funnel-builder application.

## Templates

| Template | Source file | Hosted preview route |
| --- | --- | --- |
| Sales page | `page-templates/sales/index.html` | `/sales` |
| Checkout | `page-templates/checkout/index.html` | `/checkout` |
| One-time offer 1 | `page-templates/oto/index.html` | `/oto` |
| One-time offer 2 | `page-templates/oto2/index.html` | `/oto2` |
| Thank-you page | `page-templates/thank-you/index.html` | `/thank-you` |

## Start a new funnel

Clone the repository and copy the five template folders into a campaign directory:

```bash
git clone <private-repository-url> my-new-funnel
cd my-new-funnel
```

Edit the HTML files directly. Search for placeholder copy such as `[INSERT PRODUCT NAME]`, `support@yoursite.com`, price values, and the existing external image URLs.

## Local preview

```bash
pnpm install
pnpm dev
```

The Manus preview wrapper exposes all five pages at the routes in the table above.

## Production work required

These templates are visual mirrors only. Their source scripts and live form actions were deliberately removed. Before production use, connect:

1. Sales-page CTA URLs.
2. Checkout form fields and payment processing.
3. OTO accept and decline actions.
4. OTO 2 accept and decline actions.
5. Thank-you delivery, member-area, and booking links.
6. Analytics, advertising pixels, consent controls, terms, and privacy links.

## Ownership and external assets

The templates currently reference externally hosted images and font files to preserve visual fidelity. Replace them with assets you own or are authorised to reuse before production. For reliable long-term use, download authorised assets into controlled storage and update every source URL.

## GitHub recommendation

Keep the repository private while the templates still contain reference copy and external assets. Once cleaned and documented, enable GitHub's **Template repository** option so every new funnel can be created from the same starting point.
