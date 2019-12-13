<template>
  <div class="activity-feed">
    <div class="feed-item" v-for="(e, index) in events" :key="index">
      <div class="col-md-8 col-sm-12 col-xs-12 morningdetail">
        <div class="col-md-8 col-sm-2 col-xs-8">
          <h5>
            <span style="color:#E2B104;" class="text-uppercase">{{e.event}}</span>
          </h5>
        </div>

        <div class="col-md-4 col-sm-10 col-xs-4">
          <h5 style="color: #E2B104;">
            เมื่อเวลา:
            <span style="color: #B7B7B7">{{unixToDate(e.timestamp)}}</span>
          </h5>
        </div>

        <div class="col-md-12 col-sm-12 col-xs-12">
          <p style="color:#B7B7B7 ">{{e.message}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    events: null
  },
  methods: {
    unixToDate(unix) {
      return moment.unix(unix).format("LL");
    }
  }
};
</script>

<style scoped>
.morningdetail {
  background-color: #3a3c45;
  border-radius: 12px;
  position: absolute;
  margin-left: -3rem;
  margin-top: 4rem;
  padding-top: 1rem;
}

.activity-feed {
  padding: 1rem;
  /* margin-top: 120px; */
}

.activity-feed .feed-item {
  position: relative;
  padding-bottom: 140px;
  padding-left: 30px;
  margin-bottom: 5rem;
  border-left: 2px solid #e2b104;
}

.activity-feed .feed-item:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 13px;
  background: #fff;
  border: 1px solid #e2b104;
}
</style>