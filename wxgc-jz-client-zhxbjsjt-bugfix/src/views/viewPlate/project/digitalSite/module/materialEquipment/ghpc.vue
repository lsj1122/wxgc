<template>
  <div class="ghpc box">
    <div class="title">
      <div class="title_text">供货偏差</div>
      <div>
        <el-button
          size="small"
          @click="handghpcData(1)"
          :class="{ active: isActive == 1 }"
          >本月</el-button
        >
        <el-button
          size="small"
          @click="handghpcData(2)"
          :class="{ active: isActive == 2 }"
          >累计</el-button
        >
      </div>
    </div>
    <div class="mian">
      <div class="main_data">
        <div id="ghpcData" v-loading='loading'></div>
      </div>
      <div class="main_table">
        <el-table :data="tableData" height="100%" style="width: 100%" v-loading='loading'>
          <el-table-column
            prop="pm"
            label="排名"
            width="100"
            align="center"
          >
          <template slot-scope="scope">
            <span >{{'TOP '+ scope.$index}}</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="GYSMC"
            label="供应商"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cfcgbs"
            label="超负差/过磅数"
            width="120"
            align="center"
          >
          <template slot-scope="scope">
            <span v-if="scope.row.count && scope.row.total">{{ scope.row.count+' / '+ scope.row.total}}</span>
          </template>
          </el-table-column>
          <el-table-column
            prop="percentage"
            label="超负差比"
            width="100"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { initghpcData } from "./ghpc_data.js";
import { getGongHUOinfo,getGongHUOinfoRight } from "../../api/wlys.js";
export default {
  data() {
    return {
      isActive: 0,
      ghpcData: [
        [], // 传入的值  (本月)
        [],      //（累计）
      ],
      ghpcDataPercentage: [
        [], // 传入的百分比的值
        [],  //（累计）
      ],
      tableData: [],
       loading: false,
    };
  },
  mounted() {
    this.handghpcData(1);
  },
  methods: {
    scopeLL(scope){
      console.log(scope)
    },

    getGongHUOinfo(value) {
      this.ghpcData=[[],[]]
      this.ghpcDataPercentage=[[], []]
      let type = null;
      let index = 0;
      if (value == 1) {
        type = value;
        index=0
      } else {
        type = "";
        index=1
      }
      getGongHUOinfo({ type: type }).then((res) => {

        let name = [];
        res.forEach((element) => {
          let nameinfo = "";
          if (element.PCJG == -1) {
            nameinfo = `超负差(${element["count"]}个)`;
          } else if (element.PCJG == 0) {
            nameinfo = `正常(${element["count"]}个)`;
          } else if (element.PCJG == 1) {
            nameinfo = `超正差(${element["count"]}个)`;
          }
          name.push(nameinfo);
          this.ghpcData[index].push(element.count);
          this.ghpcDataPercentage[index].push(element.percentage);
        });
        if (value == 1) {
         initghpcData(name,this.ghpcData[0], this.ghpcDataPercentage[0])
      } else {
        initghpcData(name,this.ghpcData[1], this.ghpcDataPercentage[1])  // 名字 ，数量 ，百分比
      }
     
      });
     
      // 右边表格的数据
      this.loading =true
      getGongHUOinfoRight({ type: type }).then(res=>{
        this.tableData =res
         this.loading =false
      }).catch(error=>{
         this.loading =false
      })

    },
    handghpcData(value) {
      this.isActive = value;
      this.getGongHUOinfo(value);


    },
  },
};
</script>

<style lang="less" scoped>
@import "./MQBaseStyle.less";

.ghpc {
  margin-top: 19.5px;
  height: 45%;
  .mian {
    height: 85%;
    display: flex;
    .main_data {
      width: 40%;
      margin-right: 20px;
      #ghpcData {
        width: 100%;
        height: 95%;
      }
    }
    .main_table {
      width: 60%;
      /deep/ .el-table {
        height: 95% !important;
        &,
        th {
          border: 1px solid rgba(240, 248, 255, 0.3);
        }
      }
      /deep/ .el-table--border::after {
        background: none !important;
      }
    }
  }
}
</style>
