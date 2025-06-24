<template>
  <combox title="党员活动" class="dangyuanhd">
    <div class="container">
      <div class="content">
<!--        <img style="float: left" :src="activityArr[currentData].imgUrl" alt="" @contextmenu.prevent="updateImg($event)" :width="imgWidth" :height="imgHeight"/>-->
        <img style="float: left" :src="activityArr[currentData].imgUrl" alt="" :width="activityArr[currentData].width" :height="activityArr[currentData].height"/>
        <h2 style="color:#c7e9fd;">{{activityArr[currentData].title}}</h2>
        <p  @contextmenu.prevent="updateText">{{activityArr[currentData].content}}</p>
      </div>
      <div class="activities">
        <div class="item"
             v-for="(item, index) in activityArr"
             :key="index"
             :class="index === currentData ? 'item-selected' : ''"
             @click="handleItemClick(index)">
          <div class="image-box">
            <img class="img-head" :src="item.imgUrl" alt/>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="修改图片尺寸" :visible.sync="DialogVisible2" width="500px" center class="dialog-wrap" :modal-append-to-body='false'>
      <div>
        <el-input type="text" placeholder="图片宽度" v-model="imgWidth"></el-input><br>
        <el-input type="text" placeholder="图片高度" v-model="imgHeight"></el-input><br>
        <el-button type="primary" @click="ok">确定</el-button>
      </div>
    </el-dialog>
  </combox>
</template>

<script>
  import {getAllTtPartyActiveByPro} from "@/views/party/api/ttpartyactive";
  export default {
    name: "partyActivity",
    data () {
      return {
        activityArr: [{imgUrl:'',title:'',content:''}],
        currentData: 0,
        DialogVisible2:false,
        DialogVisible3:false,
        imgWidth:500,
        imgHeight:500,
        isExec:true,
      }
    },
    components:{},
    created(){
      this.getActiveList()
    },
    mounted() {
      var obj=localStorage.getItem("imginfo");
      if (obj===null)
      {
        this.imgWidth=500;
        this.imgHeight=500;
      }else {
        this.imgWidth=JSON.parse(obj).w;
        this.imgHeight=JSON.parse(obj).h;
      }

      this.setSwiper()
    },
    beforeDestroy(){
      clearTimeout(this.timer)
    },
    methods:{
      setSwiper(){
        clearTimeout(this.timer)
        if(this.currentData+1>=this.activityArr.length){
          this.currentData = 0
        }else{
          this.currentData++
        }
        this.timer = setTimeout(this.setSwiper.bind(this),2500)
      },
      updateImg(event)
      {
        this.DialogVisible2=true;
        let  that=this;
        var interval=setInterval(function (){
          if (that.isExec===true)
          {
            console.log("..");
          }else {
            event.target.width = that.imgWidth;
            event.target.height = that.imgHeight;
            localStorage.setItem("imginfo",JSON.stringify({
              w:that.imgWidth,
              h:that.imgHeight
            }))
            clearInterval(interval);
            that.isExec=true
          }
        },1000)
      },
      ok()
      {
        this.isExec=false;
        this.DialogVisible2 = false;
      },
      updateText()
      {
        this.DialogVisible3=true;
      },
      handleItemClick(index)
      {
        clearTimeout(this.timer)
        this.currentData=index;
      },
      getActiveList(){
        getAllTtPartyActiveByPro().then(res => {
          if(res.data.length!=0){
            this.activityArr = res.data
          }
        })
      },
    }
  }
</script>

<style scoped lang="less">
  .container {
    /*width: 100%;*/
    height: 100%;
  }
  .content {
    height: 72%;
    overflow-y: auto;
  }
  .content img{
    max-width: 66%;
    max-height: 84%;
    margin-right: 10px;
    margin-top: 10px;
  }
  .content h2 {
    text-align: center;
    color: #beadff;
    margin: 0;
    font-weight: normal;
  }
  .content p {
    text-indent: 2em;
    font-size: 16px;
    line-height: 30px;
    text-align: justify;
    padding-right: 10px;
  }

  .activities {
    width: 100%;
    height: 28%;
    display: flex;
    padding-bottom: 5px;
    flex-direction: row;
    overflow-x: scroll;
  }
  .item{
    width: 25%;
    flex-shrink:0;
    padding: 10px;
    border-width: 1px;
    border-color: #40bcff;
    border-style: solid;
    margin-right: 5px;
    overflow:hidden;
  }
  .item-selected {
    border-width: 1px;
    border-color: #ffa000;
    border-style: solid;
  }
  .image-box img {
    max-width: 100%;
    max-height: 80%;

  }

/deep/ .activities::-webkit-scrollbar {
   height: 15px !important;
}
</style>
