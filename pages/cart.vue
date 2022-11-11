<template>
<div>
    <div v-if="cartItemCount>0">
    <h1 class="text-center d-block mt-16">Your Cart</h1>
    <v-row class="d-flex justify-center">
        <v-col cols="12" lg="8" sm="12">
            <div class="d-flex justify-center">
                <div class="mt-14">
                    <div class="d-flex flex-column item-box mt-4">
                        <!-- <div class="d-flex mb-6">
                            <h3 class="mr-auto pa-2">product</h3>
                            <h3>price</h3>
                            <h3>quantity</h3>
                            <h3>total</h3>
                        </div> -->
                        <cart-item v-for="item in $store.state.cart" :key="item.id"
                        :name="item.name" :image="item.image" :price="item.price" 
                        :countity="item.countity" :id="item.id"/>
                        </div>
                </div>
            </div>
        </v-col>
    <v-col sm="6" lg="3">
        <div class="d-flex box align-center justify-center">
            <v-card
            dark
            min-width="350"
            >
            <v-card-title>

            <h2 class="text-h6 font-weight-light ml-4">order summary</h2>
            </v-card-title>
            <hr class="mx-12">

            <v-card-text class="text-h6">
            <h4><span>subtotal:</span><span>RM{{cartTotalPrice.toLocaleString()}}</span></h4>
            </v-card-text>

            <v-card-text class="text-h6">
            <h4><span>total:</span><span>RM{{cartTotalPrice.toLocaleString()}}</span></h4>
            </v-card-text>
            <v-card-actions>
                
            <v-dialog
                v-model="dialog"
                persistent
                max-width="600px"
                >
                <template v-slot:activator="{ on, attrs }">

                <v-btn
                        color="primary"
                        class="mt-2"
                        height="50"
                        block
                        outlined
                        v-bind="attrs"
                        v-on="on"
                >CHECKOUT</v-btn>

                </template>
                
                <v-card>
                    <v-card-title>
                    <span class="text-h5">Please complete the form</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                        <v-form
                            lazy-validation
                            ref="form"
                        >
                        <v-text-field
                        v-model="name"
                        :counter="20"
                        :rules="nameRules"
                        label="Name"
                        required
                        ></v-text-field>
                        
                        <v-text-field
                        v-model="contactNumber"
                        :rules="contactNumberRules"
                        label="Contact Number"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="companyName"
                        :rules="companyNameRules"
                        label="Company Name"
                        required
                        ></v-text-field>

                        </v-form>
                    </v-container>
                    <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="dialog = false"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="$refs.form.reset()"
                    >
                        Clear
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="nextStep"
                    >
                        Purchase
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            
            </v-card-actions>
            </v-card>
        </div>

            <v-dialog
                v-model="dialog3"
                max-width="500px"
            >
                <v-card>
                <v-card-title>
                    <h4>Make sure to complete the following steps !</h4>
                    <br><br><br>
                    <!-- <v-spacer></v-spacer> -->
                        <p>1. Bank in RM {{cartTotalPrice.toLocaleString()}} to ...
                    <br><br>2. Upload the payment slip at <a href="/upload">http://localhost:3000/upload</a>
                    <br><br>Your order id is : {{orderId}}

                    <!-- <br><br>3. hello
                    <br><br>4. hello -->
                    </p>
                </v-card-title>
                <v-card-actions>
                    <v-btn
                    color="primary"
                    text
                    @click="dialog3 = false"
                    >
                    Close
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>

    </v-col>
    </v-row>
    </div>
    <div v-else class="d-flex mt-16 justify-center">
        <h1>NO ITEM IN CART</h1>
    </div>
    <v-snackbar
        v-model="snackbar"
        >
        {{ text }}

        <template v-slot:action="{ attrs }">
            <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="snackbar = false"
            >
            Close
            </v-btn>
        </template>
    </v-snackbar>
</div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import CartItem from '../components/cart-item.vue';
export default {
    data() {
        return {
            orderId: null,
            dialog: false,
            dialog3: false,
            name: '',
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 20) || 'Name must be less than 20 characters',
            ],
            contactNumber: '',
            contactNumberRules: [
                v => !!v || 'Contact number is required',
            ],
            companyName: '',
            companyNameRules: [
                v => !!v || 'Company name is required',
            ],
            snackbar: false,
            text: ``,
        }
    },
    components:{CartItem},

    computed: mapGetters(["cartTotalPrice","cartItemCount"]),

    methods:{
      ...mapActions(["fetchdata"]),
      decimal: function(price){
        return (price).toFixed(2)
      },
      async nextStep() {
        if(!this.$refs.form.validate()) return;

        const res = await this.$axios.post('/api/order', {
            name: this.name,
            contactNumber: this.contactNumber,
            companyName: this.companyName,
            orders: this.$store.state.cart
        })

        if(res.data.error) {
            this.text = `An unknown error occured. Please refresh this page and try again !`
            this.snackbar = true
            return
        }

        this.orderId = res.data.orderId
        this.dialog = false;
        this.dialog3 = true;
        
        
      },
      reset () {
        this.$refs.form.reset()
      },
    },

    created() { 
        this.fetchdata()
    }
}

</script>

<style scoped>
.item-box{
  max-width: 850PX;
  flex-shrink: 1;
}
h3{
  margin: 0 40px;
  line-height: auto;
  text-align: center;
  width: 80px;
}
hr{
  border:0.5px;
  height: 1px;
  background-color: #333333;
}
.box{
    margin-top: 8px;
}
h4{
    display: flex;
    justify-content: space-between;
    margin:0 20px;
}


</style>