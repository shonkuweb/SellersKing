import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCategoryTree,
  flattenCategoryTree,
  getDescendantIds,
  getCategoryPath,
  getCategoryAndDescendantIds,
} from '../lib/category-tree.mjs';
import {
  calculateDiscount,
  getDiscountNudgeStatus,
  validateOffersSettings,
} from '../lib/discounts.mjs';
import {
  getStateFromPincode,
  isProductDeliverableToLocation,
} from '../lib/indian-regions.mjs';
import { prepareCheckout, CheckoutError } from '../lib/payment-core.mjs';

test('category tree functions correctly build hierarchy and calculate descendants', () => {
  const categories = [
    { id: 'plants', name: 'Plants', parentId: null },
    { id: 'indoor', name: 'Indoor Plants', parentId: 'plants' },
    { id: 'flowering', name: 'Flowering Indoor', parentId: 'indoor' },
    { id: 'pots', name: 'Pots & Planters', parentId: null },
  ];

  const tree = buildCategoryTree(categories);
  assert.equal(tree.length, 2);
  assert.equal(tree[0].id, 'plants');
  assert.equal(tree[0].children.length, 1);
  assert.equal(tree[0].children[0].id, 'indoor');
  assert.equal(tree[0].children[0].children[0].id, 'flowering');

  const flat = flattenCategoryTree(tree);
  assert.equal(flat.length, 4);
  assert.equal(flat[0].name, 'Plants');
  assert.equal(flat[0].depth, 0);
  assert.equal(flat[1].name, 'Indoor Plants');
  assert.equal(flat[1].depth, 1);
  assert.equal(flat[2].name, 'Flowering Indoor');
  assert.equal(flat[2].depth, 2);

  const plantDescendants = getDescendantIds('plants', categories);
  assert.ok(plantDescendants.has('indoor'));
  assert.ok(plantDescendants.has('flowering'));
  assert.ok(!plantDescendants.has('pots'));

  const path = getCategoryPath('flowering', categories);
  assert.deepEqual(path.map(c => c.id), ['plants', 'indoor', 'flowering']);

  const allPlantIds = getCategoryAndDescendantIds('plants', categories);
  assert.deepEqual(allPlantIds.sort(), ['flowering', 'indoor', 'plants'].sort());
});

test('discount calculation and 51% nudge rules behave correctly', () => {
  const rule = {
    enabled: true,
    title: 'Festive Offer',
    type: 'percentage',
    value: 10,
    minOrderAmount: 1000,
    maxDiscount: 200,
    nudgeThresholdPercent: 51,
  };

  // Below 51% threshold: ₹500 / ₹1000 = 50%
  const nudge50 = getDiscountNudgeStatus(500, rule);
  assert.equal(nudge50.isNudgeEligible, false);
  assert.equal(nudge50.isSatisfied, false);

  // At or above 51% threshold: ₹510 / ₹1000 = 51%
  const nudge51 = getDiscountNudgeStatus(510, rule);
  assert.equal(nudge51.isNudgeEligible, true);
  assert.equal(nudge51.isSatisfied, false);
  assert.equal(nudge51.remainingAmount, 490);

  // At 80% threshold: ₹800 / ₹1000
  const nudge80 = getDiscountNudgeStatus(800, rule);
  assert.equal(nudge80.isNudgeEligible, true);
  assert.equal(nudge80.isSatisfied, false);
  assert.equal(nudge80.remainingAmount, 200);

  // At or above target: ₹1200
  const nudgeSatisfied = getDiscountNudgeStatus(1200, rule);
  assert.equal(nudgeSatisfied.isSatisfied, true);

  // Discount calculation
  assert.equal(calculateDiscount(500, rule), 0); // below min
  assert.equal(calculateDiscount(1000, rule), 100); // 10% of 1000
  assert.equal(calculateDiscount(1500, rule), 150); // 10% of 1500
  assert.equal(calculateDiscount(3000, rule), 200); // capped at maxDiscount 200

  // Fixed discount calculation
  const fixedRule = { ...rule, type: 'fixed', value: 150 };
  assert.equal(calculateDiscount(1200, fixedRule), 150);

  // Validate settings
  const validated = validateOffersSettings({
    announcementText: 'Hello world',
    discountRule: { enabled: true, minOrderAmount: 500 },
  });
  assert.equal(validated.valid, true);
  assert.equal(validated.settings.discountRule.minOrderAmount, 500);
});

test('pincode and state delivery checks correctly restrict purchase', () => {
  assert.equal(getStateFromPincode('700001'), 'West Bengal');
  assert.equal(getStateFromPincode('721253'), 'West Bengal');
  assert.equal(getStateFromPincode('110001'), 'Delhi');
  assert.equal(getStateFromPincode('400001'), 'Maharashtra');

  // Product 1: All India
  const allIndiaProd = {
    id: 'p1',
    slug: 'all-india-plant',
    shippingScope: 'all_india',
  };
  assert.equal(isProductDeliverableToLocation(allIndiaProd, '700001').deliverable, true);
  assert.equal(isProductDeliverableToLocation(allIndiaProd, '110001').deliverable, true);

  // Product 2: Specific States (West Bengal, Odisha)
  const stateProd = {
    id: 'p2',
    slug: 'local-plant',
    shippingScope: 'states',
    deliveryStates: 'West Bengal, Odisha',
  };
  assert.equal(isProductDeliverableToLocation(stateProd, '700001').deliverable, true);
  assert.equal(isProductDeliverableToLocation(stateProd, '751001').deliverable, true); // Odisha
  assert.equal(isProductDeliverableToLocation(stateProd, '110001').deliverable, false); // Delhi

  // Product 3: Specific Pincodes
  const pincodeProd = {
    id: 'p3',
    slug: 'rare-plant',
    shippingScope: 'pincodes',
    deliveryPincodes: '721253, 700001',
  };
  assert.equal(isProductDeliverableToLocation(pincodeProd, '721253').deliverable, true);
  assert.equal(isProductDeliverableToLocation(pincodeProd, '700001').deliverable, true);
  assert.equal(isProductDeliverableToLocation(pincodeProd, '700002').deliverable, false);
});

test('prepareCheckout blocks orders when customer pincode is outside shipping scope', () => {
  const restrictedProduct = {
    id: 'p1',
    slug: 'rare-rose',
    title: 'Rare Rose',
    price: '500',
    isPublished: true,
    inStock: true,
    category: { isVisible: true },
    shippingScope: 'states',
    deliveryStates: 'West Bengal',
  };

  const validCustomer = {
    name: 'Suman Roy',
    phone: '9876543210',
    address: '123 Station Road, Medinipur',
    pincode: '721253', // West Bengal
  };

  const outOfStateCustomer = {
    ...validCustomer,
    address: '456 Connaught Place, New Delhi',
    pincode: '110001', // Delhi
  };

  const inputValid = {
    customer: validCustomer,
    items: [{ slug: 'rare-rose', qty: 1 }],
  };

  const inputInvalid = {
    customer: outOfStateCustomer,
    items: [{ slug: 'rare-rose', qty: 1 }],
  };

  // Valid order succeeds
  const prepared = prepareCheckout(inputValid, [restrictedProduct]);
  assert.equal(prepared.subtotal, 50000);

  // Invalid order throws CheckoutError
  assert.throws(
    () => prepareCheckout(inputInvalid, [restrictedProduct]),
    CheckoutError
  );
});

test('customer session correctly preserves state and pincode', async () => {
  const { createCustomerSession, verifyCustomerSession } = await import('../lib/customer-session.mjs');
  const token = await createCustomerSession({
    id: 'cust-wb',
    phone: '8637054105',
    name: 'Anirban',
    state: 'West Bengal',
    pincode: '721253',
  });

  const verified = await verifyCustomerSession(token);
  assert.ok(verified);
  assert.equal(verified.id, 'cust-wb');
  assert.equal(verified.state, 'West Bengal');
  assert.equal(verified.pincode, '721253');
});

test('product size field supports text and number values and is saved in database schema', async () => {
  const { mkdtempSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const path = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const Database = (await import('better-sqlite3')).default;

  const dir = mkdtempSync(path.join(tmpdir(), 'sellersking-product-size-'));
  const filename = path.join(dir, 'test.db');
  const db = new Database(filename);

  try {
    db.exec('CREATE TABLE Settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
    db.exec('CREATE TABLE Product (id TEXT PRIMARY KEY, slug TEXT, title TEXT, price TEXT)');

    // Run category & product schema initializer on clean database
    execFileSync(process.execPath, ['scripts/initialize-categories.cjs'], {
      env: { ...process.env, DATABASE_URL: `file:${filename}` },
      stdio: 'pipe',
    });

    const columns = db.prepare('PRAGMA table_info(Product)').all().map(c => c.name);
    assert.ok(columns.includes('size'), 'Product table must include size column');

    // Test text size insertion
    db.prepare(`
      INSERT INTO Product (id, slug, title, price, size)
      VALUES (?, ?, ?, ?, ?)
    `).run('prod-1', 't-shirt-xl', 'Premium T-Shirt', '999', 'XL');

    const prodText = db.prepare('SELECT id, title, size FROM Product WHERE id = ?').get('prod-1');
    assert.equal(prodText.size, 'XL');

    // Test numeric size insertion (e.g. shoe size 10)
    db.prepare(`
      INSERT INTO Product (id, slug, title, price, size)
      VALUES (?, ?, ?, ?, ?)
    `).run('prod-2', 'running-shoes-10', 'Running Shoes', '2499', '10');

    const prodNum = db.prepare('SELECT id, title, size FROM Product WHERE id = ?').get('prod-2');
    assert.equal(prodNum.size, '10');
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('multiple sizes with individual prices and stock allow selecting multiple sizes at checkout', async () => {
  const { prepareCheckout } = await import('../lib/payment-core.mjs');

  const multiSizeProduct = {
    id: 'p-multi',
    slug: 'ceramic-planter',
    title: 'Ceramic Planter Pot',
    price: '299.00',
    inStock: true,
    isPublished: true,
    category: { isVisible: true },
    adeniumOptions: JSON.stringify({
      '6 inch': { price: '299.00', inStock: true },
      '8 inch': { price: '499.00', inStock: true },
      '10 inch': { price: '699.00', inStock: false }, // Sold out size
    }),
  };

  const customer = {
    name: 'Customer Test',
    phone: '9876543210',
    address: '10 Nursery Road',
    pincode: '721253',
  };

  // 1. Customer purchases multiple available sizes of the same product
  const checkoutInput = {
    customer,
    items: [
      { slug: 'ceramic-planter', qty: 2, variant: '6 inch' },
      { slug: 'ceramic-planter', qty: 1, variant: '8 inch' },
    ],
  };

  const quote = prepareCheckout(checkoutInput, [multiSizeProduct]);
  // Subtotal: 2 * 29900 + 1 * 49900 = 59800 + 49900 = 109700 paise (₹1097)
  assert.equal(quote.subtotal, 109700);

  const parsedItems = JSON.parse(quote.itemsJson);
  assert.equal(parsedItems.length, 2);
  assert.equal(parsedItems[0].variant, '6 inch');
  assert.equal(parsedItems[0].qty, 2);
  assert.equal(parsedItems[0].unitAmount, 29900);

  assert.equal(parsedItems[1].variant, '8 inch');
  assert.equal(parsedItems[1].qty, 1);
  assert.equal(parsedItems[1].unitAmount, 49900);

  // 2. Customer attempts to purchase sold out size (10 inch) -> must be blocked
  assert.throws(() => {
    prepareCheckout({
      customer,
      items: [
        { slug: 'ceramic-planter', qty: 1, variant: '10 inch' },
      ],
    }, [multiSizeProduct]);
  }, /sold out/i);
});

test('product and category drag-and-drop position reordering and new product last position', async () => {
  const { mkdtempSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const path = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const Database = (await import('better-sqlite3')).default;

  const dir = mkdtempSync(path.join(tmpdir(), 'sellersking-reorder-'));
  const filename = path.join(dir, 'test.db');
  const db = new Database(filename);

  try {
    db.exec('CREATE TABLE Settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
    db.exec('CREATE TABLE Product (id TEXT PRIMARY KEY, slug TEXT, title TEXT, price TEXT, createdAt TEXT)');

    // Run category & product schema initializer
    execFileSync(process.execPath, ['scripts/initialize-categories.cjs'], {
      env: { ...process.env, DATABASE_URL: `file:${filename}` },
      stdio: 'pipe',
    });

    const columns = db.prepare('PRAGMA table_info(Product)').all().map(c => c.name);
    assert.ok(columns.includes('order'), 'Product table must include order column for drag-and-drop reordering');

    // Insert 3 initial products with orders 0, 1, 2
    const insert = db.prepare(`
      INSERT INTO Product (id, slug, title, price, "order", createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run('p1', 'rose', 'Rose Plant', '150', 0, '2026-01-01T00:00:00Z');
    insert.run('p2', 'tulip', 'Tulip Plant', '200', 1, '2026-01-02T00:00:00Z');
    insert.run('p3', 'orchid', 'Orchid Plant', '500', 2, '2026-01-03T00:00:00Z');

    // 1. Verify new product is added at the LAST position: max(order) + 1
    const maxOrderRow = db.prepare('SELECT MAX("order") as maxOrder FROM Product').get();
    const newProductOrder = (maxOrderRow?.maxOrder ?? -1) + 1;
    assert.equal(newProductOrder, 3, 'New product must get order 3 (end of the list)');

    insert.run('p4', 'fern', 'Fern Plant', '120', newProductOrder, '2026-01-04T00:00:00Z');

    // Fetch products ordered by order asc
    const orderedProducts = db.prepare('SELECT id, title, "order" FROM Product ORDER BY "order" ASC, createdAt ASC').all();
    assert.equal(orderedProducts.length, 4);
    assert.equal(orderedProducts[0].id, 'p1');
    assert.equal(orderedProducts[3].id, 'p4', 'New product p4 must appear in the last position');

    // 2. Simulate drag and drop reordering: move p4 (Fern) to first place [p4, p1, p2, p3]
    const reorderedIds = ['p4', 'p1', 'p2', 'p3'];
    const updateOrder = db.prepare('UPDATE Product SET "order" = ? WHERE id = ?');
    db.transaction(() => {
      reorderedIds.forEach((id, idx) => updateOrder.run(idx, id));
    })();

    const afterDragProducts = db.prepare('SELECT id, title, "order" FROM Product ORDER BY "order" ASC').all();
    assert.equal(afterDragProducts[0].id, 'p4', 'p4 must now be at the 1st position');
    assert.equal(afterDragProducts[0].order, 0);
    assert.equal(afterDragProducts[1].id, 'p1');
    assert.equal(afterDragProducts[1].order, 1);
    assert.equal(afterDragProducts[3].id, 'p3');
    assert.equal(afterDragProducts[3].order, 3);

    // 3. Category reordering
    const insertCat = db.prepare(`
      INSERT INTO Category (id, slug, name, nameKey, "order")
      VALUES (?, ?, ?, ?, ?)
    `);
    insertCat.run('c1', 'indoor', 'Indoor Plants', 'indoor', 0);
    insertCat.run('c2', 'outdoor', 'Outdoor Plants', 'outdoor', 1);

    // Drag outdoor before indoor -> [c2, c1]
    const reorderedCatIds = ['c2', 'c1'];
    const updateCatOrder = db.prepare('UPDATE Category SET "order" = ? WHERE id = ?');
    db.transaction(() => {
      reorderedCatIds.forEach((id, idx) => updateCatOrder.run(idx, id));
    })();

    const afterDragCats = db.prepare('SELECT id, name, "order" FROM Category ORDER BY "order" ASC').all();
    assert.equal(afterDragCats[0].id, 'c2');
    assert.equal(afterDragCats[0].order, 0);
    assert.equal(afterDragCats[1].id, 'c1');
    assert.equal(afterDragCats[1].order, 1);
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('product colors and catalog photos support color variants and cart checkout line items', async () => {
  const { business } = await import('../lib/business.mjs');
  assert.equal(business.name, 'Sellersking Infotech PVT. LTD.');
  assert.equal(business.legalName, 'Sellersking Infotech PVT. LTD.');

  // Test checkout with color variant
  const product = {
    id: 'prod-color-1',
    slug: 'hibiscus-exotic',
    title: 'Exotic Hibiscus',
    price: '250',
    oldPrice: '350',
    isPublished: true,
    inStock: true,
    colors: JSON.stringify([
      { id: '1', name: 'Crimson Red', hex: '#EF4444', image: 'https://cdn.sellersking.com/red.webp', inStock: true },
      { id: '2', name: 'Golden Yellow', hex: '#FACC15', image: 'https://cdn.sellersking.com/yellow.webp', inStock: true },
      { id: '3', name: 'Snow White', hex: '#FFFFFF', image: '', inStock: false },
    ]),
    category: { isVisible: true },
  };

  const products = [product];

  // Cart items with two different colors of the same product
  const items = [
    { slug: 'hibiscus-exotic', qty: 1, color: 'Crimson Red' },
    { slug: 'hibiscus-exotic', qty: 2, color: 'Golden Yellow' },
  ];

  const checkout = prepareCheckout({
    items,
    customer: {
      name: 'Anita Roy',
      phone: '9876543210',
      address: '123 Park Street, Near Metro Station',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
    },
  }, products);

  const parsedItems = JSON.parse(checkout.itemsJson);
  assert.equal(parsedItems.length, 2);
  assert.equal(parsedItems[0].color, 'Crimson Red');
  assert.equal(parsedItems[0].qty, 1);
  assert.equal(parsedItems[1].color, 'Golden Yellow');
  assert.equal(parsedItems[1].qty, 2);
  assert.equal(checkout.subtotal, (250 * 1 + 250 * 2) * 100);
});

