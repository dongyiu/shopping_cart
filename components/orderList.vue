<template>
<div>
  <v-card class="box d-flex justify-space-around align-center ma-4">
    <h3 class="mx-2">{{name}} x{{countity}}</h3>
    <h3>RM {{total()}}</h3>
  </v-card>
</div>
</template>

<script>
export default {
    name:'cart-item',
    props:['image','name','price','countity','id'],
    data(){
      return{
        item:{
          id:this.id
        }
      }
    },
    methods:{
      total: function(){
        return (this.price*this.countity).toLocaleString()

      }
}
}
</script>

<style scoped>
.box{
  width: 800px;
  border-radius: 10px;
}

h2{
  margin: 0 40px;
  line-height: auto;
  text-align: center;
  width: 80px;
}
@media only screen and (max-width: 900px) {
  .box {
    width: 90vw;

  }
  h3{
    font-size: 14px;
  }
}
</style>