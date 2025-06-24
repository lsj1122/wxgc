<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">文件资料</div>
    </div>
    <div class="body" @scroll="scrollBox">
      <div class="boxd">
        <div v-for="(item,index) in zlList" :key="index" @click="preview(item.otherFilePath)">
          <span :title="item.otherFilePath.substring(60)">{{item.otherFilePath.substring(60)}}</span>
          <span>{{item.createTime.split(' ').shift()}}</span>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import {getPageTtUploadFile}  from '@/views/sysproject/api/ttuploadfile.js'
import pdfobject from "pdfobject";
export default {
  data() {
    return {
      viewTitle:'文件预览',
      zlList:[],
      listQuery: { //搜索条件
          pageIndex: 1,
          pageSize: 10,
          createBy: undefined,
          type: 17
        },
    };
  },
  components:{
  },
  created(){
    this.loadPageData();
  },
  methods: {
    scrollBox(){
      let bigs = document.querySelector('.body').scrollTop;
      let bigsH = document.querySelector('.body').clientHeight;
      let small = document.querySelector('.boxd').scrollHeight;
      if((bigs + bigsH) >= (small - 10)){
        this.listQuery.pageIndex += 1;
        this.loadPageData();
      }
    },
    loadPageData(){
        getPageTtUploadFile(this.listQuery).then(res=>{
          if(res.code=="success"){
            this.zlList=res.data.records;
          }
        }).catch(err=>{
          console.log(JSON.stringify(err))
        })
      },
      preview(path) {
      let type = path.split(".").pop();
      let htmls = "";
      if (type === "pdf") {

        htmls = `<div style="width:100%;height:650px" id="prepdf"></div>`;
        setTimeout(() => {
          pdfobject.embed(path, "#prepdf");
        }, 200);
      } else {
        htmls = `<iframe src='https://view.officeapps.live.com/op/view.aspx?src=${path}' width='100%' height='650' frameborder='0'></iframe>`;
      }
      this.$alert(htmls, "预览", {
        dangerouslyUseHTMLString: true,
        customClass: "preWord",
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../laborManagement/MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  color: #c3e9fc;
  p{
    padding: 0;
    margin: 0;
  }
  .body{
    height: 88%;
    overflow-y: scroll;
    .boxd{
      >div{
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        cursor: pointer;
        span:nth-child(1){
          width: 60%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    }
}
</style>

<style >
.preWord {
  width: 1120px;
}
</style>