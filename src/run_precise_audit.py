import os
import json
import re
import sys

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
    s = s.replace('\ufb01', 'fi').replace('\ufb02', 'fl').replace('\ufb00', 'ff')
    s = s.replace('\ufb03', 'ffi').replace('\ufb04', 'ffl')
    s = s.replace('\xad', '')
    return re.sub(r'[^a-zA-Z0-9]', '', s).lower()

print("=== CH12 VERIFICATION RESULTS ===")
ch12_audit_results = {}
for r in ch12:
    idx = int(r["pdf_page_index"])
    full_text = clean(doc_f[idx].get_text())
    if idx + 1 < len(doc_f):
        full_text += clean(doc_f[idx + 1].get_text())
    
    parts = [clean(p) for p in r["supporting_quotation"].split("...") if clean(p)]
    all_parts_match = all(p in full_text for p in parts)
    
    actual_page = idx
    if not all_parts_match:
        # scan whole chapter
        for p_idx in range(254, 270):
            p_text = clean(doc_f[p_idx].get_text())
            if all(p in p_text for p in parts):
                actual_page = p_idx
                all_parts_match = True
                break
    
    status = "VERIFIED_FULL" if (all_parts_match and actual_page == idx) else ("VERIFIED_ON_PAGE_" + str(actual_page) if all_parts_match else "PARTIAL_MATCH")
    ch12_audit_results[r["evidence_id"]] = {
        "status": status,
        "recorded_page_idx": idx,
        "actual_page_idx": actual_page,
        "parts_count": len(parts)
    }
    print(f"{r['evidence_id']}: {status} (recorded idx: {idx}, actual: {actual_page})")

print("\n=== ATLAS VERIFICATION RESULTS ===")
atlas_audit_results = {}
for r in atlas:
    idx = int(r["pdf_page_index"])
    full_text = clean(doc_a[idx].get_text())
    if idx + 1 < len(doc_a):
        full_text += clean(doc_a[idx + 1].get_text())
    
    parts = [clean(p) for p in r["supporting_quotation"].split("...") if clean(p)]
    all_parts_match = all(p in full_text for p in parts)
    
    actual_page = idx
    if not all_parts_match:
        for p_idx in range(808, 821):
            p_text = clean(doc_a[p_idx].get_text())
            if all(p in p_text for p in parts):
                actual_page = p_idx
                all_parts_match = True
                break
                
    status = "VERIFIED_FULL" if (all_parts_match and actual_page == idx) else ("VERIFIED_ON_PAGE_" + str(actual_page) if all_parts_match else "PARTIAL_MATCH")
    atlas_audit_results[r["evidence_id"]] = {
        "status": status,
        "recorded_page_idx": idx,
        "actual_page_idx": actual_page,
        "parts_count": len(parts)
    }
    print(f"{r['evidence_id']}: {status} (recorded idx: {idx}, actual: {actual_page})")
