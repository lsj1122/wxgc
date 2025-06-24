<template>
  <div class="newsCenter">
      <timeButton timeButtonShow='false'></timeButton>
       <div class="newsCenter-content">
         <com-line class="content-left-top" :title="'新闻中心'" :title2="'Video surveillance list'">
        <div class="icon-document">
          <div class="news" style="100%">
             <news></news>
          </div>
        </div>
        </com-line>
       </div>
  </div>
</template>

<script>
import timeButton from "../aModules/timeButton";
import ComLine from "../../components/comline";
import news from './modules/news'
export default {
  props: {},
    components:{ComLine,news,timeButton},
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
}
.icon-document {
    width: 100%;
    height: 75.6vh;
    // min-height: 600px;
    box-sizing: border-box;
  }
</style>