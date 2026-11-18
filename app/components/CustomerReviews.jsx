import { FaStar } from "react-icons/fa";
import styles from "./CustomerReviews.module.css";

const reviews = [
  {
    id: 1,
    name: "Ananya Banerjee",
    location: "Salt Lake, Kolkata, West Bengal",
    avatar: "AB",
    stars: 5,
    tag: "Beauty Products • Organic Skincare Serum",
    quote: "Ordered the organic glow skincare set from Sellers King Info Tech. The packaging was immaculate, 100% genuine ingredients, and delivered within two days. My skin feels nourished and refreshed. Incredible product quality!",
  },
  {
    id: 2,
    name: "Mohd. Rizwan Ansari",
    location: "Hazratganj, Lucknow, Uttar Pradesh",
    avatar: "RA",
    stars: 5,
    tag: "Electronics Products • Wireless Earbuds & 65W Charger",
    quote: "I bought the wireless noise-cancelling earbuds and fast charger. The sound clarity and build quality exceeded my expectations. Prompt delivery and authentic warranty from Sellers King Info Tech.",
  },
  {
    id: 3,
    name: "Subhashis Mukherjee",
    location: "Medinipur, West Bengal",
    avatar: "SM",
    stars: 5,
    tag: "Premium Plants Products • Exotic Grafted Adenium",
    quote: "I ordered premium grafted Adeniums from Sellers King Info Tech. They reached with thick, solid caudex and healthy green buds. The specialized transit packing kept every branch completely intact.",
  },
  {
    id: 4,
    name: "Priya Shukla",
    location: "Gomti Nagar, Lucknow, Uttar Pradesh",
    avatar: "PS",
    stars: 5,
    tag: "Beauty Products • Pure Ayurvedic Hair Oil & Mist",
    quote: "The pure botanical hair oil and organic rose water mist arrived safely sealed. Excellent texture, natural fragrance, and zero harsh chemicals. Sellers King Info Tech has become my go-to for trusted beauty essentials.",
  },
  {
    id: 5,
    name: "Ramesh Kulkarni",
    location: "Kothrud, Pune, Maharashtra",
    avatar: "RK",
    stars: 5,
    tag: "Electronics Products • Smartwatch & Bluetooth Speaker",
    quote: "Super fast shipping and reliable customer service! The smartwatch battery life and sync features work flawlessly. Authentic electronics at genuine prices with secure parcel tracking.",
  },
  {
    id: 6,
    name: "Meera Nair",
    location: "Indiranagar, Bengaluru, Karnataka",
    avatar: "MN",
    stars: 5,
    tag: "Premium Plants Products • Rare Variegated Monstera",
    quote: "Online plant delivery can be tricky, but Sellers King Info Tech sets the benchmark for premium plants. Zero stem damage, well-developed roots, and lush foliage ready for display in my living room.",
  },
];

export default function CustomerReviews() {
  return (
    <section className={styles.section} aria-labelledby="customer-reviews-title">
      <h2 id="customer-reviews-title">Happy Customers Say</h2>
      <div className={styles.track} tabIndex={0} aria-label="Customer review cards, scroll horizontally">
        {reviews.map((review) => (
          <article className={styles.card} key={review.id} aria-label={`Review by ${review.name}`}>
            <div className={styles.stars} aria-hidden="true">
              {[...Array(review.stars)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span className={styles.preview}>Verified Buyer · {review.tag}</span>
            <p className={styles.quote}>&ldquo;{review.quote}&rdquo;</p>
            <div className={styles.customer}>
              <span className={styles.avatar}>{review.avatar}</span>
              <div>
                <strong className={styles.name}>{review.name}</strong>
                <span className={styles.caption}>{review.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
