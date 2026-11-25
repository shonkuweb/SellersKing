import Link from "next/link";
import { business } from "../../lib/business.mjs";
import styles from "../components/PolicyPage.module.css";
import { FiChevronRight, FiShield } from "react-icons/fi";

export const metadata = {
  title: `Privacy Policy | ${business.name}`,
  description: `Privacy Policy for ${business.name}. Learn how we collect, protect, and handle your personal and transaction data.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <FiChevronRight aria-hidden="true" />
        <span>Privacy Policy</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.badge}>
          <FiShield aria-hidden="true" />
          <span>Data Protection & Privacy</span>
        </div>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>
          Last Updated: November 2026 • Your Privacy & Security is Our Priority at {business.name}
        </p>
      </header>

      <div className={styles.card}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Overview</h2>
          <p className={styles.sectionContent}>
            At <strong>{business.name}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we are committed to safeguarding the privacy and confidential personal data of all visitors and registered users of our website. This Privacy Policy describes how your personal information is collected, used, protected, and shared when you visit or make a purchase from our store.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
          <p className={styles.sectionContent}>
            When you visit or make a purchase through our platform, we collect certain essential details necessary to fulfill your order and provide customer support:
          </p>
          <ul className={styles.list}>
            <li><strong>Account & Contact Information:</strong> Full name, telephone/mobile number, WhatsApp contact number, and email address.</li>
            <li><strong>Delivery & Shipping Information:</strong> Complete recipient street address, landmark, city, state, postal code (PIN code), and delivery instructions.</li>
            <li><strong>Transactional Records:</strong> Order item snapshots, quantities, sizes, color selections, purchase date, invoice numbers, and payment status receipts.</li>
            <li><strong>Device & Browsing Data:</strong> IP address, device type, browser version, and pages viewed, collected via standard session logs to optimize site responsiveness.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Payment Security & Third-Party Gateway (Razorpay)</h2>
          <p className={styles.sectionContent}>
            We integrate with certified, industry-leading third-party payment processors, primarily <strong>Razorpay</strong>, to handle all electronic monetary transactions securely.
          </p>
          <div className={styles.highlightBox}>
            <strong>Zero Card Data Storage:</strong> {business.name} never collects, views, or stores your credit card numbers, debit card numbers, CVV security codes, UPI PINs, or net banking passwords. All sensitive payment credentials are submitted directly to Razorpay through 256-bit SSL encrypted sessions that comply with the highest global security benchmark: <strong>PCI-DSS Level 1 Certification</strong>.
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. How We Use Your Information</h2>
          <p className={styles.sectionContent}>
            We utilize the collected information strictly for legitimate commercial and operational purposes, including:
          </p>
          <ul className={styles.list}>
            <li>Processing, packing, and dispatching your product orders.</li>
            <li>Sending transactional notifications, payment receipts, GST/commercial invoices, and tracking links via SMS, WhatsApp, and email.</li>
            <li>Communicating with you regarding customer support queries, delivery verification, or return requests.</li>
            <li>Screening orders for potential risk, fraud prevention, and regulatory compliance.</li>
            <li>Improving our website performance, inventory assortment, and customer satisfaction.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Sharing of Personal Data</h2>
          <p className={styles.sectionContent}>
            We do <strong>not</strong> sell, rent, trade, or monetize your personal data to any third-party advertisers or marketing agencies. We share information only with trusted operational partners strictly necessary to complete your purchase:
          </p>
          <ul className={styles.list}>
            <li><strong>Logistics & Courier Partners:</strong> We share your recipient name, shipping address, and phone number with our delivery carriers (e.g., Delhivery, Blue Dart, DTDC, India Post) solely for dispatching and delivering parcels to your door.</li>
            <li><strong>Payment Gateways:</strong> Necessary billing metadata is shared with Razorpay for payment verification, fraud detection, and refund processing.</li>
            <li><strong>Legal & Regulatory Authorities:</strong> Where mandated by law, court order, or governmental inquiry to comply with statutory legal requirements.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Cookies & Local Storage</h2>
          <p className={styles.sectionContent}>
            Our website utilizes minimal, essential cookies and browser local storage to maintain your active shopping cart, preserve your logged-in session, and store basic UI preferences. You can configure your browser to block or alert you about cookies; however, disabling essential cookies may impact certain cart and checkout functionalities.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Data Retention & User Rights</h2>
          <p className={styles.sectionContent}>
            We retain your purchase history and order details in our database to comply with statutory accounting and tax regulations under Indian law. Registered customers have the full right to inspect, update, or request the deletion of their personal profile information by visiting their account settings page or contacting our grievance officer.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Grievance Officer & Contact Details</h2>
          <p className={styles.sectionContent}>
            In accordance with the Information Technology Act, 2000 and the rules made thereunder, any privacy inquiries, data requests, or grievances may be directed to our designated officer:
          </p>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Designation</div>
              <div className={styles.contactValue}>Grievance Officer</div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Company</div>
              <div className={styles.contactValue}>{business.name}</div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Official Email</div>
              <div className={styles.contactValue}>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Phone / Helpline</div>
              <div className={styles.contactValue}>
                <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
