import type { SupportedLocale, TranslationNamespace } from './types.js';

// Import Vietnamese resources
import viCommon from '../locales/vi-VN/common.json' with { type: 'json' };
import viNavigation from '../locales/vi-VN/navigation.json' with { type: 'json' };
import viAuth from '../locales/vi-VN/auth.json' with { type: 'json' };
import viDashboard from '../locales/vi-VN/dashboard.json' with { type: 'json' };
import viUsers from '../locales/vi-VN/users.json' with { type: 'json' };
import viSettings from '../locales/vi-VN/settings.json' with { type: 'json' };
import viForms from '../locales/vi-VN/forms.json' with { type: 'json' };
import viValidation from '../locales/vi-VN/validation.json' with { type: 'json' };
import viDataGrid from '../locales/vi-VN/data-grid.json' with { type: 'json' };
import viFeedback from '../locales/vi-VN/feedback.json' with { type: 'json' };
import viAccessibility from '../locales/vi-VN/accessibility.json' with { type: 'json' };

// Import English resources
import enCommon from '../locales/en-US/common.json' with { type: 'json' };
import enNavigation from '../locales/en-US/navigation.json' with { type: 'json' };
import enAuth from '../locales/en-US/auth.json' with { type: 'json' };
import enDashboard from '../locales/en-US/dashboard.json' with { type: 'json' };
import enUsers from '../locales/en-US/users.json' with { type: 'json' };
import enSettings from '../locales/en-US/settings.json' with { type: 'json' };
import enForms from '../locales/en-US/forms.json' with { type: 'json' };
import enValidation from '../locales/en-US/validation.json' with { type: 'json' };
import enDataGrid from '../locales/en-US/data-grid.json' with { type: 'json' };
import enFeedback from '../locales/en-US/feedback.json' with { type: 'json' };
import enAccessibility from '../locales/en-US/accessibility.json' with { type: 'json' };

export const staticResources: Record<SupportedLocale, Record<TranslationNamespace, Record<string, any>>> = {
  'vi-VN': {
    common: viCommon,
    navigation: viNavigation,
    auth: viAuth,
    dashboard: viDashboard,
    users: viUsers,
    settings: viSettings,
    forms: viForms,
    validation: viValidation,
    'data-grid': viDataGrid,
    feedback: viFeedback,
    accessibility: viAccessibility,
  },
  'en-US': {
    common: enCommon,
    navigation: enNavigation,
    auth: enAuth,
    dashboard: enDashboard,
    users: enUsers,
    settings: enSettings,
    forms: enForms,
    validation: enValidation,
    'data-grid': enDataGrid,
    feedback: enFeedback,
    accessibility: enAccessibility,
  },
};

export function getNamespaceResource(locale: SupportedLocale, ns: TranslationNamespace): Record<string, any> {
  return staticResources[locale]?.[ns] || staticResources['en-US']?.[ns] || {};
}
