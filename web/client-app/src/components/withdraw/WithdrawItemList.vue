<template>
  <div>
    <withdraw></withdraw>

    <b-table :items="items" :fields="fields">
      <template v-slot:cell(amount)="data">{{data.value | currency}}</template>
    </b-table>
  </div>
</template>

<script>
import Withdraw from "./WithdrawItem";

export default {
  props: {
    items: null
  },
  data() {
    return {
      fields: [
        { key: "amount", label: "จำนวนเงิน" },
        { key: "status", label: "สถานะ" },
        { key: "time", label: "เมื่อ" },
        // { key: "invoice", label: ''}
      ]
    };
  },
  components: {
    Withdraw
  }
};
</script>