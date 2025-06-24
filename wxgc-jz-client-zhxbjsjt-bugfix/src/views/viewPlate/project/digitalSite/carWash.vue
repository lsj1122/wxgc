<template>
  <div class="carWashBox">
    <div class="query-form">
      <el-row :gutter="24">

        <el-col :span="5">

        </el-col>
        <el-col :span="12">
          <el-date-picker
            size="small"
            v-model="listQuery.sDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="loadPageData"
            :picker-options="pickerOptions"
            placeholder="开始日期"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-date-picker
            size="small"
            v-model="listQuery.eDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="loadPageData"
            :picker-options="pickerOptions"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-col>
      </el-row>
    </div>
    <div style="font-size:22px">车辆冲洗信息：</div>
    <div class="wrap-outer" v-loading='loading'>
      <div class="pic-wrap" v-for="(n, index) in 3" :key="n">
        <div class="pic-container" v-for="item in data[index]" :key="item.id">
          <div class="pic-one" >
            <el-image
              :src="item.filePath"
              :preview-src-list="picList"
              :fit="'fill'"
             
            ></el-image>
            <div class="bottom-text">
              <div class="bottom-text-left">
                <div style="color: #40bcff; font-size: 16px">
                  {{ item.typeStr }}
                </div>
                <!-- <div>来源：{{ item.area }}</div> -->
              </div>
              <div class="bottom-text-right">{{ item.createTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</template>

<script>
import Pagination from "@/components/Pagination";
import { getPageTtAiAlarmData, getPageTtAiAlarmDataCarWash} from "@/views/digitalConstructionSite/spjk/api/ttaialarmdata";
export default {
  props: ["projectId"],
  components: {
    Pagination,
  },
  data() {
    return {
      loading:false,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 9,
        sDate:'',
        eDate:'',
      },
      mapSelect: {},
      selOptions: {},
      labels: [{ name: "项目进出主路" }],
      eventType: [{ name: "未戴安全帽" }, { name: "未穿反光衣" }],
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
    this.loadPageData();
  },
  methods: {
    loadPageData() {
      this.loading =true
      getPageTtAiAlarmDataCarWash(this.listQuery).then((res) => {
        console.log('车辆冲洗的信息',res)
        if (res.code == "success") {
          this.total = res.data.total;
          this.data = [];
          this.picList = res.data.records.map((item) => {
            return item.filePath;
          });
          this.data.push(res.data.records.slice(0, 3));
          this.data.push(res.data.records.slice(3, 6));
          this.data.push(res.data.records.slice(6, 9));
           this.loading =false
        }
      }).catch(error=>{
         this.loading =false
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
.carWashBox{
  width: 100%;
  height: 100%;
}
.query-form {
  position: absolute;
  top: 45px;
  right: 50px;
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
  height: 31.5%;
  display: flex;
  flex-direction: row;
  justify-content: left;
}
.pic-container {
  width: 31%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: left;;
   margin-left: 1.5%;
}
.pic-one {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.wrap-outer {
  width: 100%;
  height:calc(100% - 45px);
  // height: 95%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-top: 45px;
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
    right: -30px;
  }
}
</style>
