<template>
  <b-navbar class="navbar-dark bg-dark" toggleable="lg" type="dark">
    <b-navbar-brand href="#/">DoWeb</b-navbar-brand>
    
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <!-- item group -->
        <b-nav-item-dropdown text="โครงการ" right>
          <b-dropdown-item href="#">เร่งด่วน</b-dropdown-item>
          <b-dropdown-item href="#">การศึกษา</b-dropdown-item>
          <b-dropdown-item href="#">สิ่งแวดล้อม</b-dropdown-item>
        </b-nav-item-dropdown>

        <li class="nav-item">
          <a class="nav-link" href="#">ความเคลื่อนไหว</a>
        </li>
        <li class="nav-item">
          <router-link to="/contact" class="nav-link">ติดต่อเรา</router-link>
        </li>

        <b-nav-form>
          <b-form-input class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button variant="outline-success" class="my-2 my-sm-0" type="submit">Search</b-button>
        </b-nav-form>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto" v-if="!getUser">
        <!-- item group user -->
        <li class="nav-item">
          <a class="nav-link" href="#">
            <icon icon="user-secret" />Sign Up
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="showModal">
            <icon icon="sign-in-alt" />Login
          </a>
        </li>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto" v-else>
        <li class="nav-item">
          <router-link to="/me" class="nav-link">{{getUser.displayName}}</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="logout">
            <icon :icon="icon.signout" />Logout
          </a>
        </li>
      </b-navbar-nav>

      <!-- Form login -->
      <b-modal id="modal-login" hide-footer>
        <template slot="modal-title">Login</template>
        <div class="d-block text-center">
          <form @submit.prevent="login">
            <b-form-group label="Email address:">
              <b-form-input v-model="form.email" type="email" required placeholder="Enter email"></b-form-input>
            </b-form-group>
            <b-form-group label="Password:">
              <b-form-input
                autocomplete="current-password"
                v-model="form.password"
                type="password"
                required
                placeholder="your password"
              ></b-form-input>
            </b-form-group>
            <p v-if="error">Error: {{error}}</p>
            <b-button class="mt-3 btn-success" type="submit">
              <span
                v-if="isLoading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="false"
              ></span> Login
            </b-button>
          </form>
        </div>
      </b-modal>
    </b-collapse>
  </b-navbar>
</template>

<script>
import auth from "../firebase";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      userInfo: "",
      form: {
        email: "",
        password: ""
      },
      icon: {
        signout: faSignOutAlt
      },
      isLoading: false,
      error: ""
    };
  },
  computed: {
    ...mapGetters(["getUser"])
  },
  mounted() {
    auth.onAuthStateChanged(user => {
      console.log("auth state chanded.");
      if (user) this.setUser(user);
      else this.setUser("");
    });
  },
  methods: {
    login: async function() {
      this.isLoading = true;
      try {
        const user = await auth.signInWithEmailAndPassword(
          this.form.email,
          this.form.password
        );
        this.isLoading = false;
        this.setUser(user.user);
        this.hideModal();
      } catch (err) {
        this.isLoading = false;
        this.error = err;
      }
    },
    logout: async function() {
      console.log("click logout");
      try {
        await auth.signOut();
        this.setUser("");
      } catch (err) {
        this.error = err;
        console.log(err);
      }
    },
    hideModal: function() {
      this.$bvModal.hide("modal-login");
    },
    showModal: function() {
      this.$bvModal.show("modal-login");
    },
    ...mapActions(["setUser"])
  }
};
</script>

<style>
</style>