import { useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";
import SharedEditionsTable from "../../components/SharedEditionsTable";
import HRMSCalculator from "../../components/HRMSCalculator";
import AutoCountTrainingWebGL from "../../components/AutoCountTrainingWebGL.jsx";
import useFavicon from "../../hooks/useFavicon.js";

const TutorialPlayIcon = (
  <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" />
  </svg>
);

const TutorialScreenIcon = (
  <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const TutorialPremiumIcon = (
  <svg className="tutorial-tab-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3l2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77 6.6 19.61l1.03-6.01-4.36-4.25 6.03-.88L12 3z" />
  </svg>
);

const HRMS_VIDEOS = [
  {
    id: "fTLWEGZXApY",
    label: "Introduction",
    description: "Start with a quick AutoCount HRMS overview before comparing plans, payroll workflows, employee self-service, and the cloud HR tools available for your team.",
    note: "Introduction",
    icon: TutorialPlayIcon,
  },
  {
    id: "CeLVteZ4Wtk",
    playlistId: "PLuc8uVTiaUHMW6DZRNxl1XF94l90mYO6R",
    label: "General Tutorial",
    description: "Follow the general HRMS training playlist for payroll setup, employee records, statutory settings, payroll processing, and daily HR administration.",
    note: "General Training",
    icon: TutorialScreenIcon,
  },
  {
    id: "0GvMf9_az3U",
    playlistId: "PLuc8uVTiaUHN8kaFtKB5ZWQVtDAtmLFOs",
    label: "Premium Plan Training",
    description: "Learn the Premium plan workflow, including eLeave, eClaim, eAttendance, approvals, and the additional HR tools for growing teams.",
    note: "Premium Guide",
    icon: TutorialPremiumIcon,
  },
];

const HRMS_EDITIONS = ["Express", "Premium", "Accountant"];
const HRMS_EDITION_TABLE = {
  topRows: [
    ["Price", ["RM 720 /year*", "Free for 3 headcounts (Then RM 44 /month*)", "RM 840 /year*"]],
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
        ["eLeave & eClaim", ["", "+ (Free for 10 headcounts)", ""]],
        ["eAttendance", ["", "+ (Free for 10 headcounts)", ""]],
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

        <div className="product-app-section product-app-section-ice product-app-section-from-mist product-app-section-to-cloud">
          <div id="training">
            <AutoCountTrainingWebGL
              customVideos={HRMS_VIDEOS}
              title="AutoCount HRMS Quick-Start Guide"
              themeColor="#3069b8"
              themeHoverColor="#3d7bd1"
              activeTabBg="#2f315a"
              playBtnBg="#3069b8"
              playIconColor="#ffffff"
            />
          </div>
        </div>

        <ProductPlaceholder title="AutoCount HRMS" />
        <Footer />
      </main>
    </div>
  );
}
