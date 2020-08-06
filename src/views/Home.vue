<!--
 * @Author: zhangzheng
 * @Date: 2020-08-06 15:12:32
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-06 17:00:29
 * @Descripttion: 
-->
<template>
  <div class="home">
    <Header />
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <Button type="info">主要按钮</Button>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/header/HeaderTempalte.vue";
import HelloWorld from "@/components/HelloWorld.vue";

import { Button } from "vant";
export default {
  name: "Home",
  components: {
    HelloWorld,
    Header,
    Button
  }
};
</script>
