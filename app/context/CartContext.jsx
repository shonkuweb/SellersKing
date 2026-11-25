"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    let controller;
    const refresh = async () => {
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;
      try {
        const response = await fetch("/api/products", { cache: "no-store", signal: requestController.signal });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data)) throw new Error("Unable to load products");
        if (active) { setProducts(data); setProductsError(false); }
      } catch (error) {
        if (active && error.name !== "AbortError") setProductsError(true);
      } finally {
        if (active && !requestController.signal.aborted) setProductsLoading(false);
      }
    };
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    const channels = typeof BroadcastChannel !== "undefined" ? ["store-products", "store-categories"].map(name => new BroadcastChannel(name)) : [];
    channels.forEach(channel => { channel.onmessage = refresh; });
    return () => {
      active = false; controller?.abort(); channels.forEach(channel => channel.close());
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("blooming-partners-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("blooming-partners-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (slug, qty = 1, variant = null, color = null) => {
    const product = products.find(product => product.slug === slug);
    if (!product || product.inStock === false || !Number.isInteger(qty) || qty < 1) return;
    if (variant && product.adeniumOptions && product.adeniumOptions[variant]) {
      const opt = product.adeniumOptions[variant];
      if (typeof opt === 'object' && opt !== null && opt.inStock === false) return;
    }
    if (color && Array.isArray(product.colors)) {
      const colObj = product.colors.find(c => c.name.toLowerCase() === String(color).toLowerCase());
      if (colObj && colObj.inStock === false) return;
    }
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug && (i.variant || null) === (variant || null) && (i.color || null) === (color || null));
      if (found) {
        return prev.map((i) => (i.slug === slug && (i.variant || null) === (variant || null) && (i.color || null) === (color || null) ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { slug, qty, variant: variant || null, color: color || null }];
    });
  };

  const showCartAfterAdd = () => {
    if (window.matchMedia('(min-width: 768px)').matches) setIsSidebarOpen(true);
  };

  const updateQty = (slug, variant, qty, color = null) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => !(i.slug === slug && (i.variant || null) === (variant || null) && (i.color || null) === (color || null))));
      return;
    }
    setItems((prev) => prev.map((i) => (i.slug === slug && (i.variant || null) === (variant || null) && (i.color || null) === (color || null) ? { ...i, qty } : i)));
  };

  const removeItem = (slug, variant, color = null) => setItems((prev) => prev.filter((i) => !(i.slug === slug && (i.variant || null) === (variant || null) && (i.color || null) === (color || null))));
  const clear = () => setItems([]);

  const removePurchased = useCallback((orderId, purchased) => {
    let processed = [];
    try { processed = JSON.parse(localStorage.getItem('nursery-confirmed-cart-orders') || '[]'); } catch {}
    if (processed.includes(orderId)) return;
    setItems(current => current.map(item => {
      const paid = purchased.find(line => line.slug === item.slug && (line.variant || null) === (item.variant || null) && (line.color || null) === (item.color || null));
      return paid ? { ...item, qty: Math.max(0, item.qty - paid.qty) } : item;
    }).filter(item => item.qty > 0));
    try { localStorage.setItem('nursery-confirmed-cart-orders', JSON.stringify([...processed, orderId].slice(-100))); } catch {}
  }, []);

  const detailedItems = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.slug === item.slug);
          if (!product || product.inStock === false) return null;
          let price = product.price;
          if (item.variant && product.adeniumOptions && product.adeniumOptions[item.variant]) {
            const opt = product.adeniumOptions[item.variant];
            if (typeof opt === 'object' && opt !== null) {
              if (opt.inStock === false) return null;
              price = opt.price ?? product.price;
            } else {
              price = opt;
            }
          }
          let image = product.image;
          if (item.color && Array.isArray(product.colors)) {
            const col = product.colors.find(c => c.name.toLowerCase() === String(item.color).toLowerCase());
            if (col?.image) image = col.image;
          }
          return { ...product, qty: item.qty, variant: item.variant, color: item.color, price, image };
        })
        .filter(Boolean),
    [items, products]
  );

  return (
    <CartContext.Provider value={{ items: detailedItems, addItem, showCartAfterAdd, updateQty, removeItem, clear, removePurchased, products, productsLoading, productsError, isSidebarOpen, setIsSidebarOpen, isMenuOpen, setIsMenuOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
