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
          <th>เหลือเวลา</th>
          <th>รายละเอียด</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in projects" v-bind:key="p.id">
          <td>{{p.title}}</td>
          <td>{{p.balance | currency}}</td>
          <td :class="isTimeExpired(p.endtime)">{{updateTime(p.endtime)}}</td>
          <td>
            <router-link :to="{ name: 'detail', params: { id: p.id }}">
              <button class="btn btn-info">รายละเอียด</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="container">Time : {{time}}</div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
const moment = require("moment");
import service from "../service";
import socket from '../service/socket';

moment.locale("th");

export default {
  name: "home",
  components: {
    // HelloWorld
  },
  data() {
    return {
      projects: [],
      time: moment().format("LTS")
    };
  },
  async beforeCreate() {
    // Get project list
    this.projects = await service.getProjects();
  },
  methods: {
    updateTime: function(end) {
      const endtime = moment(end, moment.ISO_8601);
      return endtime.fromNow();
    },
    isTimeExpired: function(endtime) {
      return moment(endtime, moment.ISO_8601).diff(moment()) <= 0
        ? "table-danger"
        : "";
    },
    onDecode(result) {
      this.result = result;
    }
  },
  mounted() {
    setInterval(() => {
      this.time = moment().format("LTS");
    }, 1000);
    socket.on("reload", async () => {
      this.projects = await service.getProjects();
    });
  }
};
</script>
