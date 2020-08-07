<!--
 * @Author: zhangzheng
 * @Date: 2020-08-06 15:12:32
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-07 10:32:39
 * @Descripttion: 
-->
<template>
  <div class="home">
    <Header />
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="username"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="password"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import Header from "@/components/header/HeaderTempalte.vue";
import { Form, Button, field } from "vant";
import { userLogin } from "../api/apiControl";
export default {
  name: "Home",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    onSubmit(values) {
      userLogin(
        {
          username: values.username,
          password: values.password
        },
        progress => {
          console.log(progress);
          console.log(progress.loaded / progress.total) * 100;
        }
      );
    }
  },
  components: {
    Header,
    "van-button": Button,
    "van-form": Form,
    "van-field": field
  }
};
</script>
