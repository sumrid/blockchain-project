<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="5">
        <v-card class="elevation-12">
          <v-card-text>
            <v-form>
              <v-text-field label="Email" name="login" prepend-icon="mdi-user" type="text"></v-text-field>

              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: null,
        password: null
      },
      icon: {

      }
    }
  },
  created() {
  },
};
</script>