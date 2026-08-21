export const themeTokens = {
  background: {
    page: 'var(--color-bg-page)',
    surface: 'var(--color-bg-surface)',
    surfaceMuted: 'var(--color-bg-surface-muted)',
    surfaceElevated: 'var(--color-bg-surface-elevated)',
    overlay: 'var(--color-bg-overlay)',
  },
  foreground: {
    primary: 'var(--color-fg-primary)',
    secondary: 'var(--color-fg-secondary)',
    muted: 'var(--color-fg-muted)',
    inverse: 'var(--color-fg-inverse)',
  },
  border: {
    default: 'var(--color-border-default)',
    muted: 'var(--color-border-muted)',
    strong: 'var(--color-border-strong)',
  },
  action: {
    primary: 'var(--color-action-primary)',
    primaryFg: 'var(--color-action-primary-fg)',
    secondary: 'var(--color-action-secondary)',
    secondaryFg: 'var(--color-action-secondary-fg)',
    destructive: 'var(--color-action-destructive)',
    destructiveFg: 'var(--color-action-destructive-fg)',
  },
  status: {
    success: 'var(--color-status-success)',
    successFg: 'var(--color-status-success-fg)',
    warning: 'var(--color-status-warning)',
    warningFg: 'var(--color-status-warning-fg)',
    error: 'var(--color-status-error)',
    errorFg: 'var(--color-status-error-fg)',
    info: 'var(--color-status-info)',
    infoFg: 'var(--color-status-info-fg)',
  },
  focus: {
    ring: 'var(--color-focus-ring)',
  },
  navigation: {
    sidebar: 'var(--color-nav-sidebar)',
    sidebarFg: 'var(--color-nav-sidebar-fg)',
    sidebarAccent: 'var(--color-nav-sidebar-accent)',
    sidebarAccentFg: 'var(--color-nav-sidebar-accent-fg)',
    sidebarBorder: 'var(--color-nav-sidebar-border)',
  },
} as const;
