import ContactForm from "./ContactForm";
import { business, whatsappUrl } from "../../lib/business.mjs";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./page.module.css";

export const metadata = {
  title: 'Contact Us',
  description: `Contact ${business.name} on WhatsApp at ${business.phoneDisplay}.`,
};

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <h1>Contact Us</h1>
      <p className={styles.intro}>Have a question about our products or your order? Send us a message.</p>

      <div className={styles.contactLayout}>
        <aside className={styles.infoCol} aria-label="Store contact information">
          <div className={styles.infoCard}>
            <h2>{business.name}</h2>
            <p className={styles.infoTagline}>Shop smarter, live better.</p>

            <div className={styles.infoItems}>
              <div className={styles.infoItem}>
                <FiMapPin className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <strong>Store Location</strong>
                  <p>{business.address}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FiPhone className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <strong>Phone / Support</strong>
                  <p><a href={`tel:${business.phone}`}>{business.phoneDisplay}</a></p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FiMail className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <strong>Email</strong>
                  <p><a href={`mailto:${business.email}`}>{business.email}</a></p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FiClock className={styles.infoIcon} aria-hidden="true" />
                <div>
                  <strong>Support Hours</strong>
                  <p>Mon – Sat: 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl("Hello SellersKing, I'd like to ask a question.")}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.infoWhatsappBtn}
            >
              <FaWhatsapp aria-hidden="true" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </aside>

        <div className={styles.formCol}>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
