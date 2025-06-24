<template>
  <div class="barometer" ref="barometer">
    <div class="aa">
      <div class="datetime">
      <el-select

        v-model="wfvalue"
        placeholder="请选择年"
        width="120"
        @change="changeYear"
      >
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        v-model="wfvalue2"
        placeholder="请选择月"
        @change="changeMonth"
      >
        <el-option
          v-for="item in options2"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
        </div>
      <el-calendar v-model="value" value-format="yyyy-MM-dd"> </el-calendar>
    
      <div class="weather" v-show="weatherShow">
        <p>{{ dateVale }}</p>
        <p v-if="!noData">{{ wea }}</p>
        <p v-if="!noData">{{temNight}}°C~{{temDay}}°C</p>
        <p v-if="noData">暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
var $ = require("jquery");
import { selectAirLevelLimit30 } from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {
  components: {},
  data() {
    return {
      value: new Date(),

      options: ["2023年","2022年","2021年", "2020年", "2019年", "2018年", "2017年", "2016年"],
      wfvalue: "2022",
      options2: [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月",
      ],
      wfvalue2: "",
      wea:"",
      weatherShow: false,
      dateText: null,
      dateVale: "",
      temNight:'',
      temDay:'',
      noData:false
    };
  },
  created() {
    var date = new Date();
    this.wfvalue = date.getFullYear() + "年";
    this.wfvalue2 = date.getMonth() + 1 + "月";
  },
  mounted() {
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector("table");
      let dateTime = document.querySelector(".el-calendar__title");
      prevBtn.addEventListener("click", () => {
        this.dateText = dateTime.innerHTML;
        var time = dateTime.innerHTML + "";
        var time2 = time.split("年")[1];
        this.wfvalue2 = time2;
        this.c();
        //处理时间
        this.dateVale = this.value.toLocaleDateString();
      });
    });
  },
  methods: {
    changeYear() {
      var value1 = this.wfvalue.split("年")[0];
      var value2 = this.wfvalue2.split("月")[0];
      this.value = value1 + "-" + value2;
      this.weatherShow = false;
    },
    changeMonth() {
      var value1 = this.wfvalue.split("年")[0];
      var value2 = this.wfvalue2.split("月")[0];
      this.value = value1 + "-" + value2;
      this.weatherShow = false;
    },
    c(event) {
      //点击元素的位置
      var lit = $(".barometer .el-calendar-table .is-selected").offset().top;
      var liL = $(".barometer .el-calendar-table .is-selected").offset().left;
      //
      var bt = $(".barometer").offset().top;
      var bL = $(".barometer").offset().left;
      var top = lit - bt;
      var left = liL - bL;
      $(".barometer .weather").css("left", left + 70 + "px");
      $(".barometer .weather").css("top", top + 10 + "px");
      this.weatherShow = true;
      // 点击接口获取数据
      //   this.value.slice(0,10)
      //  let str=this.value
      var str = JSON.stringify(this.value);

      selectAirLevelLimit30({ date: str.slice(1, 11) }).then((res) => {
        if (res.code == "success") {
         if(res.data&&res.data.length!=[]){
            this.noData=false
            this.wea=res.data[0].wea
            this.temDay=res.data[0].temDay
            this.temNight=res.data[0].temNight
         }
         else{
          this.noData=true
         }
        }
      });
    },
  },
};
</script>
<style lang="less">
.barometer .el-calendar-table .el-calendar-day {
  height: 40px !important;
  line-height: 20px !important;
}
.barometer .el-calendar-table td {
  border: 0px;
}
.barometer .el-calendar-table tr td:first-child {
  border: 0px;
}
.barometer .el-calendar-table tr:first-child td {
  border: 0px;
}
.barometer .el-calendar-table td.is-selected {
  background-color: transparent;
  color: #fff;

  span {
    display: inline-block;
    padding: 5px 10px;
    background-color: #005cba;
    border-radius: 5px;
  }
}
.barometer .el-calendar-table .el-calendar-day:hover {
  background-color: transparent;
}
</style>
<style lang="less" scoped>
.barometer {
  height: 33vh;
  min-height: 300px;
  .aa {
    position: relative;
    height: 100%;
    .datetime{
     
      display: flex;
      justify-content: end;
      align-items: center;
      padding-top: 10px;
    }
    .el-calendar {
      height: 90%;
      text-align: center !important;
      background-color: transparent;
      /deep/.el-calendar-day{
         
      }
      /deep/.prev{
         color: #B3D7FF;
          opacity: 0.3
        // color: pink;
      }
      /deep/.next{
         color: #B3D7FF;
          opacity: 0.3
      }
      /deep/.el-calendar__header {
        display: none;
        .el-calendar__title {
          color: #fff !important;
        }
      }
      /deep/.el-calendar__body {
        height: 100%;
        
      }
      .com-box /deep/.cb-content {
        text-align: center;
      }
    }
  }
}

.weather{
    position: absolute;
    right: 0;
    bottom: 0;
    width: 160px;
    height: 85px;
   background: rgba(31, 92, 174, 0.9500);
   border: 1px solid #009CFF;
   border-radius: 4px;
   p{
     font-size: 14px;
     padding: 0;
     margin: 8px 10px;
   }
}
::v-deep .el-calendar-table thead th{
  color:#fff;
}
.el-select:nth-child(1){
    width: 120px;

}
.el-select:nth-child(2){
    width: 100px;
}
</style>
