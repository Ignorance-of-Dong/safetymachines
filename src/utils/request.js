/*
 * @Author: xiaowei
 * @Date: 2019-11-05 17:30:11
 * @LastEditors: zhangzheng
 * @LastEditTime: 2020-08-07 10:32:18
 * @Description: file content
 */
import axios from "axios";
import qs from "qs";
import store from "@/store";

let pending = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识

const CancelToken = axios.CancelToken;

let removePending = config => {
  for (let p in pending) {
    if (pending[p].conf === config.url + "&" + config.method) {
      // 当当前请求在数组中存在时执行函数体
      pending[p].func(); // 执行取消操作
      pending.splice(p, 1); // 把这条记录从数组中移除
    }
  }
};

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    removePending(config); // 在一个ajax发送前执行一下取消操作
    config.withCredentials = true;
    config.cancelToken = new CancelToken(c => {
      pending.push({ conf: config.url + "&" + config.method, func: c });
    });
    // token处理
    let token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    config.headers["x-dm-app"] = "DcsWeb";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    removePending(response.config); // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    return response;
  },
  error => {
    return Promise.reject(error);
    // return { data: error }  // 返回一个空对象，主要是防止控制台报错
  }
);

// post
const poster = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "x-dm-app": "DcsWeb"
  },
  transformRequest: [
    function(data) {
      return qs.stringify(data, { arrayFormat: "repeat" });
    }
  ]
});
// post请求拦截器
poster.interceptors.request.use(
  config => {
    // token处理
    let token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// postJson
const posterJson = axios.create({
  headers: {
    "Content-Type": "application/json",
    "x-dm-app": "DcsWeb"
  }
});
// postJson请求拦截器
posterJson.interceptors.request.use(
  config => {
    // token处理
    let token = store.state.account.token;
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const errorMsg = {
  401: "用户尚未登录，即将跳转到登录页面",
  403: "当前用户权限无法执行操作",
  404: "未找到",
  500: "服务器发生错误",
  502: "服务器网关错误",
  503: "服务不可用",
  504: "服务器超时",
  10500: "程序内部错误",
  10400: "参数错误",
  timeout: "网络超时"
};

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// 响应中包含错误
function errorResponse(res, reject, bus) {
  if (bus) {
    switch (res.data.code) {
      case 10500026: // 10500026: 用户凭证不存在
      case 10500027: // 10500027: 用户凭证无效
        break;
      case 10400005:
        // 未找到
        break;
      case 12500016: // 工作组无权限， 无法访问
        break;
      case 10500065: // 10500060   订阅不存在或者已过期
        break;
      case 10500062: // 10500062   该账号未分配License
        break;
      default:
        break;
    }
  }
  reject(res);
}
// 请求发生错误
async function failedRequest(err, reject, bus) {
  let errMsg = errorMsg;
  if (err.response) {
    switch (err.response.status) {
      case 401:
        // 登录检测失败
        if (bus) bus.$message.error(errMsg[err.response.status]);
        break;
      case 403:
        if (bus) bus.$message.error(errMsg[err.response.status]);
        reject(err);
        break;
      case 404:
        if (bus) bus.$message.error(errMsg[err.response.status]);
        reject(err);
        break;
      case 500:
        if (bus) bus.$message.error(errMsg[err.response.status]);
        reject(err);
        break;
      default:
        if (bus) bus.$message.error(err.message);
        reject(err);
        break;
    }
  } else {
    if (err.code === "ECONNABORTED") {
      if (bus) bus.$message.error(errMsg["timeout"]);
    }
    reject(err);
  }
}

// URL接口地址参数拼接
function parseUrlParams(url, data) {
  // 使用$$做为定界符
  return url.replace(/(\$(\w*?)\$)/g, function(match, full, n1) {
    if (full === "$$") {
      return data;
    } else if (data[n1] !== undefined) {
      var rs = data[n1];
      delete data[n1];
      return rs;
    }
    return full;
  });
}
/**
 *
 * @param {*请求的URL与方法} api
 * @param {*请求需要发送的数据} data
 * @param {*事件总线，主要是为了vue中的i18n和message} bus
 * @param {*回调函数，在上传中用于回调进度信息} cb
 */
export function requestControl(api, data, bus, cb = () => {}) {
  let url = parseUrlParams(api.url, data);
  switch (api.method.toLowerCase()) {
    case "post":
      return new Promise((resolve, reject) => {
        poster({
          method: "post",
          url: url,
          data: data,
          timeout: 15 * 1000
        })
          .then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              errorResponse(res, reject, bus);
            }
          })
          .catch(err => {
            failedRequest(err, reject, bus);
          });
      });
    case "put":
      return new Promise((resolve, reject) => {
        poster({
          method: "put",
          url: url,
          data: data,
          timeout: 15 * 1000
        })
          .then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              errorResponse(res, reject, bus);
            }
          })
          .catch(err => {
            failedRequest(err, reject, bus);
          });
      });
    case "delete":
      return new Promise((resolve, reject) => {
        poster({
          method: "delete",
          url: url,
          data: data,
          timeout: 15 * 1000
        })
          .then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              errorResponse(res, reject, bus);
            }
          })
          .catch(err => {
            failedRequest(err, reject, bus);
          });
      });
    case "json":
      return new Promise((resolve, reject) => {
        posterJson({
          method: "post",
          url: url,
          data: data,
          timeout: 60 * 1000
        })
          .then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              errorResponse(res, reject, bus);
            }
          })
          .catch(err => {
            failedRequest(err, reject, bus);
          });
      });
    case "get":
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: url,
          params: Object.assign(data, {
            dcs_request_unit: new Date().getTime()
          }),
          timeout: 30 * 1000,
          headers: {
            // "X-Service-Id-Request-Id": "manage"
          }
        })
          .then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              errorResponse(res, reject, bus);
            }
          })
          .catch(err => {
            failedRequest(err, reject, bus);
          });
      });
    case "upload":
      return new Promise((resolve, reject) => {
        axios
          .post(url, data, {
            headers: {
              "Content-Type": "multipart/form-data"
              // "X-Service-Id-Request-Id": "manage"
            },
            onUploadProgress: progressEvent => {
              cb(progressEvent);
            }
          })
          .then(res => {
            if (res.data.code === 0) {
              resolve(res.data.data);
            } else {
              errorResponse(res, reject, bus);
            }
          })
          .catch(err => {
            failedRequest(err, reject, bus);
          });
      });
    case "download":
      return axios({
        method: "get",
        url: url,
        params: Object.assign(data, {
          dcs_request_unit: new Date().getTime()
        }),
        timeout: 30 * 1000,
        responseType: "arraybuffer"
      })
        .then(res => {
          // return res;
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(data => {
          return data; // data即为图片地址
        });
    default:
      break;
  }
}
