<template>
  <div class="newsCenter">
       <div class="newsCenter-content">
        <div class="icon-document">
          <div class="news">
             <news></news>
          </div>
        </div>
       </div>
  </div>
</template>

<script>
import ComLine from "../viewPlate/components/comline.vue";
import news from './modules/news'
export default {
  props: {},
    components:{ComLine,news},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.newsCenter{
    width: 100%;
    // height: 76.8vh;
    // min-height: 600px;
    padding:20px;
    background: #ffffff;
}
.icon-document {
    width: 100%;
    height: 100%;
    // min-height: 600px;
    box-sizing: border-box;
    overflow: scroll;
  }
</style>
