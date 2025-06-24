<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">监测设备类型及数量</div>
    </div>
    <div id="chart"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      showBox:null,
      echartsData:null,
      numberData:{
        num1:[2, 4, 20, 19],
        num2:[4, 3, 5, 2],
        num3:[8, 4, 6, 4],
      }
    };
  },
    created(){
    if(this.$store.state.user.name =="zgnj123"  ||
       this.$store.state.project.projectName == '中国能建安徽电建二公司多功能展示馆一期项目'){
         this.echartsData = ["围护结构顶竖向位移监测", "围护结构顶水平位移监测", "桩体深层水平位移监测", 
         "周边建筑物沉降监测",'地下水位监测']
         this.showBox = false
       }else{
          this.echartsData =["渗压计", "深层土体水平位移观测", "水平位移观测", "竖向位移观测"]
          this.showBox = true
       }
  },
  mounted() {
    this.loadchart();
  },
  methods: {
    loadchart() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "4%",
          left: "3%",
          right: "0%",
          bottom: "12%",
          containLabel: true,
        },
        yAxis: {
          type: "value",

          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(34, 58, 98,1)",
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(34, 57, 99,0)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: "rgba(255, 255, 255,0.7)",
          },
        },
        xAxis: {
          type: "category",
          data: this.echartsData,
  
          axisLine: {
            lineStyle: {
              color: "rgba(34, 58, 98,0.8)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
              interval:0,//横轴信息全部显示  
            color: "rgba(255, 255, 255,0.7)",
             formatter : function(params){
                   var newParamsName = "";// 最终拼接成的字符串
                            var paramsNameNumber = params.length;// 实际标签的个数
                            var provideNumber = 6;// 每行能显示的字的个数
                            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                            /**
                             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                             */
                            // 条件等同于rowNumber>1
                            if (paramsNameNumber > provideNumber) {
                                /** 循环每一行,p表示行 */
                                for (var p = 0; p < rowNumber; p++) {
                                    var tempStr = "";// 表示每一次截取的字符串
                                    var start = p * provideNumber;// 开始截取的位置
                                    var end = start + provideNumber;// 结束截取的位置
                                    // 此处特殊处理最后一行的索引值
                                    if (p == rowNumber - 1) {
                                        // 最后一次不换行
                                        tempStr = params.substring(start, paramsNameNumber);
                                    } else {
                                        // 每一次拼接字符串并换行
                                        tempStr = params.substring(start, end) + "\n";
                                    }
                                    newParamsName += tempStr;// 最终拼成的字符串
                                }

                            } else {
                                // 将旧标签的值赋给新标签
                                newParamsName = params;
                            }
                            //将最终的字符串返回
                            return newParamsName
                }

          },
        },
       
        series: [
          {
            name: "已上报",
            type: "bar",
            barWidth: 14,
            barGap: "14%",
            data: this.numberData.num1,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#f4bba0", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#dd8cd9", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            name: "未上报",
            type: "bar",
            barWidth: 14,
            barGap: "14%",
            data: this.numberData.num2,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#0064ea", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#00bbf8", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          {
            name: "已发布",
            type: "bar",
            barWidth: 14,
            barGap: "14%",
            data: this.numberData.num3,
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#e4bb63", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#eb9d77", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      };

      if(!this.showBox){
        option.series =[
          {
            name: "数量",
            type: "bar",
            barWidth: 14,
            barGap: "14%",
            data: [1,1,1,1,1],
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "#f4bba0", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#dd8cd9", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          
          
        ]
      }
      let myChart1 = echarts.init(document.getElementById("chart"));
      myChart1.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../laborManagement/MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  p {
    padding: 0;
    margin: 0;
  }
  height: 100%;
}
#chart {
  width: 100%;
  height: 95%;
}
@media screen and (max-width:1024px) {
  #chart{
    transform: scale(0.9);
  }
}
</style>