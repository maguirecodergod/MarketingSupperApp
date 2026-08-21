# API Transport Package Rules

- Direct `fetch` is encapsulated exclusively here.
- Always attach correlation ID and handle timeouts gracefully with `AbortController`.
- Normalize all network/HTTP errors into typed Error subclasses.
- Support ETag caching and optimistic concurrency headers (`If-Match`, `If-None-Match`).
