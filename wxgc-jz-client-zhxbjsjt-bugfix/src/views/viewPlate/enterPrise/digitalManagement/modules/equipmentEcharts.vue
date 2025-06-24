<template>
  <div style="height:100%">
    <div id="eqCharts5"></div>
     <el-dialog title="物联网设备统计" :visible.sync="DialogVisible" center>
      <div class="infotable">
      <el-select
        v-model="selectList.proName"
        clearable
        placeholder="请选择项目名称"
      >
        <el-option
          v-for="item in selectList"
          :key="item.value"
          :label="item.value"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- <el-select
        class="selectType"
        v-model="listQuery.flag"
        placeholder="请选择类型"
      >
        <el-option
          v-for="item in optionsType"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select> -->
      <el-date-picker
        v-model="listQuery.date"
        type="date"
        placeholder="选择日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      >
        >
      </el-date-picker>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        @click="getQualitysafeManagerStatus"
      >
        搜索
      </el-button>
        <el-button
        v-waves
        class="filter-item"
        type="primary"
        @click="rest"
      >
        重置
      </el-button>
      </div>
      <el-table :data="tableData" width="100%">
        <el-table-column prop="proName" label="项目名称"> </el-table-column>
        <el-table-column prop="problemType" label="设备名称"> </el-table-column>

        <el-table-column prop="reviewPerson" label="设备类型"> </el-table-column>
        <el-table-column prop="checkTime" label="设备编号"> </el-table-column>
        <!-- <el-table-column prop="auditResult" label="问题状态"> </el-table-column>
        <el-table-column prop="problemArea" label="问题部位"> </el-table-column> -->
        <el-table-column prop="rectificationPerson" label="设备状态">
        </el-table-column>
        <!-- <el-table-column prop="rectificationRequirement" label="时限">
        </el-table-column>
         <el-table-column prop="rectificationRequirement" label="审核结果">
        </el-table-column> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click.native.prevent="check(scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <!--分页组件-->
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
      </span>
    </el-dialog>
  </div>
  
</template>

<script>
import echarts from "echarts";
import { machineryEquipmentStatistics } from "@/views/viewPlate/enterPrise/api/safetyManagement";
export default {
  components: {},
  data() {
    return {
         listQuery: {
        //搜索条件

        pageIndex: 1,
        pageSize: 7,
        proName: "",
        date: "",
        flag: 1, // flag 1 全部 2 2是已整改 3未整改
      },
        selectList:{
        proName:'',
        flag:''
      },
      accordingProject: {
        labelData: [],
        manData: [],
        womanData: [],
        monitoring:[],
        cannon:[],
        Unloading:[],
      },
      DialogVisible:false,
      type: [
        { value: 0, name: "特种设备" },
        { value: 0, name: "一般设备" },
      ],
    };
  },
  created() {
    this.getMachineryEquipmentStatistics();
  },
  mounted() {
    // this.handelEcharts2();
  },
  methods: {
    rest(){
      this.listQuery.date =""
    },
    getQualitysafeManagerStatus(){},
    getMachineryEquipmentStatistics() {
      machineryEquipmentStatistics().then((res) => {
        if (res.code == "success") {
          console.log("机械设备统计", res.data);
          // 按项目数据
          // 获取x轴数据
          this.accordingProject.labelData = res.data.map((item) => {
            return item.name;
          });
          // 获取塔机数据
          this.accordingProject.manData = res.data.map((item) => {
            return item.num1;
          });
          // 获取视频监控
          this.accordingProject.womanData = res.data.map((item) => {
            return item.num2;
          });
            // 扬尘监测
          this.accordingProject.monitoring = res.data.map((item) => {
            return item.num3;
          });
            // 雾炮喷淋
          this.accordingProject.cannon = res.data.map((item) => {
            return item.num4;
          });
            // 卸料平台
          this.accordingProject.Unloading = res.data.map((item) => {
            return item.num5;
          });
          console.log(this.accordingProject);
          this.handelEcharts();
          // 按类型数据
          for (let index = 0; index < res.data.length; index++) {
            this.type[0].value = this.type[0].value + res.data[index].value;
            this.type[1].value = this.type[1].value + res.data[index].amount;
          }
          console.log("按类型的数据", this.type);
        }
      });
    },
    handelEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("eqCharts5"));

      // 指定图表的配置项和数据
      var labelData = this.accordingProject.labelData;
      // 塔机数据
      var manData = this.accordingProject.manData;
      // 视频监控数据
      var womanData = this.accordingProject.womanData;
      // 扬尘监测
      var monitoring = this.accordingProject.monitoring;
      // 雾炮喷淋
      var cannon = this.accordingProject.cannon;
      // 卸料平台
      var Unloading = this.accordingProject.Unloading;

 let option = {
    legend: {
        name: [],
        //orient 排列方式,默认水平
        orient: 'horizontal',
        //align 排列方式为垂直的话,对齐方式由align决定
        align: '',
        bottom: "5%",

        textStyle: {
            color: '#fff',
            fontSize: 12,
        },
    },
    //  grid: {
    //       left: "10%",
    //       right: "0%",
    //       bottom: "10%",
         
    //     },
    // backgroundColor: '#08254F',
    // tooltip（提示框组件）
    tooltip: {
        //trigger(触发类型)，可选'item','axis','none'
        trigger: 'axis',
        axisPointer: {
            //指示器类型,可选'line','shadow','cross'
            type: 'shadow'
        }
    },
     grid: {
          left: "2%",
          right: "14%",
          bottom: "10%",
          top: "20%",
          containLabel: true,
        },
    xAxis: {
        name: '单位：台',
        type: 'value',
        position: 'bottom',
        axisLabel: {
            show: true,
            color: '#fff',
            fontSize: 12,
        },
        splitLine: {
            show: false
        },
        axisLine: {
            // show:false,
            lineStyle: {
                color: 'rgba(255,255,255,0.7)'
            }
        },
        axisTick: {
            show: false
        },

    },
    yAxis: [{
    
        type: 'category',
        //是否反向坐标轴    
        inverse: true,
        //axisTick 坐标轴刻度相关设置
        axisTick: {
            show: false
        },
        //axixLine 坐标轴轴线相关设置
        axisLine: {
            lineStyle: {
                color: 'rgba(255,255,255,0.7)',
            }
        },
        data: labelData,
        //axisLabel 坐标轴刻度标签的相关设置
        axisLabel: {
            show: true,
            color: '#fff',
            fontSize: 10
        }
    }, ],
    series: [{
            name: '塔机',
            type: 'bar',
            stack: '费用',
            data: manData,
            barWidth: '30%',
            itemStyle: {
                color: '#2CC6CB',
            },

        },
        {
            name: '视频监控',
            //type决定图表类型
            type: 'bar',
            //stack 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
            stack: '费用',
            data: womanData,
            barWidth: '30%',
            itemStyle: {
                color: '#6ED73D',
            },
        },
        {
            name: '扬尘监测',
            //type决定图表类型
            type: 'bar',
            //stack 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
            stack: '费用',
            data:monitoring,
            barWidth: '30%',
            itemStyle: {
                color: '#D5D009',
            },
        },
         {
            name: '雾炮喷淋',
            //type决定图表类型
            type: 'bar',
            //stack 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
            stack: '费用',
            data: cannon,
            barWidth: '30%',
            itemStyle: {
                color: '#FFA70E',
            },
        },
        {
            name: '卸料平台',
            //type决定图表类型
            type: 'bar',
            //stack 数据堆叠，同个类目轴上系列配置相同的stack值可以堆叠放置。
            stack: '费用',
            data: Unloading,
            barWidth: '30%',
            itemStyle: {
                color: '#FB8668',
            },
        },

    ]
};

      myChart.clear();
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  
  },
};
</script>
<style lang="scss" scoped>
#eqCharts5 {
  height: 100%;
  min-height: 300px;
}
@media screen and (max-width: 1024px) {
  #eqCharts5 {
    transform: scaleY(0.9);
  }
}
.infotable{
  display: flex;
  justify-content: end;
}
</style>