import React, { useEffect } from "react";

interface AdOptions {
  key: string;
  format: string;
  height: number;
  width: number;
  params?: Record<string, unknown>;
}

interface AdSlotProps {
  id: string;
  script: string;
  options?: AdOptions;
}

const AdSlotComponent: React.FC<AdSlotProps> = ({ id, script, options }) => {
  useEffect(() => {
    const container = document.getElementById(id);
    if (!container) return;

    // only inject once
    if (container.dataset.loaded) return;
    container.dataset.loaded = "true";

    if (options) {
      const configScript = document.createElement("script");
      configScript.type = "text/javascript";
      configScript.innerHTML = `atOptions = ${JSON.stringify(options)};`;
      container.appendChild(configScript);
    }

    const adScript = document.createElement("script");
    adScript.type = "text/javascript";
    adScript.src = script;
    adScript.async = true;
    container.appendChild(adScript);

    // ❌ no cleanup — keeps ad persistent
  }, []);

  return <div id={id} />;
};

// ✅ Prevent re-renders even if parent updates
export const AdSlot = React.memo(AdSlotComponent, () => true);
