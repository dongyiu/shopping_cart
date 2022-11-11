<template>
  <v-app>
    <v-main>
      <v-app-bar
      elevation="5"
      >
      <v-toolbar-items
      class="hidden-xs-only">
        <v-btn
          text
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">{{item.title}}</v-btn>
           <v-btn icon>
      </v-btn>
      </v-toolbar-items>
        <v-spacer></v-spacer>
        <span class="hidden-sm-and-up">
          <v-btn
          @click="sidebar = !sidebar"
          >
          |||
          </v-btn>
        </span>
      </v-app-bar>
      <v-navigation-drawer
      v-model="sidebar"
      absolute
      temporary
      right
      >
        <v-list>
          <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">{{item.title}}
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>


<script>
import index from '~/pages/index.vue'
export default {
  components: { index },
  name: 'default',
  data(){
    return{
      sidebar:false,
      menuItems:[
        // {title:'Home',path:'/'},
        {title:'Products',path: '/'},
        {title:'Cart',path:'/cart'},
        {title:'Upload',path: '/upload'},
      ],
    }
  },
  async created() {
    const res = await this.$axios.get(`/api/isAdmin`);
    if(res.data.admin == true) return this.menuItems.push({ title: 'Admin', path: '/admin' })
    
  }
}
</script>