import os
import sys
import shutil
import re
from app import app

# Ensure utf-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, 'docs')

ROUTES = {
    '/': 'index.html',
    '/new-collection': 'new_collection.html',
    '/design': 'design.html',
    '/about': 'about.html',
    '/tracking': 'tracking.html',
    '/products-test': 'products-test.html',
    '/api-test': 'api-test.html',
}

def clean_html(html_str):
    # Thay thế đường dẫn tuyệt đối sang tương đối
    replacements = [
        ('href="/static/', 'href="static/'),
        ('src="/static/', 'src="static/'),
        ('href="/new-collection"', 'href="new_collection.html"'),
        ('href="/new-collection', 'href="new_collection.html'),
        ('href="/design"', 'href="design.html"'),
        ('href="/design', 'href="design.html'),
        ('href="/about"', 'href="about.html"'),
        ('href="/about', 'href="about.html'),
        ('href="/tracking"', 'href="tracking.html"'),
        ('href="/tracking', 'href="tracking.html'),
        ('href="/"', 'href="index.html"'),
        ("href='/'", "href='index.html'"),
    ]
    for old, new in replacements:
        html_str = html_str.replace(old, new)
    return html_str

def fix_products_json(file_path):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Bỏ dấu / ở đầu tất cả /static/
    content = content.replace('"/static/', '"static/')
    
    # 2. Map các ảnh phụ kiện ảo sang ảnh thật trên đĩa
    accessory_maps = {
        'static/image/bow-pink.png': 'static/image/Head Bows 1.png',
        'static/image/ears-white.png': 'static/image/Head Bows 2.png',
        'static/image/hat-brown.png': 'static/image/Head Hats 1.png',
        'static/image/sweater-pink.png': 'static/image/Tops 1.png',
        'static/image/tshirt-caramel.png': 'static/image/Tops 2.png',
        'static/image/dress-white.png': 'static/image/Tops 3.png',
        'static/image/skirt-pink.png': 'static/image/Bottoms 1.png',
        'static/image/pants-brown.png': 'static/image/Bottoms 2.png',
        'static/image/shorts-cream.png': 'static/image/Bottoms 3.png',
        'static/image/backpack-pink.png': 'static/image/Accessories 1.png',
        'static/image/bag-brown.png': 'static/image/Accessories 2.png',
        'static/image/clutch-cream.png': 'static/image/Accessories 3.png',
    }
    for old_img, new_img in accessory_maps.items():
        content = content.replace(old_img, new_img)
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def build():
    print(f"Bắt đầu xuất website tĩnh ra thư mục: {OUTPUT_DIR}")
    
    # Chuẩn hóa file products.json gốc trước
    src_products_json = os.path.join(BASE_DIR, 'static', 'data', 'products.json')
    fix_products_json(src_products_json)
    print(" -> Đã chuẩn hóa static/data/products.json gốc")

    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 1. Copy thư mục static
    static_src = os.path.join(BASE_DIR, 'static')
    static_dst = os.path.join(OUTPUT_DIR, 'static')
    if os.path.exists(static_src):
        shutil.copytree(static_src, static_dst)
        print(" -> Đã sao chép thư mục static/")

    # 2. Render tất cả template từ Flask app
    with app.test_client() as client:
        for route, filename in ROUTES.items():
            res = client.get(route)
            if res.status_code == 200:
                html = res.data.decode('utf-8')
                html = clean_html(html)
                out_path = os.path.join(OUTPUT_DIR, filename)
                with open(out_path, 'w', encoding='utf-8') as f:
                    f.write(html)
                print(f" -> Đã tạo {filename} từ route '{route}'")
            else:
                print(f" ! Cảnh báo: route {route} trả về mã {res.status_code}")

    # Tạo thêm alias new-collection.html phòng trường hợp truy cập
    alias_path = os.path.join(OUTPUT_DIR, 'new-collection.html')
    nc_path = os.path.join(OUTPUT_DIR, 'new_collection.html')
    if os.path.exists(nc_path) and not os.path.exists(alias_path):
        shutil.copyfile(nc_path, alias_path)

    # 3. Chuẩn hóa CSS: chuyển đường dẫn background ảnh thành tương đối
    css_style = os.path.join(static_dst, 'css', 'style.css')
    if os.path.exists(css_style):
        with open(css_style, 'r', encoding='utf-8') as f:
            css_content = f.read()
        css_content = css_content.replace("url('/static/image/", "url('../image/")
        css_content = css_content.replace('url("/static/image/', 'url("../image/')
        css_content = css_content.replace('url(/static/image/', 'url(../image/')
        with open(css_style, 'w', encoding='utf-8') as f:
            f.write(css_content)
        print(" -> Đã tối ưu hóa static/css/style.css (sửa đường dẫn background-image)")

    # 4. Chuẩn hóa JavaScript
    js_products_api = os.path.join(static_dst, 'js', 'products-api.js')
    if os.path.exists(js_products_api):
        with open(js_products_api, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace("fetch('/static/data/products.json')", "fetch('static/data/products.json')")
        with open(js_products_api, 'w', encoding='utf-8') as f:
            f.write(content)
        print(" -> Đã tối ưu hóa static/js/products-api.js")

    js_main = os.path.join(static_dst, 'js', 'main.js')
    if os.path.exists(js_main):
        with open(js_main, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace("window.location.href = `/tracking?order=${orderId}`;", "window.location.href = `tracking.html?order=${orderId}`;")
        content = content.replace("window.location.href = '/new-collection';", "window.location.href = 'new_collection.html';")
        content = content.replace('href="/design"', 'href="design.html"')
        content = content.replace("'/static/image/", "'static/image/")
        content = content.replace('"/static/image/', '"static/image/')
        # Tối ưu logic active link
        old_nav = "if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/')) {"
        new_nav = "const href = link.getAttribute('href'); if (href && (currentPath.endsWith(href) || ((href === 'index.html' || href === '/') && (currentPath.endsWith('/') || currentPath.endsWith('index.html'))))) {"
        content = content.replace(old_nav, new_nav)
        with open(js_main, 'w', encoding='utf-8') as f:
            f.write(content)
        print(" -> Đã tối ưu hóa static/js/main.js")

    # 5. Chuẩn hóa file products.json trong docs/static/data/
    dst_products_json = os.path.join(static_dst, 'data', 'products.json')
    fix_products_json(dst_products_json)
    print(" -> Đã chuẩn hóa docs/static/data/products.json")

    # 6. Tạo file .nojekyll
    with open(os.path.join(OUTPUT_DIR, '.nojekyll'), 'w', encoding='utf-8') as f:
        f.write('')
    print(" -> Đã tạo file .nojekyll")

    # 7. Tạo 404.html (trang dự phòng khi người dùng gõ sai URL)
    index_path = os.path.join(OUTPUT_DIR, 'index.html')
    notfound_path = os.path.join(OUTPUT_DIR, '404.html')
    if os.path.exists(index_path):
        shutil.copyfile(index_path, notfound_path)
        print(" -> Đã tạo file 404.html")

    print("\n✅ Xuất website tĩnh thành công! Toàn bộ đường dẫn hình ảnh đã được fix 100%.")

if __name__ == '__main__':
    build()
