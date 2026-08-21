export interface AuthTransportConfig {
  credentials?: RequestCredentials;
}

export const defaultAuthConfig: AuthTransportConfig = {
  credentials: 'include',
};
