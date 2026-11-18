"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FiCheck, FiInfo } from "react-icons/fi";
import { business } from "../../../lib/business.mjs";
import styles from "./WhatsappSettingsEditor.module.css";

export default function WhatsappSettingsEditor({ onClose }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconCircle}>
        <FaWhatsapp aria-hidden="true" />
        <span className={styles.statusDot} title="WhatsApp Service Online" />
      </div>

      <h3 className={styles.title}>WhatsApp Integration</h3>

      <div className={styles.statusBanner} role="status">
        <span className={styles.bannerIcon}>
          <FiCheck aria-hidden="true" />
        </span>
        <div className={styles.bannerText}>
          <strong>WhatsApp is connected</strong>
          <p>Will be active at the time the site is live.</p>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Business Support Number</span>
          <span className={styles.detailValue}>{business.phoneDisplay}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Integration Channel</span>
          <span className={styles.detailValue}>WhatsApp Direct &amp; API</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Live Status</span>
          <span className={styles.badgeReady}>Ready to Launch</span>
        </div>
      </div>

      <div className={styles.featureList}>
        <h4>Automated Live Features</h4>
        <ul>
          <li>Floating 1-click WhatsApp customer support widget</li>
          <li>Instant pre-filled product inquiry messages</li>
          <li>Direct WhatsApp order confirmation &amp; inquiry links</li>
        </ul>
      </div>

      {onClose && (
        <button type="button" className={styles.actionButton} onClick={onClose}>
          Got it
        </button>
      )}
    </div>
  );
}
