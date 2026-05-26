import React, { useState } from "react";

export default function MenuButton({ onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>{`
        .liquid-menu-btn {
          position: fixed;
          z-index: 1000;
          display: flex;
          align-items: center;
          justifyContent: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 2px 6px rgba(255, 255, 255, 0.5);
          color: #2f315a;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        }
        
        .liquid-menu-btn:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
          box-shadow: 0 12px 40px rgba(31, 38, 135, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.6);
          transform: translateY(-2px) scale(1.02);
        }

        .liquid-menu-btn:active {
          transform: translateY(1px) scale(0.98);
        }

        /* Desktop & Tablet: Top Right */
        @media (min-width: 768px) {
          .liquid-menu-btn {
            top: 1.5rem;
            right: 1.5rem;
          }
        }

        /* Mobile: Bottom Center */
        @media (max-width: 767px) {
          .liquid-menu-btn {
            bottom: 1.5rem;
            left: 50%;
            transform: translateX(-50%);
          }
          .liquid-menu-btn:hover {
            transform: translateX(-50%) translateY(-2px) scale(1.02);
          }
          .liquid-menu-btn:active {
            transform: translateX(-50%) translateY(1px) scale(0.98);
          }
        }
      `}</style>
      <button 
        className="liquid-menu-btn"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <span>Menu</span>
      </button>
    </>
  );
}
