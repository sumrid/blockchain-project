<template>
  <v-container>
    <v-row>
      <v-col>
        <p class="headline">รายการใบกำกับภาษี</p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <inv-item v-for="(inv, index) in invoices" :key="index" :id="inv.id"></inv-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import service from "../service/invoice";
import InvItem from "../components/InvoiceItem";

export default {
  components: {
    InvItem
  },
  data() {
    return {
      invoices: []
    };
  },
  created() {
    this.getInvoices();
  },
  methods: {
    async getInvoices() {
      this.invoices = await service.getAllInvoices();
    }
  }
};
</script>