import Vue from "vue";
import Cookies from "js-cookie";
import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";
import "@/styles/index.scss"; // global css
import "@/styles/myfont/myfont.css";
import "@/styles/screenfont/myfont.css";
import Axios from "axios";
import App from "./App";
import store from "./store";
import router from "./router";

import i18n from "./lang"; // internationalization
import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log

import * as filters from "./filters"; // global filters
import waves from "@/directive/waves";
import JSEncrypt from "jsencrypt"; //引入模块
Vue.prototype.$jsEncrypt = JSEncrypt; //配置全局变量
Vue.prototype.$axios = Axios; //配置全局变量
import BaiduMap from "vue-baidu-map";
import divLayout from "@/components/divLayout/layout.vue";
import wxTable from "@/components/wxTable/index.vue";

/*视频预览组件*/
import videoZHCN from "video.js/dist/lang/zh-CN.json";
import videoPlayer from "vue-video-player";
let videojs = videoPlayer.videojs;
videojs.addLanguage("zh-CN", videoZHCN);
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.min.css";
import "video.js/dist/lang/zh-CN.json";
import "videojs-contrib-hls";
Vue.use(videoPlayer);

/*分片上传组件*/
import uploader from "vue-simple-uploader";
import combox from "./views/viewPlate/components/combox.vue";

Vue.use(uploader);
Vue.component("div-layout", divLayout);
Vue.component("wx-table", wxTable);
Vue.component("combox", combox); //面板公用组件

// 引入 iconfont
import '@/assets/icons/iconfont.css'

//
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: "76nFOz5YV7FDd2jSmUO4aQ9pSrgEFjfa",
});
// /**
//  * If you don't want to use mock-server
//  * you want to use MockJs for mock api
//  * you can execute: mockXHR()
//  *
//  * Currently MockJs will be used in the production environment,
//  * please remove it before going online ! ! !
//  */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(waves);
Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
  i18n: (key, value) => i18n.t(key, value),
});

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: (h) => h(App),
});
