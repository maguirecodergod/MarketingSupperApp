import { useContext } from 'react';
import { FeatureFlags, type FeatureFlagKey } from './definitions.js';
import { FeatureFlagContext } from './provider.js';

export function useFeatureFlag(key: FeatureFlagKey): boolean {
  const ctx = useContext(FeatureFlagContext);
  if (!ctx) {
    return FeatureFlags[key]?.defaultValue ?? false;
  }
  return ctx.isEnabled(key);
}
