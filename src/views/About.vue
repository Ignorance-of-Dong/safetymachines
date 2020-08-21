<!--
 * @Author: zhangzheng
 * @Date: 2020-08-06 15:12:32
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-18 18:24:27
 * @Descripttion: 
-->
<template>
  <div class="about">
    <datapicker />
  </div>
</template>
<script>
import * as datapicker from "vue-datetime-picker";
export default {
  components: {
    datapicker: datapicker
  }
};
</script>
