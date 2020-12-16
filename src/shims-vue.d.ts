/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/extensions
import { DollarApollo } from 'vue-apollo/types/vue-apollo';

declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $apollo: DollarApollo<this>;
  }
}

declare global {
  let store: any;
  interface Window {
    store: any;
  }
}
