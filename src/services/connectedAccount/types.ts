export enum Countries {
  FR = 'FR',
  US = 'US'
}

export enum BusinessTypes {
  INDIVIDUAL = 'individual',
  COMPANY = 'company'
}

export interface CreateConnectedAccountPayload {}

export interface CreateConnectedAccountResponse {
  id: string
}

export enum CompletenessStatus {
  NOT_CONNECTED = 'notConnected',
  INCOMPLETE = 'incomplete',
  PARTIALLY_COMPLETE = 'partially_complete',
  COMPLETED = 'completed',
  COMPLETING = 'completing'
}

export interface AccountLinkResponse {
  id: string
  onboardingUrl: string
}

export interface RefreshAccountLinkResponse extends AccountLinkResponse {}

export interface ConnectedAccountResponse {
  id: string
  accountCompleteness: CompletenessStatus
}
