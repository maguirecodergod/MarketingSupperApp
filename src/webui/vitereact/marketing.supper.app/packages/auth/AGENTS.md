# Auth Package Rules

- Do NOT store tokens or secrets in localStorage or Zustand.
- Session authorization is authoritative on backend; client guards manage route/UI access.
- Permission keys must match the `resource.action` schema.
