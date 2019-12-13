<template>
  <div>
    <!-- Clarity Section -->
    <div class="container-fluid" style="background-color:#fcf2e0">

      <div class="container">
        <carousel :perPage="1" loop autoplay :autoplayTimeout="4000">
          <slide v-for="(p, index) in projects" :key="index">
            <project-carousel-item :project="p" :img="imageUrl(p.id)"></project-carousel-item>
          </slide>
        </carousel>
      </div>
    </div>

    <!-- สร้างคอลัมน์ ซ้าย กลาง ขวา -->
    <div class="container">
      <div class="row">
        <div class="col-sm-6 col-lg-4" v-for="p in projects" :key="p.id">
          <project-item :project="p" :img="imageUrl(p.id)"></project-item>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <my-footer />
  </div>
</template>

<script>
const moment = require("moment");
import service from "../service";
import myFooter from "../components/Footer";
import projectItem from "../components/project/projectItem";
import ProjectCarouselItem from "../components/project/ProjectCarouselItem";

moment.locale("th");

export default {
  name: "home",
  components: {
    myFooter,
    projectItem,
    ProjectCarouselItem
  },
  data() {
    return {
      projects: [],
      info: [],
      time: moment().format("LTS")
    };
  },
  async beforeCreate() {
    // Get project list
    this.projects = await service.getProjects();
    this.info = await service.getProjectsInfo();
  },
  created() {
    document.title = "Donate-web | หน้าแรก";
  },
  methods: {
    imageUrl: function(id) {
      console.info(`[home] [imageUrl] project id: ${id}`);
      const p = this.info.find(p => p.id === id); // find in array.
      return p.image;
    }
  },
  mounted() {
    setInterval(() => {
      this.time = moment().format("LTS");
    }, 1000);
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Sarabun&display=swap");

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  padding: 64px;
}

.row:after {
  content: "";
  display: table;
  clear: both;
}

.column-66 {
  float: left;
  width: 66.66666%;
  padding: 20px;
}

.column-33 {
  float: left;
  width: 33.33333%;
  padding: 20px;
}

.large-font {
  font-size: 48px;
}

.xlarge-font {
  font-size: 64px;
}

.button {
  border: none;
  color: white;
  padding: 14px 28px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
}

img {
  display: block;
  height: auto;
  max-width: 100%;
}

@media screen and (max-width: 1000px) {
  .column-66,
  .column-33 {
    width: 100%;
    text-align: center;
  }
  img {
    margin: auto;
  }
}

.column {
  float: left;
  width: 25%;
  padding: 0 10px;
}

/* Remove extra left and right margins, due to padding */
.row {
  margin: 0 -5px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Responsive columns */
@media screen and (max-width: 600px) {
  .column {
    width: 100%;
    display: block;
    margin-bottom: 20px;
  }
}

.typo-light h1,
.typo-light h2,
.typo-light h3,
.typo-light h4,
.typo-light h5,
.typo-light h6,
.typo-light p,
.typo-light div,
.typo-light span,
.typo-light small {
  color: #fff;
}

ul.social-footer2 {
  margin: 0;
  padding: 0;
  width: auto;
}
ul.social-footer2 li {
  display: inline-block;
  padding: 0;
}
ul.social-footer2 li a:hover {
  background-color: #ff8d1e;
}
ul.social-footer2 li a {
  display: block;
  height: 30px;
  width: 30px;
  text-align: center;
}
.btn {
  background-color: #ff8d1e;
  color: #fff;
}
.btn:hover,
.btn:focus,
.btn.active {
  background: #4b92dc;
  color: #fff;
  -webkit-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -o-box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  -webkit-transition: all 250ms ease-in-out 0s;
  -moz-transition: all 250ms ease-in-out 0s;
  -ms-transition: all 250ms ease-in-out 0s;
  -o-transition: all 250ms ease-in-out 0s;
  transition: all 250ms ease-in-out 0s;
}

.detail-font {
  font-family: "Sarabun", sans-serif;
}
</style>