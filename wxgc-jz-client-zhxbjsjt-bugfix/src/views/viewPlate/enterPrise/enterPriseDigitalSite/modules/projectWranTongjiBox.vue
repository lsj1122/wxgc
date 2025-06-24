<template>
  <div class="aa">
    <div id="pmTongji">
          <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        label="项目名称"
        margin-left="10px"
        width="350">
         <template slot-scope="scope">  
        <span style="margin-left:10px">{{ scope.row.name }}</span>
        <span style="float:right;color:#FDA484"> ll</span>
      </template>
      </el-table-column>
      <el-table-column
        prop="value"
        label="报警次数"
        width="120"
        align ='center'
        >
      </el-table-column>
      <el-table-column
        prop="amount"
        align ='center'
        label="预警次数">
        <template slot-scope="scope">  
        <span style="margin-left: 10px">{{ scope.row.amount }}</span>
        <span :class="[scope.$index==0?'aaa':scope.$index==1?'bbb':scope.$index==2?'ccc':'ddd']"></span>
        <!-- <span :class="[scope.$index==0?'aaa':'']"></span> -->
      </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import { alarStatistics, } from "@/views/viewPlate/enterPrise/api/enterPriseDigitalSite";
export default {
  components: {},
  data() {
    return {tableData: []};
  },
  created(){
       this.ways(this.$store.state.video.isActive)
  },
  mounted() {

  },
  methods: {
    ways(index){
      alarStatistics({flag:index}).then(res=>{
        this.tableData =res.data
      })
    }
  },
};
</script>
<style lang="less" scoped>
.aa{
  height: 100%;
}
#pmTongji {
height: 100%;
  // min-height: 300px;
  margin:0 -15px;
    
}
/deep/.el-table__body-wrapper{
  height: 90% !important;
   overflow: auto !important;
   /deep/table{
overflow: auto;
   }
}
#pmTongji .el-table {
  height: 100%;
       /deep/.has-gutter tr th:nth-child(1) .cell{
          margin-left:10px ;
       }
      /deep/.el-table__row--striped td{
          background-color: rgba(164, 229, 225, 0.05);
    }
  }
.aaa{
    margin-top: 8px;
float:right;background-color:#FF0000;width:8px;height:8px;border-radius: 50%;
}
.bbb{
     margin-top: 8px;
float:right;background-color:#FF7753;width:8px;height:8px;border-radius: 50%;
}
.ccc{
     margin-top: 8px;
float:right;background-color:#FDD484;width:8px;height:8px;border-radius: 50%;
}
.ddd{
     margin-top: 8px;
float:right;background-color:rgba(0,0,0,0);width:8px;height:8px;border-radius: 50%;
}
</style>
