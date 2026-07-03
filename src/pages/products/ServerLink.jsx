import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import ProductHero from "../../components/ProductHero";
import ProductPlaceholder from "../../components/ProductPlaceholder";
import AutoCountTrialModal from "../../components/AutoCountTrialModal.jsx";
import useFavicon from "../../hooks/useFavicon.js";

const WA_LINK = `https://wa.me/60179052323?text=${encodeURIComponent("Hi KS Support Team, I would like to learn more about ServerLink. Thank you.")}`;

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
        <ProductPlaceholder title="ServerLink" />
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
