<template>
  <div class="slgk">
    <div class="title">
      <div class="title_text">报警信息</div>
    </div>

    <div class="body">
      <div class="main-top">
        <div v-for="(item,index) in list" :key="index">
          <p class="num" :style="{color:item.color}">{{item.num}}</p>
          <p>{{item.text}}</p>
        </div>
      </div>
      <div class="main-cnt">
        <div class="main-cnt-text" v-for="(item,index) in dataList" :key="index">
          <p class="p1"><span>{{item.name}}</span> <span>{{item.name2}}</span></p>
          <p class="p2">{{item.text}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list:[
        {
          num:16,
          text:'水平位移警报',
          color:'#d60617'
        },
        {
          num:19,
          text:'沉降报警',
          color:'#be680b'
        },
        {
          num:22,
          text:'轴力报警',
          color:'#8100cd'
        },
        {
          num:7,
          text:'倾角报警',
          color:'#1962c7'
        }
      ],
      dataList:[
        {
          name:'轴力告警',
          name2:'告警点：轴力点1',
          text:'报警值 30KN，告警时间 :  \u00A0 2020/2/21 10:00'
        },
        {
          name:'沉降告警',
          name2:'告警点：测点7',
          text:'报警值 1.5mm，告警时间 :  \u00A0 2020/2/21 12:00'
        },
        {
          name:'倾角告警',
          name2:'告警点：测点11',
          text:'报警值 2°，告警时间 :  \u00A0 2020/2/21 14:00'
        },
        {
          name:'沉降告警',
          name2:'告警点：测点9',
          text:'报警值 1.7mm，告警时间 :  \u00A0 2020/2/21 15:00'
        },
        {
          name:'轴力告警    告警点：轴力点3',
          name2:'轴力告警    告警点：轴力点3',
          text:'报警值 25KN，告警时间 :  \u00A0 2020/2/21 10:00'
        },
        {
          name:'轴力告警',
          name2:'告警点：轴力点2',
          text:'报警值 33KN，告警时间 :  \u00A0 2020/2/22 11:00'
        },
        {
          name:'倾角告警',
          name2:'告警点：测点11',
          text:'报警值 3°，告警时间 :  \u00A0 2020/2/22 16:00'
        },
        {
          name:'轴力告警',
          name2:'告警点：轴力点5',
          text:'报警值 28KN，告警时间 :  \u00A0 2020/2/23 8:00'
        },

          {
          name:'轴力告警',
          name2:'告警点：轴力点3',
          text:'报警值 29KN，告警时间 :  \u00A0 2020/2/24 14:00'
        },
          {
          name:'倾角告警',
          name2:'告警点：测点12',
          text:'报警值 3°，告警时间 :  \u00A0 2020/2/24 15:00'
        }
      ]
    };
  },
  methods: {
    
  },
};
</script>

<style lang="less" scoped>
@import "../MQBaseStyle.less";

.slgk {
  height: 100%;
  overflow: hidden;
  p{
    padding: 0;
    margin: 0;
  }
  height: 100%;
  .body{
    height: 100%;
    color:#c3e9fc;
    .main-top{
      display: flex;
      justify-content: space-between;
      .num{
        font-size: 26px;
        text-align: center;
      }
    }
    .main-cnt{
      margin-top: 15px;
      height: 60%;
       margin-top: 2px;
      overflow: auto;
      .main-cnt-text{
        margin-top: 10px;
        border-bottom: 1px solid #1b1d35;
        .p1{
           span:nth-child(1){
             margin-right: 15px;
           }
        }
      }
    }
  }
}
</style>