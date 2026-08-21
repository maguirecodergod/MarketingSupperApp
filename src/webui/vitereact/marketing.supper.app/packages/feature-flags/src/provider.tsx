import React, { createContext, useState } from 'react';
import { FeatureFlags, type FeatureFlagKey } from './definitions.js';

export interface FeatureFlagContextValue {
  flags: Record<string, boolean>;
  isEnabled: (key: FeatureFlagKey) => boolean;
  setFlag: (key: FeatureFlagKey, enabled: boolean) => void;
}

export const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

export function FeatureFlagProvider({
  initialFlags,
  children,
}: {
  initialFlags?: Record<string, boolean>;
  children: React.ReactNode;
}) {
  const [flags, setFlags] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    for (const [key, def] of Object.entries(FeatureFlags)) {
      defaults[key] = def.defaultValue;
    }
    return { ...defaults, ...initialFlags };
  });

  const isEnabled = (key: FeatureFlagKey): boolean => {
    return flags[key] ?? FeatureFlags[key]?.defaultValue ?? false;
  };

  const setFlag = (key: FeatureFlagKey, enabled: boolean) => {
    setFlags((prev) => ({ ...prev, [key]: enabled }));
  };

  return (
    <FeatureFlagContext.Provider value={{ flags, isEnabled, setFlag }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
