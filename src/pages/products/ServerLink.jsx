import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import useFavicon from "../../hooks/useFavicon.js";
import EnquireNowCTA from "../../components/EnquireNowCTA.jsx";
import SectionSidebar from "../../components/SectionSidebar.jsx";
import { PageSectionDivider } from "../../components/PageSections.jsx";
import { IconChart, IconCloud, IconDollar } from "../../components/SectionDivider.jsx";
import FeatureShowcase from "../../components/FeatureShowcase.jsx";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent("Hi KS Support Team, I would like to learn more about ServerLink. Thank you.")}`;
const SERVERLINK_ACCENT = "#00b3fe";

const SERVERLINK_SECTIONS = [
  { id: "advantages", label: "Features", icon: IconCloud, color: SERVERLINK_ACCENT },
  { id: "pricing", label: "Pricing", icon: IconDollar, color: SERVERLINK_ACCENT },
  { id: "upgrades", label: "Add Users", icon: IconChart, color: SERVERLINK_ACCENT },
];

const BUNDLE_PLANS = [
  { users: "01 User", price: "RM1,104.00 + 8%SST" },
  { users: "03 Users", price: "RM2,070.00 + 8%SST" },
  { users: "05 Users", price: "RM2,760.00 + 8%SST", featured: true },
  { users: "10 Users", price: "RM3,864.00 + 8%SST" },
  { users: "20 Users", price: "RM6,072.00 + 8%SST" },
  { users: "30 Users", price: "RM8,556.00 + 8%SST" },
  { users: "40 Users", price: "RM9,660.00 + 8%SST" },
  { users: "Unlimited Users", price: "RM16,560.00 + 8%SST" },
];

const UPGRADE_TABS = [
  { label: "From 1 user", targets: [
      { index: 1, price: 1250 }, { index: 2, price: 1940 }, { index: 3, price: 3044 }, 
      { index: 4, price: 5252 }, { index: 5, price: 7736 }, { index: 6, price: 8840 }, { index: 7, price: 15740 }
  ]},
  { label: "From 3 users", targets: [
      { index: 2, price: 1035 }, { index: 3, price: 2139 }, { index: 4, price: 4347 }, 
      { index: 5, price: 6831 }, { index: 6, price: 7935 }, { index: 7, price: 14835 }
  ]},
  { label: "From 5 users", targets: [
      { index: 3, price: 1564 }, { index: 4, price: 3772 }, { index: 5, price: 6256 }, 
      { index: 6, price: 7360 }, { index: 7, price: 14260 }
  ]},
  { label: "From 10 users", targets: [
      { index: 4, price: 2852 }, { index: 5, price: 5336 }, { index: 6, price: 6440 }, { index: 7, price: 13340 }
  ]},
  { label: "From 20 users", targets: [
      { index: 5, price: 3496 }, { index: 6, price: 4600 }, { index: 7, price: 11500 }
  ]},
  { label: "From 30 users", targets: [
      { index: 6, price: 2530 }, { index: 7, price: 9430 }
  ]},
  { label: "From 40 users", targets: [
      { index: 7, price: 8510 }
  ]}
];

const ADVANTAGES = [
  {
    icon: "/images/products/serverlink-icon.webp",
    title: "Use desktop software from anywhere",
    desc: "Access your existing accounting or business software remotely without moving everything to a public cloud platform.",
  },
  {
    icon: "/images/icons/feature-device.svg",
    title: "Connect HQ and outlets",
    desc: "Let multiple branches work with the same server data while keeping user access controlled and easier to support.",
  },
  {
    icon: "/images/icons/feature-integration.svg",
    title: "Keep your current infrastructure",
    desc: "ServerLink helps extend your current server, software, and workflow instead of forcing a full system replacement.",
  },
  {
    icon: "/images/branding/ksl-logo-circle.webp",
    title: "Setup guided by our team",
    desc: "We help check Windows edition, server readiness, remote access tools, user count, and installation planning before rollout.",
  },
];

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function PricingCard({ plan }) {
  return (
    <article className={`serverlink-price-card${plan.featured ? " is-featured" : ""}`}>
      {plan.featured && <span className="serverlink-price-badge">Popular</span>}
      <div>
        <p className="serverlink-price-kicker">ServerLink Remote Access</p>
        <h3>{plan.users}</h3>
        <p className="serverlink-price-desc">With 12 months support license</p>
      </div>
      <div className="serverlink-price-row">
        <strong>{plan.price}</strong>
        <span>One-time bundle</span>
      </div>
    </article>
  );
}

function UpgradeTable() {
  const [activeTab, setActiveTab] = useState(0);
  const activeData = UPGRADE_TABS[activeTab];

  const formatPrice = (value) => `RM${value.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="serverlink-upgrade-table-wrap">
      <div className="serverlink-upgrade-panel-head">
        <div>
          <span>Upgrade path</span>
          <h3>{activeData.label}</h3>
        </div>
        <p>{activeData.targets.length} available upgrade options</p>
      </div>

      <div className="serverlink-upgrade-tabs" role="tablist" aria-label="ServerLink upgrade starting user count">
        {UPGRADE_TABS.map((tab, i) => (
          <button 
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            className={`serverlink-upgrade-tab${activeTab === i ? " is-active" : ""}`}
          >
            <span>{tab.label}</span>
            <strong>{tab.targets.length}</strong>
          </button>
        ))}
      </div>
      <table className="serverlink-upgrade-table">
        <thead>
          <tr>
            <th>Upgrade To</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {activeData.targets.map((targetInfo) => {
            const targetPlan = BUNDLE_PLANS[targetInfo.index];
            return (
              <tr key={targetPlan.users}>
                <td>
                  <strong>{activeData.label} to {targetPlan.users}</strong>
                  <span>Upgrade with 12 months support license</span>
                </td>
                <td>{formatPrice(targetInfo.price)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="serverlink-table-note">Prices exclude 8% SST.</p>
    </div>
  );
}

function AdvantagesSection() {
  return (
    <section id="advantages" className="serverlink-advantages-section product-app-section product-app-section-paper product-app-section-clean">


      <FeatureShowcase
        features={ADVANTAGES}
        id="serverlink-features"
        className="serverlink-feature-showcase"
        sectionStyle={{ padding: 0 }}
      />
    </section>
  );
}

export default function ServerLinkPage({ onContact }) {
  const [trialOpen, setTrialOpen] = useState(false);
  useFavicon("/images/products/serverlink-icon.webp");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const openContact = () => {
    // If the modal isn't passed, we trigger the prop onContact which opens the Contact form.
    if (onContact) onContact();
  };

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <SectionSidebar sections={SERVERLINK_SECTIONS} themeColor={SERVERLINK_ACCENT} />

      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Remote Access Solution"
          title="ServerLink"
          body="Transform your desktop accounting software into a web-accessible private cloud with ServerLink—an affordable, all-in-one remote access solution that leverages your existing infrastructure for seamless remote and branch connectivity."
          iconSrc="/images/products/serverlink-icon.webp"
          backgroundImage="/images/products/serverlink-showcase.webp"
          primaryCta={{ label: "Start Free Trial", onClick: () => setTrialOpen(true), className: "ks-btn-serverlink" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <AdvantagesSection />

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-paper)", "--section-to": "var(--ks-page-ice)" }}>
          <PageSectionDivider sections={SERVERLINK_SECTIONS} id="pricing" />
        </div>

        <section id="pricing" className="serverlink-pricing-section product-app-section product-app-section-ice product-app-section-from-paper product-app-section-to-mist">
          <div className="content-wrap">
            <div className="serverlink-section-head serverlink-pricing-head">
              <div>
                <h2 className="ks-section-title">ServerLink Remote Access Pricing</h2>
                <p className="ks-body-text">
                  Choose a ready bundle for a new remote access setup, or add more users when your team grows.
                  Prices exclude 8% SST.
                </p>
              </div>
            </div>

            <div className="serverlink-price-grid">
              {BUNDLE_PLANS.map((plan) => (
                <PricingCard key={plan.users} plan={plan} />
              ))}
            </div>

            <div className="serverlink-pricing-note">
              <strong>Bundle includes:</strong> ServerLink Remote Access with 12 months support license.
              For Windows edition requirements, trial setup, server readiness, and installation planning,
              please contact KS Support Team before purchase. Prices exclude 8% SST.
            </div>
          </div>
        </section>

        <div className="product-app-divider" style={{ "--section-from": "var(--ks-page-ice)", "--section-to": "var(--ks-page-mist)" }}>
          <PageSectionDivider sections={SERVERLINK_SECTIONS} id="upgrades" />
        </div>

        <section id="upgrades" className="serverlink-upgrade-section product-app-section product-app-section-mist product-app-section-from-ice product-app-section-to-cloud">
          <div className="content-wrap">
            <div className="serverlink-section-head">
              <div>
                <h2 className="ks-section-title">Add More Remote Users</h2>
                <p className="ks-body-text">
                  Already using ServerLink? Pick your current user count and compare the available upgrade paths.
                  We can help confirm the right upgrade before checkout.
                </p>
              </div>
            </div>

            <UpgradeTable />
          </div>
        </section>

        <EnquireNowCTA
          heading="Ready to set up ServerLink?"
          body="Talk to KS Support Team for a quotation, trial setup, and server readiness check."
          buttons={[{ label: "Contact Sales", href: WA_LINK, className: "btn-ghost-base btn-ghost-dark" }]}
        />

        <Footer />
      </main>

      <AutoCountTrialModal 
        open={trialOpen} 
        onClose={() => setTrialOpen(false)}
        productName="ServerLink Remote Access"
        supportMessage="HI KS Support Team, I would like to start the ServerLink Remote Access Free Trial and schedule an installation session. I can prepare AnyDesk / UltraViewer."
        stats={[
          { label: "Trial Limit", value: "15 Days" },
          { label: "Features", value: "Full Features" },
          { label: "Users", value: "5 Users" },
        ]}
        checklist={[
          <>ServerLink host <strong>ONLY</strong> support Windows 10 & Windows 11 Pro Edition as host.</>,
          <>Install or prepare <strong>AnyDesk</strong> / <strong>UltraViewer</strong> for remote access.</>,
          <>Reserve around <strong>30 minutes</strong> for setup and basic checking.</>,
          <>Message our Support Team to arrange a suitable installation time.</>
        ]}
      />
    </div>
  );
}
