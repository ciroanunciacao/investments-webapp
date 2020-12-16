import '@babel/polyfill';
import 'mutationobserver-shim';
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import '@/plugins/bootstrap-vue';
import '@/plugins/vue-apollo';
import { Auth0Plugin, getInstance } from '@/auth';
import router from '@/router';
import store from '@/store';
import apolloClient from '@/service/graphql/connection';
import App from '@/App.vue';

// Import the Auth0 configuration
import { domain, clientId, audience } from '../auth_config.json';

window.store = store;

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

let app: Vue;

const startApp = () => {
  if (!app) {
    app = new Vue({
      router,
      store,
      apolloProvider,
      render: (h) => h(App),
    }).$mount('#app');
  }
};

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: (appState: any) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    );
  },
  onAuthStateChanged: () => {
    startApp();
  },
});
const authService = getInstance();

authService.$watch('loading', (loading: any) => {
  if (loading === false && !authService.isAuthenticated) {
    startApp();
  }
});

Vue.config.productionTip = false;
