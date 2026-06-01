from __future__ import annotations

import html
import re
from pathlib import Path

from pypdf import PdfReader


BASE_DIR = Path(__file__).resolve().parent.parent
IMPORT_DIR = BASE_DIR / "backend" / "knowledge_imports"
OUTPUT_DIR = BASE_DIR / "backend" / "knowledge" / "states"

STATE_MAP = {
    "GR (guju)": ("Gujarat", "gujarat"),
    "GR (punjab)": ("Punjab", "punjab"),
    "GR (maharastra)": ("Maharashtra", "maharashtra"),
    "farming units": ("Maharashtra", "maharashtra_research_units"),
}


def normalize_text(text: str) -> str:
    text = str(text or "").replace("\xa0", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def pdf_to_text(path: Path) -> str:
    reader = PdfReader(str(path))
    parts = []
    for page in reader.pages:
        try:
            parts.append(page.extract_text() or "")
        except Exception:
            continue
    return normalize_text("\n\n".join(parts))


def text_to_sections(text: str) -> list[str]:
    sections = [part.strip() for part in re.split(r"\n{2,}", text) if part.strip()]
    return sections[:120]


def build_html_page(state_name: str, source_label: str, source_files: list[Path]) -> str:
    sections_markup: list[str] = []
    for source_file in source_files:
        extracted = pdf_to_text(source_file)
        snippets = text_to_sections(extracted)
        snippet_markup = "\n".join(
            f"<p>{html.escape(snippet)}</p>"
            for snippet in snippets
            if len(snippet) > 40
        )
        sections_markup.append(
            f"""
            <section>
                <h2>{html.escape(source_file.name)}</h2>
                <p><strong>State:</strong> {html.escape(state_name)}</p>
                <p><strong>Imported from:</strong> {html.escape(source_label)}</p>
                {snippet_markup or '<p>No readable text could be extracted from this PDF.</p>'}
            </section>
            """
        )

    title = f"{state_name} Knowledge Base"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{html.escape(title)}</title>
    <meta name="state" content="{html.escape(state_name)}">
    <meta name="source_url" content="">
</head>
<body>
    <main>
        <h1>{html.escape(title)}</h1>
        <p>This knowledge page was generated from imported government or agriculture source documents.</p>
        {''.join(sections_markup)}
    </main>
</body>
</html>
"""


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for folder in sorted(IMPORT_DIR.iterdir()):
        if not folder.is_dir():
            continue
        state_name, output_stem = STATE_MAP.get(folder.name, (folder.name, re.sub(r"[^a-z0-9]+", "_", folder.name.lower()).strip("_")))
        pdf_files = sorted(folder.glob("*.pdf"))
        if not pdf_files:
            continue
        page_html = build_html_page(state_name, folder.name, pdf_files)
        output_path = OUTPUT_DIR / f"{output_stem}.html"
        output_path.write_text(page_html, encoding="utf-8")
        print(f"Built {output_path}")


if __name__ == "__main__":
    main()
