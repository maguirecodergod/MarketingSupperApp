# Query Package Rules

- Server state belongs in TanStack Query ONLY.
- Always pass AbortSignal down to the API client.
- Always declare and use structured Query Key factories.
- All mutations must declare invalidation rules and rollback strategies.
