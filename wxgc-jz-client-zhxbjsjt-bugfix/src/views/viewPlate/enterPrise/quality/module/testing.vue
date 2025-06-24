<template>
  <div class="testing" style="height: 100%">
    <div id="Echarts1"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { quailtyprom } from "@/views/viewPlate/enterPrise/api/safetyManagement";
import project from '@/store/modules/project';
export default {
  name: "testing",

  data() {
    return {
      datatab:{},
      datemonth:[],
      dataProject:[],
      value1:[],
      value2:[],
      value3:[],
      value4:[],
      projectName:[],

    };
  },

  mounted() {
    this.testprom();
    this.handechart();
  },

  methods: {
    testprom() {
      let option = {
        flag: 2,
        dataType: 0,
      };
      quailtyprom(option).then((res) => {
        if (res.code == "success") {
          console.log("质量检查", res.data);
          this.datatab = res.data;
          // this.dataProject = res.data.map((item) => {
          //   // 项目的X 轴  项目名字
          //   return item.name;
          // });
          // 月份
          this.datemonth = this.datatab.days
          // 项目名
          this.dataProject = this.datatab.projectName
          // 测试项目
          this.value1 = this.datatab.测试项目
          this.value2 = this.datatab.测试项目2
          this.value3 = this.datatab.测试项目B
          this.value4 = this.datatab.龙湖天境

          console.log("名字", this.datemonth);
          console.log("数据",this.value4);
          // this.OrdinaryProject = res.data.map((item) => {
          //   //  数值  是 value
          //   return item.value;
          // });
          //   this.SeverityProject = res.data.map((item) => {
          //     //  项目名  
          //     return item.amount;
          //   });
          //   this.UrgencyProject = res.data.map((item) => {
          //     //  严重 是 urgency
          //     return item.urgency;
          //   });

          this.handechart();
        }
      });
    },
    handechart() {
      var myChart = echarts.init(document.getElementById("Echarts1"));


       let datas =[]
      
    
      this.dataProject.forEach((i) => {
        let item =   {
            name: "",
            type: "bar",
            barWidth: 25,
            stack: "total",
            data: this.value1,
          }
        item.name = i;
        item.data = this.datatab[i];
        console.log("111",this.datatab[i]);
        datas.push(item);
      });
      console.log("项目4",this.value1);
      let option = {
        color: ["#00FBE7", "#FF8E22", "#333FFF", "#58CFFF"],
        tooltip: {
          confine: true,
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "5%",
          right: "4%",
          bottom: "15%",
          top: "10%",
        },
        legend: {
          icon: "rect",
          orient: "horizontal",
          left: "center",
          bottom:"0",
          itemWidth: 12,
          itemHeight: 12,
          formatter: ["{a|{name}}"].join("\n"),
          textStyle: {
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            height: 8,
            rich: {
              a: {
                verticalAlign: "bottom",
              },
            },
          },
          data: this.dataProject,
        },
        xAxis: {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.45)",
            },
          },
          axisLabel: {
            // interval:0,
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
          },
          axisTick: {
            show: false,
          },
          data:this.datemonth,
        },
        yAxis: {
          name:"单位:次",
          type: "value",
          // min: 0,
          // minInterval: 1,
          nameTextStyle: {
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            align: "center",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)",
            },
          },
         
          axisTick: { show: false },
          splitArea: { show: false },
          splitLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.15)",
              // type: 'dashed', // dotted 虚线
            },
          },
          axisLabel: {
            fontSize: 12,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Bebas",
          },
        },
        series: datas,
      };

      myChart.setOption(option);
      setTimeout(function () {
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>

  #Echarts1 {
    width: 100%;
  height: 100%;


}

</style>
