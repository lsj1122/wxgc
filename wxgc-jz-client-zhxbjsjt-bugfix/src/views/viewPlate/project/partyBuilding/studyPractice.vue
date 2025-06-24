<template>
  <combox style="overflow-x: hidden" title="学习实践">
    <div class="content">
      <div class="item" v-for="(item, index) in members" :key="index"  @click="showDetail(item)">
        <div class="image-box">
          <img class="img-head" :src="item.imgUrl" alt />
        </div>
        <div style="margin-left: 10px;flex:1">
          <div>{{item.name}}</div><br>
          <div>{{item.date}}</div>
        </div>
      </div>
    </div>

    <el-dialog
        title="内容详情"
        :visible.sync="DialogVisible"
        width="700px"
        center
        class="dialog-wrap"
        :modal-append-to-body='false'
    >
      <div>
        <!-- <img :src="textDetail.imgUrl" width="500" alt="" srcset=""> -->
          <el-image
      style="width:500px"
      :preview-src-list=[textDetail.imgUrl]
      :src="textDetail.imgUrl"
      :fit="fit"></el-image>
        <p style="color:#fff">{{textDetail.name}}</p>
      </div>
    </el-dialog>
  </combox>
</template>

<script>
import {getAllTtPartyStudyByPro} from "@/views/party/api/ttpartystudy";
export default {
  name: "studyPractice",
  data() {
    return {
      DialogVisible:false,
      filedata:null,
      shijianTitle:'',
      members: [],
      textDetail:''
    };
  },
  components: {},
  created(){
    this.geStudyList()
  },
  methods: {
      showDetail(item){
        this.DialogVisible=true;
        this.textDetail=item;
      },
      geStudyList(){
        getAllTtPartyStudyByPro().then(res => {
          this.members = res.data
        })
      },
  }
}
</script>

<style scoped>
.content {
  /*color: #cecece;*/
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.content:hover {
  overflow-y: auto;
}
.item {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}
.image-box {
  height: 75px;
  width: 100px;
}
.image-box img {
  width: 100%;
  height: 100%;
}
</style>
