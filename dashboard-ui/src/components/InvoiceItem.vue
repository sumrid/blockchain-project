<template>
  <v-card class="mb-4">
    <v-card-title>ID : {{id}}</v-card-title>
    <v-row class="pa-2">
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>รายการสินค้า</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-left">ราคา/หน่วย</th>
                      <th class="text-left">จำนวน</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in invoice.items" :key="item.name">
                      <td>{{ item.name }}</td>
                      <td>{{ item.price }}</td>
                      <td>{{ item.amount }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import service from "../service/invoice";
export default {
  props: {
    id: null
  },
  data() {
    return {
      invoice: {}
    };
  },
  created() {
    this.getInv();
  },
  methods: {
    async getInv() {
      this.invoice = await service.getInvoice(this.id);
    }
  }
};
</script>