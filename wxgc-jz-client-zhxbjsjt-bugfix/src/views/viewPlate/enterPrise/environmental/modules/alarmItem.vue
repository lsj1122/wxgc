<template>
  <div class="alarmItemBox">
    <div id="alarmEcharts2"></div>
    <el-dialog
      title="报警项目统计"
      :visible.sync="dialogVisible"
      width="65%"
      @close="closeDialog"
      center
      v-loading="loding"
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="listQuery.proName" placeholder="请选择项目名称" clearable>
            <el-option
              v-for="item in selectoptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-date-picker
            v-model="listQuery.createTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="检查时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="proName" label="项目名称"></el-table-column>
        <el-table-column prop="number" label="设备编号"></el-table-column>
        <el-table-column label="报警内容" prop="value">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.status === 0">显示</span>
            <span v-else-if="scope.row.status === 1">隐藏</span>
            <span v-else style="color: red">删除</span>
          </template> -->
          <span style="color: red">pm2.5超标</span>
        </el-table-column>
        <el-table-column prop="date" label="报警时间"></el-table-column>
        <!-- <el-table-column prop="rectificationPerson" label="整改人" width="100">
        </el-table-column> -->
        <!-- <el-table-column
          prop="rectificationTimelimit"
          label="整改时限"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="auditResult" label="审核结果" width="100">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" round @click="viewDetailed(scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination
        class="el-pagination"
        v-show="total > 0"
        background
        layout="prev, pager, next"
        :current-page.sync="listQuery.pageIndex"
        :page-size.sync="listQuery.pageSize"
        @current-change="loadPageData($event)"
        :total="total"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import {selectYcjcProByChild} from "@/views/digitalConstructionSite/ycjc/api/ycjcworkdata";
import {
  safetyStatistics,
  selectYcJcWorkDataByProNameData,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";

var $ = require("jquery");
import echarts from "echarts";

export default {
  components: {},
  data() {
    return {
      nameList: [],
      valueList: [],
      dialogVisible: false,
      //select项目选择器数据
      selectoptions: [],
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 8,
        proName: '',
        // proId: "",
        date: "",
        // createTime: "",
      },
      tableData: [],
      total: 0,
      //select项目选择器现行选中项
      proName: "",
      loding: true,
    };
  },
  created() {
    // selectYcjcProByChild({flag:2}).then(res=>{
    //   if(res.code =='success'){
    //     if(res.data.length!=0) {
    //       for (let i = 0; i <res.data.length ; i++) {
    //         this.nameList.push(res.data[i].name)
    //         this.valueList.push(res.data[i].value)
    //       }
    //     }
    //   }
    //   this.handelEcharts();
    // })
    this.ways(2);
  },
  mounted() {
  },

  methods: {
    ways(index) {
      selectYcjcProByChild({flag: index}).then((res) => {
        if (res.code == "success") {
          this.nameList = [];
          this.valueList = [];
          if (res.data.length != 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.nameList.push(res.data[i].name);
              this.valueList.push(res.data[i].intValue);
            }
          }
        }
        this.handelEcharts();
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("alarmEcharts2"));
      let scoreShow = false//配置滚动条出现条件
      if (this.nameList.length > 5) {//超过八条才显示
        scoreShow = true
      }
      // 指定图表的配置项和数据
      var option = {
        // backgroundColor: "#011c3a",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        //  legend: {
        //       x: "3%",
        //       top: "0%",
        //       itemHeight: 12, //legend图形大小
        //       itemWidth: 12, //legend图形大小
        //       itemGap: 20, //图例每项之间的间隔
        //       textStyle: {
        //         color: "#c1cadf",
        //         fontSize: 12,
        //       },
        //     },
        grid: {
          top: "15%",
          left: "6%",
          right: "5%",
          bottom: "14%",
          // containLabel: true
        },
        xAxis: {
          data: this.nameList,
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)",
            },
          },
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLabel: {
            showMaxLabel: true,
            inside: false,
            interval: "", //横轴信息全部显示
            rotate: 0, //-30度角倾斜显示
            textStyle: {
              color: "rgba(255,255,255,0.7)", // x轴 字体 颜色
              fontWeight: "normal",
              fontSize: "12",
              lineHeight: 22,
            },
          },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          name: "单位:次",
          nameTextStyle: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
          },
          axisTick: {
            show: false, //隐藏刻度
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)",
            },
          },
          axisLabel: {
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#0177d4",
            },
          },
          //   interval: 500,
          //   max: 1000,
        },
        series: [
          {
            type: "bar",
            name: "报警次数",
            barWidth: 14,
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 8, 8],
                //显示数值
                label: {
                  show: true, //开启显示
                  position: "top", //在上方显示
                  textStyle: {
                    //数值样式
                    color: "#D904DB",
                    fontSize: 14,
                  },
                  formatter: function (params) {
                    if (params.value > 0) {
                      return params.value;
                    } else {
                      return "";
                    }
                  },
                },
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "#FF7C01",
                    },
                    {
                      offset: 1,
                      color: "#FEC702",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.valueList,
          },
        ],
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            show: scoreShow,
            height: 10,
            start: 0, //数据窗口范围的起始百分比0-100
            end: 100, //数据窗口范围的结束百分比0-100
            xAxisIndex: [0],
            filterMode: "filter",
            realtime: true,
            bottom: 2,
            textStyle: {
              color: "#e7e7eb",
            },
            //  type: 'inside',// 内置于坐标系中
            // start: 0, //开始位置
            // end: 100, //技术位置
            // xAxisIndex: [0]
          },
          //2.在内部可以横向拖动
          {
            type: "inside", // 内置于坐标系中
            start: 0,
            end: 30,
            xAxisIndex: [0],
          },
          // {
          //     id: 'dataZoomY',
          //     type: 'slider',
          //     yAxisIndex: [0],
          //     filterMode: 'empty'
          // }
        ],
      };
      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    closeDialog() {
      this.dialogVisible = false;
      this.proName = "";
      this.listQuery = {
        //搜索条件
        pageIndex: 1,
        pageSize: 8,
        proName: "",
        // proId: "",
        date: "",
        // createTime: "",
      };
    },
    // 获取项目
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
        }
      });
    },
    // 分页
    loadPageData(index) {
      selectYcJcWorkDataByProNameData(this.listQuery)
        .then((res) => {
          this.loading = true;
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.loading = false;
        });
    },
    // 获取表格数据

    // 点击搜索
    onSubmit() {
      this.listQuery.pageIndex = 1;
      // this.listQuery.proId = this.proName;
      this.loadPageData()
    },
    viewDetailed() {
    },
  },
};
</script>
<style lang="scss" scoped>
.alarmItemBox {
  height: 100%;
  // min-height: 300px;
}

#alarmEcharts2 {
  height: 100%;
}

.dangerBox-top {
  // margin-top:-10px ;
  // margin-left: -25px;
  position: relative;
  top: -10px;
  left: -25px;
  list-style: none;
  display: flex;
  justify-content: left;

  li {
    span:nth-child(1) {
      font-size: 34px;
      font-family: Acens;
      font-weight: 400;
      color: #8ec6ff;
    }

    p {
      width: 200px;
      margin: 5px 0;
      padding: 0;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
  }
}

.el-pagination {
  text-align: center;
}
</style>
