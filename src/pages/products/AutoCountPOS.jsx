import ProductShowcasePage from "./ProductShowcasePage.jsx";
import { autoCountPOSData } from "./productShowcaseData.js";

export default function AutoCountPOSPage({ onContact }) {
  return <ProductShowcasePage data={autoCountPOSData} onContact={onContact} />;
}
