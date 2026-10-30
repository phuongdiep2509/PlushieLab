/**
 * ════════════════════════════════════════════════════════
 * PRODUCTS API - Lấy dữ liệu sản phẩm từ JSON
 * ════════════════════════════════════════════════════════
 */

'use strict';

class ProductsAPI {
  constructor() {
    this.data = null;
    this.loading = false;
  }

  /**
   * Load dữ liệu từ JSON file
   */
  async loadProducts() {
    if (this.data) return this.data; // Cache
    
    try {
      this.loading = true;
      const response = await fetch('static/data/products.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      console.log('✅ Products loaded successfully:', this.data);
      return this.data;
    } catch (error) {
      console.error('❌ Error loading products:', error);
      return null;
    } finally {
      this.loading = false;
    }
  }

  /**
   * Lấy tất cả sản phẩm
   */
  async getAllProducts() {
    const data = await this.loadProducts();
    return data?.products || [];
  }

  /**
   * Lấy sản phẩm theo ID
   */
  async getProductById(id) {
    const data = await this.loadProducts();
    return data?.products.find(p => p.id === id);
  }

  /**
   * Lấy sản phẩm theo category
   */
  async getProductsByCategory(category) {
    const data = await this.loadProducts();
    return data?.products.filter(p => p.category === category) || [];
  }

  /**
   * Lấy sản phẩm nổi bật (featured)
   */
  async getFeaturedProducts() {
    return this.getProductsByCategory('featured');
  }

  /**
   * Lấy tất cả sản phẩm Halloween
   */
  async getHalloweenProducts() {
    return this.getProductsByCategory('halloween');
  }

  /**
   * Lấy tất cả Collection products
   */
  async getCollectionProducts() {
    return this.getProductsByCategory('collection');
  }

  /**
   * Lấy sản phẩm theo loại (type)
   */
  async getProductsByType(type) {
    const data = await this.loadProducts();
    return data?.products.filter(p => p.type === type) || [];
  }

  /**
   * Lấy sản phẩm theo màu (color)
   */
  async getProductsByColor(color) {
    const data = await this.loadProducts();
    return data?.products.filter(p => p.color === color) || [];
  }

  /**
   * Tìm kiếm sản phẩm (theo tên)
   */
  async searchProducts(keyword) {
    const data = await this.loadProducts();
    const kw = keyword.toLowerCase();
    return data?.products.filter(p => 
      p.name.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw)
    ) || [];
  }

  /**
   * Lấy tất cả categories
   */
  async getCategories() {
    const data = await this.loadProducts();
    return data?.categories || {};
  }

  /**
   * Lấy tất cả types (loại gấu)
   */
  async getTypes() {
    const data = await this.loadProducts();
    return data?.types || [];
  }

  /**
   * Lấy tất cả colors
   */
  async getColors() {
    const data = await this.loadProducts();
    return data?.colors || [];
  }

  /**
   * Lấy accessories theo loại
   */
  async getAccessoriesByType(type) {
    const data = await this.loadProducts();
    return data?.accessories[type] || [];
  }

  /**
   * Lấy tất cả accessories
   */
  async getAllAccessories() {
    const data = await this.loadProducts();
    return data?.accessories || {};
  }

  /**
   * Lấy services (embroidery, giftwrap)
   */
  async getServices() {
    const data = await this.loadProducts();
    return data?.services || {};
  }

  /**
   * Lấy giá base của sản phẩm
   */
  async getProductPrice(id) {
    const product = await this.getProductById(id);
    return product?.basePrice || 0;
  }

  /**
   * Lấy sản phẩm theo range giá
   */
  async getProductsByPriceRange(minPrice, maxPrice) {
    const data = await this.loadProducts();
    return data?.products.filter(p => 
      p.basePrice >= minPrice && p.basePrice <= maxPrice
    ) || [];
  }

  /**
   * Sắp xếp sản phẩm theo giá
   */
  async getProductsSortedByPrice(order = 'asc') {
    const products = await this.getAllProducts();
    return products.sort((a, b) => {
      return order === 'asc' 
        ? a.basePrice - b.basePrice 
        : b.basePrice - a.basePrice;
    });
  }

  /**
   * Sắp xếp sản phẩm theo rating
   */
  async getProductsSortedByRating(order = 'desc') {
    const products = await this.getAllProducts();
    return products.sort((a, b) => {
      return order === 'desc'
        ? b.ratings - a.ratings
        : a.ratings - b.ratings;
    });
  }
}

// ════════════════════════════════════════════════════════
// GLOBAL INSTANCE
// ════════════════════════════════════════════════════════

const productsAPI = new ProductsAPI();

// Auto load on page load
document.addEventListener('DOMContentLoaded', async () => {
  await productsAPI.loadProducts();
});

/**
 * ════════════════════════════════════════════════════════
 * USAGE EXAMPLES
 * ════════════════════════════════════════════════════════

// 1. Lấy tất cả sản phẩm
const allProducts = await productsAPI.getAllProducts();
console.log(allProducts);

// 2. Lấy sản phẩm theo ID
const product = await productsAPI.getProductById('PROD-001');
console.log(product);

// 3. Lấy sản phẩm Halloween
const halloweenProducts = await productsAPI.getHalloweenProducts();
console.log(halloweenProducts);

// 4. Lấy sản phẩm Collection
const collectionProducts = await productsAPI.getCollectionProducts();
console.log(collectionProducts);

// 5. Lấy sản phẩm nổi bật
const featured = await productsAPI.getFeaturedProducts();
console.log(featured);

// 6. Tìm kiếm sản phẩm
const searchResults = await productsAPI.searchProducts('Bunnie');
console.log(searchResults);

// 7. Lấy phụ kiện
const heads = await productsAPI.getAccessoriesByType('head');
console.log(heads);

// 8. Lấy services
const services = await productsAPI.getServices();
console.log(services);

// 9. Lấy sản phẩm theo loại
const bears = await productsAPI.getProductsByType('bear');
console.log(bears);

// 10. Sắp xếp theo giá
const byPrice = await productsAPI.getProductsSortedByPrice('asc');
console.log(byPrice);

 */
