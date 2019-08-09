<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <h1>โครงการ</h1>
    <table class="table">
      <thead>
        <tr>
          <th>ชื่อ</th>
          <th>ยอดปัจจุบัน</th>
          <th>รายละเอียด</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in projects" v-bind:key="p.id">
          <td>{{p.title}}</td>
          <td>{{p.balance}}</td>
          <td>
            <router-link :to="{ name: 'detail', params: { id: p.id }}">
              <button class="btn btn-info">รายละเอียด</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
const axios = require("axios");

export default {
  name: "home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      projects: []
    };
  },
  beforeCreate() {
    axios.get("http://localhost:8000/api/project").then(res => {
      this.projects = res.data;
      console.log(this.projects);
    });
  },
  methods: {
    projectDetail: function() {
      console.log("click");
    }
  }
};
</script>
