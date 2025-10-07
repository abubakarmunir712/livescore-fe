import React, { useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
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
  }, []);

  return <div className="mt-4" ref={containerRef} id={id} />;
};

export const AdSlot = React.memo(AdSlotComponent, () => true);