import ShippingAndDeliveryPage, { metadata as pageMetadata } from "../shipping-and-delivery/page";

export const metadata = {
  ...pageMetadata,
  title: pageMetadata.title.replace("Shipping & Delivery", "Shipping Policy"),
};

export default function ShippingPolicyAliasPage() {
  return <ShippingAndDeliveryPage />;
}
