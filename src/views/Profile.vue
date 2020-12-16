<template>
  <div class="profile">
    <h1>Profile</h1>
    <hr class="mb-5"/>

    <!-- <div class="d-flex justify-content-center mb-3" v-if="loading">
      <b-spinner style="width: 3rem; height: 3rem;" class="mt-5" label="Large Spinner"></b-spinner>
    </div> -->

    <b-overlay :show="loading" rounded="sm">
      <b-alert variant="success" dismissible :show="dismissSuccess" @dismissed="dismissSuccess=0">
        Profile successfully updated!
      </b-alert>

      <b-alert variant="danger" dismissible :show="dismissError">
        An error ocurred while updating your profile. Please try again later.
      </b-alert>

      <b-form @submit="onSubmit" v-if="me">
        <div class="row">
          <div class="col-xs-12 offset-sm-2 col-sm-8 offset-lg-3 col-lg-6 offset-xl-4 col-xl-4">
            <b-form-group id="input-group-name" label="Your Name:" label-for="input-name">
              <b-form-input
                id="input-name"
                v-model="me.name"
                placeholder="Enter name"
                required
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 offset-sm-2 col-sm-8 offset-lg-3 col-lg-6 offset-xl-4 col-xl-4">
            <b-form-group
              id="input-group-email"
              label="Email address:"
              label-for="input-email"
              description="We'll never share your email with anyone else."
              readonly
            >
              <b-form-input
                id="input-email"
                v-model="me.email"
                type="email"
                placeholder="Enter email"
                required
                readonly
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 offset-sm-2 col-sm-8 offset-lg-3 col-lg-6 offset-xl-4 col-xl-4">
            <b-form-group
              id="input-group-birthdate"
              label="Birthdate:"
              label-for="input-birthdate"
              readonly
            >
              <b-form-datepicker
                id="input-birthdate"
                v-model="me.birthdate"
                class="mb-2"
                show-decade-nav
                placeholder="Select your birthdate"
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12 offset-sm-2 col-sm-8 offset-lg-3 col-lg-6 offset-xl-4 col-xl-4">
            <b-button type="submit" variant="primary">Save</b-button>
          </div>
        </div>
      </b-form>
    </b-overlay>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CURRENT_USER_QUERY, UPDATE_PROFILE_MUTATION } from '@/service/graphql/queries';
import { getInstance } from '@/auth';

@Component({
  data() {
    return {
      me: null,
      loading: true,
      dismissSuccess: 0,
      dismissError: 0,
    };
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      (this as any).loading = true;
      try {
        const { name, birthdate } = (this as any).me;
        const response = await this.$apollo.mutate({
          mutation: UPDATE_PROFILE_MUTATION,
          variables: { data: { name, birthdate } },
        });

        if (response && response.data && response.data.updateProfile) {
          (this as any).me = response.data.updateProfile;
          (this as any).dismissSuccess = 10;
        } else {
          (this as any).dismissError = 10;
        }
      } catch (error) {
        console.error(error);
      } finally {
        (this as any).loading = false;
      }
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
        (this as any).dismissError = 10;
        console.error(error);
      }
    }
    (this as any).loading = false;
  }
}
</script>
