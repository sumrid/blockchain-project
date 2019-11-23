<template>
  <div>
    <b-table striped hover :items="donations" :fields="donationFields" v-if="isHaveDonations">
      <template v-slot:cell(project)="data">{{getProjectTitle(data.value)}}</template>
      <template v-slot:cell(amount)="data">{{data.value | currency}}</template>
      <template v-slot:cell(invoice)="data">
        <b-button
          variant="outline-primary"
          size="sm"
          :to="{ name: 'invoice-view', params: { txid: data.item.txid }}"
        >รายละเอียด</b-button>
      </template>
    </b-table>

    <b-alert show v-else>ยังไม่มีการบริจาค</b-alert>
  </div>
</template>

<script>
import service from "../../service";
import moment from "moment";
import Axios from "axios";
export default {
  props: {
    user: null
  },
  created() {
    this.getDonations();
  },
  computed: {
    isHaveDonations() {
      return Boolean(this.donations);
    }
  },
  data() {
    return {
      donations: [],
      donationFields: [
        {
          key: "project",
          label: "โครงการ",
        },
        {
          key: "amount",
          label: "จำนวน",
          sortable: true
        },
        {
          key: "time",
          label: "เวลา",
          sortable: true,
          formatter: this.formatTime
        },
        {
          key: "invoice",
          label: "ใบเสร็จ"
        }
      ]
    };
  },
  methods: {
    async getDonations() {
      this.donations = await service.getDonationByUserID(this.user);
    },
    formatTime(value) {
      const readable = moment(value).format("LLL");
      return readable;
    },
    getProjectTitle(id) {
        // service.getProjectByID(id).then(p => {
        //     return p.title;
        // });
        return id;
    }
  }
};
</script>