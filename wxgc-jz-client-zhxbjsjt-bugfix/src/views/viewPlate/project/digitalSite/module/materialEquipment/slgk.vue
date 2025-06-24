<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">收料概况</div>
    </div>

    <div class="body">
      <div class="main" v-for="(item, index) in dataSource" :key="index">
        <!-- FIXME 页面待穿透 -->
        <div class="main_title" @click="showInfo(item, index)">
          <div>{{ item.title }}</div>
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="main_content">{{ (item.count?item.count:0) +' 车'}}</div>
        <div class="main_footer">
          <div>
            <div class="number">{{ item.ydzl }}</div>
            <div>运单重量</div>
          </div>
          <div>
            <div class="number">{{ item.sjzl }}</div>
            <div>实际重量</div>
          </div>
          <!-- FIEME 待滚动 -->
          <div>
            <div class="number">{{ item.ydsl }}</div>
            <div>运单数量</div>
          </div>
          <div>
            <div class="number">{{ item.sjsl }}</div>
            <div>实际数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹框 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogTableVisible"
      width="80%"
      :modal-append-to-body="false"
    >
      <el-table :data="tableData" height="500px" v-loading="loading">
        <el-table-column type="index" label="序号" width="50">
          <template slot-scope="scope">
            <!--     循环次数+(当前页码-1) * 每页显示数据条数 +1         -->
            {{
              scope.$index + (listQuery.pageIndex - 1) * listQuery.pageSize + 1
            }}
          </template>
        </el-table-column>
        <el-table-column label="材料/规格" width="200" align="center">
          <template slot-scope="scope">
            <span>{{
              "材料: " + scope.row.clmc + " /规格: " + scope.row.ggxh
            }}</span>
          </template>
        </el-table-column>
        <el-table-column property="sjbdbh" label="时间/榜单编号" align="center">
          <template slot-scope="scope">
            <span>{{
              scope.row.createTime + " /编号: " + scope.row.billid
            }}</span>
          </template>
        </el-table-column>
        <el-table-column property="gysxx" label="供应商信息" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.gysmc + " /车牌号: " + scope.row.cph }}</span>
          </template>
        </el-table-column>
        <el-table-column property="sl" label="数量" align="center">
          <template slot-scope="scope">
            <span>{{
              "运单数量:" +
              scope.row.ydsl +
              scope.row.pclx +
              " /实际数量: " +
              scope.row.sjsl +
              scope.row.pclx
            }}</span>
          </template>
        </el-table-column>
        <el-table-column property="zl" label="重量" align="center">
          <template slot-scope="scope">
            <span>{{
              "运单重量:" +
              scope.row.ydzl +
              scope.row.pclx +
              " /实际重量: " +
              scope.row.sjzl +
              scope.row.pclx
            }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      class="el-pagination"
      v-show="total > 0"
      background
      layout="prev, pager, next"
      :current-page.sync="listQuery.pageIndex"
      :page-size.sync="listQuery.pageSize"
      @current-change="loadPageData(this.clickIndex)"
      :total="total"
    >
    </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { getNewWLinfo, getGeneral } from "../../api/wlys.js";
export default {
  data() {
    return {
      dw: ["千克", "吨", "立方米"],
      dataSource: [
        {
          // title: "今日收料",
          // quantity: "6车",
          // ydzl: "20",
          // sjzl: "30",
          // ydsl: ["68", "73.98", "30"],
          // sjsl: ["68", "73.79", "29.5"],
        },
        {
          // title: "本月收料",
          // quantity: "20车",
          // ydzl: "20",
          // sjzl: "30",
          // ydsl: ["180", "173.98", "106"],
          // sjsl: ["179.5", "173.79", "105.78"],
        },
        {
          // title: "累计收料",
          // quantity: "56车",
          // ydzl: "60",
          // sjzl: "61",
          // ydsl: ["230", "345", "569"],
          // sjsl: ["229", "344.9", "568"],
        },
      ],
      title: "暂无标题",
      gridData: [
        // {
        //   clgg: "水泥(吨)/规格:P152.5",
        //   sjbdbh: "2019-04-06 13:42:31/编号:DJ201904030910",
        //   gysxx: "中铁五局一公司制造分公司/车牌号:豫NMN665",
        //   sl: "运单数量:17.5吨/实际数量:16.5吨",
        //   zl: "运单重量:17.5吨/实际重量:16.9吨",
        // },
        // {
        //   clgg: "砼/规格:C35",
        //   sjbdbh: "2019-04-06 13:42:10/编号:DJ201904030758",
        //   gysxx: "中铁五局一公司制造分公司/车牌号:津AB8755",
        //   sl: "运单数量:24.5吨/实际数量:24.4吨",
        //   zl: "运单重量:24.4吨/实际重量:24.1吨",
        // },
        // {
        //   clgg: "钢筋/规格Φ8",
        //   sjbdbh: "2019-04-06 13:42:20/编号:DJ201904030746",
        //   gysxx: "中铁十七局物资有限公司/车牌号:豫H89635",
        //   sl: "运单数量:19吨/实际数量:18.9吨",
        //   zl: "运单重量:20吨/实际重量:19.8吨",
        // },
        // {
        //   clgg: "粗砂/规格:P152.5",
        //   sjbdbh: "2019-04-06 19:41:39/编号:CS201904030941",
        //   gysxx: "中铁五局一公司制造分公司/车牌号:豫A98745",
        //   sl: "运单数量:15吨/实际数量:14.5吨",
        //   zl: "运单重量:15吨/实际重量:14.5吨",
        // },
      ],
      tableData: [],
      dialogTableVisible: false,
      loading: true,
      tableDataObj: {
        today: null,
        month: null,
        total: null,
      },
      total:1,
      listQuery: {
        lx: 0,
        pageIndex: 1,
        pageSize: 10,
        type:'', //0代表当天1代表当月，不传默认全部
      },
      clickIndex:null
    };
  },
  mounted() {
    this.getNewWLinfo(0);
    this.getNewWLinfo(1);
    this.getNewWLinfo();
  },
  methods: {
       //加载分页数据
    loadPageData(type){
      this.loading = true;
       this.tableData=[]
       if(type ==0 || type ==1){
          this.listQuery.type =type
       }else{
         this.listQuery.type =''
       }
      console.log(this.listQuery)
      getNewWLinfo(this.listQuery)
        .then((res) => {
           if (res.code == "success") {
             this.total = res.data.total;
            this.tableData = res.data.records;

           }
           
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });

    },
    getNewWLinfo(type) {
      this.loading = true;

      let obj = {
        lx: 0,
        type: type, //0代表当天1代表当月，不传默认全部
      };

      getGeneral(obj).then((res) => {
        if (type == 0) {
          res[0].title = '今日收料'
          this.$set(this.dataSource, 0, res[0]);
        } else if (type == 1) {
            res[0].title = "本月收料" 
            this.$set(this.dataSource, 1, res[0]);
        } else {
          res[0].title = "累计收料" 
           this.$set(this.dataSource, 2, res[0]);
        }
      });
    },
    showInfo(item, index) {
    
      this.title = item.title;
      this.tableData = [];
      this.listQuery.pageIndex =1
      if (index == 0) {
        this.loadPageData(0)
        this.clickIndex =0
      } else if (index == 1) {
        this.loadPageData(1)
        this.clickIndex =1
      } else {
        this.loadPageData()
        this.clickIndex =null

      }
   
      this.dialogTableVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
@import "./MQBaseStyle.less";

.slgk {
  height: 100%;
}
.body {
  height: 95%;
  display: flex;
  flex-direction: column;
  align-content: space-around;
  .main {
    flex: 1;
    color: #b7b7b7;
    border-bottom: 1px solid rgba(240, 248, 255, 0.3);
    margin-bottom: 20px;
    .main_title {
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      &:hover {
        color: #dc9c0c;
      }
    }
    .main_content {
      height: 70%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 35px;
      color: #00d3e0;
    }
    .main_footer {
      display: flex;
      justify-content: space-around;
      text-align: center;
      .number {
        font-size: 16px;
      }
    }
    &:last-child {
      border: none;
      margin: 0;
    }
  }
}

/deep/ .el-dialog__body {
  height: 600px;
  overflow: auto;
}
@media screen and(max-width:1366px) {
  .slgk {
    overflow: scroll;
  }
  .body .main .main_content {
    height: 50%;
  }
}
</style>