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
            <strong>{business.name}</strong> delivers across India covering over 19,000+ serviceable postal codes. To ensure safe and rapid transit of our products, we partner exclusively with verified national express couriers, including <strong>Delhivery Express, Blue Dart, DTDC, and India Post Speed Post</strong>.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Shipping & Delivery Charges</h2>
          <p className={styles.sectionContent}>
            Delivery charges are variable and calculated dynamically for every order. Delivery charges are subject to the following factors:
          </p>
          <div className={styles.highlightBox}>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li style={{ marginBottom: "8px" }}>
                <strong>Product Weight:</strong> Total physical and volumetric weight of the ordered items. Heavy, dense, or bulky goods require scaled freight handling.
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Delivery Distance:</strong> Distance between our fulfillment center and your destination delivery address / postal PIN code (local, regional, metro, or national transit zones).
              </li>
              <li>
                <strong>Product Category:</strong> Specific merchandise categories (such as fragile items, electronics, oversized goods, or delicate products) requiring specialized protective packaging and courier handling.
              </li>
            </ul>
          </div>
          <p className={styles.sectionContent}>
            The exact delivery charge applicable to your order is computed and displayed transparently at checkout before you make payment. There are no hidden handling fees or surprise surcharges upon delivery.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Dispatch & Processing Timelines</h2>
          <p className={styles.sectionContent}>
            Every product order is inspected for top-tier quality before packaging:
          </p>
          <ul className={styles.list}>
            <li>
              <strong>Order Processing:</strong> Confirmed orders are queued for quality inspection and protective packing within <strong>24 to 48 hours (1 to 2 business days)</strong>.
            </li>
            <li>
              <strong>Dispatch Schedule:</strong> Orders are dispatched Monday through Saturday. Tracking numbers are generated and shared as soon as packages are handed over to our courier partners.
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
          <h2 className={styles.sectionTitle}>5. Secure Transit Packaging</h2>
          <p className={styles.sectionContent}>
            We pride ourselves on our zero-damage protective packaging protocol:
          </p>
          <ul className={styles.list}>
            <li><strong>Shockproof Cushioning:</strong> All items are packaged in multi-layered, shock-absorbing bubble cushioning, corrugated outer cartons, and waterproof security tape to withstand transit handling.</li>
            <li><strong>Electronics & Fragile Items:</strong> Specially reinforced with corner foam protectors, anti-static barriers, and tamper-evident fragile security labels.</li>
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
