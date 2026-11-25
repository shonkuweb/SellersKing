"use client";

import Link from "next/link";
import { FiImage } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addItem, showCartAfterAdd } = useCart();
  const price = Number(product.price);
  const original = Number(product.oldPrice);
  const discount = original > price ? Math.round((original - price) / original * 100) : 0;
  const format = value => Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const hasVariants = product.adeniumOptions && Object.keys(product.adeniumOptions).length > 0;
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const hasOptions = hasVariants || hasColors;

  return (
    <article className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.imageLink} aria-label={`View ${product.title}`}>
        {product.image ? <img src={product.image} alt={product.title} loading="lazy" decoding="async" /> : <span className={styles.noImage}><FiImage aria-hidden="true" /><span>No image</span></span>}
        {discount > 0 && <span className={styles.discount}>{discount}% OFF</span>}
      </Link>
      <div className={styles.info}>
        <Link href={`/product/${product.slug}`} className={styles.title}>{product.title}</Link>
        {hasColors && (
          <div className={styles.colorDotsWrap} title={`${product.colors.length} color(s) available`}>
            {product.colors.slice(0, 5).map((c, i) => (
              <span
                key={c.id || i}
                className={styles.colorDot}
                style={{ backgroundColor: c.hex || '#cbd5e1' }}
                title={c.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className={styles.moreColors}>+{product.colors.length - 5}</span>
            )}
          </div>
        )}
        <div className={styles.prices}><strong>Rs. {format(price)}</strong>{discount > 0 && <del>Rs. {format(original)}</del>}</div>
        {product.inStock === false ? (
          <button type="button" className={styles.add} disabled>Sold Out</button>
        ) : hasOptions ? (
          <Link href={`/product/${product.slug}`} className={styles.add}>
            {hasVariants ? "Select Options" : "Choose Color"}
          </Link>
        ) : (
          <button type="button" className={styles.add} onClick={() => { addItem(product.slug); showCartAfterAdd(); }} aria-label={`Add ${product.title} to cart`}>
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
