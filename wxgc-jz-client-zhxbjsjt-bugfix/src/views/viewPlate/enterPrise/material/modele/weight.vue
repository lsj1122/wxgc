<template>
  <div class="vehicles" style="height: 100%">
    <div class="top">
      <div style="margin-right: 48px">
        今日收料<span class="span1">{{this.total[0]}}</span>t
      </div>
      <div st>本月收料<span class="span2">{{this.total[1]}}</span>t</div>
    </div>
    <div id="echarts2"></div>
  </div>
</template>

<script>
import { weightsumvehicise } from "@/views/viewPlate/enterPrise/api/mater";
import echarts from "echarts";
export default {
  name: "weight",

  data() {
    return {
       date:[],
            proName:[],
            value1:[],
            value2:[],
            value3:[],
            value4:[],
            total:[],
            datalist:{},
    };
  },

  mounted() {
   
    this.contweight();
  },

  methods: {
   
      contweight() {
        let option = {
          flag: 2,
        };
        weightsumvehicise(option).then((res) => {
          if (res.code == "success") {
            this.date = res.data.days
            this.proName = res.data.projectName
            this.value1 = res.data.测试项目
            this.value2 = res.data.测试项目2
            this.value3 = res.data.测试项目B
            this.value4 = res.data.龙湖天境
            this.total = res.data.total
            this.datalist = res.data
            // this.tableData = res.data

            console.log("1111", res.data);
             this.handechart();
          }
          // res.data.text=res.data.otherFilePath.substring(res.data.otherFilePath.lastIndexOf('/') + 1)
        });
   
    },

    handechart() {
      var myChart = echarts.init(document.getElementById("echarts2"));

         let datas =[]
      
            console.log("11111",this.datalist['测试项目2']);
      this.proName.forEach((i) => {
        let item = {
            name: "",
            type: "bar",
            barWidth: 25,
            stack: "total",
            data: this.value1,
            barCategoryGap: 0,
            itemStyle: {
            
        barBorderRadius: [0,20,20,0]

      }
          }
        item.name = i;
        console.log("000",i);
        item.data = this.datalist[i];
        console.log("111",this.datalist[i]);
        datas.push(item);
      });
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
          bottom: "10%",
          top: "10%",
        },
        legend: {
          icon: "rect",
          orient: "horizontal",
          left: "right",
          itemWidth: 12,
          itemHeight: 12,
          formatter: ["{a|{name}}"].join("\n"),
          textStyle: {
            fontSize: 12,
            color: "#6A93B9",
            height: 8,
            rich: {
              a: {
                verticalAlign: "bottom",
              },
            },
          },
          data: this.proName,
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
            color: "#6A93B9",
          },
          axisTick: {
            show: false,
          },
          data:this.date,
        },
        yAxis: {
          name:"单位：t",
          type: "value",
          // min: 0,
          // minInterval: 1,
          nameTextStyle: {
            fontSize: 12,
            color: "#BAE7FF",
            align: "center",
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.7)", //线
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
            color: "#6A93B9",
            fontFamily: "Bebas",
          },
        },
        series: datas,
      };

      myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;

  margin-bottom: 17px;
  font-size: 14px;
  .span1 {
    font-size: 24px;
    color: #39ffb8;
    font-family: Acens;
    margin-left: 12px;
    margin-right: 4px;
  }
  .span2 {
    font-size: 24px;
    color: #ffc539;
    font-family: Acens;
    margin-left: 12px;
    margin-right: 4px;
  }
}
#echarts2 {
  height: 90%;
}
</style>
