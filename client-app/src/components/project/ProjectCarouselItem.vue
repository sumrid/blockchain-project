<template>
  <b-row>
    <b-col>
      <img :src="img" alt="project image" width="335" height="471" />
    </b-col>
    <b-col>
      <h1 class="xlarge-font">
        <b>{{project.title}}</b>
      </h1>
     <hr>
      <p>
        ยอดสะสม
        <span class="goal">{{project.accumulated | currency}}</span>
      </p>
      <p>
        ต้องการเงิน
        <span class="goal">{{project.goal | currency}}</span>
      </p>
      <b-button
        :to="{name: 'project', params: {id: 'p_02'}}"
        style="background-color:#ff8d1e"
      >เพิ่มเติม</b-button>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    project: null,
    img: null
  }
};
</script>

<style scoped>
img {
  display: block;
  height: auto;
  max-width: 100%;
}

.large-font {
  font-size: 48px;
}

.xlarge-font {
  font-size: 60px;
}

.goal {
  font-size: 1.2rem;
}
</style>