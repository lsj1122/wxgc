<template>
  <div class="gzm">
    <div class="gzm-left">
      <div class="gzm-left-top box">
<!--        <el-select v-model="value" @change="createXY" placeholder="请选择" style="width:200px;margin-bottom:10px;">-->
<!--          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
<!--        </el-select>-->
        <div class="img">
          <div class="right-tuli">
            <span><span><i></i>地下水位观测点</span>46</span>
            <span><span><i style="background-color: #005fcd;"></i>竖向位移观测点</span>30</span>
            <span><span><i style="background-color: #fe0101;"></i>水平位移观测点</span>16</span>
            <span><span><i style="background-color: #fea201;"></i>深层土体水平位移观测点(测斜)</span>13</span>
            <span><span><i style="background-color: #0cff01;"></i>临近建筑竖向位移观测</span>4</span>
          </div>
          <img @click="changeImage" :src="img" alt="" srcset="" class="foundpit-img">
          <span
            v-for="(item,index) in pointData"
            class="jikendian"
            :class="{'color0':item.type==='0','color1':item.type==='1','color2':item.type==='2','color3':item.type==='3','color4':item.type==='4'}"
            :style="{left:item.valueX + 'px',top:item.valueY + 'px'}"
            :key="index">
              <a class="device-tips">{{ item.pointNumber }}</a>
          </span>
        </div>
      </div>
      <div class="gzm-left-bottom box">
        <jkjc-left-bottom v-if="value ==0"/>
        <jkjcLeftBottomTwo v-else></jkjcLeftBottomTwo>
      </div>
    </div>
    <div class="gzm-right">
      <div class="gzm-right-top box">
        <jkjc-left-top/>
      </div>
      <div class="gzm-right-top box">
        <jkjc-right-middle/>
      </div>
      <div class="gzm-right-top box">
        <jkjc-right-bottom/>
      </div>
    </div>
    <image-dialog ref="diag" :picType="value" @off="createXY"></image-dialog>
  </div>
</template>

<script>
import { getAllOptions } from '../api/jkjcapi';
import ComBox from '../../../components/combox';
import jkjcLeftTop from './jkjcLeftTop';
import jkjcRightMiddle from './jkjcRightMiddle';
import jkjcRightBottom from './jkjcRightBottom';
import jkjcLeftBottom from './jkjcLeftBottom'; // 监测数据统计
import jkjcLeftBottomTwo from './jkjcLeftBottomTwo'; // 转为 监测数据统计 写的
import imageDialog from './imageDialog';
export default {
  components:{
    ComBox,
    jkjcLeftTop,
    jkjcRightMiddle,
    jkjcRightBottom,
    imageDialog,
    jkjcLeftBottom,
    jkjcLeftBottomTwo
  },
  data() {
    return {
      pointData:[],
      imgList:[
        'https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210607/wechat_20210607171025.png', 
        require("@/assets/shengjikeng.png")
      ],
      options: [{
        value: '0',
        label: '0.1m标高高排架'
      },
      {
        value: '1',
        label: '8.4m标高高排架'
      },
      {
        value: '2',
        label: '16.4m标高高排架'
      },
      {
        value: '3',
        label: '27.9m标高高排架'
      }],
      value: '0'
    }
  },
  computed:{
    img(){
      return this.imgList[this.value - 0]
    }
  },
  
  mounted(){
    this.createXY();
     if(this.$store.state.user.name =="zgnj123"  ||
       this.$store.state.project.projectName == '中国能建安徽电建二公司多功能展示馆一期项目'){
         this.value ='1'
       }else{
          this.value ='0'
       }
    
  },
  methods:{
    //加载测点
    createXY(){
      getAllOptions({picType:this.value}).then(res=>{
        if(res.code === "success"){
          let offsetH = document.querySelector('.foundpit-img');
          res.data.forEach(item=>{
              item.valueX = item.percentX * offsetH.offsetWidth + offsetH.offsetLeft;
              item.valueY = item.percentY * offsetH.offsetHeight + offsetH.offsetTop;
          })
          this.pointData = res.data;
        }
    })
    },
    //点击图片
    changeImage(){
 
      this.$refs.diag.changeImg(this.img);
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../laborManagement/MQBaseStyle.less";
.gzm{
  width: 100%;
  height: 100%;
  display: flex;
  .gzm-left{
    // flex:4;
    width: calc(70% - 14px);
    margin-right: 15px;
    .gzm-left-top{
      height: 65%;
      display: flex;
      flex-direction: column;
      .img{
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 90%;
        .foundpit-img{
          // width: 50%;
          height: 41vh;
          position: relative;
        }
      }
    }
    .gzm-left-bottom{
      margin-top: 15px;
      height: 35%;
    }
  }
  .gzm-right{
    // flex:1.5;
     width: 30%;
    .gzm-right-top{
      height: 33%;
      &:nth-child(2){
        margin: 10px 0;
      }
    }
  }
}
.right-tuli{
  position: absolute;
  bottom: 0;
  right: 2%;
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
          width: 12px;
          display: inline-block;
          margin-right: 5px;
          height: 12px;
          border-radius: 100%;
          background-color: rgb(0, 195, 255);
          border: 2px solid #fff;
      }
  }
}
.jikendian{
  position: absolute;
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px solid #fff;
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
  min-width: 86px;
  padding: 3px 0;
}
.color0{
  background-color:#00c3ff;
}
.color1{
  background-color: #005fcd;
}
.color2{
  background-color: #fe0101;
}
.color3{
    background-color: #fea201;
}
.color4{
    background-color: #0cff01;
}
::v-deep .com-box .cb-content{
  height: 95%;
}
</style>
