<template>
  <div class="ma-2">
    <v-container>
      <v-row>
        <v-col sm="4" offset-sm="1" md="12" offset-md="1">
          <h1>Popular Products</h1>
        </v-col>
      </v-row>
      <v-row>
            <v-col sm="6" lg="3" align="center"
             v-for="product in allproducts" :key="product.id">
            <productcart :id="product.id" :name="product.name" :price="product.price" :image="product.image"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import productcart from '../components/productcart.vue'
import {mapGetters,mapActions} from 'vuex';
export default {
  computed: mapGetters(["allproducts"]),
  components: { productcart },
  methods:{
    ...mapActions(["fetchdata"])
  },
  created(){
    this.fetchdata();
  },
}
</script>

<style>
.text{
  white-space: nowrap;
}
</style>