import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import Store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = Store

App.mpType = 'app'

Vue.use(uView)

const app = new Vue({
    Store,
    ...App
})


app.$mount()
