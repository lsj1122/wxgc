<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">监测数据统计</div>
      <div class="head-right">
        <el-radio-group v-model="radio" size="small" @change="changeRadio">
          <el-radio-button label="0">详细数据</el-radio-button>
          <el-radio-button label="1">图表展示</el-radio-button>
        </el-radio-group>
        <div v-if="radio === '0'">
          <el-select v-model="jcvalue" placeholder="请选择" size="small" style="margin-right:10px;">
            <el-option label="超限梁" :value="0"></el-option>
            <el-option label="高排架" :value="1"></el-option>
            <el-option label="盘扣式高支模" :value="2"></el-option>
          </el-select>
          <el-select v-model="stylevalue" placeholder="请选择" size="small">
            <el-option v-for="item in selectOption" :key="item.value" :label="item.label" :value="item.value"></el-option> 
          </el-select>
        </div>
        <div v-if="radio === '1'">
          <el-select v-model="bgvalue" placeholder="请选择" size="small" disabled>
            <el-option label="0.1m标高高排架" value="0"></el-option>
            <el-option label="8.4m标高高排架" value="1"></el-option>
            <el-option label="16.4m标高高排架" value="2"></el-option>
            <el-option label="27.9m标高高排架" value="3"></el-option>
          </el-select>
          <el-select v-model="sbgvalue" placeholder="请选择" size="small" style="margin:0 10px;" disabled> 
            <el-option label="水平位移报警" value="0"></el-option>
            <el-option label="沉降报警" value="1"></el-option>
            <el-option label="轴力报警" value="2"></el-option>
            <el-option label="倾角报警" value="3"></el-option>
          </el-select>
          <!-- <el-date-picker size="small" style="width:150px;" v-model="timeValue" type="date" placeholder="选择日期"></el-date-picker> -->
        </div>
      </div>
    </div>
    <div class="body">
      <wx-table v-if="radio === '0'" :show="false" :columns="columns" :tableData="tableData"></wx-table>
      <div class="chart" v-if="radio === '1'"></div>
    </div>
  </div>
</template>

<script>
import { getGzmList,getSelectOption } from '../api/gzmapi'
import echarts from 'echarts';
export default {
  data() {
    return {
      radio:'0',
      jcvalue:0,
      stylevalue:'',
      bgvalue:'0.1m标高高排架',
      sbgvalue:'水平位移报警',
      timeValue:'',
      selectOption:[],
      tableData:[],
      columns:[
          {prop:'dataOne',label:'构件名称'},
          {prop:'dataTwo',label:'构件编号',width:200},
          {prop:'dataThree',label:'构件尺寸'},
          {prop:'dataFour',label:'集中线荷载值(KN/m)'},
          {prop:'dataFive',label:'搭设高度(m)'},
      ],
    };
  },
  watch:{
    jcvalue(val){
      this.selectOption = [];
      this.getSelectOptions();
      this.stylevalue = '';
      switch (val){
        case 0: 
          this.columns = [
            {prop:'dataOne',label:'构件名称'},
            {prop:'dataTwo',label:'构件编号',width:200},
            {prop:'dataThree',label:'构件尺寸'},
            {prop:'dataFour',label:'集中线荷载值(KN/m)'},
            {prop:'dataFive',label:'搭设高度(m)'},
          ]; break;
        case 1: 
          this.columns = [
            {prop:'dataOne',label:'楼层'},
            {prop:'dataTwo',label:'轴线位置',width:200},
            {prop:'dataThree',label:'支模高度'},
            {prop:'dataFour',label:'板厚'},
            {prop:'dataFive',label:'梁截面'},
          ]; break;
          case 2: 
            this.columns = [
            {prop:'dataOne',label:'位置'},
            {prop:'dataTwo',label:'轴线位置',width:200},
            {prop:'dataThree',label:'支模高度'},
            {prop:'dataFour',label:'板厚'},
            {prop:'dataFive',label:'超限梁截面'},
          ]; break;
      }
    },
    stylevalue(val){
      this.getDataList()
    }
  },
  created(){
    this.getSelectOptions();
  },
  methods: {
    getSelectOptions(){
      getSelectOption({paramOne:this.jcvalue}).then(res =>{
        if(res.code === "success"){
          this.selectOption = res.data;
          this.stylevalue = this.selectOption[0].value;
        }
      })
    },
    getDataList(){
      getGzmList({paramOne:this.jcvalue,paramTwo:this.stylevalue}).then(res =>{
        if(res.code === "success"){
          this.tableData = res.data;
        }
      })
    },
    loadChart(){
      let option = {
         legend: {
          itemWidth: 30,
          itemHeight: 5,
          itemGap: 30,
          data: [
            { name: "水平倾角", icon: "roundRect" },
            { name: "竖向位移", icon: "roundRect" },
          ],
          textStyle: {
            color: "#fff",
            align: "right",
          },
          x: "center",
          bottom: "0",
        },
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  lineStyle: {
                      color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [{
                              offset: 0,
                              color: 'rgba(0, 255, 233,0)'
                          }, {
                              offset: 0.5,
                              color: 'rgba(255, 255, 255,1)',
                          }, {
                              offset: 1,
                              color: 'rgba(0, 255, 233,0)'
                          }],
                          global: false
                      }
                  },
              },
          },
          grid: {
              top: '5%',
              left: '2%',
              right: '2%',
              bottom: '5%',
          },
          xAxis: [{
              show:false,
              type: 'category',
              axisLine: {
                  show: true
              },
              splitArea: {
                  // show: true,
                  color: '#f00',
                  lineStyle: {
                      color: '#f00'
                  },
              },
              axisLabel: {
                  color: '#fff'
              },
              splitLine: {
                  show: false
              },
              boundaryGap: false,
              data: ['A', 'B', 'C', 'D', 'E', 'F'],

          }],

          yAxis: [{
              type: 'value',
              min: 0,
              // max: 140,
              splitNumber: 4,
              splitLine: {
                  show: true,
                  lineStyle: {
                      color: 'rgba(255,255,255,0.1)'
                  }
              },
              axisLine: {
                  show: false,
              },
              axisLabel: {
                  show: false,
                  margin: 20,
                  textStyle: {
                      color: '#d1e6eb',

                  },
              },
              axisTick: {
                  show: false,
              },
          }],
          series: [{
                  name: '水平倾角',
                  type: 'line',
                  smooth: true, //是否平滑
                  showAllSymbol: true,
                  // symbol: 'image://./static/images/guang-circle.png',
                  symbol: 'circle',
                  symbolSize: 8,
                  lineStyle: {
                      normal: {
                          color: "#00b3f4",
                          shadowColor: 'rgba(0, 0, 0, .3)',
                          shadowBlur: 0,
                          shadowOffsetY: 5,
                          shadowOffsetX: 5,
                      },
                  },
                  label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                          color: '#00b3f4',
                      }
                  },
                  itemStyle: {
                      color: "#00b3f4",
                      borderColor: "#fff",
                      borderWidth: 1,
                      shadowColor: 'rgba(0, 0, 0, .3)',
                      shadowBlur: 0,
                      shadowOffsetY: 2,
                      shadowOffsetX: 2,
                  },
                  tooltip: {
                      show: false
                  },
                  areaStyle: {
                      normal: {
                          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                  offset: 0,
                                  color: 'rgba(0,179,244,0.3)'
                              },
                              {
                                  offset: 1,
                                  color: 'rgba(0,179,244,0)'
                              }
                          ], false),
                          shadowColor: 'rgba(0,179,244, 0.9)',
                          shadowBlur: 20
                      }
                  },
                  data: [502.84, 205.97, 332.79, 281.55, 398.35, 214.02, ]
              },
              {
                  name: '竖向位移',
                  type: 'line',
                  smooth: true, //是否平滑
                  showAllSymbol: true,
                  // symbol: 'image://./static/images/guang-circle.png',
                  symbol: 'circle',
                  symbolSize: 8,
                  lineStyle: {
                      normal: {
                          color: "#00ca95",
                          shadowColor: 'rgba(0, 0, 0, .3)',
                          shadowBlur: 0,
                          shadowOffsetY: 5,
                          shadowOffsetX: 5,
                      },
                  },
                  label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                          color: '#00ca95',
                      }
                  },

                  itemStyle: {
                      color: "#00ca95",
                      borderColor: "#fff",
                      borderWidth: 1,
                      shadowColor: 'rgba(0, 0, 0, .3)',
                      shadowBlur: 0,
                      shadowOffsetY: 2,
                      shadowOffsetX: 2,
                  },
                  tooltip: {
                      show: false
                  },
                  areaStyle: {
                      normal: {
                          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                  offset: 0,
                                  color: 'rgba(0,202,149,0.3)'
                              },
                              {
                                  offset: 1,
                                  color: 'rgba(0,202,149,0)'
                              }
                          ], false),
                          shadowColor: 'rgba(0,202,149, 0.9)',
                          shadowBlur: 20
                      }
                  },
                  data: [281.55, 398.35, 214.02, 179.55, 289.57, 356.14, ],
              },
          ]
      };
      echarts.init(document.querySelector(".chart")).setOption(option);
    },
    changeRadio(val){
      if(val === '1'){
        this.loadChart()
      }
    }
  },
};
</script>

<style lang="less" scoped>
@import "../MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  color: #c3e9fc;
  .head-right{
    width: 60%;
    display: flex;
    justify-content: space-between;
  }
  p{
    padding: 0;
    margin: 0;
  }
  .body{
    height: 80%;
    overflow: auto;
    position: relative;
    .chart{
      height: 100%;
    }
    }
}
</style>