import Link from "next/link";
import { business } from "../../lib/business.mjs";
import styles from "../components/PolicyPage.module.css";
import { FiChevronRight, FiPackage } from "react-icons/fi";

export const metadata = {
  title: `Shipping & Delivery Policy | ${business.name}`,
  description: `Shipping rates, delivery timelines, and safe packaging guarantees for orders placed on ${business.name}. Pan-India courier delivery.`,
};

export default function ShippingAndDeliveryPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <FiChevronRight aria-hidden="true" />
        <span>Shipping & Delivery Policy</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.badge}>
          <FiPackage aria-hidden="true" />
          <span>Pan-India Logistics</span>
        </div>
        <h1 className={styles.title}>Shipping & Delivery Policy</h1>
        <p className={styles.subtitle}>
          Last Updated: November 2026 • Official Logistics & Delivery Terms for {business.name}
        </p>
      </header>

      <div className={styles.card}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Shipping Coverage & Logistics Partners</h2>
          <p className={styles.sectionContent}>
            <strong>{business.name}</strong> delivers across India covering over 19,000+ serviceable postal codes. To ensure safe, rapid, and temperature-conscious transit of our products (including live nursery specimens and fragile goods), we partner exclusively with verified national express couriers, including <strong>Delhivery Express, Blue Dart, DTDC, and India Post Speed Post</strong>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Shipping Charges & Free Delivery Threshold</h2>
          <p className={styles.sectionContent}>
            We maintain a clear, transparent, and subsidised shipping structure across all orders:
          </p>
          <div className={styles.highlightBox}>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li style={{ marginBottom: "6px" }}>
                <strong>Orders Below ₹3,999:</strong> Standard subsidized flat shipping rate of <strong>₹40 only</strong> anywhere in India.
              </li>
              <li>
                <strong>Orders of ₹3,999 and Above:</strong> <strong>100% FREE Pan-India Shipping</strong> applied automatically at checkout.
              </li>
            </ul>
          </div>
          <p className={styles.sectionContent}>
            There are no hidden handling charges, platform fees, or packing surcharges. What you see during checkout is the final amount payable.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Dispatch & Processing Timelines</h2>
          <p className={styles.sectionContent}>
            Every product order is inspected for top-tier quality before packaging:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Order Processing:</strong> Confirmed orders are queued for plant root inspection, hydration balancing, and protective packing within <strong>24 to 48 hours (1 to 2 business days)</strong>.
            </li>
            <li>
              <strong>Dispatch Schedule:</strong> Orders are dispatched Monday through Saturday. To prevent live botanical specimens from remaining in transit hubs over extended Sunday closures, outstation live plant orders received over the late weekend may be dispatched on Monday morning.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Estimated Delivery Timelines</h2>
          <p className={styles.sectionContent}>
            Once dispatched from our fulfillment facility, estimated transit times are as follows:
          </p>
          <ul className={styles.list}>
            <li><strong>West Bengal & Regional Eastern Zones:</strong> 2 to 4 business days.</li>
            <li><strong>Tier 1 Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune):</strong> 3 to 5 business days.</li>
            <li><strong>Rest of India (Tier 2, Tier 3 Cities & Remote Regions):</strong> 4 to 7 business days.</li>
          </ul>
          <p className={styles.sectionContent}>
            <em>Note:</em> Unforeseen climatic disruptions, local restrictions, public holidays, or extreme weather conditions may occasionally cause minor transit delays. Our customer support team actively tracks active consignments to resolve transit hurdles.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Specialized Transit Packaging</h2>
          <p className={styles.sectionContent}>
            We pride ourselves on our zero-damage packaging protocol:
          </p>
          <ul className={styles.list}>
            <li><strong>Live Plants:</strong> Root balls are securely wrapped with breathable moisture barriers to prevent dehydration. Heavy-duty, honeycomb-reinforced corrugated cartons with ventilation ports shield foliage from compression.</li>
            <li><strong>Fragile & Tech Items:</strong> Protected with multi-layered shock-absorbing bubble cushioning, waterproof poly outer wrap, and fragile warning markings.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Real-Time Order Tracking</h2>
          <p className={styles.sectionContent}>
            As soon as your shipment is picked up by the courier:
          </p>
          <ul className={styles.list}>
            <li>You will receive an automated tracking notification containing the carrier name and Air Waybill (AWB) consignment number via SMS, WhatsApp, and email.</li>
            <li>You can also track your live shipment progress anytime directly through our dedicated <Link href="/track-order" style={{ color: "#2563EB", fontWeight: 600 }}>Track Order Page</Link> using your order reference number.</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Delivery Address & Non-Delivery Scenarios</h2>
          <p className={styles.sectionContent}>
            Please verify your complete shipping address, postal PIN code, and active mobile contact number at checkout. In the event of a delivery attempt failure due to recipient unavailability or incorrect contact coordinates, the courier partner will attempt redelivery up to 3 times before returning the consignment.
          </p>
          <p className={styles.sectionContent}>
            If you require urgent address rectification after placing an order, please contact our support team immediately before the parcel is dispatched.
          </p>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Shipping Support</div>
              <div className={styles.contactValue}>
                <a href={`mailto:${business.email}?subject=${encodeURIComponent("Shipping Inquiry")}`}>
                  {business.email}
                </a>
              </div>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactLabel}>Courier Helpdesk (WhatsApp)</div>
              <div className={styles.contactValue}>
                <a href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hello Sellersking Infotech PVT. LTD., I have a question about shipping and delivery.")}`} target="_blank" rel="noopener noreferrer">
                  {business.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
