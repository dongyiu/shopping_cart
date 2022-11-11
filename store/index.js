import axios from 'axios';
import Apisful from '../api/Apisful';

export const state = () => ({
    products:[],
    cart:[],
});
  
export const mutations = {
    setproducts: (state, products) => (state.products = products),
    

    addtocart: (state,product) =>{

      let productInCart = state.cart.find(item => {
        return item.id === product.id});

      if(productInCart){
        productInCart.countity++
        
      }
      else {
        state.cart.push(product)
        localStorage.setItem('product', JSON.stringify(product));
      }
      window.$nuxt["$cookies"].set('cart', state.cart, {
        path: '/',
        maxAge: 2* 60* 60 * 1000
      })
    },

    increase: (state,id) =>{
        let found = state.cart.findIndex(el => el.id === id)
        state.cart[found].countity++;
        window.$nuxt["$cookies"].set('cart', state.cart, {
          path: '/',
          maxAge: 2* 60* 60 * 1000
        })
    },
    decrease: (state,id) =>{
        let found = state.cart.findIndex(el => el.id === id)
        let count = state.cart[found].countity;
        if(count<2){
          state.cart.splice(found,1);
        }else{
          state.cart[found].countity--;
        }
        window.$nuxt["$cookies"].set('cart', state.cart, {
          path: '/',
          maxAge: 2* 60* 60 * 1000
        })
    },

    loadCache: (state) => {
      const cart = window.$nuxt["$cookies"].getAll()?.cart;
      if(cart) state.cart = cart
    }


};

export const actions = {
    async fetchdata({commit}){
      const response = await Apisful.get('machines/')
        commit("setproducts", response.data.results);
        commit("loadCache")
    },
};

export const getters = {

    allproducts: state => state.products,

    cartTotalPrice: state => {
      let total = 0;
  
      state.cart.forEach(item => {
          total += item.price * item.countity;
      })
      return total
    },
    cartItemCount: state => {
      return state.cart.length;
  }

};