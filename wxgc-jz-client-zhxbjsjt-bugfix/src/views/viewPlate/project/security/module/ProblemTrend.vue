<template>
    <!-- <div class="problem-trend"  :class="wifiChooseShow?'':'wifi'"> -->
    <div style="height:100%">
        <div class="problem-trend" 
           v-show="wifiChooseShow">
        <div class="problem-trend-head">
            <span>活动进行天数<a style="color:#7bfff9">{{day}}</a>天</span>
            <span>累计教育人数<a style="color:#ffb950">{{res.numTwo}}</a>人</span>
            <span>累计教育人次<a style="color:#d7ff5c">{{res.numThree}}</a>次</span>
            <span>累计考试数量<a style="color:#a25cff">{{res.numFour}}</a></span>
            <span>平均考试通过率<a style="color:#ff5ce3">{{res.numFive}}%</a></span>
        </div>
        <div class="problem-trend-content">
            <div id="chartsBox"></div>
        </div>
    </div>

     <div class="problem-trend" 
     :style="{backgroundImage: 'url(' + coverImgUrl + ') ',  backgroundSize:'100% 95%',backgroundRepeat: 'no-repeat'}"  v-show="!wifiChooseShow">

    </div>

    </div>
</template>

<script>
    import getChartOption from './wifiChartOption'
    import echarts from 'echarts'
    import moment from 'moment'
    import {selectTtWifiByPro} from "@/views/safeManager/api/ttwifi";
    export default {
        props:['wifiChooseShow'],
        data(){
            return{
                coverImgUrl:'',
                showBox:true,
                day:0,
                res:{
                  numOne:moment().format('yyyy-MM-DD'),
                  numTwo:0,
                  numThree:0,
                  numFour:0,
                  numFive:0,
                  numEduOne:0,
                  numEduTwo:0,
                  numEduThree:0,
                  numEduFour:0,
                  numEduFive:0,
                  numRaceOne:0,
                  numRaceTwo:0,
                  numRaceThree:0,
                  numRaceFour:0,
                  numRaceFive:0,
                },
                info:null
            }
        },
        mounted(){
            // alert(12)
          selectTtWifiByPro().then(res=>{
            if(res.data.length!=0){
            this.res = res.data[0];
            this.info=res.data[0]
            this.coverImgUrl =this.info.pictureUrl
              let m1 = moment()
              let m2 = moment(this.res.numOne)
              this.day = m1.diff(m2, 'day');
              this.initchart()
            //  if(this.res.numEduOne && this.res.numEduOne !=0){
            //      this.initchart()
            //      return
            //  }
              
            }
          })

        },
        methods:{
            initchart(){
                let xdata = [1,2,3,4,5].map((item,index)=>{
                    return moment().subtract(index, 'days').format('MM-DD');
                }).reverse()
                let bardata = [this.res.numEduOne, this.res.numEduTwo, this.res.numEduThree, this.res.numEduFour, this.res.numEduFive]
                let linedata = [this.res.numRaceOne, this.res.numRaceTwo, this.res.numRaceThree, this.res.numRaceFour, this.res.numRaceFive]
                let option = getChartOption(xdata,bardata,linedata)
                echarts.init(document.getElementById('chartsBox')).setOption(option);
            }
        }
    }
</script>

<style lang="less" scoped>
  .wifi{
    background: url("../../../../../assets/wifiArea.jpg") ;
    background-size:100% 100%;

  }
.problem-trend{
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    >div.problem-trend-head{
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        
        span{
            width: 50%;
            font-size: 10px;
            color: @scolor;
            height: 20px;
            padding: 2px 0;
            a{
                font-size: 17px;
                color: rgb(0, 186, 243);
                margin: 0 3px;
                font-weight: 600;
            }
        }
    }
    .problem-trend-content{
        flex: 1;
        #chartsBox{
            height: 100%;
        }
    }
}
</style>
