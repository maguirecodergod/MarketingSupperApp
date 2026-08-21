# State Package Rules

- Strictly UI & ephemeral client state ONLY.
- DO NOT cache API data or store auth tokens in Zustand.
- Use explicit selector hooks for narrow re-renders.
