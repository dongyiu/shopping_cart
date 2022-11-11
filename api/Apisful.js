const axios = require('axios');

const Apisful = axios.create({
  // We are using apisful.com as a backend for this e-commerce website
  baseURL: 'https://api.apisful.com/v1/collections/',
  headers: {
    // Put your access key here
    'X-Api-Key': 'pbLpEnkupgDF3Ylqj2Q81eGIInR8bAePUO7QNeHjHQc' // ejuV8wNJIJoZvxq7cDeqfDbv0qWEVPa2BqaYxbRRZNI
  },
  validateStatus (status) {
    return status >= 200 && status < 500
  }
})

module.exports = Apisful
