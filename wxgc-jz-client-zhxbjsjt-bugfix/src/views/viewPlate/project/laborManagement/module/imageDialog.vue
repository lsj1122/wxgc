<template>
  <el-dialog
      title="高支模监测"
      :footer="null"
      :visible.sync="openCard"
      @ok="openCard = false"
      @close="cancelDig"
      width="80%"
      :modal-append-to-body='false'
    >
      <div @scroll="calculateOfffset" class="dcBox" id="parentBox" @mouseup="handleup" @mousemove="handlemove($event)">
        <img :src="srcFile" alt="" srcset="" @click="showTip = false" id="imgWh">
        <div class="tooltip" :style="{left:(pointParam.xaxis - 0 +10) + 'px',top:(pointParam.yaxis - 0 +10) + 'px'}" v-if="showCnt">
          <h4 style="text-align:center;">剖面二</h4>
          <div class="table" v-for="item in tableList" :key="item"> 
            <span>{{item.name}}:</span>
            <div>
              <span>{{item.nowB}}</span>
              <span>本次变化值</span>
            </div>
             <div>
              <span>{{item.allB}}</span>
              <span>累计变化值</span>
            </div>
            <span :style="{color:item.colorType === 0 ? '#d13856' : '#40c150'}">{{item.type}}</span>
          </div>
          <div style="display:flex;justify-content:space-between;">
           <el-button style="background:#0078d7;color:#fff;" size="small" @click.stop="showCnt = false;showTip = false;">取消</el-button>
           <el-button style="background:#ff4d4f;color:#fff;" size="small" @click.stop="delPoint">删除</el-button>
          </div>
        </div>
        <span 
          v-for="(item,index) in pointData"
          class="jikendian"
          :class="{'color0':item.name==='0','color1':item.name==='1','color2':item.name==='2','color3':item.name==='3','color4':item.name==='4'}"
          :style="{left:item.xaxis + 'px',top:item.yaxis + 'px'}"
          @click.self="handClickJid(item)"
          :key="index">
            <a class="device-tips">{{ item.labelName }}</a>
          </span>
        <div class="tooltip" :style="{left:(moveItem.xaxis+10) + 'px',top:(moveItem.yaxis+10) + 'px'}" v-if="showTip">
          <h4>高支模数据</h4>
            <ul>
                <li><span>测量监测点:</span>
                    <el-select size="small" style="margin-left:10px;width:150px;" v-model="params.type" @change="changeValue">
                      <el-option v-for="(item,index) in pointType" :key="index" :value="item.value">{{item.label}}</el-option>
                    </el-select> 
                  </li>
            </ul>
        </div>
        <div class="right-tuli">
          <span v-for="(item,i) in bsList" :key="i"><span><i @mousedown="downItem($event, item)" :style="{background:item.bg}"></i>{{item.title}}</span>{{item.num}}</span>
        </div>
        <i
          id="movitem"
          v-show="ismove"
          :style="{
            top: moveItem.yaxis + 'px',
            left: moveItem.xaxis + 'px',
            background: moveItem.bg
          }"
        ></i>
      </div>
    </el-dialog>
</template>

<script>
import { getAllOptions,deletePoint,getAllType,addPoint } from '../api/gzmapi'
export default {
  props:['picType'],
  data(){
    return {
      openCard:false,
      pointData:[],
      srcFile:'',
      swList:{},
      showCnt:false,//弹框的内容
      pointInfo:{}, //测点信息
      tableList:[
        {
          name:'轴力',
          nowB:'30.0kN',
          allB:'20.0kN',
          type:'三级警告',
          colorType:0
        },
        {
          name:'沉降',
          nowB:'0.0kN',
          allB:'0.0kN',
          type:'正常',
          colorType:1
        },
        {
          name:'倾角',
          nowB:'0.0kN',
          allB:'0.0kN',
          type:'正常',
          colorType:1
        },
        {
          name:'水平位移',
          nowB:'0.0kN',
          allB:'0.0kN',
          type:'正常',
          colorType:1
        }
      ],
      bsList:[
        {
          type:0,
          title:'测量监测点',
          num:0,
          bg:'rgb(103, 175, 8)'
        },
      ],
      moveItem:{
        name:'',
        bg:'',
        num:'',
        xaxis: 0,
        yaxis: 0,
        type:''
      },
      parentOffset: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      imgLength:{
        w:0,
        h:0
      },
      pointParam:{}, //删除测点参数
      //添加测点的参数
      params:{
        pictureType:'',
        type:'',
        labelName:'',
        xaxis:'',
        yaxis:'',
        name:'',
        xproportion:'',
        yproportion:''
      },
      ismove:false,
      mouseUP:true,
      showTip:false,
      padding: -50,
    }
  },
  computed:{
    pointType(){
      return this.swList[this.params.name + '']
    }
  },
  watch:{
    openCard(val){
      if(val){
        this.$nextTick(() =>{
          this.calculateOfffset()
        })
        this.params.pictureType = this.picType;
        this.getImgPoints();
      }
    }
  },
   mounted() {
     this.getImgPoints();
     this.getPoints();
  },
  methods:{
    //获取图片布点
    getImgPoints(){
      getAllOptions({pictureType:this.picType}).then(res=>{
        if(res.code === "success"){
          this.ismove = false; //获取布置点后，应将移动的那个点隐藏
          this.pointData = res.data;
        }
      })
    },
    //获取测点
    getPoints(){
      getAllType().then(res=>{
        if(res.code === "success"){
          this.swList = res.data;
          for(let i = 0; i < this.bsList.length; i++){
            this.bsList[i].num = this.swList[i].length;
          }
        }
      })
    },
    //添加测点
    addPoint(params){
      addPoint(params).then(async res=>{
        if(res.code === "success"){
          this.showTip = false;
          await this.getImgPoints();
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    //获取每个测点的数据信息
    async getPointInfo(val){
      await getAction('/entryJk/wxJkPoint/getDetail',{type:val}).then(res =>{
        if(res.success){
          this.pointInfo = res.result;
          this.showCnt = true;
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    //弹框显示
    changeImg(val){
      this.srcFile = val;
      this.openCard = true;
      this.showCnt = false;
      this.showTip = false;
      this.getImgPoints();
    },
    //选择测点
    changeValue(val){
      this.params.type = val;
      this.pointType.forEach(item =>{
        if(item.value === val){ this.params.labelName = item.label; }
      })
      this.addPoint(this.params)
    },
    calculateOfffset() {
      this.$nextTick(() =>{
        let combox = document.querySelector('.el-dialog')
        let parentbox = document.querySelector('.dcBox')
        //求取元素与屏幕距离，当图片滚动的时候，此时要减去滚动上去的高度
        this.parentOffset.y =  parentbox.offsetTop + combox.offsetTop - parentbox.scrollTop
        this.parentOffset.x = combox.offsetLeft + parentbox.offsetLeft
        //求取容器宽 高
        this.parentOffset.w = parentbox.offsetWidth
        this.parentOffset.h = parentbox.offsetHeight
        //求图片的宽、高
        this.imgLength.w = document.querySelector('#imgWh').offsetWidth
        this.imgLength.h = document.querySelector('#imgWh').offsetHeight
      })
    },
    downItem(e, item) {
      //鼠标点击设备元素（左按下）触发
      //设备信息赋值给移动元素
      this.moveItem.name = 'XXX' + item.title
      this.moveItem.bg = item.bg
      this.moveItem.num = item.num
      this.moveItem.type = item.type
      this.params.name = item.type
      this.ismove = true
      this.mouseUP = false
      this.showTip = false;
    },
    handleup() {
      // 放开鼠标左键后触发
      this.mouseUP = true
      this.showTip = true
      this.getPoints()
    },
    handlemove(e) {
      //鼠标移动中持续触发
      if (!this.mouseUP) {
        //移动元素跟随鼠标指针移动
        let xalias = e.clientX - this.parentOffset.x
        let yalias = e.clientY - this.parentOffset.y
        this.moveItem.xaxis = xalias
        this.moveItem.yaxis = yalias
        this.params.xaxis = this.moveItem.xaxis;
        this.params.yaxis = this.moveItem.yaxis;
        this.params.xproportion = this.params.xaxis / this.imgLength.w;
        this.params.yproportion = this.params.yaxis / this.imgLength.h;
      }
    },
    //点击布置好的点
    handClickJid(item){
      this.pointParam = item;
      this.showTip = false;
      this.showCnt = true;
      // this.getPointInfo(item.type) //后期如果是需要后端对接，将上面this.showCnt删除，开放这个函数
    },
    //删除测点
    delPoint(){
      this.showTip =false;
      deletePoint(this.pointParam.id).then(res=>{
        if(res.code === "success"){
          this.showCnt = false;
          this.getImgPoints();
          this.getPoints();
          this.$message.success(res.message);
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    cancelDig(){
      this.openCard = false;
      this.$emit('off')
    }
  }
}
</script>

<style scoped lang="less">
.dcBox{
  position: relative;
  overflow: scroll;
  height:50vh;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  img{
    width: 1200px;
  }
  .jikendian{
    position: absolute;
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #fff;
    border-radius: 100%;
    &:hover {
        a.device-tips {
          display: block;
        }
      }
  }
  a.device-tips {
    position: absolute;
    top: -28px;
    left: -140%;
    display: none;
    text-align: center;
    font-size: 12px;
    color: #d1f4ff;
    background: rgba(0, 75, 119, 0.57);
    border-radius: 3px;
    min-width: 100px;
    padding: 3px 0;
  }
  .right-tuli{
    position: fixed;
    top: 18%;
    right: 14%;
    flex-direction: column;
    display: flex;
    > span{
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        color: rgba(179, 188, 202,1);
        span{
            margin-right: 5px;
        }
        i{
            width: 15px;
            display: inline-block;
            margin-right: 5px;
            height: 15px;
            border-radius: 100%;
            border: 2px solid #fff;
        }
    }
  }
}
i#movitem {
    width: 18px;
    height: 18px;
    border: 2px solid #fff;
    position: absolute;
    z-index: 9;
    -webkit-animation: none;
    animation: none;
    border-radius: 50%;
  }
  .tooltip{
    position: absolute;
    padding: 15px;
    min-width: 260px;
    z-index: 999;
    background-color: rgba(1, 26, 55,0.95);
    box-shadow:0 0 5px #0be3e6 inset;
    border-radius: 5px;
    .table{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 2px solid #1589c8;
      margin-bottom: 10px;
      span{
        width: 70px;
        text-align: center;
      }
      >div{
        display: flex;
        flex-direction: column;
        margin: 0 10px;
        border-left: 2px solid #3850a8;
        border-right: 2px solid #3850a8;
        padding: 0 15px;
        span:nth-child(1){
          color:#8e724b;
          font-size: 18px;
        }
        span:nth-child(2){
          color:#0e85bd;
        }
        >span{
          text-align: center;
        }
      }
    }
    h4{
        padding: 0;
        margin: 0;
        font-weight: 400;
        margin-bottom: 10px;
        font-size: 18px;
        color: #017cd6;
    }
    ul{
        color: white;
        list-style: none;
        padding: 0;
        margin: 0;
        li{
            padding: 3px 0;
            span{
              text-align: right;
              display: inline-block;
              width: 33%;
              white-space: nowrap;
            }
        }
    }
        }
        .color0{
            background-color:rgb(103, 175, 8);
        }
        .color1{
            background-color: orange;
        }
        .color2{
            background-color: #f10df1;
        }
        .color3{
          background-color: #fea201;
        }
        .color4{
          background-color: #0cff01;
        }
        ::v-deep .ant-modal-body{
          overflow: hidden;
        }
</style>