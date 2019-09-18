<template>
  <v-container>
    <v-row class="row">
      <v-col id="x">
        <p class="display-1 text-center">สินค้า</p>
      </v-col>
    </v-row>

    <v-row>
      <v-card class="mx-auto card" max-width="400" v-for="p in products" :key="p.name">
        <v-img
          class="white--text"
          height="200px"
          max-width="400px"
          max-height="300px"
          min-width="400px"
          :src="p.img"
        >
          <v-card-title class="align-end fill-height">{{p.name}}</v-card-title>
        </v-img>

        <v-card-text>
          <span>ราคา {{p.price}} บาท</span>
          <br />
          <span class="text--primary">
            <span>Whitehaven Beach</span>
            <br />
            <span>Whitsunday Island, Whitsunday Islands</span>
          </span>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="orange" @click="addToCart(p)">
            <v-icon>{{icons.buy}}</v-icon>ซื้อ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-container class="blue lighten-4 cart-box" elevation="2">
      <v-row>
        <v-col>
          <p class="display-1 text-center">ใบสั่งซื้อ</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <code>{{invoice}}</code>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>Total : {{total}} บาท</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center">
          <v-btn :disabled="!Boolean(total)" @click="sendInvoice">
            <v-progress-circular indeterminate color="primary" v-if="isLoading"></v-progress-circular>
            <v-icon>{{icons.cart}}</v-icon>ซื้อเลยยย
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import moment from "moment";
const axios = require("axios").default;
const url = window.location.hostname;

export default {
  data() {
    return {
      products: [
        {
          name: "เสื้อผ้า",
          price: 500,
          img:
            "https://media.shopat24.com/pdmain/213841_01_reebok_b83864_bm789.jpg"
        },
        {
          name: "ข้าวสาร",
          price: 500,
          img:
            "https://www.u-rice.com/wp-content/uploads/2019/04/%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%AA%E0%B8%B2%E0%B8%A3-696x464.jpg"
        },
        {
          name: "ยาแก้ปวด",
          price: 100,
          img:
            "https://www.honestdocs.co/system/blog_articles/main_hero_images/000/005/614/large/iStock-923848688_%281%29.jpg"
        },
        {
          name: "สมุด",
          price: 50,
          img:
            "https://aumento.officemate.co.th/media/catalog/product/O/F/OFM5005071.jpg?imwidth=320"
        },
        {
          name: "ปากกา",
          price: 30,
          img:
            "https://www.goodchoiz.com/content/images/thumbs/0033019_%E0%B9%88%E0%B8%B1-%E0%B8%B1%E0%B9%89-007-07-%E0%B8%B5%E0%B9%89%E0%B8%B3%E0%B8%B4_550.jpeg"
        },
        {
          name: "อิฐก้อน",
          price: 200,
          img:
            "https://www.ttmconstruction.com/uploaded/content/article/%E0%B8%AD%E0%B8%B4%E0%B8%90%E0%B8%A1%E0%B8%AD%E0%B8%8D.jpg"
        },
        {
          name: "ปูน",
          price: 400,
          img:
            "http://www.nanasteel.com/images/content/original-1538745462299.jpg"
        },
        {
          name: "กระเบื้อง",
          price: 450,
          img:
            "https://3dwarehouse.sketchup.com/warehouse/v1.0/publiccontent/1e73b8c7-f2c4-447f-bf76-119ac0876e88"
        }
      ],
      invoice: {
        id: moment().unix().toString(),
        number: moment().unix(),
        total: this.total,
        cusname: "customer name",
        items: [],
        date: moment().toDate()
      },
      icons: {
        cart: "mdi-cart",
        buy: "mdi-cart-arrow-down"
      },
      isLoading: false
    };
  },
  computed: {
    total: function() {
      let total = 0;
      this.invoice.items.forEach(item => {
        total += item.price;
      });
      return total;
    }
  },
  methods: {
    addToCart: function(item) {
      this.invoice.items.push(item);
    },
    sendInvoice: async function() {
      this.isLoading = true;
      const URL = `http://${url}:8080/api/invoice`;
      axios
        .post(URL, this.invoice)
        .then(res => {
          console.log(res.data);
          this.isLoading = false;
          this.setUpInvoice();
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    setUpInvoice: function() {
      this.invoice = {
        id: moment().unix().toString(),
        number: moment().unix(),
        items: [],
        date: moment().toDate()
      };
    }
  }
};
</script>

<style>
.card {
  margin: 1rem;
}
.cart-box {
  border-radius: 1rem;
}
</style>