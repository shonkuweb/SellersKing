import { FaStar } from "react-icons/fa";
import styles from "./CustomerReviews.module.css";

const reviews = [
  {
    id: 1,
    name: "Ananya Banerjee",
    location: "Salt Lake, Kolkata, West Bengal",
    avatar: "AB",
    stars: 5,
    tag: "Beauty & Personal Care • Organic Skincare Set",
    quote: "Ordered the organic glow skincare set from SellersKing. The packaging was immaculate, 100% genuine ingredients, and delivered within two days. My skin feels nourished and refreshed. Incredible product quality!",
  },
  {
    id: 2,
    name: "Mohd. Rizwan Ansari",
    location: "Hazratganj, Lucknow, Uttar Pradesh",
    avatar: "RA",
    stars: 5,
    tag: "Electronics • Wireless ANC Earbuds & 65W Fast Charger",
    quote: "I bought the wireless noise-cancelling earbuds and fast charger. The sound clarity and build quality exceeded my expectations. Prompt delivery and authentic warranty from SellersKing.",
  },
  {
    id: 3,
    name: "Subhashis Mukherjee",
    location: "Medinipur, West Bengal",
    avatar: "SM",
    stars: 5,
    tag: "Home & Kitchen • Smart Air Fryer & Blender",
    quote: "I ordered the smart multi-function electric air fryer from SellersKing. Delivered in heavy-duty protective packaging within 48 hours. Works effortlessly with genuine manufacturer warranty.",
  },
  {
    id: 4,
    name: "Priya Shukla",
    location: "Gomti Nagar, Lucknow, Uttar Pradesh",
    avatar: "PS",
    stars: 5,
    tag: "Beauty & Wellness • Pure Botanical Hair Serum & Mist",
    quote: "The pure botanical hair serum and organic rose water arrived safely sealed. Excellent texture, natural fragrance, and zero harsh chemicals. SellersKing has become my go-to for trusted essentials.",
  },
  {
    id: 5,
    name: "Ramesh Kulkarni",
    location: "Kothrud, Pune, Maharashtra",
    avatar: "RK",
    stars: 5,
    tag: "Gadgets & Wearables • Smartwatch & Bluetooth Speaker",
    quote: "Super fast shipping and reliable customer service! The smartwatch battery life and sync features work flawlessly. Authentic electronics at genuine prices with secure parcel tracking.",
  },
  {
    id: 6,
    name: "Meera Nair",
    location: "Indiranagar, Bengaluru, Karnataka",
    avatar: "MN",
    stars: 5,
    tag: "Fashion & Travel • Premium Ergonomic Backpack",
    quote: "Online shopping can be unpredictable, but SellersKing sets the benchmark for genuine branded goods. Robust build quality, water-resistant material, and swift express delivery right to my doorstep.",
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
