import ProductShowcasePage from "./ProductShowcasePage.jsx";
import { feedMePOSData } from "./productShowcaseData.js";

export default function FeedMePOSPage({ onContact }) {
  return <ProductShowcasePage data={feedMePOSData} onContact={onContact} />;
}
