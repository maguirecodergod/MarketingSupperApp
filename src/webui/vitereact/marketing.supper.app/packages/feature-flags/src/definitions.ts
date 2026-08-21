export interface FeatureFlagDefinition {
  key: string;
  description: string;
  owner: string;
  defaultValue: boolean;
}

export const FeatureFlags: Record<string, FeatureFlagDefinition> = {
  EnableAdvancedAuditLogs: {
    key: 'enable_advanced_audit_logs',
    description: 'Enables advanced audit logging panels in the admin dashboard',
    owner: 'platform-team',
    defaultValue: false,
  },
  EnableBatchUserActions: {
    key: 'enable_batch_user_actions',
    description: 'Allows bulk operations in the EnterpriseDataGrid',
    owner: 'user-management-team',
    defaultValue: true,
  },
};

export type FeatureFlagKey = keyof typeof FeatureFlags;
