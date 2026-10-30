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

def build():
    print(f"Bắt đầu xuất website tĩnh ra thư mục: {OUTPUT_DIR}")
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

    # 3. Điều chỉnh JavaScript để dùng đường dẫn tương đối
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
        # Tối ưu logic active link
        old_nav = "if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/')) {"
        new_nav = "const href = link.getAttribute('href'); if (href && (currentPath.endsWith(href) || ((href === 'index.html' || href === '/') && (currentPath.endsWith('/') || currentPath.endsWith('index.html'))))) {"
        content = content.replace(old_nav, new_nav)
        with open(js_main, 'w', encoding='utf-8') as f:
            f.write(content)
        print(" -> Đã tối ưu hóa static/js/main.js")

    # 4. Tạo file .nojekyll
    with open(os.path.join(OUTPUT_DIR, '.nojekyll'), 'w', encoding='utf-8') as f:
        f.write('')
    print(" -> Đã tạo file .nojekyll")

    # 5. Tạo 404.html (trang dự phòng khi người dùng gõ sai URL)
    index_path = os.path.join(OUTPUT_DIR, 'index.html')
    notfound_path = os.path.join(OUTPUT_DIR, '404.html')
    if os.path.exists(index_path):
        shutil.copyfile(index_path, notfound_path)
        print(" -> Đã tạo file 404.html")

    print("\n✅ Xuất website tĩnh thành công! Thư mục 'docs/' đã sẵn sàng để deploy GitHub Pages.")

if __name__ == '__main__':
    build()
