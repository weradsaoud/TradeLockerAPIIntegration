export const EndPoints = {
  BASE_URL: 'https://demo.tradelocker.com/backend-api',
  LOGIN_URL: '/auth/jwt/token',
  REFRESH_URL: '/auth/jwt/refresh',
  ACCOUNTS_URL: '/auth/jwt/all-accounts',
  ACCOUNTDETAILS_URL: '/trade/accounts',
  INSTRUMENTS_URL(accountId: string) {
    return `/trade/accounts/${accountId}/instruments`;
  },
  ORDER_URL(accountId: string){
    return `/trade/accounts/${accountId}/orders`
  } 
};

export type EndpointsType = typeof EndPoints;
