<template>
  <v-container>
    <v-row>
      <v-col>
        <p class="headline">จัดการผู้ใช้</p>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col>
        <p class="body-2" v-if="this.users.length == 0">ไม่มีผู้ใช้ที่รอการยืนยัน</p>
        <p class="body-2" v-else>ผู้ใช้ที่รอการยืนยัน</p>
      </v-col>
    </v-row>
    <v-progress-linear indeterminate color="cyan" v-if="isLoading"></v-progress-linear>

    <user-item v-for="(user, index) in users" :key="index" :uid="user.uid"></user-item>
  </v-container>
</template>

<script>
import UserItem from "@/components/UserItem.vue";
import firebase from "@/firebase/user";
export default {
  components: {
    UserItem
  },
  data() {
    return {
      users: [],
      isLoading: false,
      headers: [
        {
          text: "ชื่อผู้ใช้งาน",
          value: "name"
        },
        {
          text: "ยืนยันบัตร",
          value: "verifyIDCard"
        }
      ]
    };
  },
  async created() {
    this.isLoading = true;
    await this.getUsers();
    this.isLoading = false;
  },
  methods: {
    async getUsers() {
      const users = await firebase.getAllUsers();
      this.users = users.filter(item => {
        console.log(JSON.stringify(item));
        return item.verifyIDCard === false;
      });
    }
  }
};
</script>