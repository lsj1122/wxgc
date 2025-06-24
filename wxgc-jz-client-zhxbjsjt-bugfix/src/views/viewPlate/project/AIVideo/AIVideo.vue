<template>
<div class="boot" style="height:100%;">
    <timeButton @zongLanChoose="zongLanChoose($event)"></timeButton>
<div class="AIVideo">
    <div class="leftbox">
        <ai-static :projectId="projectId"></ai-static>
        <!-- <capture :projectId="projectId"></capture> -->
        <capture-record :projectId="projectId" :gjlxData="gjlxData" ></capture-record>
    </div>
  <div class="centerbox">
    <combox title="告警类型分析" style="flex:1;margin-bottom:18px">
      <div id="gaojingfenx" class="chart-box"></div>
    </combox>
    <combox title="违规统计" style="flex:1;margin:0">
        <br/>
      <div id="weigui" class="chart-box"></div>
    </combox>
  </div>
    <div class="rightbox">
        <ai-video-record :projectId="projectId"></ai-video-record>
    </div>
</div>
</div>
</template>

<script>
    import echarts from "echarts";
    import timeButton from "../aModules/timeButton";
    import AiStatic from './module/aiStatic.vue';
    import CaptureRecord from './module/CaptureRecord.vue';
    import AiVideoRecord from './module/AiVideoRecord.vue';
    import capture from './module/capture.vue';

    import {select2, select4,violationsStatistics,Capture} from "@/views/digitalConstructionSite/spjk/api/ttaialarmdata";
    export default {
        name: "AIVideo",
        components:{
            AiStatic,
            CaptureRecord,
            AiVideoRecord,
            timeButton,
            capture
        },
        data(){
            return{
                projectId: localStorage.getItem("projectId"),
                ViolatData:[],
                gjlxData:[],
                videoMonitoringtData:[],
                gjlxData:[],
            }
        },
        created() {
            this.getWran()
            this.getViolat()
            this.getvideoMonitoring()
            this.selectCaptureRecord()
        },
        methods:{
              selectCaptureRecord() {
      Capture().then((res) => {
        
        this.gjlxData = res.data;
        console.log("抓拍记录统计", res.data);
        this.handecharts()
      });
    },
            getWran(){
                select2().then(res=>{
                  if(res.code=="success"){
                        this.gjlxData = res.data
                        this.gjlxfenxi();
                    }
                })
            },
            getViolat(){
                select4().then(res=>{
                  if(res.code=="success"){
                        this.ViolatData = res.data
                        this.weiguidongji();
                    }
                })
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
               handecharts(){
        // 初始化
        let _this = this;
        var dataProject = this.gjlxData.map((item) => {
            // 项目的X 轴  项目名字
            return item.name;
          });
          var datavalue = this.gjlxData.map((item) => {
            // 项目的数值
            return item.value;
          });
          console.log("项目名称",this.dataProject);
          console.log("数值",this.datavalue);
        var myChart = echarts.init(document.getElementById("weigui"));
        
let option = {
  // backgroundColor:"#000a3f",
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          },
          backgroundColor: 'rgba(9, 24, 48, 0.5)',
          borderColor: 'rgba(75, 253, 238, 0.4)',
          textStyle: {
              color: '#CFE3FC',
          },
          borderWidth: 1,
      },
      grid: {
          top: '15%',
          right: '5%',
          left: "10%",
          bottom: '12%'
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
        name:"抓拍统计",
          type: 'bar',
          data:datavalue,
          barWidth: '30%',
          itemStyle: {
              normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(0,244,255,1)' // 0% 处的颜色
                  }, {
                      offset: 1,
                      color: 'rgba(0,77,167,1)' // 100% 处的颜色
                  }], false),
                  shadowColor: 'rgba(0,160,221,1)',
                  shadowBlur: 4,
              }
          },
          label: {
              normal: {
                  show: true,
                  lineHeight: 10,
                  formatter: '{c}',
                  position: 'top',
                  textStyle: {
                      color: '#00D6F9',
                      fontSize: 12
                  }

              }
          }
      }]
  };

 myChart.setOption(option);
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
 var myChart = echarts.init(document.getElementById("gaojingfenx"));
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
        itemWidth: 2,
        itemHeight: 1,
        icon: 'circle',
        bottom: '0%',
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

};
myChart.setOption(option)

    },
        }
    }
</script>

<style scoped lang="less">
#gaojingfenx{
height: 400px;
}
    .AIVideo {
        width: 100%;
        height: 95%;
        display: flex;
        .leftbox {
            flex: 1;
            display: flex;
            margin-right: 15px;
            flex-direction: column;
        }
        .centerbox{
        flex: 1;
        display: flex;
        margin-right: 15px;
        flex-direction: column;
        }
        .rightbox {
            flex: 3;
            display: flex;
        }
        .chart-box {
            width: 100%;
            height: 350px !important;
        }
    }
@media screen and(max-width:1024px) {
    #gaojingfenx{
        // transform: scaleY(0.9);
    }
}

</style>
