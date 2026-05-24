'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AccountContext = createContext(null);

// These call the Shopify Storefront API for customer operations
const DOMAIN = typeof window !== 'undefined' ? undefined : undefined;

async function shopifyCustomerFetch(query, variables = {}) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const res = await fetch(`https://${domain}/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  return json.data;
}

export function AccountProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ss-customer-token');
      if (saved) {
        const { token, expires } = JSON.parse(saved);
        if (new Date(expires) > new Date()) {
          setAccessToken(token);
          fetchCustomerData(token);
        } else {
          localStorage.removeItem('ss-customer-token');
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  const fetchCustomerData = useCallback(async (token) => {
    try {
      const data = await shopifyCustomerFetch(`
        query getCustomer($token: String!) {
          customer(customerAccessToken: $token) {
            id firstName lastName email phone
            orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
              edges {
                node {
                  id orderNumber processedAt
                  fulfillmentStatus financialStatus
                  currentTotalPrice { amount currencyCode }
                  statusUrl
                  lineItems(first: 3) {
                    edges {
                      node {
                        title quantity
                        variant { image { url altText } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `, { token });
      if (data?.customer) setCustomer(data.customer);
    } catch {}
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopifyCustomerFetch(`
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken { accessToken expiresAt }
            customerUserErrors { code field message }
          }
        }
      `, { input: { email, password } });

      const result = data?.customerAccessTokenCreate;
      if (result?.customerUserErrors?.length) {
        const err = result.customerUserErrors[0];
        if (err.code === 'UNIDENTIFIED_CUSTOMER') {
          setError('E-mailadres of wachtwoord is onjuist.');
        } else {
          setError(err.message);
        }
        return false;
      }
      const { accessToken: token, expiresAt } = result.customerAccessToken;
      setAccessToken(token);
      try {
        localStorage.setItem('ss-customer-token', JSON.stringify({ token, expires: expiresAt }));
      } catch {}
      await fetchCustomerData(token);
      return true;
    } catch (e) {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCustomerData]);

  const register = useCallback(async (firstName, lastName, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await shopifyCustomerFetch(`
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer { id email firstName lastName }
            customerUserErrors { code field message }
          }
        }
      `, { input: { firstName, lastName, email, password, acceptsMarketing: false } });

      const result = data?.customerCreate;
      if (result?.customerUserErrors?.length) {
        const err = result.customerUserErrors[0];
        if (err.code === 'TAKEN') {
          setError('Dit e-mailadres is al in gebruik.');
        } else {
          setError(err.message);
        }
        return false;
      }
      // Auto-login after register
      return await login(email, password);
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const logout = useCallback(async () => {
    if (accessToken) {
      try {
        await shopifyCustomerFetch(`
          mutation customerAccessTokenDelete($token: String!) {
            customerAccessTokenDelete(customerAccessToken: $token) {
              deletedAccessToken
            }
          }
        `, { token: accessToken });
      } catch {}
    }
    setAccessToken(null);
    setCustomer(null);
    setError(null);
    try { localStorage.removeItem('ss-customer-token'); } catch {}
  }, [accessToken]);

  return (
    <AccountContext.Provider value={{ customer, accessToken, loading, error, setError, loaded, login, register, logout }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be inside AccountProvider');
  return ctx;
}
