# 📦 Products Data Storage Guide

## 🎯 Tổng Quan

Tất cả thông tin sản phẩm được lưu trữ trong file JSON và có thể truy cập qua JavaScript API.

### Lợi Ích:
- ✅ Dễ quản lý và cập nhật
- ✅ Không cần Flask backend để lấy dữ liệu
- ✅ Tốc độ nhanh (client-side caching)
- ✅ Dễ tích hợp với frontend framework
- ✅ Có thể convert sang database sau

---

## 📁 File Structure

```
static/
├── data/
│   └── products.json         ← Tất cả dữ liệu sản phẩm
└── js/
    ├── products-api.js       ← API để lấy dữ liệu
    ├── main.js              ← Main logic (sử dụng API)
    └── ...
```

---

## 📄 File: products.json

Chứa 4 phần chính:

### 1. **Products** - Danh sách sản phẩm

```json
{
  "id": "PROD-001",
  "name": "Bunnie Witch (Halloween)",
  "collection": "Halloween Special",
  "type": "bunny",
  "typeName": "Bunny",
  "typeIcon": "🐰",
  "color": "pink",
  "colorName": "Pink",
  "colorHex": "#e0b18d",
  "basePrice": 249000,
  "image": "/static/image/background.png",
  "description": "Nhân vật Bunnie Witch xinh xắn...",
  "category": "halloween",
  "featured": false,
  "ratings": 4.8,
  "reviews": 145
}
```

### 2. **Categories** - Danh mục sản phẩm

```json
{
  "halloween": {
    "name": "Halloween Special",
    "icon": "🎃",
    "description": "Bộ sưu tập đặc biệt mùa lễ hội"
  }
}
```

### 3. **Types** - Loại gấu bông

```json
[
  {"value": "bear", "name": "Bear", "icon": "🐻"},
  {"value": "bunny", "name": "Bunny", "icon": "🐰"},
  {"value": "cat", "name": "Cat", "icon": "🐱"},
  {"value": "capybara", "name": "Capybara", "icon": "🐫"}
]
```

### 4. **Colors** - Màu sắc

```json
[
  {"value": "cream", "name": "Cream", "hex": "#f5e6d3"},
  {"value": "caramel", "name": "Caramel", "hex": "#c8864a"},
  {"value": "pink", "name": "Pink", "hex": "#e0b18d"},
  {"value": "brown", "name": "Brown", "hex": "#935a3a"}
]
```

### 5. **Accessories** - Phụ kiện

```json
{
  "head": [
    {"id": "ACC-HEAD-001", "name": "Pink Bow", "price": 45000},
    {"id": "ACC-HEAD-002", "name": "White Bunny Ears", "price": 55000}
  ],
  "tops": [...],
  "bottoms": [...],
  "accessories": [...]
}
```

### 6. **Services** - Dịch vụ

```json
{
  "embroidery": {
    "name": "Embroidery",
    "price": 35000,
    "options": [
      {"id": "EMB-NAME", "name": "Name"},
      {"id": "EMB-ICON", "name": "Icon"}
    ]
  },
  "giftwrap": {
    "name": "Gift Wrap",
    "price": 25000,
    "options": [...]
  }
}
```

---

## 🚀 Cách Sử Dụng

### File: `static/js/products-api.js`

Cung cấp class `ProductsAPI` với các method:

```javascript
const api = productsAPI; // Global instance
```

### ✨ Các Method Chính

#### 1. **Lấy Tất Cả Sản Phẩm**

```javascript
const products = await productsAPI.getAllProducts();
console.log(products); // Mảng 9 sản phẩm
```

#### 2. **Lấy Sản Phẩm Theo ID**

```javascript
const product = await productsAPI.getProductById('PROD-001');
console.log(product.name); // "Bunnie Witch (Halloween)"
console.log(product.basePrice); // 249000
```

#### 3. **Lấy Sản Phẩm Theo Category**

```javascript
// Halloween products
const halloween = await productsAPI.getHalloweenProducts();

// Collection products
const collection = await productsAPI.getCollectionProducts();

// Featured products
const featured = await productsAPI.getFeaturedProducts();

// Custom category
const byCategory = await productsAPI.getProductsByCategory('halloween');
```

#### 4. **Lấy Sản Phẩm Theo Loại (Type)**

```javascript
const bears = await productsAPI.getProductsByType('bear');
const cats = await productsAPI.getProductsByType('cat');
const bunnies = await productsAPI.getProductsByType('bunny');
```

#### 5. **Lấy Sản Phẩm Theo Màu (Color)**

```javascript
const pink = await productsAPI.getProductsByColor('pink');
const brown = await productsAPI.getProductsByColor('brown');
```

#### 6. **Tìm Kiếm Sản Phẩm**

```javascript
const results = await productsAPI.searchProducts('Bunnie');
// Tìm theo tên và description
```

#### 7. **Lấy Phụ Kiện**

```javascript
const heads = await productsAPI.getAccessoriesByType('head');
const tops = await productsAPI.getAccessoriesByType('tops');
const bottoms = await productsAPI.getAccessoriesByType('bottoms');
const bags = await productsAPI.getAccessoriesByType('accessories');

// Tất cả
const all = await productsAPI.getAllAccessories();
```

#### 8. **Lấy Dịch Vụ**

```javascript
const services = await productsAPI.getServices();
console.log(services.embroidery.price); // 35000
console.log(services.giftwrap.price); // 25000
```

#### 9. **Sắp Xếp Theo Giá**

```javascript
// Từ thấp đến cao
const byPriceAsc = await productsAPI.getProductsSortedByPrice('asc');

// Từ cao đến thấp
const byPriceDesc = await productsAPI.getProductsSortedByPrice('desc');
```

#### 10. **Sắp Xếp Theo Rating**

```javascript
// Rating cao nhất
const byRatingDesc = await productsAPI.getProductsSortedByRating('desc');

// Rating thấp nhất
const byRatingAsc = await productsAPI.getProductsSortedByRating('asc');
```

#### 11. **Lấy Sản Phẩm Theo Khoảng Giá**

```javascript
const affordable = await productsAPI.getProductsByPriceRange(200000, 250000);
```

#### 12. **Lấy Types, Colors, Categories**

```javascript
const types = await productsAPI.getTypes();
// [{ value: "bear", name: "Bear", icon: "🐻" }, ...]

const colors = await productsAPI.getColors();
// [{ value: "cream", name: "Cream", hex: "#f5e6d3" }, ...]

const categories = await productsAPI.getCategories();
// { halloween: {...}, collection: {...} }
```

---

## 💡 Ví Dụ Thực Tế

### Ví Dụ 1: Hiển Thị Tất Cả Sản Phẩm Halloween

```javascript
async function displayHalloween() {
  const products = await productsAPI.getHalloweenProducts();
  const container = document.getElementById('halloween-products');
  
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p>Giá: ${p.basePrice.toLocaleString('vi-VN')}đ</p>
      <button onclick="addToCart('${p.id}')">Thêm vào giỏ</button>
    </div>
  `).join('');
}
```

### Ví Dụ 2: Tạo Filter Theo Loại

```javascript
async function filterByType(type) {
  const products = await productsAPI.getProductsByType(type);
  console.log(`Sản phẩm loại ${type}:`, products);
  // Render lại UI
}

// Sử dụng
filterByType('cat');    // Lấy tất cả mèo
filterByType('bear');   // Lấy tất cả gấu
```

### Ví Dụ 3: Hiển Thị Phụ Kiện Khi Người Dùng Chọn

```javascript
async function showAccessories(slot) {
  const accessories = await productsAPI.getAccessoriesByType(slot);
  const container = document.getElementById(`acc-${slot}`);
  
  container.innerHTML = accessories.map(acc => `
    <div class="acc-item" data-price="${acc.price}">
      <img src="${acc.image}" alt="${acc.name}" />
      <h4>${acc.name}</h4>
      <p>+${acc.price.toLocaleString('vi-VN')}đ</p>
    </div>
  `).join('');
}

// Sử dụng
showAccessories('head');  // Hiển thị phụ kiện đầu
```

### Ví Dụ 4: Tìm Kiếm

```javascript
async function handleSearch(keyword) {
  const results = await productsAPI.searchProducts(keyword);
  console.log(`Tìm thấy ${results.length} sản phẩm cho "${keyword}"`);
  // Render results
}

// Sử dụng
handleSearch('Bunnie');  // Tìm tất cả sản phẩm Bunnie
```

### Ví Dụ 5: Hiển Thị Sản Phẩm Nổi Bật

```javascript
async function showFeatured() {
  const featured = await productsAPI.getFeaturedProducts();
  if (featured.length > 0) {
    const product = featured[0];
    document.querySelector('.featured-price').textContent = 
      `${product.basePrice.toLocaleString('vi-VN')}đ`;
    document.querySelector('.featured-name').textContent = product.name;
  }
}
```

---

## 🔄 Cách Cập Nhật Sản Phẩm

### Thêm Sản Phẩm Mới

Mở `static/data/products.json` và thêm vào mảng `products`:

```json
{
  "id": "PROD-010",
  "name": "New Product Name",
  "collection": "Collection Name",
  "type": "bear",
  "typeName": "Bear",
  "typeIcon": "🐻",
  "color": "cream",
  "colorName": "Cream",
  "colorHex": "#f5e6d3",
  "basePrice": 299000,
  "image": "/static/image/new-product.png",
  "description": "Mô tả sản phẩm...",
  "category": "collection",
  "featured": false,
  "ratings": 4.5,
  "reviews": 50
}
```

### Thêm Phụ Kiện Mới

```json
{
  "id": "ACC-HEAD-004",
  "name": "Blue Hat",
  "price": 70000,
  "image": "/static/image/hat-blue.png"
}
```

### Cập Nhật Dịch Vụ

Chỉnh sửa section `services` trong `products.json`.

---

## ⚡ Performance Tips

1. **Caching**: API tự động cache dữ liệu sau lần load đầu
2. **Lazy Load**: Chỉ load dữ liệu khi cần
3. **Local Storage**: Có thể lưu vào localStorage cho offline

```javascript
// Lưu vào localStorage
localStorage.setItem('products', JSON.stringify(await productsAPI.getAllProducts()));

// Lấy từ localStorage
const cached = JSON.parse(localStorage.getItem('products'));
```

---

## 🔗 Integration

### Trong main.js

Có thể thay thế hardcoded data bằng API calls:

```javascript
// Trước (hardcoded)
const PRICING = { base: 199000, embroidery: 35000, ... };

// Sau (từ API)
const services = await productsAPI.getServices();
const PRICING = {
  base: 199000,
  embroidery: services.embroidery.price,
  giftWrap: services.giftwrap.price
};
```

---

## 📊 Dữ Liệu Có Sẵn

| Loại | Số Lượng |
|------|---------|
| **Sản phẩm** | 9 |
| **Categories** | 3 |
| **Types** | 4 |
| **Colors** | 4 |
| **Phụ kiện (Head)** | 3 |
| **Phụ kiện (Tops)** | 3 |
| **Phụ kiện (Bottoms)** | 3 |
| **Phụ kiện (Bags)** | 3 |
| **Dịch vụ** | 2 |

---

## ✅ Checklist

- [x] File `products.json` được tạo
- [x] File `products-api.js` được tạo
- [x] `base.html` được cập nhật (import script)
- [x] Global instance `productsAPI` sẵn sàng sử dụng
- [x] Tất cả method đã được implement

---

## 🎓 Tiếp Theo

1. **Cập nhật main.js**: Dùng API thay vì hardcoded data
2. **Cập nhật HTML templates**: Load dữ liệu động từ API
3. **Thêm Filter/Search UI**: Cho phép người dùng filter
4. **Chuyển sang Database**: Khi dữ liệu quá lớn

---

**🚀 Đã sẵn sàng! Hãy bắt đầu sử dụng `productsAPI` trong console browser!**
