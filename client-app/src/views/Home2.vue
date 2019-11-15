<template>
  <div>
    <!-- Clarity Section -->
    <div class="container-fluid" style="background-color:#fcf2e0">
      <div class="container">
        <div class="row">
          <div class="column-33">
            <img
              src="https://d2e111jq13me73.cloudfront.net/sites/default/files/styles/blog_article/public/blog/csm-blog/raise-kid-conscience2-blog-1138x658.jpg?itok=VUcKiAz8"
              alt="App"
              width="335"
              height="471"
            />
          </div>
          <div class="column-66">
            <h1 class="xlarge-font">
              <b>ช่วยเหลือเด็กๆ</b>
            </h1>
            <h1 class="large-font" style="columns: #ff8d1e;">
              <b>ขาดสารอาหารทั่วประเทศ</b>
            </h1>
            <p class="detail-font">
              <span style="font-size:24px">โรคขาดสารอาหาร</span> เป็นภาวะที่ร่างกายขาดสารอาหารและอาจทำให้เกิดปัญหาสุขภาพตามมา โดยอาจมีอาการ เช่น อ่อนเพลีย ผิวหนังมีลักษณะผิดปกติ กระดูกหยุดเจริญเติบโต หรือมีภาวะสมองเสื่อม เป็นต้น ซึ่งโรคขาดสารอาหารมักเกิดขึ้นเมื่อร่างกายได้รับสารอาหารที่จำเป็นไม่เพียงพอ โดยเฉพาะอาหารหลักอย่างโปรตีน คาร์โบไฮเดรต ไขมัน วิตามิน หรือแร่ธาตุต่าง ๆ หากผู้ป่วยไม่ได้รับการรักษาอย่างเหมาะสมทันท่วงที อาจมีอาการร้ายแรงถึงขั้นเสียชีวิตได้
            </p>
            <button class="btn btn-outline-secondary" style="background-color:#ff8d1e">Read More</button>
          </div>
        </div>
      </div>
    </div>
    <!-- สร้างคอลัมน์ ซ้าย กลาง ขวา -->
    <div class="container">
      <div class="row">
        <div class="col-sm-6 col-lg-4" v-for="p in projects" :key="p.id">
          <div class="card">
            <b-img-lazy rounded :src="imageUrl(p.id)" width="500" height="200"></b-img-lazy>
            <h3>{{p.title}}</h3>
            <p class="detail-font">ในชีวิตคุณ คงจะมีหลายครั้งที่คุณเจอแมวถูกทิ้งและแมวจรจัด สัตว์ที่อาศัยอยู่นอกบ้านเหล่านี้ทำบุญกับใครไม่ค่อยขึ้น ไม่ว่าคุณจะเห็นมันหลังบ้านของคุณ รอบ ๆ ที่ทำงาน สวนสาธารณะ หรือขณะเดินทางไปต่างประเทศ</p>
            <router-link :to="{ name: 'project', params: { id: p.id }}">
              <button type="button" class="btn btn-outline-secondary">Read more</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <my-footer />
  </div>
  <!-- main div -->
</template>

<script>
const moment = require("moment");
import service from "../service";
import myFooter from "../components/Footer";

moment.locale("th");

export default {
  name: "home",
  components: {
    myFooter
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
    document.title = "Donate-Web | หน้าแรก";
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
    },
    imageUrl: function(id) {
      console.info(`[home] [imageUrl] project id: ${id}`);
      const p = this.info.find(p => p.id === id); // find in array.
      console.info(`[home] [imageUrl] ${JSON.stringify(p)}`);
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
@import url('https://fonts.googleapis.com/css?family=Sarabun&display=swap');

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

/* สไลด์รูป */
.mySlides {
  display: none;
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

/* Style the counter cards */
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px;
  text-align: center;
  background-color: #f1f1f1;
}

/*==================== 
            Widgets 
====================== */
.widget {
  padding: 20px;
  margin-bottom: 40px;
}
.widget.widget-last {
  margin-bottom: 0px;
}
.widget.no-box {
  padding: 0;
  background-color: transparent;
  margin-bottom: 40px;
  box-shadow: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  -ms-box-shadow: none;
  -o-box-shadow: none;
}
.widget.subscribe p {
  margin-bottom: 18px;
}
.widget li a {
  color: #ff8d1e;
}
.widget li a:hover {
  color: #4b92dc;
}
.widget-title {
  margin-bottom: 20px;
}
.widget-title span {
  background: #839fad none repeat scroll 0 0;
  display: block;
  height: 1px;
  margin-top: 25px;
  position: relative;
  width: 20%;
}
.widget-title span::after {
  background: inherit;
  content: "";
  height: inherit;
  position: absolute;
  top: -4px;
  width: 50%;
}
.widget-title.text-center span,
.widget-title.text-center span::after {
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
}
.widget .badge {
  float: right;
  background: #7f7f7f;
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
  font-family: 'Sarabun', sans-serif;
}
</style>