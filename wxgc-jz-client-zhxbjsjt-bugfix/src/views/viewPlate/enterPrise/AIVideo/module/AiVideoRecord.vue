<template>

    <com-line title="慧眼AI抓拍统计" style="height:100%;width:100%">
    <div class="com">
    <div class="query-form">
      <el-row :gutter="24">
        <el-col :span="7">
            <el-select v-model="listQuery.proName" placeholder="请选择项目名称">
              <el-option
                v-for="item in selectoptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
              </el-option>
            </el-select>
        </el-col>
        <el-col :span="7">
          <el-select
            v-model="listQuery.type"
            clearable
            size="small"
            placeholder="请选择违规类型"
          >
            <el-option
              v-for="(item, index1) in eventType"
              :key="index1"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="7">
            <el-date-picker
      v-model="date"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
          <!-- <el-date-picker
            size="small"
            v-model="listQuery.sDate"
            type="date"
            value-format="yyyy-MM-dd"
            @change="loadPageData"
            :picker-options="pickerOptions"
            placeholder="开始日期"
          >
          </el-date-picker> -->
        </el-col>
        <el-col :span="3">
          <el-button @click="search">搜索</el-button>
          <!-- <el-date-picker
            size="small"
            v-model="listQuery.eDate"
            type="date"
            value-format="yyyy-MM-dd"
            @change="loadPageData"
            :picker-options="pickerOptions"
            placeholder="结束日期"
          >
          </el-date-picker> -->
        </el-col>
      </el-row>
    </div>
    <div class="wrap-outer">
      <div class="pic-wrap" v-for="(n, index) in 3" :key="n">
        <div class="pic-container" v-for="item in data[index]" :key="item.id">
          <div class="pic-one" >
            <el-image
              :src="item.picData"
              :preview-src-list="picList"
              :fit="'fill'"
            />
            <div class="bottom-text">
              <div class="bottom-text-left">
                <div style="color: #40bcff; font-size: 16px">
                  {{ item.typeStr }}
                </div>
                <div>项目名称：{{ item.proName }}</div>
                <div>违规类型：{{ item.type == 1 ? '未戴安全帽':item.type == 2 ? '未穿反光衣':item.type == 3 ? '烟尘':item.type == 4 ? '明火':item.type == 5 ? '非法闯入':item.type == 6 ? '人员聚集':'物品移动' }}</div>
                <div>时间：{{ item.createTime }}</div>

              </div>
              <!-- <div class="bottom-text-right">{{ item.createTime }}</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--            <Pagination @sizeChange="sizeChange" @currentChange="currentChange" :total="total" style="text-align: center"></Pagination>-->


    <el-pagination
      class="el-pagination"
      v-show="total > 0"
      background
      layout="prev, pager, next"
      :current-page.sync="listQuery.pageIndex"
      :page-size.sync="listQuery.pageSize"
      @current-change="loadPageData"
      :total="total"
    >
    </el-pagination>
    </div>
    </com-line>

</template>

<script>
import Pagination from "@/components/Pagination";
import ComLine from "../../../components/comlineone";
import moment from 'moment';
import { getPageTtAiAlarmData } from "@/views/digitalConstructionSite/spjk/api/ttaialarmdata";
import {
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import data from '@/views/pdf/content';

export default {
  props: ["projectId"],
  components: {
    Pagination,
    ComLine,
    moment
  },
  data() {
    return {
      date:"",
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 9,
        sDate: null,
        eDate: null,
        type: null,
      },
      picVar: require("../../../../../assets/viewplate/wei1.png"),
      mapSelect: {},
      selOptions: {},
      // labels: [{name:"东出口"},{name:"地下实验室"},{name:"大厅内"},{name:"大厅门外"},{name:"自行车棚"},{name:"花园球机"},{name:"西南口"}],
      labels: [{ name: "项目进出主路" }],
      eventType:[{name:"安全帽",type:"1"},{name:"反光衣",type:"2"},{name:"烟尘",type:"3"},{name:"明火",type:"4"},{name:"非法闯入",type:"5"},{name:"人员聚集",type:"6"},{name:"物品移动",type:"7"}],
      eventsType: [{ name: "未戴安全帽" }, { name: "未穿反光衣" }],
      data: [],
      picList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  created() {

    this.getProjectName()
  },
  mounted(){
 this.loadPageData();
  },
  methods: {
    // 搜索
    search(){
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },
    // 获取项目名称
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          this.selectoptions.unshift({ value: "全部" });
        }
      });
    },
    loadPageData() {
      console.log("时间",this.date);
      if (this.date) {
          this.listQuery.sDate = moment(this.date[0]).format("YYYY-MM-DD HH:mm:ss");
      this.listQuery.eDate = moment(this.date[1]).format("YYYY-MM-DD HH:mm:ss")
      }else{
        this.listQuery.sDate = '';
        this.listQuery.eDate = '';
      }

      getPageTtAiAlarmData(this.listQuery).then((res) => {
        if (res.code == "success") {
          this.total = res.data.total;
          console.log(11111,res);
          this.data = [];
          this.picList = res.data.records.map((item) => {
            return item.picData;
          });
          this.data.push(res.data.records.slice(0, 3));
          this.data.push(res.data.records.slice(3, 6));
          this.data.push(res.data.records.slice(6, 9));
        }
      });
    },
    sizeChange(size) {
      console.log(size);
    },
    // 当前页变化时出发
    currentChange(currentPage) {
      this.page = currentPage;
      this.query();
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .vp-project-content .el-input__inner {
  background: #104078;
}
::v-deep .el-date-editor .el-range-input {
  background-color: rgba(15, 62, 118, 0.8000);
}
::v-deep .el-pagination{
  margin-top: 10px;
}
::v-deep .el-date-editor .el-range-separator{
  color: rgba(255, 255, 255, 0.6);
}
.com{
  height: 81.5vh;
}
.query-form {
  position: absolute;
  top: 7px;
  right: 0px;
  z-index: 99;
  overflow: hidden;
  .mapQuery-btn {
    display: inline-block;
    height: 30px;
    width: 30px;
    font-size: 23px;
    line-height: 30px;
    background: #010220;
    text-align: center;
    border: 1px solid #0d85a9;
    border-radius: 4px;
    cursor: pointer;
  }
}
.pic-wrap {
  width: 100%;
  height: 33%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.pic-container {
  width: 32.5%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.pic-one {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  text-align: left;
}
.wrap-outer {
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 50px;
}
.bottom-text {
  width: 100%;
  height: 60px;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.bottom-text-left {
  float: left;
}
.bottom-text-right {
  float: right;
  line-height: 60px;
}
@media screen and(max-width:1024px) {
  .query-form {
    right: 20px;
  }
}
::v-deep .el-image{
  margin: 0 auto;
}
</style>
