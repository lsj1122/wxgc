<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
     return {
       time:0,
     }
  },
  created() {
    this.loadPublicKey();
  },methods:{
    loadPublicKey() {
      let  that=this;
      this.$store.dispatch('RSA/loadPublicKey')
        .then(() => {
          console.log("============>已经获得公钥!")
        })
        .catch(() => {
          console.log("============>尝试重新获得公钥!")
          this.time++;
          if(this.time>4){
            return;
          }
          setTimeout(that.loadPublicKey(),500)
        })
    }

  }
}
</script>
<style lang="scss">
@import "styles/index.css";
@media screen and(max-width:1366px) {
  #app{
    overflow: scroll;
  }
  #app::-webkit-scrollbar {display:none}
}
@media screen and(max-width:1024px) {
  #app{
    overflow: hidden;
  }  
}

</style>
