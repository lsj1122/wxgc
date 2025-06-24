<template>
  <div class="AIVideo">
     <timeButton timeButtonShow='false'></timeButton>
     <div class="aivideo">
    <div class="leftbox">
      <com-line title="AI统计" :title2="'AI statistics'" >
        <div class="icon-document">
          <div class="aistatic" style="height:100%">
           <ai-static :projectId="projectId"></ai-static>
           </div>
        </div>
       
      </com-line>
        <com-line title="抓拍记录统计" :title2="'Capture record statistics'">
          <div class="icon-document">
          <div class="CaptureRecord" style="height:100%">
          <capture-record
        :projectId="projectId"
        :gjlxData="gjlxData"
      ></capture-record>
           </div>
        </div>

      </com-line>
      
    </div>
    <div class="centerbox">
      <com-line title="项目违规统计" :title2="'Project violation statistics'" style="flex: 1; margin-bottom: 30px">
        <div class="icon-document">
          <div id="gaojingfenx"></div>
        </div>
        
      </com-line>
      <com-line title="违规统计" :title2="'Violation statistics'" style="flex: 1; margin: 0">
         <div class="icon-document">
          <div id="weigui"></div>
        </div>  
      </com-line>
    </div>
    <div class="rightbox">
      
      <ai-video-record :projectId="projectId"></ai-video-record>
    </div>
  </div>
  </div>
</template>

<script>
import echarts from "echarts";
import AiStatic from "./module/aiStatic.vue";
import CaptureRecord from "./module/CaptureRecord.vue";
import AiVideoRecord from "./module/AiVideoRecord.vue";
import timeButton from "../aModules/timeButton";
import ComLine from "../../components/comline";
import {
  violationStatistics,
  alarmTypeAnalysis,
  selectCaptureRecord,
} from "@/views/digitalConstructionSite/spjk/api/ttaialarmdata";
import {
 Violation
} from "@/views/viewPlate/enterPrise/api/aivideo";
import {
 violationsStatistics
} from "@/views/viewPlate/enterPrise/api/videoMonitoring";

export default {
  name: "AIVideo",
  components: {
    AiStatic,
    CaptureRecord,
    AiVideoRecord,
    timeButton,
    ComLine
  },
  data() {
    return {
      projectId: localStorage.getItem("projectId"),
      ViolatData: [],
      gjlxData: [],
      gjlxDataNew: [],
      videoMonitoringtData:[]
    };
  },
  created() {
    // this.getWran(); //告警类型分析

    this.getViolat(); //项目违规统计
    // this.selectCaptureRecord(); //抓拍记录统计
  },
  mounted(){
     this.weiguidongji();
     this.getViolat();
     this.getvideoMonitoring();
  },
  methods: {
    // 抓拍记录统计
    selectCaptureRecord() {
      selectCaptureRecord().then((res) => {
        console.log("抓拍记录统计", res);
        this.gjlxData = res.data;
      });
    },
    getWran() {
      // 告警类型分析
      alarmTypeAnalysis().then((res) => {
        if (res.code == "success") {
          console.log("告警类型分析", res);
          this.gjlxDataNew = res.data;
         
        }
      });
    },
    // 违规统计
    getvideoMonitoring() {
      violationsStatistics().then((res) => {
        if (res.code == "success") {
         
          this.videoMonitoringtData = res.data;
           console.log("违规统计12333", this.videoMonitoringtData);
          this.gjlxfenxi();
        }
      });
    },
    // 项目违规统计
    getViolat() {
      Violation().then((res) => {
        if (res.code == "success") {
          console.log("项目违规统计", res);
          this.ViolatData = res.data;
          this.weiguidongji();
        }
      });
    },
    weiguidongji() {
       var myChart = echarts.init(document.getElementById("gaojingfenx"));
      let _this = this;
        var dataProject = this.ViolatData.map((item) => {
            // 项目的X 轴  项目名字
            return item.name;
          });
          var datavalue = this.ViolatData.map((item) => {
            // 项目的数值
            return item.value;
          });
      // var xAxisData = this.ViolatData.xData;
      // for (let i = 0; i < xAxisData.length; i++) {
      //   xAxisData[i] = xAxisData[i].slice(5, 11);
      // }
      // var legendData = [this.ViolatData.yData.name];
      // var title = "单位：次";
      // var serieData = [];

      // serieData.push({
      //   name: _this.ViolatData.yData.name,
      //   type: "line",
      //   symbol: "circle",
      //   symbolSize: 10,
      //   data: _this.ViolatData.yData.data,
      // });


      var fontColor = '#30eee9';
let scoreShow = false//配置滚动条出现条件
if (dataProject.length > 5) {//超过八条才显示
      scoreShow = true
}
let option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'line',
							lineStyle: {
								color: 'rgba(50, 216, 205, 1)'
							},
						}
					},
					  xAxis: [{
          // name: "单位：",
          type: 'category',
          data: dataProject,
          axisLine: {
              lineStyle: {
                  color: '#FFFFFF'
              }
          },
          axisLabel: {
              margin: 10,
              color: '#e2e9ff',
              textStyle: {
                  fontSize: 10
              },
          },
          axisTick: {
              show: false
          }
      }],
				 yAxis: [{
          name: "单位：次",
          axisLabel: {
              formatter: '{value}',
              color: '#e2e9ff',
          },
          axisTick: {
              show: false
          },
          axisLine: {
              show: true,
              lineStyle: {
                  color: '#FFFFFF'
              }
          },
          splitLine: {
              lineStyle: {
                  color: 'rgba(255,255,255,0.12)'
              }
          }
      }],
					series: [{
						name: '违规次数',
						type: 'line',
						smooth: true,
						stack: '总量',
						symbolSize: 5,
						showSymbol: false,
						itemStyle: {
							normal: {
								color: '#38D0FB',
								lineStyle: {
									color: "#38D0FB",
									width: 2
								},
							}
						},
						// areaStyle: {
						// 	normal: {
						// 		color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						// 				offset: 0,
						// 				color: 'rgba(0,150,255,0.8)'
						// 			},
						// 			{
						// 				offset: 1,
						// 				color: 'rgba(56,208,251,0.2)'
						// 			}
						// 		], false),
						// 	}
						// },
						data:datavalue
					}, ],
          dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            show:scoreShow,
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
        setTimeout(function () {
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      }, 100);
         myChart.setOption(option);
      // console.log("=========================================", serieData);

      // let colors = ["#FFFF00", "#D72B37", "#5EBEFC", "#2EF7F3", "#FFFFFF"];
      // let option = {
      //   title: {
      //     text: title,
      //     textAlign: "left",
      //     textStyle: {color: "#fff", fontSize: "16", fontWeight: "normal"},
      //   },
      //   // legend: {
      //   //   show: true,
      //   //   left: "right",
      //   //   data: legendData,
      //   //   y: "5%",
      //   //   itemWidth: 18,
      //   //   itemHeight: 12,
      //   //   textStyle: { color: "#fff", fontSize: 14 },
      //   // },
      //   color: colors,
      //   grid: {
      //     left: "2%",
      //     top: "12%",
      //     bottom: "5%",
      //     right: "5%",
      //     containLabel: true,
      //   },
      //   tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
      //   xAxis: [
      //     {
      //       type: "category",
      //       axisLine: {show: true, lineStyle: {color: "#6173A3"}},
      //       axisLabel: {
      //         interval: 0,
      //         textStyle: {color: "#FFFFFF", fontSize: 12},
      //         formatter: function (value) {
      //           return value.split("-")[1] + '日'
      //         },
      //       },
      //       axisTick: {show: false},
      //       data: xAxisData,
      //     },
      //   ],
      //   yAxis: [
      //     {
      //       axisTick: {show: false},
      //       splitLine: {show: false},
      //       axisLabel: {textStyle: {color: "#FFFFFF", fontSize: 14}},
      //       axisLine: {show: true, lineStyle: {color: "#6173A3"}},
      //     },
      //   ],
      //   series: serieData,
      //   dataZoom: [
      //     {
      //       id: "dataZoomX",
      //       type: "slider",
      //       // show:false,
      //       height: 10,
      //       start: 0, //数据窗口范围的起始百分比0-100
      //       end: 100, //数据窗口范围的结束百分比0-100
      //       xAxisIndex: [0],
      //       filterMode: "filter",
      //       realtime: true,
      //       bottom: 2,
      //       textStyle: {
      //         color: "#e7e7eb",
      //       },
      //       //  type: 'inside',// 内置于坐标系中
      //       // start: 0, //开始位置
      //       // end: 100, //技术位置
      //       // xAxisIndex: [0]
      //     },
      //     //2.在内部可以横向拖动
      //     {
      //       type: "inside", // 内置于坐标系中
      //       start: 0,
      //       end: 30,
      //       xAxisIndex: [0],
      //     },
      //     // {
      //     //     id: 'dataZoomY',
      //     //     type: 'slider',
      //     //     yAxisIndex: [0],
      //     //     filterMode: 'empty'
      //     // }
      //   ],
      // };
      // echarts.init(document.getElementById("weigui")).setOption(option);
      
    },

    gjlxfenxi() {
           console.log("违规统计12443", this.videoMonitoringtData);
      
     

      var dataArr = this.videoMonitoringtData;
      // 总共的
      var amountNumber = 0;
      for (var z = 0; z < this.videoMonitoringtData.length; z++) {
        amountNumber = amountNumber + this.videoMonitoringtData[z].num;
      }
      var newdataName = dataArr.map((item) => {
        return item.type;
      });
      console.log("总共的",amountNumber);
      console.log("mingzi",newdataName);
       var data = [];
let color =['rgba(37, 80, 185, 1)','rgba(6, 255, 199, 1)','rgba(255, 215, 0, 1)','rgba(53, 194, 246, 1)','rgba(126, 177, 64, 1)','rgba(83, 34, 157, 1)','rgba(219, 67, 118, 1)'];

 for (var i = 0; i < dataArr.length; i++) {
        data.push(
          {
            value: ((dataArr[i].num * 100)/amountNumber).toFixed(2),
            name: dataArr[i].type,
            itemStyle: {
              normal: {
                color: color[i],
              },
            },
          },
 )}
console.log("数据111111111",data);
 var myChart = echarts.init(document.getElementById("weigui"));
 var objdata = array2obj(data, 'name');
function array2obj(array, key) {
    var resObj = {};
    for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
    }
    return resObj;
}
let option = {
   
    legend: {
        selectedMode: false,
        orient: 'horizontal',
        itemWidth: 5,
        itemHeight: 3,
        icon: 'circle',
        bottom: '5%',
        textStyle: {
            fontSize: 14,
            color: '#fff',
        },
         
          formatter: function (name) {
            return name + '  ' + objdata[name].value + '%';
        },
      data: data,
    },
    series: [
        {
            name: 'title',
            type: 'pie',
            startAngle: 280,
            radius: ['55%', '58%'],
            center: ['50%', '40%'],
            label: {
                show: false,
                formatter: (params) => {
                    return `
                     ${params.name}: ${params.percent}%
                     ${params.data.value}个
                     `;
                },
                padding: [0, -30],
                textStyle: {
                    lineHeight: 25,
                },
            },
            // labelLine: {
            //     show: true,
            //     // showAbove:true,
            //     length: 30,
            //     length2: 50,

            // },
            // itemStyle: {
            //     shadowBlur: 15,
            //     shadowColor: 'rgba(0, 0, 0, 0.3)',
            //     borderColor: '#0a1a2a',
            //     borderWidth: '3',
            // },
            color: ['red'],
            data: data
        },
        {
            name: '',
            type: 'pie',
            startAngle: 280,
            radius: ['48%', '43%'],
            center: ['50%', '40%'],
            zlevel: 3,
            hoverAnimation: false,
            legendHoverLink: false,
            label: {
                show: false,
            },
            labelLine: {
                show: false,
            },
            itemStyle: {
                normal: {
                    // shadowBlur: 15,
                    // shadowColor: 'rgba(0, 0, 0, 0.5)',
                    // borderColor: '#fff',
                    // borderWidth: '3',
                },
                ellipsis: {
                    borderColor: '#0a1a2a',
                },
            },
            tooltip: {
                show: false,
            },
            data: data
        },
        {
            name: 'title',
            type: 'pie',
            zlevel: 5,
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ['60%', '61%'],
            center: ['50%', '40%'],
            label: {
                show: false,
                // formatter: (params) => {
                //     return `
                //      ${params.name}: ${amountNumber}%
                //      ${params.data.value}个
                //      `;
                // },
                padding: [0, -30],
                textStyle: {
                    lineHeight: 25,
                },
            },
            itemStyle: {
                shadowBlur: 15,
                // shadowColor: 'rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(29, 102, 144, 0.3)',
                color: "rgba(29, 102, 144, 0.3)",
            },
            data: [
                {
                    value: 41,
                    name: '低级',
                },
            ],
        },
        {
            name: 'title',
            type: 'pie',
            zlevel: 5,
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ['40%', '39%'],
            center: ['50%', '40%'],
            label: {
                show: false,
                formatter: (params) => {
                    return `
                     ${params.name}: ${amountNumber}%
                     ${params.data.value}个
                     `;
                },
                padding: [0, -30],
                textStyle: {
                    lineHeight: 25,
                },
            },
            itemStyle: {
                shadowBlur: 15,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
               
                color: 'rgba(29, 102, 144, 0.3)',
            },
            data: [
                {
                    value: 41,
                    name: '低级',
                },
            ],
        },
    ],
    // graphic: [
    //     {
    //         type: 'group',
    //         left: '39%',
    //         top: '44%',
    //         children: [
    //             {
    //                 type: 'text',
    //                 z: 100,
    //                 top: 'middle',
    //                 style: {
    //                     fill: '#fff',
    //                     text: ['行业', '分布'].join('\n'),
    //                     font: '48px Microsoft YaHei',
    //                 },
    //             },
    //         ],
    //     },
    // ],
};
myChart.setOption(option)
      // let _this = this;
      // var xAxisData = this.gjlxDataNew.xData;
      // for (let i = 0; i < xAxisData.length; i++) {
      //   xAxisData[i] = xAxisData[i].slice(5, 11);
      // }
      // var legendData = this.gjlxDataNew.yData.map((item) => {
      //   return item.name;
      // });
      // var title = "单位：次";
      // var serieData = [];

      // for (var v = 0; v < _this.gjlxDataNew.yData.length; v++) {
      //   var serie = {
      //     name: _this.gjlxDataNew.yData[v].name,
      //     type: "line",
      //     symbol: "circle",
      //     symbolSize: 10,
      //     data: _this.gjlxDataNew.yData[v].data,
      //   };
      //   serieData.push(serie);
      // }
      // let colors = ["#FFFF00", "#D72B37", "#5EBEFC", "#2EF7F3", "#FFFFFF"];
      // let option = {
      //   title: {
      //     text: title,
      //     textAlign: "left",
      //     textStyle: {color: "#fff", fontSize: "16", fontWeight: "normal"},
      //   },
      //   color: colors,
      //   grid: {
      //     left: "2%",
      //     top: "12%",
      //     bottom: "5%",
      //     right: "5%",
      //     containLabel: true,
      //   },
      //   tooltip: {trigger: "axis", axisPointer: {type: "shadow"}},
      //   xAxis: [
      //     {
      //       type: "category",
      //       axisLine: {show: true, lineStyle: {color: "#6173A3"}},
      //       axisLabel: {
      //         interval: 0,
      //         textStyle: {color: "#FFFFFF", fontSize: 12},
      //         formatter: function (value) {
      //           return value.split("-")[1] + '日'
      //         },
      //       },
      //       axisTick: {show: false},
      //       data: xAxisData,
      //     },
      //   ],
      //   yAxis: [
      //     {
      //       axisTick: {show: false},
      //       splitLine: {show: false},
      //       axisLabel: {textStyle: {color: "#FFFFFF", fontSize: 14}},
      //       axisLine: {show: true, lineStyle: {color: "#6173A3"}},
      //     },
      //   ],
      //   series: serieData,
      //   dataZoom: [
      //     {
      //       id: "dataZoomX",
      //       type: "slider",
      //       // show:false,
      //       height: 10,
      //       start: 0, //数据窗口范围的起始百分比0-100
      //       end: 100, //数据窗口范围的结束百分比0-100
      //       xAxisIndex: [0],
      //       filterMode: "filter",
      //       realtime: true,
      //       bottom: 2,
      //       textStyle: {
      //         color: "#e7e7eb",
      //       },
      //       //  type: 'inside',// 内置于坐标系中
      //       // start: 0, //开始位置
      //       // end: 100, //技术位置
      //       // xAxisIndex: [0]
      //     },
      //     //2.在内部可以横向拖动
      //     {
      //       type: "inside", // 内置于坐标系中
      //       start: 0,
      //       end: 30,
      //       xAxisIndex: [0],
      //     },
      //     // {
      //     //     id: 'dataZoomY',
      //     //     type: 'slider',
      //     //     yAxisIndex: [0],
      //     //     filterMode: 'empty'
      //     // }
      //   ],
      // };

      // echarts.init(document.getElementById("gaojingfenx")).setOption(option);
      // return;
    },
  },
};
</script>

<style scoped lang="less">
#gaojingfenx{
  height: 100%;
}
#weigui{
  height: 100%;
}
.AIVideo {
  width: 100%;
  height: 100%;
 
  .aivideo{
     width: 100%;
  height: 95%;
  display: flex;
  }
  .leftbox {
    flex: 1;
    display: flex;
    justify-content: space-between;
    margin-right: 15px;
    flex-direction: column;
      .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
  }

  .centerbox {
    flex: 1;
    display: flex;
    margin-right: 15px;
    flex-direction: column;
    justify-content: space-between;
      .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
  }

  .rightbox {
    flex: 3;
    display: flex;
  }

  .chart-box {
    width: 100%;
    height: 100% !important;
  }
}

@media screen and(max-width: 1024px) {
  #gaojingfenx {
    // transform: scaleY(0.9);
  }
}
</style>
