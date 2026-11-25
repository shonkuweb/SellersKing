"use client";

import { useStoreSettings } from "../context/StoreSettingsContext";
import styles from "./PackingTicker.module.css";

const defaultMessage = "⚡ Express Pan-India Delivery • Handpicked Quality Products • 100% Genuine Guarantee";

export default function PackingTicker() {
  const { heroSettings } = useStoreSettings();
  const message = heroSettings?.endTickerText?.trim() || defaultMessage;

  return (
    <aside className={styles.ticker} aria-label="Order preparation notice">
      <p className={styles.accessibleText}>{message}</p>
      <div className={styles.track} aria-hidden="true">
        <span>{message}</span>
        <span>{message}</span>
      </div>
    </aside>
  );
}
