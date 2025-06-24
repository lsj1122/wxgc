<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">监测数据统计</div>
    </div>
    <div class="body">
      <div class="selectAll">
        <div>
          <el-select
            v-model="bgvalue1"
            placeholder="请选择"
            size="small"
            class="selectBox"
            @change="bgvalueChange()"
          >
            <el-option
              v-for="item in options"
              :key="item"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
           @change="bgvalueChange()"
            v-model="select.value1"
            
            placeholder="请选择"
            size="small"
            class="selectBox"
            v-if="bgvalue1 == 0 && optionsCeXie.length > 0"
          >
            <el-option
              v-for="item in optionsCeXie"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
           @change="bgvalueChange()"
            v-model="select.value2"
            
            placeholder="请选择"
            size="small"
            class="selectBox"
            v-if="bgvalue1 == 0 && optionsCeXie2.length > 0"
          >
            <el-option
              v-for="item in optionsCeXie2"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <!-- 第二个表了 -->
          <el-select
            @change="bgvalueChange()"
            v-model="select.value3"
            
            placeholder="请选择"
            size="small"
            class="selectBox"
            v-if="bgvalue1 == 1 && optionsChengJiang.length > 0"
          >
            <el-option
              v-for="item in optionsChengJiang"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
           <!-- 第三个表了 -->
          <el-select
            @change="bgvalueChange()"
            v-model="select.value4"
            
            placeholder="请选择"
            size="small"
            class="selectBox"
            v-if="bgvalue1 == 2 && optionsShuiWei.length > 0"
          >
            <el-option
              v-for="item in optionsShuiWei"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>

           <!-- 第四个表了 -->
           <el-select
            @change="bgvalueChange()"
            v-model="select.value5"
            
            placeholder="请选择"
            size="small"
            class="selectBox"
            v-if="bgvalue1 == 3 && optionsShuiPing.length > 0"
          >
            <el-option
              v-for="item in optionsShuiPing"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div class="top-child">
          <el-popover
            placement="bottom"
            width="150"
            trigger="click"
            :content="content"
          >
            <el-button slot="reference">备注</el-button>
          </el-popover>

          <div class="daochu">
            <el-button @click="downLoad" :title="DAOCHUtitle" id="daochu"
              >导出</el-button
            >
          </div>
        </div>
      </div>

      <wx-table
        v-loading="loading"
        :show="false"
        :columns="columns"
        :tableData="tableData"
      ></wx-table>
    </div>
  </div>
</template>

<script>
import {
  getCeXieInfo,
  getCeXieInfoTable,
  getCehngjiangInfo,
  getChengjingTable,
  getShuiPingInfo,
  getShuipingTable,

  getShuiWEiInfo,
  getgetShuiWEiTable
} from "../api/jkjcapi";
export default {
  data() {
    return {
      loading:false,
      content: "暂无", // 备注
      optionsCeXie: [],
      optionsCeXie2: [],
      optionsChengJiang: [],
      optionsShuiWei: [],//水位
      optionsShuiPing: [],
      value: [],
      select: {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
      },
      bgvalue1: "0",
      options: [
        { label: "测斜位移", value: "0" },
        { label: "沉降位移", value: "1" },
        { label: "水位监测", value: "2" },
        { label: "水平位移", value: "3" },
      ],
      tableData: [],
      columns: [
        // 表头的数据
        { prop: "pointNumber", label: "编号" },
        { prop: "deep", label: "水位深度(m)" },
        { prop: "high", label: "高程(m)" },
        { prop: "dayValue", label: "日变化量(mm)" },
        { prop: "sumValue", label: "累计变化量(mm)" },
        { prop: "rate", label: "累计变化速率(m/d)" },
      ],
      projectId: this.$store.getters.projectId,
      DAOCHUtitle:
        "水位深度值是水面到管口的距离，采用1985国家高程基准（井口高程为37.896米）",
    };
  },

  created() {
    this.bgvalueChange();
  },
  mounted() {},
  methods: {
    bgvalueChange() {
      this.loading=true
      this.tableData =[]
      if (this.bgvalue1 == 0) {
        //测斜位移
        getCeXieInfo().then((res) => {
          console.log(83, res);
          this.optionsCeXie = res.data[0];
          this.optionsCeXie2 = res.data[1];
          if( !this.select.value1){
             this.select.value1 =res.data[0][0];
          }
           if( !this.select.value2){
             this.select.value2 =res.data[1][0];
          }
          getCeXieInfoTable({ pageSize: -1,sh: this.select.value1,point:this.select.value2}).then((res) => {
            console.log("测斜table", res);
             this.columns = [
                // 表头的数据
                { prop: "jgksd", label: "距管口深度 (m)" },
                { prop: "bcgcz", label: "本粗观测值 (mm)" },
                { prop: "jqcwyl", label: "较前次位移量 (mm)" },
                { prop: "ljwyl", label: "累计位移量 (mm)" },
              ];
               this.tableData = res.data.records;
                this.loading=false
            if (res.data.records.length > 0) {
               this.content = res.data.records[0].remark?res.data.records[0].remark:'暂无';
            } else {
              this.content = "暂无";
            }
          });
        });
      } else if (this.bgvalue1 == 1) {
        //沉降位移
        getCehngjiangInfo().then((res) => {
          console.log(136, res);
          this.optionsChengJiang = res.data;
          if( !this.select.value3){
             this.select.value3 =res.data[0];
          }
          getChengjingTable({ pageSize: -1, sh: this.select.value3 }).then(
            (res) => {
              console.log("沉降table", res);
              this.columns = [
                // 表头的数据
                { prop: "gcz", label: "观测值 m" },
                { prop: "bhl", label: "变化量 mm" },
                { prop: "lj", label: "累计 mm" },
              ];
              this.tableData = res.data.records;
               this.loading=false
              if (res.data.records.length > 0) {
                this.content = res.data.records[0].remark?res.data.records[0].remark:'暂无';
              } else {
                this.content = "暂无";
              }
            }
          );
        });
      } else if (this.bgvalue1 == 2) {
        //水位监测
         getShuiWEiInfo().then((res) => {
          console.log(253,res);
          this.optionsShuiWei = res.data;

          if( !this.select.value4){
             this.select.value4 =res.data[0];
          }
          getgetShuiWEiTable({ pageSize: -1 ,point:this.select.value4}).then(
            (res) => {
              console.log("水位table", res);
              this.columns = [
                // 表头的数据
                { prop: "date", label: "日期" },
                { prop: "swsd", label: "水位深度 (m)" },
                { prop: "smgc", label: "水面高程 (m)" },
              ];
              this.tableData = res.data.records;
               this.loading=false
              if (res.data.records.length > 0) {
                this.content = res.data.records[0].remark?res.data.records[0].remark:'暂无';
              } else {
                this.content = "暂无";
              }
            }
          );
        });

      } else if (this.bgvalue1 == 3) {
        //水平位移
        getShuiPingInfo().then((res) => {
          console.log('水平',res);
          this.optionsShuiPing = res.data;
           if(!this.select.value5){
             this.select.value5 =res.data[0];
          }
          getShuipingTable({ pageSize: -1 ,sh: this.select.value5}).then(
            (res) => {
              console.log("水平table", res);
              this.columns = [
                // 表头的数据
                { prop: "gcz", label: "观测值 (m)" },
                { prop: "bhl", label: "变化量 (mm)" },
                { prop: "lz", label: "累计 (mm)" },
              ];
              this.tableData = res.data.records;
               this.loading=false
              if (res.data.records.length > 0) {
                this.content = res.data.records[0].remark?res.data.records[0].remark:'暂无';
              } else {
                this.content = "暂无";
              }
            }
          );
        });
      }
    },
    //导出
    downLoad() { //
      if (this.bgvalue1 == 0){
         window.location.href ='https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210409/211116%E6%B5%8B%E6%96%9C%E6%8A%A5%E8%A1%A8.xls?versionId=CAEQJRiBgMCy6vq57BciIDZkZTQ0N2NjMTg0OTRiYWI5NWNiNzE0MDZlNDhmN2I1'
      }else if(this.bgvalue1 == 1){
        //沉降
        window.location.href = 'https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210409/%E7%95%8C%E9%A6%96%E5%B8%82%E5%85%AC%E5%85%B1%E5%BB%BA%E7%AD%91%E6%95%B4%E4%BD%93%E6%8E%A8%E8%BF%9BPPP%E9%A1%B9%E7%9B%AE%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%B1%95%E7%A4%BA%E9%A6%86%E4%B8%80%E6%9C%9F%E5%9F%BA%E5%9D%91%E7%9B%91%E6%B5%8B%E6%A1%A9%E9%A1%B6%E6%B2%89%E9%99%8D%E8%A7%82%E6%B5%8B.xlsx?versionId=CAEQJRiBgMCx1Pu57BciIGIzZjY2MWUyNTczNDQzOWZhMjMyMGYwZTgzYmEyODE3'
      }else if(this.bgvalue1 == 2){
        //水位
         window.location.href = 'https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210409/211116%E6%B0%B4%E4%BD%8D%E8%A7%82%E6%B5%8B%E6%8A%A5%E8%A1%A8%EF%BC%8820%E4%B8%AA%EF%BC%89(1).xls?versionId=CAEQJRiBgICMmfu57BciIGQ4YjA4NjY1YzFjYjRhNWRhOWNjMTY4YTM5MmNhNTMx'
      }else if(this.bgvalue1 == 3){
        //水平
        window.location.href ='https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210409/%E7%95%8C%E9%A6%96%E5%B8%82%E5%85%AC%E5%85%B1%E5%BB%BA%E7%AD%91%E6%95%B4%E4%BD%93%E6%8E%A8%E8%BF%9BPPP%E9%A1%B9%E7%9B%AE%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%B1%95%E7%A4%BA%E9%A6%86%E4%B8%80%E6%9C%9F%E5%9F%BA%E5%9D%91%E7%9B%91%E6%B5%8B%E6%A1%A9%E9%A1%B6%E6%B0%B4%E5%B9%B3%E4%BD%8D%E7%A7%BB%E7%9B%91%E6%B5%8B.xlsx?versionId=CAEQJRiBgIDNgPy57BciIGYyODExOTE3NDg2ODQ5ZjJhYzYzYjZiN2M1NjQ5MGRk'
      }
     
    },
  },
};
</script>

<style lang="less" scoped>
// @import "../../laborManagement/MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  color: #c3e9fc;
  .head-right {
    width: 60%;
    display: flex;
    justify-content: space-between;
  }
  p {
    padding: 0;
    margin: 0;
  }
  .body {
    margin-top: 20px;
    height: 85%;
    overflow: auto;
    position: relative;
    .selectAll {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chart {
      height: 82%;
    }
  }
}
::v-deep .el-radio-button__inner {
  background: #04283a;
  color: #0065be;
  border: 1px solid #0065be;
}
::v-deep .el-button--medium {
  padding: 8px 20px !important;
}
.top-child {
  display: flex;
  .daochu {
    margin-left: 20px;
    ::v-deep .el-button {
      background-color: rgb(48, 127, 255) !important;
      color: rgb(243, 236, 236) !important;
    }
  }
}
.selectBox {
  margin-right: 20px;
  width: 150px;
}
</style>
