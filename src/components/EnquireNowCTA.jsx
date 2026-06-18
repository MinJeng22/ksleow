import React from "react";
import ParticleBackground from "./ParticleBackground";
import { CTA_PARTICLE_PROPS } from "./ctaParticleConfig.js";

export default function EnquireNowCTA({
  heading,
  body,
  buttons = []
}) {
  return (
    <div className="enquire-now-section">
      <ParticleBackground
        {...CTA_PARTICLE_PROPS}
        paused={false}
      />
      <div className="enquire-now-content content-wrap">
        <h2 className="enquire-now-heading">{heading}</h2>
        <p className="enquire-now-body">{body}</p>
        {buttons.length > 0 && (
          <div className="enquire-now-actions">
            {buttons.map((btn, i) => (
              <a key={i} href={btn.href} target={btn.target || "_blank"} rel="noreferrer" className={btn.className || "btn-ghost-base btn-ghost-dark"}>
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
