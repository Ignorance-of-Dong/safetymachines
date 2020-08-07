/*
 * @Author: zhangzheng
 * @Date: 2020-05-28 17:07:29
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-07 10:17:53
 * @Descripttion: 公共api
 */
import * as bus from "../main.js";
import { requestControl } from "../utils/request";
import { USER_LOGIN } from "./api";

// license订阅列表
export function userLogin(data, cb) {
  return requestControl(USER_LOGIN, data, bus, cb);
}
