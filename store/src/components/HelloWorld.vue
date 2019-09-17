<template>
  <v-container>
    <div class="row">
      <p class="display-1">สินค้า</p>
    </div>

    <v-row>
      <v-card class="mx-auto card" max-width="400" v-for="p in products" :key="p.name">
        <v-img class="white--text" height="200px" max-width="400px" max-height="300px" min-width="400px" :src="p.img">
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
          <v-btn text color="orange">ซื้อ</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row>
      <p class="display-1">ตะกร้า</p>
    </v-row>
  </v-container>
</template>

<script>
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
      carts: []
    };
  }
};
</script>

<style>
.card {
  margin: 1rem;
}
</style>