import colors from 'vuetify/es5/util/colors.js'
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
dotenv.config();
// require('dotenv').config()
export default {
  // ssr: true,
  // target: 'server',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Copiers Part Supply',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Purchase copier parts.' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/google-analytics'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-clipboard2',
    'nuxt-webfontloader',
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    ['@nuxtjs/dotenv', { only: ['host', 'type', 'port', 'GOOGLE_ANALYTICS_ID'] }],
    [
      'nuxt-session', 
      (session) => {
          // Use the session object:
          // const MongoStore = require('connect-mongo');
          return {
              name: 'sessionId',
              store: MongoStore.create({
                mongoUrl: process.env.mango, //YOUR MONGODB URL
              }),
              secret: 'u90u3998998y0u-ui-iu0-iefrhjffihreioheriohfiohfriofhriorhhreiorfhioerhiorheroifhriohfior-3u3-39-u2393-23-320-3',
              cookie: { 
                  maxAge: 2 * 60 * 60 * 1000 // 2 hours
              },
              saveUninitialized: true,
              resave: false
          };
        }
      ],
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue?.darken2 || colors.default.blue.darken2,
          accent: colors.grey?.darken3 || colors.default.grey.darken3,
          secondary: colors.amber?.darken3 || colors.default.amber.darken3,
          info: colors.teal?.lighten1 || colors.default.teal.lighten1,
          warning: colors.amber?.base || colors.default.amber.base,
          error: colors.deepOrange?.accent4 || colors.default.deepOrange.accent4,
          success: colors.green?.accent3 || colors.default.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  webfontloader: {
    google: {
      families: ['Poppins:400,500,700']
    }
  },

  serverMiddleware: [
    '~/api/index.js'
  ],

  server: {
    host: '0.0.0.0',
    port: process.env.port // default: 3000
  },

  axios: {
    baseURL: `${process.env.type}://${process.env.host}/`
  },

  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
    autoTracking: {
      screenview: true,
      pageviewOnLoad: true,
      pageviewTemplate (route) {
        return {
          page: route.path,
          title: document.title,
          location: window.location.href
        }
      }
    },
    debug: {
      enabled: false, // default value
      trace: false, // default value
      sendHitTask: true // default value
    },
  },

  env: {
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID
  }
}
