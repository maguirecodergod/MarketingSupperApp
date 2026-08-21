import 'i18next';
import type common from '../locales/en-US/common.json';
import type navigation from '../locales/en-US/navigation.json';
import type auth from '../locales/en-US/auth.json';
import type dashboard from '../locales/en-US/dashboard.json';
import type users from '../locales/en-US/users.json';
import type settings from '../locales/en-US/settings.json';
import type forms from '../locales/en-US/forms.json';
import type validation from '../locales/en-US/validation.json';
import type dataGrid from '../locales/en-US/data-grid.json';
import type feedback from '../locales/en-US/feedback.json';
import type accessibility from '../locales/en-US/accessibility.json';

export interface CustomTypeOptions {
  defaultNS: 'common';
  resources: {
    common: typeof common;
    navigation: typeof navigation;
    auth: typeof auth;
    dashboard: typeof dashboard;
    users: typeof users;
    settings: typeof settings;
    forms: typeof forms;
    validation: typeof validation;
    'data-grid': typeof dataGrid;
    feedback: typeof feedback;
    accessibility: typeof accessibility;
  };
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      navigation: typeof navigation;
      auth: typeof auth;
      dashboard: typeof dashboard;
      users: typeof users;
      settings: typeof settings;
      forms: typeof forms;
      validation: typeof validation;
      'data-grid': typeof dataGrid;
      feedback: typeof feedback;
      accessibility: typeof accessibility;
    };
  }
}
