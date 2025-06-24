<template>
  <div style="height:100%">
    <div id="alarm_Box" style="height:100%">
      <div class="alarm_Box-top">
        <!-- <div class="textT" v-for='(item,index) in titleArr' :key="index">
          <div>{{listQuery.flag ==1?'今天新增':(listQuery.flag ==2 ?'7天内新增':'30天内新增')}} <span style="color:#FF7800">{{item.value>=0? ('+'+ item.value):item.value}}</span></div>
          <div><span>{{item.number}}</span> <span>次</span></div>
          <div>{{item.name2}}</div>
        </div> -->
        <!-- <div class="textT">
          <div>较上月 <span style="color:#30CF59">+321</span></div>
          <div><span>121</span> <span>次</span></div>
          <div>升降机告警</div>
        </div>
        <div class="textT">
          <div>较上月 <span style="color: #30cf59">+0</span></div>
          <div><span>336</span> <span>次</span></div>
          <div>扬尘检测告警</div>
        </div> -->
      </div>
      <div class="alarm_Box-table">
                  <el-table
      :data="newtableData"
      stripe
      :header-cell-style="{background:'rgba(164, 229, 225, 0.05)'}"
      style="width: 100%">
      <el-table-column
        prop="uploadDate"
        label="时间"
        align ='center'
        >
      </el-table-column>
      <el-table-column
        prop="machineName"
        label="设备"
        align ='center'
        >
      </el-table-column>
      <el-table-column
        prop="projectName"
        align ='center'
        label="项目">
      </el-table-column>
      <el-table-column
        prop="warning"
        align ='center'
        label="警告内容">
      </el-table-column>
      
    </el-table>
     <!--分页组件-->
    <el-pagination class="el-pagination"
                   v-show="total>0"
                   background
                   layout="prev, pager, next"
                   :current-page.sync="listQuery.pageIndex" :page-size.sync="listQuery.pageSize"
                   @current-change="loadPageData"
                   :total="total">
    </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getPageTtUploadFile} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import Pagination from '@/components/Pagination' 
import { alarmTongji } from "@/views/viewPlate/enterPrise/api/enterPriseDigitalSite";
export default {
  // props:['isActive'],
  components: {Pagination},
  data() {
    return {
       total: 1, // 默认总数0
        listQuery: { //搜索条件
          pageIndex: 1,
          pageSize: 15,
          flag:''
        },
        upTotal:0,

      titleArr:[],
      newtableData:[],
       
    };
  },
   created(){
   this.ways(this.$store.state.video.isActive,)
  },
  mounted() {},
  methods: {
     ways(index){
        this.listQuery.flag =index
       this.loadPageData(index)
       alarmTongji({flag:index}).then(res=>{ 
          console.log('告警详情',res)
          this.titleArr =res.data.num

          for(var j=0;j<this.titleArr.length;j++){
             if(index ==1){
                this.titleArr[j].timeDate ='较昨天'
             }else if(index ==2){
                this.titleArr[j].timeDate ='较上周'
             }else if(index ==3){
                this.titleArr[j].timeDate ='较上月'
             }

             if(this.titleArr[j].name == 'tj'){
               this.titleArr[j].number =res.data.tj.length
               this.titleArr[j].name2 ='塔吊报警'
             }
             if(this.titleArr[j].name == 'td'){
               this.titleArr[j].number =res.data.td.length
               this.titleArr[j].name2 ='升降机报警'
             }
             if(this.titleArr[j].name == 'ycjc'){
               this.titleArr[j].number =res.data.ycjc.length
               this.titleArr[j].name2 ='扬尘监测报警'
             }
          }
          // this.newData =res.data 
          //    console.log(101,res)
          //    var newArr=[]
          //  Object.keys(res.data).forEach((key, index) => {  // 对象转数组
          //   if(key != "num" ){
          //       newArr.push(res.data[key])
          //   }
          // });
          // for(var i=0;i<newArr.length;i++){
          //     for(var a=0;a<newArr[i].length;a++){
          //      this.newtableData.push(newArr[i][a])
          //   }
          // }
          // console.log(this.newtableData)  // 这是新的列表的值

       })
    },
      loadPageData(){
        this.dataLoading=true;
        getPageTtUploadFile(this.listQuery).then(res=>{
          if(res.code=="success"){
            this.newtableData=res.data.records;
            this.total=res.data.total;
          }
          this.dataLoading=false;
        }).catch(err=>{
          console.log(JSON.stringify(err))
          this.dataLoading=false;
        })
      },
  },
};
</script>

<style lang="less" scoped>
#alarm_Box .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: transparent;
    color:#4190AF
}
#alarm_Box .el-table {
  /deep/.el-table__row--striped td {
    background-color: rgba(164, 229, 225, 0.05);
  
  }
}
</style>
<style lang="less" scoped>
#alarm_Box {
  height: 100%;
  min-height: 700px;
  margin: 0px -15px 0 -15px;
  .alarm_Box-top {
    height: 120px;
    //    width: 181px;
    //    height: 120px;
    display: flex;
    justify-content: space-between;
    margin-top: -10px;
    .textT {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 185px;
      height: 120px;
      background-color: rgba(164, 229, 225, 0.05);

      div:nth-child(1) {
        font-size: 18px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #9e9e9f;
        line-height: 44px;
        font-family: "Acens";
      }
      div:nth-child(2) {
        font-size: 14px;
        color: #9e9e9f;
        
        span:nth-child(1) {
          font-size: 30px;
          color: #f10d18;
          font-family: "Acens";
        }
      }
      div:nth-child(3) {
        margin-top: 5px;
        font-size: 14px;
        color: #a4e5ff;
      }
    }
  }
}
.alarm_Box-table {
  margin: 24px 0;
  height: calc(100% - 180px);
  overflow: scroll;
  // background-color: #fff;
}
.el-pagination{
  position: absolute;
  bottom: 10px;
}
</style>
