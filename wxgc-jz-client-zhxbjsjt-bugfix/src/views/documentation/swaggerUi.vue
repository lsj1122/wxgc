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
      this.src=process.env.VUE_APP_BASE_API_POXY+"/swagger-ui.html"
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
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
