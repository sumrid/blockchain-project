<template>
  <v-card>
    <v-card-title>ชื่อ {{user.name}}</v-card-title>
    <v-card-text>
      <p>บัตรประชาชน</p>
      <v-img :src="user.id_card_img" max-width="350"></v-img>
    </v-card-text>
    <v-card-actions>
      <v-btn color="success" v-if="user.verifyIDCard" disabled>Approved</v-btn>
      <v-btn color="success" @click.prevent="onApprove" v-else>
        <v-progress-circular indeterminate color="primary" size="20" width="3" v-if="isLoading"></v-progress-circular>Approve
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="headline red lighten-2" primary-title>Error</v-card-title>
        <v-card-text>{{error}}</v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="primary" text @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import firebase from "../firebase/user";
import service from "../service/user";
export default {
  props: {
    uid: null
  },
  data() {
    return {
      user: {},
      isLoading: false,
      error: null,
      dialog: false
    };
  },
  async created() {
    this.user = await firebase.getUser(this.uid);
  },
  methods: {
    async onApprove() {
      try {
        this.isLoading = true;
        await service.approveIDCard("admin", this.uid, 1);
        this.user = await firebase.getUser(this.uid);
        this.isLoading = false;
      } catch (err) {
        this.error = err;
        this.isLoading = false;
        this.dialog = true;
      }
    }
  }
};
</script>