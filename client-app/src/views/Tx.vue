<template>
  <div>
    <div class="container-fluid">
        <div class="row">
            <d class="col">
                <h3>TX: {{id}}</h3>
            </d>
        </div>
        <div class="row">
          <div class="col">
            <pre>{{tx}}</pre>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import service from '../service';
export default {
  data() {
    return {
      id: null,
      tx: null
    }
  },
  async created() {
    const id = this.$route.params.txid;
    this.id = id;
    this.tx = await service.getTx(id);
  },
}
</script>