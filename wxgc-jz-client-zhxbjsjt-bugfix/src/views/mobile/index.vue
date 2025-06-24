<template>
  <div class="main">
    <div :class="show==true ? 'block':'blocks'">
      <div v-if="iosErr" class="iosErr">暂不支持IOS客户端,仅支持Android,鸿蒙honeyOS!</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      show: false,
      iosErr: false,
      appUrl: window.location.protocol + '//' + window.location.host + '/zhxn.apk',
      iosUrl: '' // ios暂无
    }
  },
  created() {
    this.downApp()
  },
  methods: {
    downApp() {

      let ua = navigator.userAgent.toLowerCase();
      let isWechat = this.isWeixinBrowser(ua);//微信扫描的
      let isAlipay = this.isAlipayBrowser(ua); //支付宝扫描的

      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        this.iosErr = true;
        this.show = true;
        window.location = this.iosUrl
      } else if (/(Android)/i.test(navigator.userAgent)) {
        if (isWechat || isAlipay) {
          this.show = true;
          this.iosErr = false;
        } else {
          window.location = this.appUrl;
        }
      } else { //PC电脑
        this.$router.push("/");
      }

       if(this.isWeixinBrowser(ua)){ //如果是微信
         //Android终端
         let isAndroid = ua.indexOf("Android") > -1 || ua.indexOf("Adr") > -1; //Ios终端
         let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
         if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
           this.iosErr=true;
           this.show=false;
         } else if (/(Android)/i.test(navigator.userAgent)) {
           //Android终端
           this.show=true;
           this.iosErr=false;
         }else{
           this.$router.push("/");
         }
       }else{
         window.location=this.appUrl;
       }
    },
    isWeixinBrowser(ua) {
      return /micromessenger/.test(ua) ? true : false;
    },
    isAlipayBrowser(ua) {
      return /alipayclient/.test(ua) ? true : false;
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  background-color: gray;
  width: 100%;
  height: 100vh;

  .block {
    width: 100%;
    height: 400px;
    background-color: gray;
    background-image: url("./live_weixin.png"); //默认路劲为public下
    background-size: 100% 100%;
  }

  .blocks {
    width: 100%;
    height: 400px;
    background-color: gray;
    background-size: 100% 100%;
  }

  .iosErr {
    color: white;
    padding-top: 25%;
    text-align: center;
  }
}

</style>
