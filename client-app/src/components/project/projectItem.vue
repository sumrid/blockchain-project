<template>
  <b-card :img-src="img" img-top img-height="190" style="max-width: 20rem;" class="mb-2">
    <b-card-title id="title">{{project.title}}</b-card-title>
    <hr />
    <b-card-text>
        <p>ยอดสะสม {{project.accumulated | currency}}</p>
      <p>เป้าหมาย {{project.goal | currency}}</p>
      <p>{{remainingTime}}</p>
    </b-card-text>

    <b-button
      id="donate-btn"
      block
      :to="{ name: 'project', params: { id: project.id }}"
    >อ่านเพิ่มเติม</b-button>
  </b-card>
</template>

<script>
import moment from "moment";
export default {
  props: {
    project: null,
    img: null
  },
  computed: {
    remainingTime() {
      const time = moment(this.project.endtime).fromNow();
      const diff = moment(this.project.endtime).diff();
      if (diff < 0) {
        return "หมดเวลาแล้ว";
      } else {
        return `เหลือเวลา ${time}`;
      }
    }
  }
};
</script>

<style scoped>
#title {
  color: #a05b00;
}

#donate-btn {
  background: rgb(233, 130, 62);
}
</style>