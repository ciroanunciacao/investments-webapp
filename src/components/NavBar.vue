<template>
  <b-navbar toggleable="lg">
    <b-navbar-brand href="#">
      <img alt="App Logo" class="img-logo" src="../assets/logo.png" />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav v-if="!$auth.loading">
      <b-navbar-nav v-if="$auth.isAuthenticated">
        <b-nav-item href="/">Home</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" v-if="$auth.isAuthenticated">
        <b-nav-item-dropdown size="lg" variant="link" no-caret right>
          <template #button-content>
            <img
              height="40"
              v-if="me && me.profilePicture"
              :src="me.profilePicture"
              class="rounded-circle"
            />
            <span v-if="!me || !me.profilePicture">Account</span>
          </template>
          <b-dropdown-item href="/profile">Profile</b-dropdown-item>
          <b-dropdown-item href="javascript:;" @click="logout">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CURRENT_USER_QUERY } from '@/service/graphql/queries';
import { getInstance } from '@/auth';

@Component({
  data() {
    return {
      me: null,
    };
  },
  methods: {
    logout(e) {
      e.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$auth.logout();
    },
  },
})
export default class NavBar extends Vue {
  async mounted() {
    if (getInstance().isAuthenticated) {
      try {
        const response = await this.$apollo.query({
          query: CURRENT_USER_QUERY,
        });
        if (response && response.data && response.data.me) {
          (this as any).me = response.data.me;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style lang="scss">
.img-logo {
  max-width: 40px;
}
</style>
