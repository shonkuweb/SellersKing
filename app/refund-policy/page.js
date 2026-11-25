import CancellationAndRefundPage, { metadata as pageMetadata } from "../cancellation-and-refund/page";

export const metadata = {
  ...pageMetadata,
  title: pageMetadata.title.replace("Cancellation & Refund", "Refund Policy"),
};

export default function RefundPolicyAliasPage() {
  return <CancellationAndRefundPage />;
}
