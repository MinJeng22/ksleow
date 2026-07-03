import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import useFavicon from "../../hooks/useFavicon.js";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent("Hi KS Support Team, I would like to learn more about ServerLink. Thank you.")}`;
const STORE_BUNDLE_URL = "https://store.serverlink.com.my/bundle";
const STORE_UPGRADE_URL = "https://store.serverlink.com.my/serverlink_upgrades";

const BUNDLE_PLANS = [
  { users: "01 User", price: "RM1,192.32", href: "https://store.serverlink.com.my/bundle/serverlink01-bundle" },
  { users: "03 Users", price: "RM2,235.60", href: "https://store.serverlink.com.my/bundle/serverlink03-user-bundle" },
  { users: "05 Users", price: "RM2,980.80", href: "https://store.serverlink.com.my/bundle/serverlink05-user-bundle", featured: true },
  { users: "10 Users", price: "RM4,173.12", href: "https://store.serverlink.com.my/bundle/serverlink10-user-bundle" },
  { users: "20 Users", price: "RM6,557.76", href: "https://store.serverlink.com.my/bundle/serverlink20-user-bundle" },
  { users: "30 Users", price: "RM9,240.48", href: "https://store.serverlink.com.my/bundle/serverlink30-user-bundle" },
  { users: "40 Users", price: "RM10,432.80", href: "https://store.serverlink.com.my/bundle/serverlink40-user-bundle" },
  { users: "Unlimited Users", price: "RM17,884.80", href: "https://store.serverlink.com.my/bundle/serverlink-unlimited-user-bundle" },
];

const UPGRADE_PLANS = [
  { users: "+1 User", price: "RM1,209.60", href: "https://store.serverlink.com.my/serverlink_upgrades/serverlink-additional-1-user" },
  { users: "+3 Users", price: "RM2,079.00", href: "https://store.serverlink.com.my/serverlink_upgrades/serverlink-additional-3-users" },
  { users: "+5 Users", price: "RM2,700.00", href: "https://store.serverlink.com.my/serverlink_upgrades/serverlink-additional-5-users" },
  { users: "+10 Users", price: "RM3,693.60", href: "https://store.serverlink.com.my/serverlink_upgrades/serverlink-additional-10-users" },
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
      <a className="serverlink-price-link" href={plan.href} target="_blank" rel="noreferrer">
        View in ServerLink Store <ArrowIcon />
      </a>
    </article>
  );
}

function UpgradeTable() {
  return (
    <div className="serverlink-upgrade-table-wrap">
      <table className="serverlink-upgrade-table">
        <thead>
          <tr>
            <th>Upgrade Option</th>
            <th>Price</th>
            <th>Store</th>
          </tr>
        </thead>
        <tbody>
          {UPGRADE_PLANS.map((plan) => (
            <tr key={plan.users}>
              <td>
                <strong>{plan.users}</strong>
                <span>Additional user upgrade, without support license</span>
              </td>
              <td>{plan.price}</td>
              <td>
                <a href={plan.href} target="_blank" rel="noreferrer">
                  View <ArrowIcon />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ServerLinkPage({ onContact }) {
  const [trialOpen, setTrialOpen] = useState(false);
  useFavicon("/images/products/serverlink-icon.png");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

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
                  Prices are referenced from the official ServerLink store.
                </p>
              </div>
              <div className="serverlink-pricing-actions">
                <a className="ks-btn ks-btn-serverlink" href={STORE_BUNDLE_URL} target="_blank" rel="noreferrer">
                  View Bundle Store <ArrowIcon />
                </a>
                <a className="btn-ghost-base btn-ghost-dark" href={STORE_UPGRADE_URL} target="_blank" rel="noreferrer">
                  View Upgrades <ArrowIcon />
                </a>
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
              <UpgradeTable />
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
