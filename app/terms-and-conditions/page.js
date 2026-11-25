import Link from "next/link";
import { business } from "../../lib/business.mjs";
import styles from "../components/PolicyPage.module.css";
import { FiChevronRight, FiFileText } from "react-icons/fi";

export const metadata = {
  title: `Terms & Conditions | ${business.name}`,
  description: `Terms and conditions of service for ${business.name}. Read about our user agreement, pricing, ordering, and governing laws.`,
};

export default function TermsAndConditionsPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <FiChevronRight aria-hidden="true" />
        <span>Terms & Conditions</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.badge}>
          <FiFileText aria-hidden="true" />
          <span>Legal & Compliance</span>
        </div>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.subtitle}>
          Last Updated: November 2026 • Official Terms of Service for {business.name}
        </p>
      </header>

      <div className={styles.card}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Introduction & Acceptance of Terms</h2>
          <p className={styles.sectionContent}>
            Welcome to <strong>{business.name}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By accessing, browsing, or using our website, digital platform, and ordering products, you (&ldquo;User&rdquo;, &ldquo;Customer&rdquo;, or &ldquo;You&rdquo;) unconditionally agree to be bound by the following Terms & Conditions, together with our Privacy Policy, Cancellation & Refund Policy, and Shipping & Delivery Policy.
          </p>
          <p className={styles.sectionContent}>
            If you do not agree with any part of these terms, you should immediately discontinue using our website and services.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Eligibility & Account Responsibilities</h2>
          <p className={styles.sectionContent}>
            By creating an account or placing an order on our platform, you represent and warrant that:
          </p>
          <ul className={styles.list}>
            <li>You are at least 18 years of age or possess legal parental/guardian consent to make commercial transactions.</li>
            <li>All information provided during registration, checkout, or account updates (including phone number, delivery address, and recipient name) is accurate, current, and complete.</li>
            <li>You are solely responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your login session.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Product Information, Pricing & Availability</h2>
          <p className={styles.sectionContent}>
            We make every reasonable effort to ensure that product descriptions, catalog imagery, dimensions, size options, and colors are displayed accurately on our site. Actual product packaging, colors, and finishes may slightly vary depending on screen display settings, lighting, or manufacturer revisions.
          </p>
          <p className={styles.sectionContent}>
            All prices listed on our platform are denominated in <strong>Indian Rupees (INR ₹)</strong> and are inclusive of applicable taxes unless stated otherwise. We reserve the right to revise catalog prices, promotional discounts, and availability at any time without prior notice. In the event of an inadvertent technical pricing discrepancy, we will contact you before dispatch or cancel the order with a full refund.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Payment Processing & Security</h2>
          <p className={styles.sectionContent}>
            Orders placed on our website are processed through licensed, industry-standard, PCI-DSS Level 1 compliant payment gateways (including <strong>Razorpay</strong>). You may complete payments via Credit Card, Debit Card, Net Banking, UPI (Google Pay, PhonePe, Paytm, etc.), and authorized mobile wallets.
          </p>
          <div className={styles.highlightBox}>
            <strong>Payment Security Guarantee:</strong> {business.name} does NOT store, capture, or have access to your raw credit/debit card numbers, CVV security codes, or banking PINs. All financial transactions are directly encrypted and transmitted through verified banking channels.
          </div>
          <p className={styles.sectionContent}>
            An order is considered successfully placed and confirmed only upon authorized payment verification and clearance from the payment gateway.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Order Confirmation & Fulfillment</h2>
          <p className={styles.sectionContent}>
            Upon completing checkout, you will receive an automated order confirmation notification via SMS, WhatsApp, and/or email containing your order reference ID (e.g., SK-XXXX). We reserve the right to limit quantities, reject orders, or cancel transactions where fraud, misuse, or logistical non-serviceability is detected.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Intellectual Property Rights</h2>
          <p className={styles.sectionContent}>
            All content on this website, including but not limited to brand logos, trademarks, visual design, custom software code, product images, written copy, and graphics, is the exclusive property of <strong>{business.name}</strong> and is protected under Indian Copyright and Intellectual Property Laws. Unauthorized copying, reproduction, or redistribution is strictly prohibited.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
          <p className={styles.sectionContent}>
            In no event shall {business.name}, its directors, employees, or partners be liable for any indirect, incidental, punitive, or consequential damages resulting from the use of our products, courier delivery delays beyond reasonable control, or temporary website maintenance downtime. Our maximum cumulative liability for any verified claim shall not exceed the amount actually paid by you for the specific order in dispute.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Governing Law & Jurisdiction</h2>
          <p className={styles.sectionContent}>
            These Terms & Conditions shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes, claims, or legal proceedings arising out of or related to our platform, purchases, or services shall be subject to the exclusive jurisdiction of the competent courts in <strong>West Bengal, India</strong>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>9. Contact & Support Information</h2>
          <p className={styles.sectionContent}>
            If you have questions, feedback, or grievances regarding these Terms & Conditions, please contact us through our official support channels:
          </p>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Company Entity</div>
              <div className={styles.contactValue}>{business.name}</div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Email Support</div>
              <div className={styles.contactValue}>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Phone / WhatsApp</div>
              <div className={styles.contactValue}>
                <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a>
              </div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Registered Address</div>
              <div className={styles.contactValue}>{business.address}, {business.region}, India</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
