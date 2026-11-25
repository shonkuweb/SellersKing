import Link from "next/link";
import { business } from "../../lib/business.mjs";
import styles from "../components/PolicyPage.module.css";
import { FiChevronRight, FiRefreshCw } from "react-icons/fi";

export const metadata = {
  title: `Cancellation & Refund Policy | ${business.name}`,
  description: `Cancellation, return, and refund policies for orders placed on ${business.name}. Transparent timelines, live plant transit guarantees, and 5-7 business day refunds.`,
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
            Because our catalog includes live plants, organic materials, and specialized goods, our return criteria are categorized as follows:
          </p>
          <div className={styles.highlightBox}>
            <strong>Live Plants & Botanical Items (Perishable Goods):</strong> Live plants undergo specialized transit packaging with moisture-retaining root wraps and ventilated corrugated boxes. In the rare event your plant arrives severely wilted, broken, decayed, or dead on arrival due to courier delays, you must notify us within <strong>24 to 48 hours of delivery</strong> with clear photographs or an unboxing video showing the damaged condition. Upon verification, we will immediately arrange a <strong>free replacement</strong> or a <strong>full refund</strong>.
          </div>
          <ul className={styles.list}>
            <li>
              <strong>Non-Perishable Goods (Pots, Planters, Tools, Accessories, Tech Products):</strong> You may initiate a return or replacement request within <strong>7 calendar days</strong> of delivery if the item is defective, mechanically damaged, or if an incorrect item was delivered.
            </li>
            <li>
              <strong>Condition of Return:</strong> Non-perishable items must be unused, in their original brand packaging, accompanied by original tags, user manuals, and the purchase invoice.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Non-Returnable Scenarios</h2>
          <p className={styles.sectionContent}>
            Returns or refunds will not be entertained in the following circumstances:
          </p>
          <ul className={styles.list}>
            <li>Damage resulting from improper care, overwatering, repotting shock after 48 hours of receipt, or neglect after delivery.</li>
            <li>Minor cosmetic shedding of yellow leaves or soil loosening during transit, which is normal for live plant transportation and does not affect the root health.</li>
            <li>Requests initiated beyond the stipulated 48-hour (live plants) or 7-day (non-perishables) notification window.</li>
            <li>Items returned without original packaging or parts missing.</li>
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
