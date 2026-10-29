import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./server-data/noor_database.json', 'utf8'));

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'object') {
    return "'" + JSON.stringify(val).replace(/'/g, "''") + "'";
  }
  return "'" + String(val).replace(/'/g, "''") + "'";
}

let sql = `-- ==========================================================
-- NOOR AL HUDA ISLAMIC SHOP
-- Cloudflare D1 Production Seed Data
-- ==========================================================

`;

// Settings
const s = db.Settings?.[0] || {};
sql += `INSERT OR REPLACE INTO store_settings (
  id, store_name, owner_email, whatsapp_number, standard_delivery_charge, 
  free_delivery_threshold, currency_symbol, announcement_text, announcement_active, 
  google_sheets_id, google_drive_folder_id, upi_id, updated_at
) VALUES (
  ${escapeSql(s.id || 'settings_01')},
  ${escapeSql(s.storeName || 'NOOR AL HUDA ISLAMIC SHOP')},
  ${escapeSql(s.ownerEmail || 'uskshayeem@gmail.com')},
  ${escapeSql(s.whatsappNumber || '+917003735250')},
  ${s.standardDeliveryCharge ?? 40},
  ${s.freeDeliveryThreshold ?? 999},
  ${escapeSql(s.currencySymbol || '₹')},
  ${escapeSql(s.announcementText || '')},
  ${s.announcementActive ? 1 : 0},
  ${escapeSql(s.googleSheetsId || '')},
  ${escapeSql(s.googleDriveFolderId || '')},
  ${escapeSql(s.upiId || '')},
  ${escapeSql(s.updatedAt || new Date().toISOString())}
);\n\n`;

// Categories
sql += `-- Categories\n`;
for (const c of db.Categories || []) {
  sql += `INSERT OR REPLACE INTO categories (id, name, slug, description, image_url, sort_order, is_active, item_count, created_at) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, ${escapeSql(c.description)}, ${escapeSql(c.imageUrl)}, ${c.sortOrder || 1}, ${c.isActive ? 1 : 0}, ${c.itemCount || 0}, datetime('now'));\n`;
}
sql += `\n`;

// Banners
sql += `-- Promotional Banners\n`;
for (const b of db.Banners || []) {
  sql += `INSERT OR REPLACE INTO banners (id, title, subtitle, badge, image_url, link, button_text, sort_order, is_active, created_at) VALUES (${escapeSql(b.id)}, ${escapeSql(b.title)}, ${escapeSql(b.subtitle)}, ${escapeSql(b.badge)}, ${escapeSql(b.imageUrl)}, ${escapeSql(b.link)}, ${escapeSql(b.buttonText)}, ${b.sortOrder || 1}, ${b.isActive ? 1 : 0}, datetime('now'));\n`;
}
sql += `\n`;

// Coupons
sql += `-- Discount Coupons\n`;
for (const cp of db.Coupons || []) {
  sql += `INSERT OR REPLACE INTO coupons (id, code, discount_type, discount_value, min_order_value, max_discount, usage_limit, used_count, valid_until, is_active, created_at) VALUES (${escapeSql(cp.id)}, ${escapeSql(cp.code)}, ${escapeSql(cp.discountType)}, ${cp.discountValue}, ${cp.minOrderValue || 0}, ${escapeSql(cp.maxDiscount)}, ${escapeSql(cp.usageLimit)}, ${cp.usedCount || 0}, ${escapeSql(cp.validUntil)}, ${cp.isActive ? 1 : 0}, datetime('now'));\n`;
}
sql += `\n`;

// Products & Variants
sql += `-- Products & Variants\n`;
for (const p of db.Products || []) {
  sql += `INSERT OR REPLACE INTO products (id, title, slug, sku, description, category_id, category_name, brand, price, original_price, discount_percentage, stock, low_stock_threshold, images, specifications, is_active, is_featured, is_best_seller, is_new_arrival, rating, review_count, created_at, updated_at) VALUES (\n`;
  sql += `  ${escapeSql(p.id)}, ${escapeSql(p.title)}, ${escapeSql(p.slug)}, ${escapeSql(p.sku)}, ${escapeSql(p.description)}, ${escapeSql(p.categoryId)}, ${escapeSql(p.categoryName)}, ${escapeSql(p.brand || 'Noor Al Huda')}, ${p.price}, ${escapeSql(p.originalPrice)}, ${p.discountPercentage || 0}, ${p.stock}, ${p.lowStockThreshold || 5}, ${escapeSql(p.images || [])}, ${escapeSql(p.specifications || {})}, ${p.isActive ? 1 : 0}, ${p.isFeatured ? 1 : 0}, ${p.isBestSeller ? 1 : 0}, ${p.isNewArrival ? 1 : 0}, ${p.rating || 5.0}, ${p.reviewCount || 0}, ${escapeSql(p.createdAt || new Date().toISOString())}, datetime('now')\n);\n`;

  if (p.variants && Array.isArray(p.variants)) {
    for (const v of p.variants) {
      sql += `INSERT OR REPLACE INTO product_variants (id, product_id, name, sku, price, original_price, stock, created_at) VALUES (${escapeSql(v.id)}, ${escapeSql(p.id)}, ${escapeSql(v.name)}, ${escapeSql(v.sku)}, ${v.price}, ${escapeSql(v.originalPrice)}, ${v.stock}, datetime('now'));\n`;
    }
  }
}
sql += `\n`;

// Customers
sql += `-- Customers\n`;
for (const c of db.Customers || []) {
  sql += `INSERT OR REPLACE INTO customers (id, name, email, phone, role, total_orders, total_spent, created_at, updated_at) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.email)}, ${escapeSql(c.phone)}, 'customer', ${c.totalOrders || 0}, ${c.totalSpent || 0}, ${escapeSql(c.createdAt || new Date().toISOString())}, datetime('now'));\n`;
}
sql += `\n`;

// Admin Users
sql += `-- Admin Users\n`;
for (const a of db.AdminUsers || []) {
  sql += `INSERT OR REPLACE INTO admin_users (id, name, email, phone, role, permissions, is_active, created_at) VALUES (${escapeSql(a.id)}, ${escapeSql(a.name)}, ${escapeSql(a.email)}, ${escapeSql(a.phone)}, ${escapeSql(a.role)}, ${escapeSql(a.permissions || [])}, 1, datetime('now'));\n`;
}

fs.writeFileSync('./cloudflare/seed.sql', sql, 'utf8');
console.log('Seed SQL generation complete!');
