<!--
 * @Author: zhangzheng
 * @Date: 2020-08-06 16:37:09
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-06 18:39:07
 * @Descripttion: 
-->
<template lang="">
  <div class="header">{{ msg }}</div>
</template>
<script>
export default {
  props: ["msg"]
};
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 50px;
  background: #ccc;
}
</style>
