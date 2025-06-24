<template>
  <div style="height: 100%">
    <!-- <div id="pEcharts"></div> -->
    <div id="stCharts3"></div>
    <el-dialog
      :modal-append-to-body="false"
      class="el-dialog-xiangxi"
      :visible.sync="visible"
      title="安全问题统计详情"
      center
      @close="closeDialog"
      width="55%"
    >
      <!-- <el-form
        :inline="true"
        label-width="120px"
        class="demo-form-inline"
        label-position="right"
      >
        <el-form-item label="检查时间:">
          <span class="text_span">{{ this.formInline.checkTime }}</span>
        </el-form-item>
          <el-form-item label="检查人:">
          <span class="text_span">{{ this.formInline.checkPerson }}</span>
        </el-form-item>
        <el-form-item label="问题部位:">
          <span class="text_span">{{ this.formInline.problemArea }}</span>
        </el-form-item>
        <el-form-item label="问题类型:">
          <span class="text_span">{{ this.formInline.problemType }}</span>
        </el-form-item>
      </el-form> -->

         <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24"
            ><div class="grid-content bg-purple">
              <!-- <el-form-item label="检查时间" prop="checkTime" >
                <el-date-picker
                  v-model="temp.checkTime"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="检查时间"
                 disabled='true'
                >
                </el-date-picker>
              </el-form-item> -->

              <!-- <el-form-item label="检查人" prop="checkPerson" >
                <el-input v-model="temp.checkPerson" placeholder="检查人" disabled='true'  />
              </el-form-item> -->
              <el-form-item label="问题部位" prop="problemArea">
                <el-input v-model="temp.problemArea"  disabled='true'/>
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input v-model="temp.problemType"  disabled='true'/>
              </el-form-item>
              <!-- <el-form-item label="问题级别" prop="problemLevel">
                <el-input v-model="temp.problemLevel" placeholder="问题级别" disabled='true'/>
              </el-form-item> -->
              <el-form-item label="影响级别" prop="influenceLevel">
                <!-- <el-input
                  v-model="temp.influenceLevel"
                  placeholder="影响级别"
                /> -->
                <el-select
                  v-model="temp.influenceLevel"
                  disabled='true'
                >
                  <el-option
                    v-for="item in influenceLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="隐患级别" prop="hiddenDangerLevel">
                <el-input
                  v-model="temp.hiddenDangerLevel"
                  placeholder="隐患级别"
                />
                <el-select
                  v-model="temp.hiddenDangerLevel"
                  placeholder="请选择隐患级别"
                >
                  <el-option
                    v-for="item in hiddenDangerLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  v-model="temp.problemDescribe"
                 
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe" >
                <el-image
                  v-if="temp.filePath1"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath1]"
                >
                </el-image>
                 <el-input
                v-if="!temp.filePath1"
                 value="暂无图片"
                 disabled
                />
              </el-form-item>

              <!-- <el-form-item label="分包单位" prop="subcontractors">
                <el-input
                  v-model="temp.subcontractors"
                  placeholder="分包单位"
                />
              </el-form-item> -->
              <el-form-item label="整改人" prop="rectificationPerson" >
                <el-input
                  v-model="temp.rectificationPerson"
                  
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  v-model="temp.rectificationMeasures"
                  
                  disabled='true'
                />
              </el-form-item>

               <el-form-item label="整改图片" prop="problemDescribe">
                 <el-image
                  v-if="temp.filePath2"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath2"
                  :preview-src-list="[temp.filePath2]"
                >
                </el-image>
            
                <el-input
                v-if="!temp.filePath2"
                 value="暂无图片"
                 disabled
                />
              </el-form-item>

              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                disabled='true'
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                
                >
                </el-date-picker>
              </el-form-item>
                  <el-form-item label="复查图片" prop="problemDescribe">
                 <el-image
                  v-if="temp.filePath3"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="temp.filePath3"
                  :preview-src-list="[temp.filePath3]"
                >
                </el-image>
            
                <el-input
                v-if="!temp.filePath3"
                 value="暂无图片"
                 disabled
                />
              </el-form-item>

              <!-- <el-form-item label="复查超时" prop="reviewOverTime">
                <el-input
                disabled='true'
                  v-model="temp.reviewOverTime"
                  placeholder="复查超时"
                />
              </el-form-item> -->
               <el-form-item label="复查意见" prop="reviewResult" >
                <el-input v-model="temp.reviewResult" disabled='true' />
              </el-form-item>
              <el-form-item label="审核结果" prop="auditResult" >
                <el-input v-model="temp.auditResult" disabled='true' />
              </el-form-item>
              <!-- <el-form-item label="审核人" prop="auditPerson">
                <el-input v-model="temp.auditPerson" placeholder="审核人" disabled='true' />
              </el-form-item> -->
              <!--            <el-form-item label="现场图片路径" prop="sencePicturePath">-->
              <!--              <el-input v-model="temp.sencePicturePath" placeholder="现场图片路径" />-->
              <!--            </el-form-item>-->
              <!-- <el-form-item label="备注" prop="remark">
                <el-input v-model="temp.remark" placeholder="备注" disabled='true' />
              </el-form-item> -->
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input v-model="temp.reviewPerson" disabled='true' />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input v-model="temp.chaosongPerson"   disabled='true'/>
              </el-form-item></div
          ></el-col>
        </el-row>
      </el-form>

    </el-dialog>
    <!-- 弹框 -->
    <el-dialog
      title="安全问题统计"
      :visible.sync="DialogVisible"
      width="65%"
      @close="closeDialog"
      center
    >
      <el-form :inline="true" :model="searchData" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="proName" placeholder="请选择项目名称" clearable>
            <el-option
              v-for="item in selectoptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="listQuery.date"
            type="month"
            value-format="yyyy-MM"
            placeholder="检查时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.stop="onSubmit">搜索</el-button>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click.stop="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="400"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="projectName" label="项目名称">
        </el-table-column>
        <el-table-column prop="problemType" label="问题类型">
        </el-table-column>
        <el-table-column prop="checkPerson" label="检查人" width="80">
             <template slot-scope="scope">  
                <span>{{scope.row.checkPerson?(scope.row.checkPerson ):"- -"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="checkTime" label="检查时间"  width="180">
          <template slot-scope="scope">  
                <span>{{scope.row.checkTime?(scope.row.checkTime ):"- -"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rectificationPerson" label="整改人" width="80">
        </el-table-column>
        <el-table-column
          prop="rectificationTimelimit"
          label="整改时限"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="auditResult" label="审核结果" width="100">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" round @click="viewDetailed(scope.row)" class="textlook"
              >查看</el-button
            >
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
        @current-change="loadPageData($event)"
        :total="total"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
var $ = require("jquery");
import echarts from "echarts";
import {
  safetyStatistics,
  securityIssueStatisticsDate,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
// import moment from "moment";
import { deepClone } from "@/utils";
export default {
  components: {},
  data() {
    return {
      temp:{
          ssManagerUser:[
          {filePath1:'',filePath2:'',filePath3:'',filePath4:'',filePath5:'',filePath6:'',filePath7:'',filePath8:'',filePath9:'',},
          {filePath1:'',filePath2:'',filePath3:'',filePath4:'',filePath5:'',filePath6:'',filePath7:'',filePath8:'',filePath9:'',}
        ]
      },
        newTempImageUrl0:{},
      newTempImageUrl1:{},
      echartsdataZoom: 50,
      // 详细对话框显示
      visible: false,
      // 详细对话框数据
      formInline: [],
      newdata: {},
      DialogVisible: false,
      tableData: [],
      // 分页
      total: 0,

      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        proId: "",
        date: "",
        checkTime: "",
        dataType:1,
        createTime:""
      },

      //select项目选择器数据
      selectoptions: [],

      //select项目选择器现行选中项
      proName: "",
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive);
  },
  methods: {
    // 获取项目名称
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          this.selectoptions.unshift({value: '全部',})
        }
      });
    },
    // 关闭Dialog 重置数据
    closeDialog() {
      // this.proName = "";
      this.listQuery = {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        proId: "",
        date: "",
        createTime: "",
        dataType:1,
      
      };
    },
    loadPageData() {
      console.log(278, this.listQuery);
      securityIssueStatisticsDate(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    onSubmit() {
      if (this.listQuery.createTime == null) {
        this.listQuery.createTime=''
        console.log('时间为空重新赋值 后台不允许传null');
      }
      this.listQuery.pageIndex = 1;
      if(this.proName =='全部'){
         this.listQuery.proId = "";
      }else{
         this.listQuery.proId = this.proName;
      }
      console.log(this.listQuery);
      this.aqwttj(this.listQuery);
    },
    reset(){
       this.listQuery.date=''
       this.proName=''
      this.loadPageData()
    },
    viewDetailed(row) {
      this.formInline = "";
      this.formInline = row;
      this.temp = row
      console.log("查看内容",this.temp);
      if(this.temp.ssManagerUser.length<=0){
         this.temp.ssManagerUser=[
          {filePath1:'',filePath2:'',filePath3:'',filePath4:'',filePath5:'',filePath6:'',filePath7:'',filePath8:'',filePath9:'',},
          {filePath1:'',filePath2:'',filePath3:'',filePath4:'',filePath5:'',filePath6:'',filePath7:'',filePath8:'',filePath9:'',}
        ]
      }
      if(this.temp.ssManagerUser.length ==1){
        this.temp.ssManagerUser[1] = {filePath1:'',filePath2:'',filePath3:'',filePath4:'',filePath5:'',filePath6:'',filePath7:'',filePath8:'',filePath9:'',}
      }
      
      this.newTempImageUrl0 =deepClone(row).ssManagerUser[0]
      this.newTempImageUrl1 =deepClone(row).ssManagerUser[1]
      this.visible = true;
    },
    aqwttj(listQuery) {
      securityIssueStatisticsDate(this.listQuery).then((res) => {
        if (res.code == "success") {
          console.log("aqwttj", res);
          this.tableData = res.data.records;
          this.total = res.data.total;
          // this.listQuery.pageIndex = res.data.pages;
          console.log(this.tableData.records);
        }
      });
    },


    ways(flag) {
      if (flag == 2 || flag == 1) {
        this.echartsdataZoom = 100;
      } else if (flag == 3) {
        this.echartsdataZoom = 50;
      }
      let option = {
        dataType:1,
        flag:flag
      }
      safetyStatistics(option).then((res) => {

        console.log("安全问题统计",option, res);
        if (res.code == "success") {
          this.newdata = res.data.data;
          this.handelEcharts();
        }
      });
    },
    handelEcharts() {

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("stCharts3"));

      var NO2_data = []; //待整改 数值
      var O3_data = []; //已整改 数值
      var urgency=[]   // 待复查
      var noPass=[]   // 不通过
      var date_list = [
        "10-01",
        "10-02",
        "10-03",
        "10-04",
        "10-05",
        "10-06",
        "10-07",
      ]; //时间
      console.log("this.newdata.await", this.newdata.await == null);
      //
      NO2_data = this.newdata.map((item) => { // 待整改   amount 
        return item.amount;
      });
      O3_data = this.newdata.map((item) => {  //已整改  value
        return item.value;
      });
      urgency = this.newdata.map((item) => {  //待复查  urgency
        return item.urgency;
      });

      noPass = this.newdata.map((item) => {  //不通过  value
        return item.noPass;
      });
      

        date_list = this.newdata.map((item) => {  // x 轴日期
          return item.date;
        });
    


      let _this = this;
      var option = {
        // backgroundColor: "#080b30",
        title: {
          // text: '近一周空气质量变化',
          textStyle: {
            align: "center",
            color: "#fff",
            fontSize: 20,
          },
          top: "5%",
          left: "center",
        },
        legend: {
          itemWidth: 20,
          itemHeight: 5,
          itemGap: 30,
          data: [
            { name: "已整改", icon: "roundRect" },
            { name: "未整改", icon: "roundRect" },
            // { name: "待复查", icon: "roundRect" },
            // { name: "不通过", icon: "roundRect" },
          ],
          textStyle: {
            color: "#fff",
            align: "right",
          },
          x: "center",
          bottom: "10",
        },
        //     tooltip: {
        //     trigger: 'axis',
        //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //         type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        //     }
        // },
        tooltip: {
          trigger: "axis",
        
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 255, 233,0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255, 255, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 233,0)",
                  },
                ],
                global: false,
              },
            },
          },
        },
        grid: {
          top: "15%",
          left: "9%",
          right: "8%",
          bottom: "24%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisTick: {
              show: false, //隐藏刻度
            },
            splitArea: {
              // show: true,
              color: "rgba(255,255,255,0.7)",
              lineStyle: {
                color: "rgba(255,255,255,0.7)",
              },
            },
            axisLabel: {
              color: "rgba(255,255,255,0.7)",
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
            data: date_list,
            // date:getVirtulData()['data'],
          },
        ],

        yAxis: {
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
              color: "rgba(255,255,255,0.7)",
            },
          },
          //   interval: 500,
          //   max: 1000,
        },
        series: [
          {
            name: "已整改",
            type: "line",
            smooth: true, //是否平滑
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 10,
            lineStyle: {
              normal: {
                color: "#1AFFEC",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            label: {
              //显示数字
              show: false,
              position: "top",
              textStyle: {
                color: "#1AFFEC",
              },
            },

            itemStyle: {
              color: "#1AFFEC",
              borderColor: "#fff",
              borderWidth: 3,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(90,255,236,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(90,255,236,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#1AFFEC",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            data: O3_data,
          },
          {
            name: "未整改",
            type: "line",
            smooth: true, //是否平滑、
            showAllSymbol: true,
            // symbol: 'image://./static/images/guang-circle.png',
            symbol: "circle",
            symbolSize: 10,
            lineStyle: {
              normal: {
                color: "#FF801A",
                shadowColor: "rgba(0, 0, 0, .3)",
                shadowBlur: 0,
                shadowOffsetY: 5,
                shadowOffsetX: 5,
              },
            },
            label: {
              show: false, //显示数字
              position: "top",
              textStyle: {
                color: "#FF801A",
              },
            },
            itemStyle: {
              color: "#FF801A",
              borderColor: "#fff",
              borderWidth: 3,
              shadowColor: "rgba(0, 0, 0, .3)",
              shadowBlur: 0,
              shadowOffsetY: 2,
              shadowOffsetX: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(246,127,0,0.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(246,127,0,0)",
                    },
                  ],
                  false
                ),
                shadowColor: "#FF801A",
                shadowBlur: 10,
                shadowOffsetY: 2,
              },
            },
            data: NO2_data,
          },
     
        ],
        // dataZoom: [
        //   {
        //     id: "dataZoomX",
        //     type: "slider",
        //     // show:false,
        //     height: 10,
        //     start: 0, //数据窗口范围的起始百分比0-100
        //     end:100, //数据窗口范围的结束百分比0-100
        //     xAxisIndex: [0],
        //     filterMode: "filter",
        //     realtime: true,
        //     bottom: 2,
        //     textStyle: {
        //       color: "#e7e7eb",
        //     },

        //     //  type: 'inside',// 内置于坐标系中
        //     // start: 0, //开始位置
        //     // end: 100, //技术位置
        //     // xAxisIndex: [0]
        //   },
        //   //2.在内部可以横向拖动
        //   {
        //     type: "inside", // 内置于坐标系中
        //     start: 0,
        //     end: 30,
        //     xAxisIndex: [0],
        //   },
        //   // {
        //   //     id: 'dataZoomY',
        //   //     type: 'slider',
        //   //     yAxisIndex: [0],
        //   //     filterMode: 'empty'
        //   // }
        // ],
      };
      myChart.setOption(option);
     
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ input::-webkit-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
/deep/ input::-moz-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
/deep/ input::-ms-input-placeholder {
  -webkit-text-fill-color: #7e8ca7;
}
.textlook{
   border: none;
}
#stCharts3 {
  height: 100%;
}
.demo-form-inline{
  display: flex;
  justify-content: end;
}
.el-pagination {
  text-align: center;
}
.exclusiveline {
  width: 75%;
}

.el-input__inner {
  width: 120%;
  height: 30px;
  margin-right: 10px;
}

.exclusiveline {
  width: 75%;
}
.text_span {
  display: inline-block;
  // color: #afafb0;
  color: rgba(255, 255, 255, 0.5);
  width: 250px;
  height: 30px;
  line-height: 28px;
  border: 1px solid #0274a8;
  border-radius: 5px;
  padding-left: 15px;
}
.text_span1 {
  display: inline-block;
  color: rgba(255, 255, 255, 0.5);
  // color: #afafb0;
  min-height: 28px;
  width: 630px;
  height: 100%;
  line-height: 28px;
  border: 1px solid #0274a8;
  border-radius: 5px;
  padding-left: 15px;
}

/deep/ .el-form-item__content {
  line-height: 27px;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 150px;
  }
}

/deep/.el-form-item__label {
  color: #9ea1a3 !important;
}


</style>
