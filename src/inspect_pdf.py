"""
Maxillofacial Treatment Outcome Evaluator - PDF Inspection & Diagnostic Utility
Inspects reference textbook PDFs in references/originals/books/ using PyMuPDF (fitz).
Checks file integrity, metadata, page counts, and samples pages across the beginning,
middle, and end of each PDF to assess selectable text and flag damaged/scanned files.
Outputs results to console and preserves/appends to reports/source_inspection.md.
"""

import os
import sys
import json
from datetime import datetime
from typing import Dict, Any, List

# Ensure VC++ runtime DLLs from Edge-WebView can be located on Windows if needed
for candidate_dir in [
    r"C:\Windows\System32\Microsoft-Edge-WebView",
]:
    if os.path.isdir(candidate_dir):
        try:
            os.add_dll_directory(candidate_dir)
        except Exception:
            pass

import pymupdf


def inspect_pdf(pdf_path: str) -> Dict[str, Any]:
    """Inspects a single PDF file and returns metadata and text selectability info."""
    if not os.path.isfile(pdf_path):
        return {
            "file_name": os.path.basename(pdf_path),
            "file_path": pdf_path,
            "error": "File not found"
        }

    file_size_bytes = os.path.getsize(pdf_path)
    result = {
        "file_name": os.path.basename(pdf_path),
        "file_path": pdf_path,
        "file_size_bytes": file_size_bytes,
        "file_size_mb": round(file_size_bytes / (1024 * 1024), 2),
        "is_damaged_or_incomplete": False,
        "page_count": 0,
        "metadata": {},
        "has_selectable_text": False,
        "ocr_needed": False,
        "status_flag": "OK",
        "sample_pages": []
    }

    try:
        doc = pymupdf.open(pdf_path)
    except Exception as e:
        result["is_damaged_or_incomplete"] = True
        result["status_flag"] = "DAMAGED_OR_CORRUPT"
        result["error"] = f"Failed to open PDF: {str(e)}"
        return result

    result["page_count"] = len(doc)
    result["metadata"] = {k: v for k, v in doc.metadata.items() if v}

    if len(doc) == 0:
        result["is_damaged_or_incomplete"] = True
        result["status_flag"] = "INCOMPLETE_OR_TRUNCATED"
        result["error"] = "PDF document opened with 0 pages (file appears truncated, damaged, or download was interrupted)."
        result["ocr_needed"] = "UNKNOWN (0 pages available)"
        return result

    total_pages = len(doc)

    # Sample pages across beginning, middle, and end
    # Beginning: first few pages
    # Middle: quarter and halfway points
    # End: near the last pages
    candidates = [
        0, 1, min(5, total_pages - 1),
        total_pages // 4,
        total_pages // 2,
        (3 * total_pages) // 4,
        max(0, total_pages - 10),
        max(0, total_pages - 2),
        total_pages - 1
    ]
    # Unique, sorted indices
    sample_indices = sorted(list(set(candidates)))

    text_pages_count = 0
    total_chars_in_samples = 0

    for idx in sample_indices:
        try:
            page = doc[idx]
            text = page.get_text().strip()
            char_len = len(text)
            total_chars_in_samples += char_len
            # Determine region label
            if idx < total_pages * 0.15:
                region = "Beginning"
            elif idx > total_pages * 0.85:
                region = "End"
            else:
                region = "Middle"

            preview = " ".join(text[:100].split()) if text else "[NO SELECTABLE TEXT]"
            result["sample_pages"].append({
                "region": region,
                "pdf_page_index": idx,
                "char_count": char_len,
                "preview": preview
            })
            if char_len > 40:
                text_pages_count += 1
        except Exception as pe:
            result["sample_pages"].append({
                "region": "Unknown",
                "pdf_page_index": idx,
                "char_count": 0,
                "preview": f"[ERROR READING PAGE: {pe}]"
            })
            result["is_damaged_or_incomplete"] = True

    # Assess selectable text status
    if text_pages_count >= max(1, len(sample_indices) // 3):
        result["has_selectable_text"] = True
        result["ocr_needed"] = False
        result["status_flag"] = "READY_FOR_EXTRACTION"
    elif total_chars_in_samples == 0:
        result["has_selectable_text"] = False
        result["ocr_needed"] = True
        result["status_flag"] = "SCANNED_OCR_REQUIRED"
    else:
        result["has_selectable_text"] = False
        result["ocr_needed"] = True
        result["status_flag"] = "PARTIAL_TEXT_POSSIBLY_SCANNED"

    return result


def generate_markdown_report(results: List[Dict[str, Any]], checked_dir: str) -> str:
    """Formats inspection results into a structured Markdown document."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines = []
    lines.append(f"## Source Textbook Inspection Report ({timestamp})")
    lines.append(f"**Target Directory:** `{checked_dir}`\n")

    if not results:
        lines.append(f"No PDF files found directly inside `{checked_dir}`.\n")
        return "\n".join(lines)

    lines.append("| Filename | File Size (MB) | Page Count | Selectable Text | OCR Needed | Status Flag |")
    lines.append("| :--- | :---: | :---: | :---: | :---: | :---: |")
    for r in results:
        fname = r.get("file_name", "")
        fsize = r.get("file_size_mb", 0)
        pcount = r.get("page_count", 0)
        sel_txt = "**YES**" if r.get("has_selectable_text") else "NO"
        ocr_need = "YES" if r.get("ocr_needed") is True else ("NO" if r.get("ocr_needed") is False else str(r.get("ocr_needed")))
        flag = r.get("status_flag", "")
        lines.append(f"| `{fname}` | {fsize} MB | {pcount} | {sel_txt} | {ocr_need} | `{flag}` |")

    lines.append("\n### Detailed Inspections & Page Sampling\n")

    for r in results:
        lines.append(f"#### `{r.get('file_name')}`")
        lines.append(f"- **File Path:** `{r.get('file_path')}`")
        lines.append(f"- **Size:** {r.get('file_size_bytes')} bytes ({r.get('file_size_mb')} MB)")
        lines.append(f"- **Total PDF Pages:** {r.get('page_count')}")
        lines.append(f"- **Status Flag:** `{r.get('status_flag')}`")
        if r.get("error"):
            lines.append(f"- **Error / Warning:** {r.get('error')}")

        meta = r.get("metadata", {})
        if meta:
            lines.append("- **Metadata:**")
            for k, v in meta.items():
                lines.append(f"  - `{k}`: {v}")
        else:
            lines.append("- **Metadata:** [None reported]")

        lines.append("\n**Page Sampling Across Document:**")
        lines.append("| Region | PDF Page Index | Characters Extracted | Sample Snippet |")
        lines.append("| :--- | :---: | :---: | :--- |")
        for s in r.get("sample_pages", []):
            snippet = s.get("preview", "").replace("|", "\\|")
            lines.append(f"| {s.get('region')} | {s.get('pdf_page_index')} | {s.get('char_count')} | \"{snippet}\" |")
        lines.append("\n---\n")

    return "\n".join(lines)


if __name__ == "__main__":
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    books_dir = os.path.join(project_root, "references", "originals", "books")

    print(f"Checking directory: {books_dir}")

    if not os.path.isdir(books_dir):
        print(f"Error: Target directory does not exist: {books_dir}")
        sys.exit(1)

    # Inspect only PDF files directly inside references/originals/books/
    pdf_files = [
        os.path.join(books_dir, f)
        for f in os.listdir(books_dir)
        if os.path.isfile(os.path.join(books_dir, f)) and f.lower().endswith(".pdf")
    ]

    if not pdf_files:
        print(f"No PDF files found directly inside: {books_dir}")
        sys.exit(0)

    print(f"Found {len(pdf_files)} PDF file(s) to inspect.\n")

    results = []
    for pdf_path in pdf_files:
        res = inspect_pdf(pdf_path)
        results.append(res)
        print("=" * 75)
        print(f"File: {res.get('file_name')}")
        print(f"Size: {res.get('file_size_mb')} MB ({res.get('file_size_bytes')} bytes)")
        print(f"Total Pages: {res.get('page_count')}")
        print(f"Metadata: {json.dumps(res.get('metadata'), indent=2)}")
        print(f"Selectable Text: {res.get('has_selectable_text')}")
        print(f"OCR Needed: {res.get('ocr_needed')}")
        print(f"Status Flag: {res.get('status_flag')}")
        if res.get("error"):
            print(f"Error: {res.get('error')}")
        print("Sample Pages (Beginning / Middle / End):")
        for s in res.get("sample_pages", []):
            safe_preview = s.get("preview", "").encode("ascii", errors="replace").decode("ascii")
            print(f"  [{s.get('region')} - Page idx {s.get('pdf_page_index')}] {s.get('char_count')} chars | \"{safe_preview}\"")

    # Save to reports/source_inspection.md preserving previous report if present
    reports_dir = os.path.join(project_root, "reports")
    os.makedirs(reports_dir, exist_ok=True)
    report_file = os.path.join(reports_dir, "source_inspection.md")

    new_report_section = generate_markdown_report(results, books_dir)

    existing_content = ""
    if os.path.isfile(report_file):
        with open(report_file, "r", encoding="utf-8") as f:
            existing_content = f.read()

    with open(report_file, "w", encoding="utf-8") as f:
        if existing_content.strip():
            f.write(existing_content.strip() + "\n\n" + ("=" * 40) + "\n\n" + new_report_section + "\n")
        else:
            f.write("# Source Inspection Log\n\n" + new_report_section + "\n")

    print("\n" + "=" * 75)
    print(f"Inspection report successfully saved to: {report_file}")
