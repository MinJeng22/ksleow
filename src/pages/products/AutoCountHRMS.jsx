import ProductShowcasePage from "./ProductShowcasePage.jsx";
import { autoCountHRMSData } from "./productShowcaseData.js";

export default function AutoCountHRMSPage({ onContact }) {
  return <ProductShowcasePage data={autoCountHRMSData} onContact={onContact} />;
}
