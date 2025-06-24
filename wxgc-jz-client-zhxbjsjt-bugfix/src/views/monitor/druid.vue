<template>
  <div class="app-container">
    <iframe :src="src" style="width:100%;height:100%;" frameborder="0"  id="bdIframe"></iframe>
  </div>
</template>

<script>

export default {
  name: 'SwaggerUi',
  components: {  },
  data() {
    return {
      src:''
    }
  },
  created(){
    this.open2();
    this.src=this.getUrl();
  },
  mounted(){

    this.changeIfame()
    window.onresize = () => {
      return (() => {
        this.changeIfame()
      })()
    }
  },methods:{
    changeIfame(){
      /**
       * iframe-高自适应显示
       */
      const oIframe = document.getElementById('bdIframe');
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.height = (Number(deviceHeight)-130) + 'px'; //数字是页面布局高度差
    },
    getUrl(){
      let url=process.env.VUE_APP_VIDEO_API+"/druid/login.html";
      return url;
    },
    open2() {
      this.$notify({
        title: '系统提示',
        message: '账户:wanxiang 密码:123456',
        duration: 0
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
