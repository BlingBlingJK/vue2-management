import axios from "axios";
import { Message } from "element-ui";
import router from "../router/index";

const instance = axios.create({
  baseURL: "http://xue.cnkdl.cn:23683",
  timeout: 10000,
});
//请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("edb-authorization-token");
    if (
      token &&
      !config.url.endsWith("/login") &&
      !config.url.endsWith("/captchaImage")
    ) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
//响应拦截器
instance.interceptors.response.use(
  (res) => {
    let res_data = res.data;
    //有的不会给code,所以先判断是否有code
    if (res_data.code && res_data.code !== 200) {
      console.log(res_data);
      //每次登录都报错的解决
      if (res_data.code === 401) {
        localStorage.removeItem("edb-authorization-token");
        router.push("/");
      }

      Message.error(res_data.msg || "网络请求错误！");
      return false;
    }
    return res_data;
  },
  (err) => {
    return Promise.reject(err);
  }
);
export default instance;
