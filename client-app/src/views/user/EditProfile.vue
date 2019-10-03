<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col">
          <b-form>
            <fieldset>
              <legend>Edit Profile</legend>

              <b-form-group label="Your Name:">
                <b-form-input required placeholder="Enter name" class="col-md-4" v-model="form.displayName"></b-form-input>
              </b-form-group>

              <b-form-group>
                <b-form-checkbox-group >
                  <b-form-checkbox value="me">Check me out</b-form-checkbox>
                  <b-form-checkbox value="that">Check that out</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>

            </fieldset>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import myFooter from "../../components/Footer";
export default {
  components: {
    myFooter
  },
  data() {
    return {
      form: {},
      user: {}
    }
  },
  computed:{
    ...mapGetters(["getUser"])
  },
  created() {
    this.form = this.getUser;
  },
};
</script>