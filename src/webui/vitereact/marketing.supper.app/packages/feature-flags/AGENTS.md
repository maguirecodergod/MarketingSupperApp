# Feature Flags Package Rules

- Feature flags are for progressive rollouts only, not authorization.
- Sensitive capabilities must default to closed (false).
- Flags must specify an owner, description, and cleanup target.
