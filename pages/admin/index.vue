<template>
  <v-card>
    <v-card-title>Customer Orders</v-card-title>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="infos"
      :search="search"
      :loading="load"
      @click:row="handleClick"
      :custom-filter="customFilter"
      item-key="_id"
    >
    </v-data-table>

    <v-dialog
        v-model="dialog"
        max-width="500px"
    >
        <OrderList v-for="item in current.orders" :key="item.id"
                        :name="item.name" :image="item.image" :price="item.price" 
                        :countity="item.countity" :id="item.id"/>
    </v-dialog>

    <v-card-title>Payment Slip</v-card-title>
    <v-card-title>
      <v-text-field
        v-model="search2"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="paymentSlip"
      :search="search2"
      :loading="load2"
      @click:row="handleClick2"
      :custom-filter="customFilter"
      item-key="_id"
    >
    </v-data-table>
  <v-dialog
          v-model="dialog2"
          max-width="500px"
      >
          <v-img :src="currentLink" />
      </v-dialog>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        expanded: [],
        search: '',
        search2: '',
        headers: [
          {
            text: 'Company Name',
            align: 'start',
            value: 'companyName',
          },
          { text: 'Customer Name', value: 'name' },
          { text: 'Contact Number', value: 'contactNumber' }
        ],
        load: true,
        load2: true,
        infos: [],
        dialog: false,
        dialog2: false,
        current: {orders: []},
        current2: {image: null},
        paymentSlip: [],
        currentLink: null
      }
    },
    methods: {
        async handleClick(item) {
            this.current = item
            this.dialog = true
        },
        async handleClick2(item) {
          this.current2 = item
          this.dialog2 = true
          this.currentLink = this.genLink(item.image)
        },
        genLink(image) {
          return `${process.env.type}://${process.env.host}/api/uploadphoto/${image.id}`
          // global.btoa = function (str) {
          //   return new Buffer(str, 'binary').toString('base64');
          // };
          // var bytes = new Uint8Array(image?.data?.data);
          // var binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
          // const done = "data:image/jpeg;base64," + btoa(binary);
          // return done
        },
        customFilter(items, search, filter) {
          const id = filter._id
          const allItems = Object.values(filter).filter(a => !Array.isArray(a)).filter(a => {
            if(a == id) {
              if(a == search) return a;
            }
            else if(this.compareTwoStrings(a.toString(), search) > 0.5) return a
          })
          if(allItems.length) return items
        },
        compareTwoStrings(first, second) {
          first = first.replace(/\s+/g, '');
          second = second.replace(/\s+/g, '');
          // identical or empty
          if (first === second) return 1;
          // if either is a 0-letter or 1-letter string
          if (first.length < 2 || second.length < 2) return 0;

          const firstBigrams = new Map();
          for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2);
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

            firstBigrams.set(bigram, count);
          }

          let intersectionSize = 0;
          for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2);
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

            if (count > 0) {
              firstBigrams.set(bigram, count - 1);
              intersectionSize++;
            }
          }

          return (2.0 * intersectionSize) / (first.length + second.length - 2);
        }
    },
    async mounted() {
        const isAdmin = await this.$axios.get('/api/isAdmin');
        if(isAdmin.data.admin == false) {
          return this.$router.push('/login')
        }
        else {
          this.$axios.get('/api/orders').then(res => {
            this.infos = res.data
            this.load = false
          })

          this.$axios.get('/api/paymentSlip').then(res => {
            this.paymentSlip = res.data
            this.load2 = false
          })
        }
        
    }
  }
</script>