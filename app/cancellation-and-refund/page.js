import Link from "next/link";
import { business } from "../../lib/business.mjs";
import styles from "../components/PolicyPage.module.css";
import { FiChevronRight, FiRefreshCw } from "react-icons/fi";

export const metadata = {
  title: `Cancellation & Refund Policy | ${business.name}`,
  description: `Cancellation, return, and refund policies for orders placed on ${business.name}. Transparent timelines, transit damage protection, and 5-7 business day refunds.`,
};

export default function CancellationAndRefundPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <FiChevronRight aria-hidden="true" />
        <span>Cancellation & Refund Policy</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.badge}>
          <FiRefreshCw aria-hidden="true" />
          <span>Transparent Customer Guarantee</span>
        </div>
        <h1 className={styles.title}>Cancellation & Refund Policy</h1>
        <p className={styles.subtitle}>
          Last Updated: November 2026 • Official Refund Guidelines for {business.name}
        </p>
      </header>

      <div className={styles.card}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Order Cancellation Policy</h2>
          <p className={styles.sectionContent}>
            At <strong>{business.name}</strong>, we endeavor to process and pack your orders promptly. You may request cancellation of your order under the following conditions:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Prior to Dispatch / Packaging:</strong> You can cancel your order at no charge before it has been marked as packed or handed over to our logistics partner. To cancel, please message our support team on WhatsApp at <strong>{business.phoneDisplay}</strong> or email <strong>{business.email}</strong> with your order reference number (e.g. SK-XXXX).
            </li>
            <li>
              <strong>Post-Dispatch:</strong> Once a parcel is dispatched and handed over to the courier with an active tracking number (AWB), the order cannot be cancelled in transit. You will need to receive the shipment and proceed under our return or replacement guidelines.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Return & Replacement Eligibility</h2>
          <p className={styles.sectionContent}>
            We want you to be completely satisfied with every purchase from our store. Our return and replacement guidelines are as follows:
          </p>
          <div className={styles.highlightBox}>
            <strong>Damaged or Defective Items on Arrival:</strong> In the rare event an item reaches you in damaged condition, physically defective, or with missing parts, you must notify our customer support team within <strong>48 hours of delivery</strong> with clear photographs or an unboxing video. Upon quick verification, we will immediately arrange a <strong>free replacement</strong> or a <strong>full refund</strong>.
          </div>
          <ul className={styles.list}>
            <li>
              <strong>Standard Products (Electronics, Home, Lifestyle, Fashion & Accessories):</strong> Eligible for return or replacement within <strong>7 calendar days</strong> of delivery if defective, damaged, or if an incorrect model/color/size was received.
            </li>
            <li>
              <strong>Condition of Return:</strong> Returned items must be unused, unwashed, in their original brand packaging with all tags, barcode labels, accessories, and warranty cards intact.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Non-Returnable Scenarios</h2>
          <p className={styles.sectionContent}>
            Returns or refunds will not be entertained in the following circumstances:
          </p>
          <ul className={styles.list}>
            <li>Damage resulting from misuse, mishandling, liquid spillage, or alterations made to the product after delivery.</li>
            <li>Requests initiated beyond the stipulated 48-hour (transit damage) or 7-day return window.</li>
            <li>Items returned without original packaging, accessories, or original purchase invoice.</li>
            <li>Personal care or hygiene products where security seals have been broken.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Refund Mode & Processing Timeline</h2>
          <p className={styles.sectionContent}>
            Once your cancellation or returned item inspection is approved by our quality team:
          </p>
          <div className={styles.highlightBox}>
            <strong>Razorpay Refund Timeline:</strong> Approved refunds are initiated immediately to the <strong>original source of payment</strong> (Credit/Debit Card, Net Banking, UPI ID, or Mobile Wallet) via our payment gateway partner Razorpay. The credited amount will reflect in your bank account or payment statement within <strong>5 to 7 business days</strong>, adhering to standard banking processing schedules.
          </div>
          <p className={styles.sectionContent}>
            You will receive an automated email and SMS notification containing the Razorpay Refund Reference ARN ID once the refund transaction is executed.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. How to Initiate a Return or Refund</h2>
          <p className={styles.sectionContent}>
            Initiating a claim is simple and fast. Reach out directly to our customer assistance team with your order reference number and unboxing proof:
          </p>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>WhatsApp Support (Fastest)</div>
              <div className={styles.contactValue}>
                <a href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Sellersking Infotech PVT. LTD., I would like to request an order cancellation / refund.")}`} target="_blank" rel="noopener noreferrer">
                  {business.phoneDisplay}
                </a>
              </div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Email Support</div>
              <div className={styles.contactValue}>
                <a href={`mailto:${business.email}?subject=${encodeURIComponent("Cancellation & Refund Request")}`}>
                  {business.email}
                </a>
              </div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Customer Care Hours</div>
              <div className={styles.contactValue}>Monday – Saturday (9:00 AM – 7:00 PM IST)</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
