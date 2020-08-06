/*
 * @Author: zhangzheng
 * @Date: 2020-08-06 15:12:32
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-06 15:31:26
 * @Descripttion: w
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "lib-flexible/flexible";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
