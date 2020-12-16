<template>
  <div class="login container">
    <div class="row pt-5">
      <div class="col col-sm-6 offset-sm-3 col-lg-4 offset-lg-4">
        <div class="card">
          <div class="card-header">
            Login
          </div>
          <div class="card-body text-center" v-if="!$auth.loading">
            <button class="btn btn-dark" v-if="$auth.isAuthenticated" @click="logout">
              Log out
            </button>
            <button
              class="btn btn-primary"
              v-if="!$auth.isAuthenticated"
              id="btn_signin"
              @click="signin"
            >
              Sign-in
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
  computed: {},
  methods: {
    logout() {
      (this as any).$auth.logout();
    },
    signin() {
      (this as any).$auth.loginWithRedirect();
    },
  },
})
export default class Login extends Vue {}
</script>
