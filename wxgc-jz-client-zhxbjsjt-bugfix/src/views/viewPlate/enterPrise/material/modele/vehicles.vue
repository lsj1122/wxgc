<template>
  <div class="vehicles" style="height: 100%">
    <div class="top">
      <div style="margin-right: 48px">
        今日收料<span class="span1">{{ this.total[0] }}</span
        >车
      </div>
      <div st>
        本月收料<span class="span2">{{ this.total[1] }}</span
        >车
      </div>
    </div>
    <div id="echarts1"></div>
  </div>
</template>

<script>
import { vehicise } from "@/views/viewPlate/enterPrise/api/mater";
import echarts from "echarts";
export default {
  name: "vehicles",

  data() {
    return {
      date: [],
      proName: [],
      value1: [],
      value2: [],
      value3: [],
      value4: [],
      total: [],
      datalist:[],
    };
  },

  mounted() {
    this.vechilelook();
  },

  methods: {
    vechilelook() {
      let option = {
        flag: 2,
      };
      vehicise(option).then((res) => {
        if (res.code == "success") {
          this.date = res.data.days;
          this.proName = res.data.projectName;
        
          this.total = res.data.total;
          this.datalist = res.data
          console.log("本月收料车次", res.data);
          // this.tableData = res.data
          this.handechart();
        }
        // res.data.text=res.data.otherFilePath.substring(res.data.otherFilePath.lastIndexOf('/') + 1)
      });
    },
    handechart() {
      var myChart = echarts.init(document.getElementById("echarts1"));
      console.log("日期", this.date);
      let xLabel = ["1", "2", "3", "4", "5", "6"];
      let goToSchool = ["40", "60", "22", "85", "50", "40"];
      let goOutSchool = ["20", "50", "12", "65", "30", "60"];

      let datas =[]
      
            console.log("11111",this.datalist['测试项目2']);
      this.proName.forEach((i) => {
        let item =  {
            name: "",
            type: "line",
        
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            showAllSymbol: true,
            symbolSize: 0,
            smooth: true,
            lineStyle: {
              normal: {
                width: 3,
              },
              borderColor: "rgba(0,0,0,.4)",
            },
            itemStyle: {
              borderColor: "#646ace",
              borderWidth: 2,
            },
            tooltip: {
              show: true,
            },
            data: this.value1,
          }
        item.name = i;
        console.log("000",i);
        item.data = this.datalist[i];
        console.log("111",this.datalist[i]);
        datas.push(item);
      });
      let option = {
        // backgroundColor: '#0e1c47',
        color: ["#5CFFDC", "#FFD24A", "#FF4A4A", "#4AA2FF"],
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,0.5)",
          borderColor: "#34CEFFBD",
          borderWidth: 2,
          padding: [5, 10],
          formatter: (params) => {
            // console.log('params',params)
            let str = `${params[0].name}月<br/>`;
            //seriesName color value
            for (let i = 0; i < params.length; i++) {
              str =
                str +
                `<span style='display:inline-block;margin-right:5px;
                border-radius:10px;width:9px;height:9px;background-color:${params[i].color}'></span>
                ${params[i].seriesName}：<i style='float:right;color:#4AEFED ' >${params[i].value}车</i><br/>`;
            }
            return str;
          },
        },
        // legend: {
        //   align: "left",
        //   right: "10%",
        //   top: "10%",
        //   type: "plain",
        //   textStyle: {
        //     color: "#7ec7ff",
        //     fontSize: 16,
        //   },
        //   // icon:'rect',
        //   itemGap: 25,
        //   itemWidth: 18,
        //   icon: "path://M0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z",
        //   data: this.proName,
        // },
        grid: {
          top: "15%",
          left: "10%",
          right: "10%",
          bottom: "15%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "category",
            name: "时间",
            nameGap: 10,
            
            boundaryGap: false,
            nameTextStyle: {
              // ---坐标轴名称样式
              color: "#E2E8EDE8",
              fontSize: 15,
            },
            axisLabel: {
              show: true,
              interval: 0, //横轴信息全部显示
              // rotate:-30,//-30度角倾斜显示
              textStyle: {
                color: "#E2E8EDE8", // 更改坐标轴文字颜色
                fontSize: this.screenScale * 15, // 更改坐标轴文字大小
              },
            },
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#379E98AB",
              },
            },
            axisTick: {
              show: false,
            },
            data: this.date,
          },
        ],
        yAxis: [
          {
            name: "单位：车",
            nameTextStyle: {
              color: "#E2E8EDE8",
              fontSize: 16,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show:true,
            lineStyle: {
              color: "rgba(255,255,255,0.7)", //线
            },
          },
            axisLabel: {
              show: true,
              // formatter: "{value}"+this.lineData.unit[0],
              textStyle: {
                color: "#E2E8EDE8", // 更改坐标轴文字颜色
                fontSize: 15, // 更改坐标轴文字大小
              },
            },
          },
        ],
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
#echarts1 {
  height: 90%;
}
</style>
