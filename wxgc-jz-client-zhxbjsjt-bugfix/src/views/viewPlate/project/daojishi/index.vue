<template>
  <div class="daojishi-top" id="timer"><span>距离竣工：</span>{{ inner }}</div>
</template>

<script>
import { selectPro } from "../../../sysproject/api/ttProject";

export default {
  data() {
    return {
      _ordertimer: null,
      inner: "",
      endDate: "",
    };
  },
  mounted() {
    selectPro().then((res) => {
      if (res.data) {
        this.endDate = res.data.endDate;
        this.endDate=this.endDate.replace(/\-/g, "/");
        this.init();
      }
    });
  },
  methods: {
    init() {
      let value = this.endDate + " 23:59:29"; //当前时间
      this.go(value);
    },
    go(v) {
      var date1 = new Date();
      var data2 = new Date(v);
      console.log(date1, data2);
      if (data2 < date1) return; //设置的时间小于现在时间退出
      this._ordertimer = setInterval(() => {
        this.leftTimer(data2);
      }, 1000);
    },
    leftTimer(enddate) {
      var leftTime = new Date(enddate) - new Date(); //计算剩余的毫秒数
      var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
      var hours = parseInt((leftTime / 1000 / 60 / 60) % 24, 10); //计算剩余的小时
      var minutes = parseInt((leftTime / 1000 / 60) % 60, 10); //计算剩余的分钟
      var seconds = parseInt((leftTime / 1000) % 60, 10); //计算剩余的秒数
      days = this.checkTime(days);
      hours = this.checkTime(hours);
      minutes = this.checkTime(minutes);
      seconds = this.checkTime(seconds);
      if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) {
        this.inner =
          days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
      }
      if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
        clearInterval(this._ordertimer);
        this._ordertimer = null;
      }
    },
    checkTime(i) {
      //将0-9的数字前面加上0，例1变为01
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
  },
};
</script>

<style lang="less" scoped>
.daojishi-top {
  position: absolute;
  left: 200px;
  color: @scolor;
}
</style>
