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
          <td>{{updateTime(p.endtime)}}</td>
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
const axios = require("axios");
const moment = require("moment");
moment.locale("th");

const util = require("../util");
const API_IP = util.API_IP;

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
  beforeCreate() {
    // Get project list
    axios.get(`http://${API_IP}:8000/api/project`).then(res => {
      this.projects = res.data;
      console.log(this.projects);
    });
  },
  methods: {
    projectDetail: function() {
      console.log("click");
    },
    updateTime: function(end) {
      const correntTime = moment();
      const endtime = moment(end, "YYYY-MM-DDTHH:mm:ss");
      let diffTime = endtime - correntTime;
      var duration = moment.duration(diffTime * 1000, "milliseconds");

      console.log("end time " + endtime.calendar());
      return endtime.calendar();
    },
    onDecode(result) {
      this.result = result;
    }
  },
  mounted() {
    setInterval(() => {
      this.time = moment().format("LTS");
    }, 1000);
  }
};
</script>
