import { API } from '../api.service'
import {
  CreateConnectedAccountPayload,
  CreateConnectedAccountResponse,
  AccountLinkResponse,
  RefreshAccountLinkResponse,
  ConnectedAccountResponse
} from './types'

export const connectedAccountsService = {
  createConnectedAccount: (payload: CreateConnectedAccountPayload) =>
    API.POST<CreateConnectedAccountResponse>(API.connectedAccounts, { payload }),
  getConnectedAccountLink: () => API.POST<AccountLinkResponse>(API.getConnectedAccountLink),
  refreshConnectedAccountLink: () => API.POST<RefreshAccountLinkResponse>(API.refreshConnectedAccountLink),
  checkConnectedAccount: () => API.GET<ConnectedAccountResponse>(API.checkConnectedAccount)
}
