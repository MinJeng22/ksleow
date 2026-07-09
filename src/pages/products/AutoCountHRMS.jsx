import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";
import SharedEditionsTable from "../../components/SharedEditionsTable";
import HRMSCalculator from "../../components/HRMSCalculator";
import useFavicon from "../../hooks/useFavicon.js";

const HRMS_EDITIONS = ["Express", "Premium", "Accountant"];
const HRMS_EDITION_TABLE = {
  topRows: [
    ["Price", ["RM 720 /year*", "RM 44 /month*", "RM 840 /year*"]],
    ["Best for", [
      "Company which only needs the Payroll process without eLeave, eClaim, and eAttendance.",
      "Company who wants a complete HR solution, including Payroll, eLeave, eClaim, and eAttendance",
      "Accounting Firms or Payroll outsourcing companies who need Payroll process without eLeave, eClaim, eAttendance"
    ]],
    ["Payment Frequency Type", ["Yearly", "Monthly / Yearly", "Yearly"]],
    ["Employee Headcount for Payroll Process", [
      "Start from 30 (Unlimited Company)",
      "Start from 5 (Unlimited companies)",
      "Start from 300 (Unlimited companies)"
    ]],
    ["Included Free Payroll Users", ["1", "Unlimited if purchase for 12 Months", "2"]]
  ],
  sections: [
    {
      name: "FEATURES",
      rows: [
        ["eLeave & eClaim", ["", "+", ""]],
        ["eAttendance", ["", "+", ""]],
        ["e-Approval Setting", ["", "Multiple", ""]],
        ["Employee Download Own Payslip", ["", "+", "+"]],
        ["Employee Profile Maintenance", ["+", "+", "+"]],
        ["Branch Setting", ["", "+", "+"]],
        ["Project Setting", ["", "+", "+"]],
        ["Employee Type Setting", ["", "+", "+"]],
        ["Department Setting", ["+ (Exclude sub-dept)", "+ (Include sub-dept)", "+ (Include sub-dept)"]],
        ["Organization Chart", ["+", "+", "+"]],
        ["Bank Account Setting", ["Single", "Multiple", "Multiple"]],
        ["Calendar Setting", ["Single", "Multiple", "Multiple"]],
        ["Advanced Calendar Setting", ["", "+", "+"]],
        ["Payroll Process Type (First Half / Second Half / Bonus / Commission / Claim)", ["+", "+", "+"]],
        ["Statutory Type (EPF, SOCSO, EIS, Income Tax, Zakat, Tabung Haji, ASN)", ["+", "+", "+"]],
        ["Monthly Payroll Link to LHDN Calculator", ["+", "+", "+"]],
        ["Formula Setting in Allowance, Deduction, Overtime", ["+", "+", "+"]],
        ["Electronic Payment", ["+", "+", "+"]],
        ["Payslip By Email", ["+", "+", "+"]],
        ["Payslip Notification (By web, email, mobile app)", ["", "+", "+"]],
        ["Loan Repayment Scheduler", ["+", "+", "+"]],
        ["Report Design", ["+", "+", "+"]],
        ["Email Notification", ["+", "+", "+"]],
        ["Payroll Posting to Cloud Accounting", ["+", "+", "+"]],
        ["Multiple Access Group Setting", ["", "+", "+"]],
        ["Support (Online Chat)", ["+", "+", "+"]],
        ["Individual Account Security Feature: 2-Factor Authentication", ["+", "+", "+"]]
      ]
    }
  ]
};

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent("Hi KS Support Team, I would like to learn more about AutoCount HRMS. Thank you.")}`;

export default function AutoCountHRMSPage({ onContact }) {
  useFavicon("/images/products/hrms-icon.webp");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Cloud Payroll & HR"
          title="AutoCount HRMS"
          body="Automated payroll compliant with EPF, SOCSO, PCB, and EIS. Payslips in minutes."
          iconSrc="/images/products/hrms-icon.webp"
          backgroundImage="/images/products/autocount-hrms.webp"
          primaryCta={{ label: "Start Free Trial", href: "https://auth.autocountcloud.com/identity/account/register/payroll?dealerCode=SYNS6037", target: "_blank", className: "ks-btn-hrms" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <div id="compare" className="product-app-section product-app-section-paper">
          <div className="content-wrap">
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 className="ks-section-title">Compare Plans & Features</h2>
            </div>
            <SharedEditionsTable 
              editions={HRMS_EDITIONS} 
              topRows={HRMS_EDITION_TABLE.topRows} 
              sections={HRMS_EDITION_TABLE.sections} 
              thColor="#3069b8"
            />
            <div className="ks-note-text" style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "#6b6f91" }}>
              <div style={{ marginBottom: "0.5rem" }}>- Exclude Implementation</div>
              <div>** Price displayed excludes SST charges.</div>
              <div>** All promotion offers are subject to terms and conditions.</div>
              <div>** Free mode supports payroll process up to 3 employee headcounts. Additionally, our free mode allows up to 10 headcounts for the eLeave, eClaim, and eAttendance features.</div>
            </div>
          </div>
        </div>
        
        <div id="calculator" className="product-app-section product-app-section-mist" style={{ padding: "4rem 0" }}>
          <div className="content-wrap">
            <HRMSCalculator />
          </div>
        </div>

        <ProductPlaceholder title="AutoCount HRMS" />
        <Footer />
      </main>
    </div>
  );
}
