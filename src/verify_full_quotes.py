import os
import json
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

for p in [r"C:\Windows\System32\Microsoft-Edge-WebView"]:
    if os.path.isdir(p):
        try:
            os.add_dll_directory(p)
        except Exception:
            pass

import pymupdf

pdf_fonseca = r"references/originals/books/Raymond Fonseca, H. Dexter Barber, Michael Powers, David E. Fros - Oral and Maxillofacial Trauma (2013, Saunders) - libgen.li.pdf"
pdf_atlas = r"references/originals/books/Michael Perry, Simon Holmes (eds.) - Atlas of Operative Maxillofacial Trauma Surgery_ Primary Repair of Facial Injuries (2014, Springer) [10.1007_978-1-4471-2855-7] - libgen.li.pdf"

doc_f = pymupdf.open(pdf_fonseca)
doc_a = pymupdf.open(pdf_atlas)

with open("data/extracted/chapter_12_evidence.json", "r", encoding="utf-8") as f:
    ch12 = json.load(f)

with open("data/extracted/atlas_chapter_20_evidence.json", "r", encoding="utf-8") as f:
    atlas = json.load(f)

def clean(s):
    # normalize ligatures
    s = s.replace('\ufb01', 'fi').replace('\ufb02', 'fl').replace('\ufb00', 'ff')
    s = s.replace('\ufb03', 'ffi').replace('\ufb04', 'ffl')
    # strip non-alphanumeric
    return re.sub(r'[^a-zA-Z0-9]', '', s).lower()

print("=== CHECKING CH12 FULL QUOTATIONS ===")
for r in ch12:
    idx = int(r["pdf_page_index"])
    page_text = clean(doc_f[idx].get_text())
    if idx + 1 < len(doc_f):
        page_text += clean(doc_f[idx + 1].get_text())
    
    q_clean = clean(r["supporting_quotation"])
    full_match = q_clean in page_text
    
    first10_words = clean(" ".join(r["supporting_quotation"].split()[:10]))
    first10_match = first10_words in page_text
    
    print(f"{r['evidence_id']} (idx {idx}): FULL={full_match}, FIRST10_WORDS={first10_match}")
    if not full_match:
        print(f"   Missing part. Quote length: {len(q_clean)}, first10: {first10_words}")

print("\n=== CHECKING ATLAS FULL QUOTATIONS ===")
for r in atlas:
    idx = int(r["pdf_page_index"])
    page_text = clean(doc_a[idx].get_text())
    if idx + 1 < len(doc_a):
        page_text += clean(doc_a[idx + 1].get_text())
    
    q_clean = clean(r["supporting_quotation"])
    full_match = q_clean in page_text
    
    first10_words = clean(" ".join(r["supporting_quotation"].split()[:10]))
    first10_match = first10_words in page_text
    
    print(f"{r['evidence_id']} (idx {idx}): FULL={full_match}, FIRST10_WORDS={first10_match}")
    if not full_match:
        print(f"   Missing part. Quote length: {len(q_clean)}, first10: {first10_words}")
