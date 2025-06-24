<template>
  <div style="height: 100%; height: 100%; position: relative">
    <div :id="myId" style="width: 50%; height: 90%" class="player" />
    <!-- <el-tag type="info" class="closeBox" @click="closeVideo">关闭</el-tag> -->
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";
import { getAccessTokenWys } from "@/api/user.js";
import axios from "axios";

export default {
  name: "HelloWorld",
  props: {
    title: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    appKey: {
      type: String,
      default: "",
    },
    secret: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },
  data: function () {
    return {
      titleShow: true,
      myId: require("uuid").v1(),
      newUrl: "",
      newTitle: "",
      player: null,
      accessToken: "",
    };
  },
  mounted() {
    if (this.url !== "" && this.url) {
      this.newUrl = this.url;
      this.newTitle = this.title;
      this.$nextTick(function () {
        this.addVideoUrl();
      });
    }
  },
  methods: {
    addVideoUrl() {
      var _this = this;
      //  获取accessToken

      var accessTokenData = sessionStorage.getItem("accessTokenARR");

      if (accessTokenData && accessTokenData.length > 0) {         //先从 sessionStorage 里面取
        accessTokenData = JSON.parse(accessTokenData);

        let exists = accessTokenData.some((element) => {
          return (_this.accessToken = element.accessToken);
        });
        if (exists) { //判断  sessionStorage 有值
          accessTokenData.forEach((element) => {
            if (element.id == _this.id) {
              _this.accessToken = element.accessToken;
            }
          });
          _this.playerWays();
        } else {  //判断  sessionStorage 无值
          axios({
            url: "https://open.ys7.com/api/lapp/token/get",
            method: "post",
            params: {
              appKey: _this.appKey,
              appSecret: _this.secret,
            },
          }).then((result) => {
            _this.accessToken = result.data.data.accessToken;
            accessTokenData =accessTokenData.push({id:_this.id,accessToken:_this.accessToken})
            sessionStorage.setItem("accessTokenARR", JSON.stringify(accessTokenData));
            _this.playerWays();
          });
        }
      } else {
        axios({
          url: "https://open.ys7.com/api/lapp/token/get",
          method: "post",
          params: {
            appKey: _this.appKey,
            appSecret: _this.secret,
          },
        }).then((result) => {
          _this.accessToken = result.data.data.accessToken;
          let arr =[{id:_this.id,accessToken:_this.accessToken}]
          sessionStorage.setItem("accessTokenARR", JSON.stringify(arr));
          console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqq',sessionStorage.getItem("accessTokenARR"))

          _this.playerWays();
        });
      }
    },
    playerWays() {
      var _this = this;
      _this.player = new EZUIKit.EZUIKitPlayer({
        id: _this.myId, // 视频容器ID
        accessToken: _this.accessToken,
        url: _this.newUrl,
        template: "theme", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版; theme-可配置主题；
        plugin: ["talk"], // 加载插件，talk-对讲
        autoplay: false,
      });

      setTimeout(function () {
        _this.player.play();
      }, 1500);
    },
    closeVideo() {
      try {
        this.$emit("deleteVideoUrl", this.url);
        this.newUrl = "";
        this.newTitle = "";
        this.player.stop();
        this.player.destroy();
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.closeBox {
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
  z-index: 1000000000;
}
.player {
  position: relative;
  background-color: black;
  height: 100% !important;
  width: 100% !important;
  border: 1px solid white;
  color: white;
  text-align: center;
  .bottom {
    position: absolute;
    top: 30px;
    right: 2px;
  }
  ::v-deep iframe {
    width: 97%;
    height: 97%;
  }
}
.bgc {
  height: 100%;
  width: 100%;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  .bgc-div {
    p {
      padding: 0;
      margin: 0;
      margin-left: -4%;
      color: #000;
    }
  }
}
.disabled {
  width: 40%;
  height: auto;
}
::v-deep .head-message {
  display: none;
}
</style>

