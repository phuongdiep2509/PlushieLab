import pymupdf

doc = pymupdf.open('Wireframe - Plushie Lab.pdf')

with open('pdf_pages/detailed_breakdown.txt', 'w', encoding='utf-8') as out:
    for pno in range(len(doc)):
        page = doc[pno]
        out.write(f"\n======================================================\n")
        out.write(f"PAGE {pno + 1}: width={page.rect.width}, height={page.rect.height}\n")
        out.write(f"======================================================\n")
        
        # Drawings (rectangles, lines, etc.)
        drawings = page.get_drawings()
        out.write(f"--- DRAWINGS ({len(drawings)}) ---\n")
        for d in drawings:
            rect = d['rect']
            fill = d.get('fill')
            color = d.get('color')
            # only log meaningful boxes (width > 10, height > 10)
            if rect.width > 10 and rect.height > 10:
                out.write(f"Rect [{rect.x0:.1f}, {rect.y0:.1f}, {rect.x1:.1f}, {rect.y1:.1f}] (w={rect.width:.1f}, h={rect.height:.1f}) fill={fill} stroke={color}\n")

        # Images
        image_list = page.get_images()
        out.write(f"\n--- IMAGES ({len(image_list)}) ---\n")
        for img in image_list:
            xref = img[0]
            # find bbox of image on page
            # page.get_image_rects(xref)
            rects = page.get_image_rects(xref)
            out.write(f"Image xref {xref}: rects={rects}\n")

        # Text blocks
        out.write(f"\n--- TEXT BLOCKS ---\n")
        blocks = page.get_text('blocks')
        for b in blocks:
            if b[4].strip():
                txt = b[4].strip().replace('\n', '  |  ')
                out.write(f"Text [{b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}]: {txt}\n")

print("Detailed breakdown written.")
