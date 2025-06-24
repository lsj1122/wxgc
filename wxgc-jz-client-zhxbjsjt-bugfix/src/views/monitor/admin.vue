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
        let url=process.env.VUE_APP_BASE_API_POXY+"/wxgc-admin";
      /*  url=url.substring(0,url.lastIndexOf(":")+1)+"9001";*/
        return url;
      },
      open2() {
        this.$notify({
          title: '系统提示',
          message: '要先启动后台的【wxgc-spring-boot-admin-server】模块,注册到同一个nacos中即可',
          duration: 0
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
