<template>
  <div>
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand href="#/">Home</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-button
            class="btn-info sm"
            id="show-btn"
            @click="$bvModal.show('modal-login')"
            v-if="!user"
          >Login</b-button>

          <b-modal id="modal-login" hide-footer>
            <template slot="modal-title">Login</template>
            <div class="d-block text-center">
              <form @submit.prevent="login">
                <b-form-group label="Email address:">
                  <b-form-input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="Enter email"
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Password:">
                  <b-form-input
                    v-model="form.password"
                    type="password"
                    required
                    placeholder="your password"
                  ></b-form-input>
                </b-form-group>
                <p v-if="err">Error: {{err}}</p>
                <b-button class="mt-3 btn-success" type="submit">Login</b-button>
              </form>
            </div>
          </b-modal>

          <b-nav-item-dropdown right v-if="user">
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#" @click="logout">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
const auth = require("../firebase");
export default {
  data() {
    return {
      user: "",
      form: {
        email: "",
        password: ""
      },
      err: ""
    };
  },
  methods: {
    hideModal: function() {
      this.$bvModal.hide("modal-login");
    },
    login: async function() {
      try {
        const user = await auth.default.signInWithEmailAndPassword(
          this.form.email,
          this.form.password
        );
        this.user = user.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        this.hideModal();
      } catch (err) {
        this.err = err.message;
      }
    },
    logout: async function() {
      try {
        await auth.default.signOut();
        localStorage.removeItem("user");
        this.user = "";
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    auth.default.onAuthStateChanged(user => {
      localStorage.setItem("user", JSON.stringify(this.user));
      this.user = user;
    });
  }
};
</script>