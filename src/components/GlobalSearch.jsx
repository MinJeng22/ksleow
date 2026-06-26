import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navigateWithRouteFeedback, preloadRouteAssets } from "../utils/routeTransitions.js";
import acPluginIcon from "../assets/images/apps/ac-plugin-icon.webp";
import autocountAccountingIcon from "../assets/images/products/autocount-accounting-icon.webp";

const SEARCH_INDEX = [
  {
    title: "Home",
    path: "/",
    keywords: "home, main, ksl, k.s. leow group, accounting firm",
    icon: <img src="/images/icons/favicon.webp" alt="Home" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "Company Gallery",
    path: "/gallery",
    keywords: "gallery, photos, photo album, company activity, team building, event, training, celebration, company event, 活动, 团建, 公司活动",
    icon: <img src="/images/icons/favicon.webp" alt="Gallery" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "AutoCount Accounting",
    path: "/products/autocount-accounting",
    keywords: "autocount, accounting, software, ledger, invoice, system, finance, business",
    icon: <img src={autocountAccountingIcon} alt="AutoCount Accounting" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "AutoCount Cloud Accounting",
    path: "/products/autocount-cloud-accounting",
    keywords: "cloud, accounting, online, web, remote, anytime, anywhere",
    icon: <img src="/images/products/cloudaccounting-icon.webp" alt="AutoCount Cloud Accounting" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "AutoCount POS",
    path: "/products/autocount-pos",
    keywords: "autocount pos, point of sale, cashier, retail, f&b, counter, barcode, receipt, inventory",
    icon: <img src="/images/products/autocount-pos.webp" alt="AutoCount POS" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "FeedMe POS",
    path: "/products/feedme-pos",
    keywords: "feedme pos, f&b pos, restaurant, cafe, point of sale, order, receipt",
    icon: <img src="/images/logos/feedme-logo.webp" alt="FeedMe POS" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "AutoCount Plugins",
    path: "/apps/autocount-plugin",
    keywords: "plugins, extensions, add-on, customize, autocount, app",
    icon: <img src={acPluginIcon} alt="AutoCount Plugins" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "Sales2DO App",
    path: "/apps/sales2do",
    keywords: "sales2do, mobile, sales, ordering, delivery, agent, app",
    icon: <img src={acPluginIcon} alt="Sales2DO" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "KS Omni",
    path: "/omni",
    keywords: "ks omni, ai, chatbot, omnichannel, whatsapp, customer service, support",
    icon: <img src="/images/branding/ksl-logo-circle.webp" alt="KS Omni" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  },
  {
    title: "Quotation Viewer",
    path: "/quotation",
    keywords: "quotation, invoice, billing, viewer, price, pricing",
    icon: <img src="/images/branding/ksl-logo-circle.webp" alt="Quotation Viewer" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
  }
];

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim() === "" 
    ? [] 
    : SEARCH_INDEX.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.keywords.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          preloadRouteAssets(results[selectedIndex].path, "high");
          navigateWithRouteFeedback(navigate, results[selectedIndex].path);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex, onClose, navigate]);

  if (!open) return null;

  return (
    <>
      <style>{`
        .search-backdrop {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 10vh 1.25rem 1.25rem;
        }
        .search-modal {
          width: min(680px, 100%);
          border-radius: 24px;
          overflow: hidden;
          animation: ksNavPanelIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .search-header {
          display: flex;
          align-items: center;
          padding: 1.05rem 1.25rem;
          border-bottom: 1px solid rgba(47,49,90,0.08);
          gap: 0.9rem;
        }
        .search-icon {
          color: rgba(47,49,90,0.48);
        }
        .search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: clamp(1.05rem, 2.1vw, 1.32rem);
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
          color: #2f315a;
          font-weight: 560;
          outline: none;
        }
        .search-input::placeholder {
          color: rgba(47,49,90,0.34);
          font-weight: 460;
        }
        .search-close-btn {
          flex-shrink: 0;
        }
        .search-results {
          max-height: min(48vh, 420px);
          overflow-y: auto;
          padding: 0.6rem;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1rem;
          margin: 0.25rem;
          border-radius: 16px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
          background: transparent;
        }
        .search-result-item.is-selected {
          background: #ffffff;
          border-color: rgba(201,168,76,0.24);
          box-shadow: 0 12px 28px rgba(47,49,90,0.09);
        }
        .search-result-item:hover {
          background: rgba(255,255,255,0.82);
          transform: translateY(-1px);
        }
        .search-result-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          background: rgba(47,49,90,0.06);
          box-shadow: inset 0 0 0 1px rgba(47,49,90,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2f315a;
        }
        .search-result-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .search-result-title {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
          color: #2f315a;
        }
        .search-result-path {
          font-size: 0.8rem;
          color: rgba(47,49,90,0.48);
        }
        .search-empty {
          padding: 3rem 2rem;
          text-align: center;
          color: rgba(47,49,90,0.48);
          font-size: 0.95rem;
        }
        
        /* Mobile adjustment */
        @media (max-width: 767px) {
          .search-backdrop {
            padding: 0.75rem;
            align-items: flex-start;
          }
          .search-modal {
            width: 100%;
            max-width: 100%;
            border-radius: 22px;
          }
          .search-input {
            font-size: 1rem;
          }
          .search-header {
            padding: 0.85rem 0.95rem;
          }
          .search-results {
            max-height: min(58vh, 430px);
            padding: 0.45rem;
          }
          .search-result-item {
            padding: 0.75rem;
            border-radius: 14px;
          }
          .search-result-icon {
            width: 38px;
            height: 38px;
            border-radius: 12px;
          }
        }
      `}</style>
      
      <div className="search-backdrop ks-nav-modal-backdrop" onClick={onClose}>
        <div className="search-modal ks-nav-glass-panel" onClick={e => e.stopPropagation()}>
          <div className="search-header">
            <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              ref={inputRef}
              type="text" 
              className="search-input" 
              placeholder="Search Pages"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="search-close-btn ks-nav-close-btn" onClick={onClose} aria-label="Close search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="search-results">
            {query.trim() === "" ? (
              <div className="search-empty">
                Type anything to start searching...
              </div>
            ) : results.length > 0 ? (
              results.map((item, index) => (
                <div 
                  key={item.path} 
                  className={`search-result-item ${index === selectedIndex ? 'is-selected' : ''}`}
                  onPointerDown={() => preloadRouteAssets(item.path, "high")}
                  onClick={() => {
                    preloadRouteAssets(item.path, "high");
                    navigateWithRouteFeedback(navigate, item.path);
                    onClose();
                  }}
                  onMouseEnter={() => {
                    setSelectedIndex(index);
                    preloadRouteAssets(item.path);
                  }}
                >
                  <div className="search-result-icon">
                    {item.icon}
                  </div>
                  <div className="search-result-text">
                    <span className="search-result-title">{item.title}</span>
                    <span className="search-result-path">{item.path}</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              ))
            ) : (
              <div className="search-empty">
                No results found for "{query}"
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
