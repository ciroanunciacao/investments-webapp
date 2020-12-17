/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import createAuth0Client, { Auth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js';

interface Auth0PluginData {
  loading: boolean;
  isAuthenticated: boolean;
  user: object | undefined;
  auth0Client: Auth0Client;
  popupOpen: boolean;
  error: any;
  token: string | null;
}

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = (appState?: any) => window.history.replaceState(
  appState, document.title, window.location.pathname,
);

const DEFAULT_AUTH_STATE_HANDLER = () => {
  console.log('auth state changed');
};

let instance: any;

// Returns the current instance of the SDK
export const getInstance = () => instance;

// Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance
export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  onAuthStateChanged = DEFAULT_AUTH_STATE_HANDLER,
  redirectUri = window.location.origin,
  ...options
}) => {
  if (instance) return instance;

  // The 'instance' is simply a Vue object
  instance = new Vue({
    data(): Auth0PluginData {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: ({} as unknown as Auth0Client),
        popupOpen: false,
        error: null,
        token: null,
      };
    },
    methods: {
      /** Authenticates the user using a popup window */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async loginWithPopup(opts: any, config: any) {
        this.popupOpen = true;

        try {
          await this.auth0Client.loginWithPopup(opts, config);
        } catch (e) {
          // eslint-disable-next-line
          console.error(e);
        } finally {
          this.popupOpen = false;
        }

        this.user = await this.auth0Client.getUser();
        this.isAuthenticated = true;

        if (typeof onAuthStateChanged === 'function') {
          onAuthStateChanged();
        }
      },
      /** Handles the callback when logging in using a redirect */
      async handleRedirectCallback() {
        this.loading = true;
        try {
          await this.auth0Client.handleRedirectCallback();
          this.user = await this.auth0Client.getUser();
          this.isAuthenticated = true;
        } catch (e) {
          this.error = e;
        } finally {
          this.loading = false;

          if (typeof onAuthStateChanged === 'function') {
            onAuthStateChanged();
          }
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect(o: any) {
        return this.auth0Client.loginWithRedirect(o);
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o: any) {
        return this.auth0Client.getIdTokenClaims(o);
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o: any) {
        return this.auth0Client.getTokenSilently(o);
      },
      /** Gets the access token using a popup window */
      getTokenWithPopup(o: any) {
        return this.auth0Client.getTokenWithPopup(o);
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o: any) {
        return this.auth0Client.logout({ ...o, returnTo: window.location.origin });
      },
    },
    /** Use this lifecycle method to instantiate the SDK client */
    async created() {
      const opts: Auth0ClientOptions = {
        ...options,
        domain: options.domain,
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_id: options.clientId,
        // eslint-disable-next-line @typescript-eslint/camelcase
        redirect_uri: redirectUri,
      };
      // Create a new instance of the SDK client using members of the given options object
      this.auth0Client = await createAuth0Client(opts);

      try {
        // If the user is returning to the app after authentication..
        if (
          window.location.search.includes('code=')
          && window.location.search.includes('state=')
        ) {
          // handle the redirect and retrieve tokens
          const { appState } = await this.auth0Client.handleRedirectCallback();

          // Notify subscribers that the redirect callback has happened, passing the appState
          // (useful for retrieving any pre-authentication state)
          onRedirectCallback(appState);
        }
      } catch (e) {
        this.error = e;
      } finally {
        // Initialize our internal authentication state
        this.isAuthenticated = await this.auth0Client.isAuthenticated();
        this.user = await this.auth0Client.getUser();
        this.loading = false;
        this.token = await this.auth0Client.getTokenSilently();

        if (typeof onAuthStateChanged === 'function') {
          onAuthStateChanged();
        }
      }
    },
  });

  return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  install(vue: any, options: any) {
    // eslint-disable-next-line no-param-reassign
    vue.prototype.$auth = useAuth0(options);
  },
};
