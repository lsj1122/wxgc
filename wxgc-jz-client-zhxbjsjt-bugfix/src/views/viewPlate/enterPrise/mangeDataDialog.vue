<template>
     <el-dialog :title="dialogTitle" :visible.sync="Dialogvisib" width="900px" :before-close="handleClose">
        <div class="chartsBox"></div>
    </el-dialog>
</template>

<script>
import echarts from 'echarts';
    export default {
        props:{
            dialogTitle:String,
            Dialogvisib:Boolean
        },
        data(){
           return{
               charts:{}
           }
        },
        watch:{
            Dialogvisib:function (val){
                if(val){
                    this.$nextTick(()=>{
                        this.loadChart()
                    })
                }
            }
        },
        methods:{
             loadChart(){
                 //echarts折线图

                 let dataList = [{
                     name: '00:00:00',
                     value: '78',
                     num: 1700
                 }, {
                     name: '04:00:00',
                     value: '75',
                     num:1400
                 }, {
                     name: '08:00:00',
                     value: '80',
                     num:1600
                 }, {
                     name: '12:00:00',
                     value: '85',
                     num:1585
                 }, {
                     name: '16:00:00',
                     value: '83',
                     num:1800
                 }, {
                     name: '20:00:00',
                     value: '81',
                     num:1705
                 }, {
                     name: '24:00:00',
                     value: '95',
                     num:1600
                 }]
                 let dataList2 = [{
                     name: '00:00:00',
                     value: '84',
                     num: 1650
                 }, {
                     name: '04:00:00',
                     value: '87',
                     num: 1320
                 }, {
                     name: '08:00:00',
                     value: '90',
                     num:1580
                 }, {
                     name: '12:00:00',
                     value: '94',
                     num:1680
                 }, {
                     name: '16:00:00',
                     value: '83',
                     num:1350
                 }, {
                     name: '20:00:00',
                     value: '91',
                     num:1580
                 }, {
                     name: '24:00:00',
                     value: '86',
                     num:1580
                 }]

                 let option = {
                     tooltip: {
                         trigger: 'axis',
                         formatter(params){
                             return '昨日在场率：'+ params[1].data.value+ '%'+'<br/>' +'昨日在场数：'+params[1].data.num + '<br/>' + '今日在场率：'+ params[0].data.value+'%' + '<br/>' + '今日在场数：'+params[0].data.num
                         }
                     },
                     legend: {
                         data: ['今日在场率', '昨日在场率'],
                         textStyle: {
                             color: "#fff"
                         }
                     },
                     title: {
                         text: '百分比%',
                         left: 0,
                         top: 0,
                         textStyle: {
                             color: '#FFFFFF',
                             fontSize: 14,
                             fontWeight: 50000,
                             fontFamily: 'PingFang SC'
                         }
                     },
                     grid: {
                         left: '2%',
                         right: '2%',
                         bottom: '5%',
                         top: '8%',
                         containLabel: true
                     },
                     dataZoom: [{
                         type: 'inside',
                         start: 0,
                         end: dataList.length > 15 ? 35 : 100
                     }],
                     xAxis: {
                         axisLine: {
                             lineStyle: {
                                 color: '#397cbc'
                             }
                         },
                         splitLine: {
                             show: false,
                         },
                         axisTick: {
                             show: false
                         },
                         //轴线上的字
                         axisLabel: {
                             show: true,
                             textStyle: {
                                 color: '#cecece',
                                 fontSize: '12'
                             }
                         },
                         data: ['00:00:00', '04:00:00', '08:00:00', '12:00:00', '16:00:00', '20:00:00', '24:00:00']
                     },
                     yAxis: [{
                         type: 'value',
                         splitNumber: 4,
                         axisTick: {
                             show: false
                         },
                         //轴线上的字
                         axisLabel: {
                             textStyle: {
                                 fontSize: '12',
                                 color: '#cecece'
                             }
                         },
                         axisLine: {
                             lineStyle: {
                                 color: '#397cbc'
                             }
                         },
                         //网格线
                         splitLine: {
                             lineStyle: {
                                 color: '#11366e'
                             }
                         }
                     }],
                     series: [{
                         name: '今日在场率',
                         type: 'line',
                         smooth: true, //是否平滑曲线显示
                         showSymbol: false,
                         itemStyle: {
                             color: '#3eb5dd',
                             borderColor: '#f1f1f1',
                             borderWidth: 1
                         },
                         lineStyle: {
                             normal: {
                                 width: 4,
                                 color: {
                                     type: 'linear',

                                     colorStops: [{
                                         offset: 0,
                                         color: '#57b3e5' // 0% 处的颜色
                                     },
                                         {
                                             offset: 1,
                                             color: '#31a9ea' // 100% 处的颜色
                                         }
                                     ],
                                     globalCoord: false // 缺省为 false
                                 },
                                 shadowColor: 'rgba(249,165,137, 0.5)',
                                 shadowBlur: 30,
                                 shadowOffsetY: 5
                             }
                         },
                         areaStyle: {
                             //区域填充样式
                             normal: {
                                 color: new echarts.graphic.LinearGradient(
                                     0,
                                     0,
                                     0,
                                     1,
                                     [{
                                         offset: 0,
                                         color: "rgba(58,182,224, 0.6)"
                                     }, {
                                         offset: 0.6,
                                         color: "rgba(58,182,224, 0.2)"
                                     },
                                         {
                                             offset: 0.8,
                                             color: "rgba(58,182,224, 0.01)"
                                         }
                                     ],
                                     false
                                 ),
                                 shadowColor: "rgba(58,182,224, 0.1)",
                                 shadowBlur: 6
                             }
                         },
                         data: dataList
                     }, {
                         name: '昨日在场率',
                         type: 'line',
                         smooth: true, //是否平滑曲线显示
                         showSymbol: false,
                         itemStyle: {
                             color: '#ff6b71',
                             borderColor: '#f1f1f1',
                             borderWidth: 1
                         },
                         lineStyle: {
                             normal: {
                                 width: 4,
                                 color: {
                                     type: 'linear',

                                     colorStops: [{
                                         offset: 0,
                                         color: '#ff874b' // 0% 处的颜色
                                     },
                                         {
                                             offset: 1,
                                             color: '#ff6b71' // 100% 处的颜色
                                         }
                                     ],
                                     globalCoord: false // 缺省为 false
                                 },
                                 shadowColor: 'rgba(255,107,113, 0.5)',
                                 shadowBlur: 12,
                                 shadowOffsetY: 5
                             }
                         },
                         areaStyle: {
                             //区域填充样式
                             normal: {
                                 color: new echarts.graphic.LinearGradient(
                                     0,
                                     0,
                                     0,
                                     1,
                                     [{
                                         offset: 0,
                                         color: "rgba(255,107,113, 0.6)"
                                     },
                                         {
                                             offset: 0.6,
                                             color: "rgba(255,107,113, 0.2)"
                                         },
                                         {
                                             offset: 1,
                                             color: "rgba(255,107,113, 0.01)"
                                         }
                                     ],
                                     false
                                 ),
                                 shadowColor: "rgba(255,107,113, 0.4)",
                                 shadowBlur: 6
                             }
                         },
                         data: dataList2
                     }]
                 };
                let myChart = echarts.init(document.querySelector(".chartsBox"));
                myChart.setOption(option);
            },
            handleClose(){
                this.$emit('update:Dialogvisib',false)
            }
        }
    }
</script>

<style lang="less" scoped>
.chartsBox{
    height: 500px;
}
</style>
