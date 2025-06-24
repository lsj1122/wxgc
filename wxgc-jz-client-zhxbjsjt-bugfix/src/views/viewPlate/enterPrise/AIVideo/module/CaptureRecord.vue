<template>
  <div class="CaptureRecord" style="height:100%">

    <div id="chaset"></div>
  </div>
   
    
    <!-- <div class="zhuap_l">

      <ul>
        <div>
          <li>
            <span></span>
            <h4>
              越界检测<i>
              {{ gjlxData.outOfBounds ? gjlxData.outOfBounds : "--" }} 次</i
            >
            </h4>
          </li>
          <li>
            <span style="background-position: 0 -172px"></span>
            <h4>
              未穿反光衣<i>
              {{
                gjlxData.reflectiveClothing
                  ? gjlxData.reflectiveClothing
                  : "--"
              }}
            </i>
            </h4>
          </li>
        </div>
        <div>
          <li>
            <span style="background-position: 0 -85px"></span>
            <h4>
              未戴安全帽<i>
              {{ gjlxData.safetyHat ? gjlxData.safetyHat : "--" }}
            </i>
            </h4>
          </li>
          <li>
            <span style="background-position: 0 -269px"></span>
            <h4 v-if="$store.getters.projectId !== '8ad22618e95281412558dbe49ff5968a'">
              人员聚集<i>
              {{
                gjlxData.personnelGathering
                  ? gjlxData.personnelGathering
                  : "--"
              }}
            </i>
            </h4>
            <h4 v-else>
              人货电梯<i>
              {{
                gjlxData.peopleGoodsElevator
                  ? gjlxData.peopleGoodsElevator
                  : "--"
              }}
            </i>
            </h4>
          </li>
        </div>
      </ul>
    </div> -->
  
</template>

<script>

import {
Capture
} from "@/views/viewPlate/enterPrise/api/aivideo";
import echarts from "echarts";
export default {
  props: ["projectId", "gjlxData"],
  data() {
    return {
      noneAqm: 0,
      yjjc: 0,
      wcfgy: 0,
      ryjj: 0,
      
      gjlxData:[]
      
    };
  },
   mounted(){
    this.handecharts();
    this.selectCaptureRecord();
  },
  methods:{
    selectCaptureRecord() {
      Capture().then((res) => {
        
        this.gjlxData = res.data;
        console.log("抓拍记录统计", res.data);
        this.handecharts()
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
        var myChart = echarts.init(document.getElementById("chaset"));
        
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
    }
  },
 
  watch: {
    // gjlxData:function (val){
    //     val.forEach(item =>{
    //         if(item.videoName==='未戴安全帽'){
    //             this.noneAqm = item.num
    //         }
    //         if(item.videoName==='越界检测'){
    //             this.yjjc = item.num
    //         }
    //         if(item.videoName==='未穿反光衣'){
    //             this.wcfgy = item.num
    //         }
    //         if(item.videoName==='人员聚集'){
    //             this.ryjj = item.num
    //         }
    //     })
    // }
  },
};
</script>

<style lang="less" scoped>
#chaset{
  height: 100%;
  width: 100%;
}
// .zhuap_l {
//   height: 100%;
//   width: 100%;
//   ul {
//     margin: 0;
//     height: 100%;
//     list-style: none;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-evenly;
//     padding-left: 0;
//     div {
//       width: 100%;
//       height: 50%;
//       display: flex;
//     }

//     li {
//       width: 50%;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: space-evenly;

//       span {
//         display: block;
//         width: 80px;
//         min-height: 48%;
//         //float: left;
//         background: url("../../../../../assets/viewplate/aqzp_ico.png") no-repeat;
//       }

//       h4 {
//         flex: 0.2;
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         //float: left;
//         font-weight: 400;
//         color: #c3e9fc;

//         i {
//           display: block;
//           color: #eee;
//           font-style: normal;
//         }
//       }
//     }
//   }
// }
</style>
