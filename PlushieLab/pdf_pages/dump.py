import json

with open('pdf_pages/layout_analysis.json', encoding='utf-8') as f:
    data = json.load(f)

with open('pdf_pages/summary.txt', 'w', encoding='utf-8') as out:
    for p in data:
        page_num = p['page']
        width = p['rect'][2]
        height = p['rect'][3]
        out.write(f"\n==================== PAGE {page_num} ({width} x {height}) ====================\n")
        out.write(f"Images count: {len(p['images'])}, Drawings count: {p['drawings_count']}\n")
        for b in p['blocks']:
            txt = b['text'].replace('\n', '  |  ')
            out.write(f"  [{b['rect'][0]:>6.1f}, {b['rect'][1]:>6.1f}, {b['rect'][2]:>6.1f}, {b['rect'][3]:>6.1f}]: {txt}\n")

print("Wrote summary.txt")
