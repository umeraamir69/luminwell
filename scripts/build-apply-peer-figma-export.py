#!/usr/bin/env python3
"""Build apply-peer-supporter-figma-export.html (all steps + thanks, CSS inlined)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "apply-peer-supporter-figma-export.html"

CSS_FILES = [
    "onboarding.css",
    "apply-peer-supporter-vars.css",
    "amb-add-wizard.css",
    "landing-chrome.css",
    "apply-peer-polish.css",
    "apply-peer-figma-export-extra.css",
]

HTML_FILES = [
    ("Step 1 — Personal", "apply-peer-supporter-1.html"),
    ("Step 2 — Background", "apply-peer-supporter-2.html"),
    ("Step 3 — Skills", "apply-peer-supporter-3.html"),
    ("Step 4 — Availability", "apply-peer-supporter-4.html"),
    ("Step 5 — Review", "apply-peer-supporter-5.html"),
    ("Thank you", "apply-peer-supporter-thanks.html"),
]

NAV_FOOTER_RE = re.compile(
    r"(<nav\s+class=\"nav\s+lw-nav\".*?</footer>\s*)",
    re.DOTALL | re.IGNORECASE,
)

ID_ATTR_RE = re.compile(r'\b(id|for|name)="([^"]+)"')


def extract_shell(html: str) -> str:
    m = NAV_FOOTER_RE.search(html)
    if not m:
        raise ValueError("Could not find nav…footer block")
    return m.group(1).strip() + "\n"


def uniquify(markup: str, prefix: str) -> str:
    def sub(m: re.Match[str]) -> str:
        attr, val = m.group(1), m.group(2)
        if val.startswith(prefix):
            return m.group(0)
        return f'{attr}="{prefix}{val}"'

    return ID_ATTR_RE.sub(sub, markup)


def main() -> None:
    css_parts = []
    for name in CSS_FILES:
        p = ROOT / name
        css_parts.append(f"/* === {name} === */\n{p.read_text(encoding='utf-8')}")
    combined_css = "\n\n".join(css_parts)

    sections_html: list[str] = []
    for label, filename in HTML_FILES:
        raw = (ROOT / filename).read_text(encoding="utf-8")
        block = extract_shell(raw)
        prefix = f"f{len(sections_html)}-"
        block = uniquify(block, prefix)
        sections_html.append(
            f'  <section class="figma-apply-screen" aria-label="{label}">\n'
            f'    <div class="figma-screen-label">{label}</div>\n{block}\n  </section>'
        )

    body_inner = "\n\n".join(sections_html)

    doc = f"""<!DOCTYPE html>
<html lang="en">
<!-- Regenerate: python3 scripts/build-apply-peer-figma-export.py  |  Open from repo root so logo.png loads. -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Apply as peer supporter — Figma export (all screens)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />
  <style>
{combined_css}
  </style>
</head>
<body class="apply-peer-page apply-peer-figma-bundle lw-public-shell">
<!--
  html.to.figma: six screens stacked top to bottom. Blue-gray bars = screen breaks.
  Designer labels: .figma-screen-label (remove in production if you reuse this pattern).
-->

{body_inner}

</body>
</html>
"""
    OUT.write_text(doc, encoding="utf-8")
    print(f"Wrote {OUT} ({len(doc):,} bytes)")


if __name__ == "__main__":
    main()
