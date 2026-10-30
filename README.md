# 🧸 Plushie Lab — E-Commerce Website

Hệ thống website thương mại điện tử hoàn chỉnh cho thương hiệu gấu bông thủ công cá nhân hóa **Plushie Lab**, được xây dựng chuẩn xác theo bản vẽ wireframe Canva (9 trang).

---

## 🎨 Bảng màu thương hiệu (Strict Brand Palette)
- `#e6c5b4` — soft blush beige
- `#935a3a` — primary warm brown
- `#fffbf7` — warm off-white background
- `#e0b18d` — muted caramel beige
- `#e3c6b7` — pale dusty pink

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Yêu cầu môi trường
- Python 3.8+ (khuyên dùng Python 3.10 - 3.14)
- Flask (`pip install Flask`)

### 2. Khởi chạy server
Mở terminal / PowerShell tại thư mục dự án:
```powershell
cd "c:\Users\nguye\Documents\BAITAP\DAIHOC\4 ENG4\PlushieLab"
python app.py
```

### 3. Truy cập website
Mở trình duyệt web và truy cập:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 📄 Các Trang & Quy Trình Được Hiện Thực (Đối ứng 9 trang Wireframe)

| Trang Wireframe | URL Website | Mô tả chi tiết giao diện |
| :--- | :--- | :--- |
| **Page 1** | `/` (Homepage) | • Hero Section toàn màn hình sử dụng `background.png`.<br>• Section New Collection: Bên trái là Banner lớn có chấm slider; bên phải là Grid 2x2 gồm 4 thẻ sản phẩm gắn nhãn **Halloween**.<br>• Section Feature Product: Bên trái là chi tiết Product 01 & nút "Buy now"; bên phải là ảnh lớn có chấm carousel.<br>• Section Our Feedback: 5 thẻ đánh giá của khách hàng đặt ngang.<br>• Footer: Thanh bar màu nâu sẫm chứa slogan `"Little Things, Lasting Memories"` & logo thương hiệu ở giữa. |
| **Page 2** | `/new-collection` | • Breadcrumbs `Home / New collection`.<br>• Hero banner "Special Season - Our Thing, Our Memories" với ảnh lớn bên trái và thông tin Product 01 bên phải.<br>• 4 khối Collection 01 - 04 (Meow meow) kèm chấm điều hướng carousel riêng. |
| **Page 3** | `/design` (Bước 1) | • Thanh tiến trình 4 bước.<br>• Khung xem trước gấu bông trực quan bên trái.<br>• Bảng chọn loại gấu bông (Bear, Bunny, Cat, Capybara) & màu sắc (Cream, Caramel, Pink, Brown).<br>• Nút mũi tên dọc `>` chuyển bước. |
| **Page 4 - 7** | `/design` (Bước 2) | • Chọn phụ kiện theo danh mục bên trái: Head (Bows & Hats), Tops, Bottoms, Accessories (Bags).<br>• Nút mũi tên hai bên `<` và `>`. |
| **Page 8** | `/design` (Bước 3) | • Dịch vụ thêu tên cá nhân hóa: Ô nhập tên + nút "Thêm tên" & "Thêm icon".<br>• Dịch vụ gói quà: Bảng màu chọn hộp quà (Cream, Caramel, Pink, Brown). |
| **Page 9** | `/design` (Bước 4) | • Bảng tóm tắt thông số 3 cột `Your Order:` hiển thị đầy đủ loại gấu, màu sắc, phụ kiện đã chọn, dịch vụ thêu và gói quà.<br>• Thanh tính tổng tiền động + Nút `Buy now` chuyển thẳng vào giỏ hàng. |
| **Bổ sung** | `/about` | Giới thiệu câu chuyện thương hiệu, giá trị cốt lõi và xưởng sản xuất thủ công. |
| **Bổ sung** | `/tracking` | Tra cứu trạng thái đơn hàng thời gian thực với sơ đồ tiến trình 5 bước. |

---

## 🛒 Tính Năng Tương Tác & Giỏ Hàng
1. **Giỏ hàng trượt (Cart Drawer):**
   - Click vào biểu tượng 🛒 ở góc phải header để mở giỏ hàng.
   - Thêm sản phẩm nhanh bằng nút `Buy now` ở Trang chủ hoặc Trang Bộ sưu tập.
   - Sản phẩm Custom từ trang `/design` được lưu chi tiết từng phụ kiện và tính tiền tự động.
   - Cho phép điều chỉnh số lượng, xóa món hàng, tính phí vận chuyển toàn quốc (0đ).
2. **Form đặt hàng & Tracking:**
   - Điền Họ tên, Số điện thoại, Địa chỉ nhận hàng và nhấn "Xác nhận đặt hàng".
   - Hệ thống tự sinh mã đơn hàng (ví dụ: `PLB-728194`), lưu vào hệ thống và tự động chuyển sang trang `/tracking?order=...` với thông tin chi tiết.

---

## 📂 Quản Lý File & Assets
- Logo chính: `static/image/logo.png` (sử dụng trực tiếp trong Header & Footer)
- Ảnh Hero & Placeholder: `static/image/background.png`
- CSS hệ thống: `static/css/style.css`
- JavaScript tương tác: `static/js/main.js`
