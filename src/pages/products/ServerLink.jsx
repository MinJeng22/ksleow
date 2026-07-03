import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import useFavicon from "../../hooks/useFavicon.js";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent("Hi KS Support Team, I would like to learn more about ServerLink. Thank you.")}`;

const BUNDLE_PLANS = [
  { users: "01 User", price: "RM1,104.00", value: 1104 },
  { users: "03 Users", price: "RM2,070.00", value: 2070 },
  { users: "05 Users", price: "RM2,760.00", value: 2760, featured: true },
  { users: "10 Users", price: "RM3,864.00", value: 3864 },
  { users: "20 Users", price: "RM6,072.00", value: 6072 },
  { users: "30 Users", price: "RM8,556.00", value: 8556 },
  { users: "40 Users", price: "RM9,660.00", value: 9660 },
  { users: "Unlimited Users", price: "RM16,560.00", value: 16560 },
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

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function PricingCard({ plan, onContact }) {
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
        <span>One-time bundle (Exclude 8% SST)</span>
      </div>
      <button className="serverlink-price-link" onClick={onContact}>
        Contact Us <ArrowIcon />
      </button>
    </article>
  );
}

function UpgradeTable({ onContact }) {
  const [activeTab, setActiveTab] = useState(0);
  const activeData = UPGRADE_TABS[activeTab];

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(value).replace('MYR', 'RM');
  };

  return (
    <div className="serverlink-upgrade-table-wrap">
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {UPGRADE_TABS.map((tab, i) => (
          <button 
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`ks-btn ${activeTab === i ? 'ks-btn-serverlink' : 'btn-ghost-base btn-ghost-dark'}`}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <table className="serverlink-upgrade-table">
        <thead>
          <tr>
            <th>Upgrade To</th>
            <th>Price (Exclude 8% SST)</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {activeData.targets.map((targetInfo) => {
            const targetPlan = BUNDLE_PLANS[targetInfo.index];
            return (
              <tr key={targetPlan.users}>
                <td>
                  <strong>{targetPlan.users}</strong>
                  <span>Additional user upgrade, without support license</span>
                </td>
                <td>{formatPrice(targetInfo.price)}</td>
                <td>
                  <button className="ks-btn ks-btn-serverlink" onClick={onContact} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', minHeight: 'auto' }}>
                    Contact Us <ArrowIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ServerLinkPage({ onContact }) {
  const [trialOpen, setTrialOpen] = useState(false);
  useFavicon("/images/products/serverlink-icon.png");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  const openContact = () => {
    // If the modal isn't passed, we trigger the prop onContact which opens the Contact form.
    if (onContact) onContact();
  };

  return (
    <div className="pinned-hero-page product-app-page" style={{ minHeight: "100vh" }}>
      <div className="pinned-hero-stage">
        <ProductHero
          eyebrow="Remote Access Solution"
          title="ServerLink"
          body="Secure, fast, and reliable remote access solution for your business software."
          iconSrc="/images/products/serverlink-icon.png"
          backgroundImage="/images/products/serverlink-showcase.webp"
          primaryCta={{ label: "Start Free Trial", onClick: () => setTrialOpen(true), className: "ks-btn-serverlink" }}
          secondaryCta={{ label: "WhatsApp Us", href: WA_LINK, target: "_blank" }}
        />
      </div>

      <main className="pinned-page-content product-app-content">
        <section className="serverlink-pricing-section product-app-section product-app-section-ice">
          <div className="content-wrap">
            <div className="serverlink-pricing-head">
              <div>
                <div className="ks-eyebrow">Pricing</div>
                <h2 className="ks-section-title">ServerLink Remote Access Pricing</h2>
                <p className="ks-body-text">
                  Choose a ready bundle for a new remote access setup, or add more users when your team grows.
                </p>
              </div>
              <div className="serverlink-pricing-actions">
                <button className="ks-btn ks-btn-serverlink" onClick={openContact}>
                  Contact Us <ArrowIcon />
                </button>
              </div>
            </div>

            <div className="serverlink-price-grid">
              {BUNDLE_PLANS.map((plan) => (
                <PricingCard key={plan.users} plan={plan} onContact={openContact} />
              ))}
            </div>

            <div className="serverlink-pricing-note">
              <strong>Bundle includes:</strong> ServerLink Remote Access with 12 months support license.
              For Windows edition requirements, trial setup, server readiness, and installation planning,
              please contact KS Support Team before purchase.
            </div>
          </div>
        </section>

        <section className="serverlink-upgrade-section product-app-section product-app-section-paper product-app-section-from-ice">
          <div className="content-wrap">
            <div className="serverlink-upgrade-layout">
              <div>
                <div className="ks-eyebrow">Upgrade</div>
                <h2 className="ks-section-title">Add More Remote Users</h2>
                <p className="ks-body-text">
                  Already using ServerLink? These upgrade options add extra concurrent users without
                  support license. We can help you confirm the best upgrade path before checkout.
                </p>
              </div>
              <UpgradeTable onContact={openContact} />
            </div>
          </div>
        </section>
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
          <>ServerLink host <strong>DO NOT</strong> support Windows 10 & Windows 11 Home Edition as host.</>,
          <>Install or prepare <strong>AnyDesk</strong> / <strong>UltraViewer</strong> for remote access.</>,
          <>Reserve around <strong>30 minutes</strong> for setup and basic checking.</>,
          <>Message our Support Team to arrange a suitable installation time.</>
        ]}
      />
    </div>
  );
}
