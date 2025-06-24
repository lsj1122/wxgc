<template>
    <div class="hangpsp">
          <div class="hangpai-r">
            <span>{{activeHangp.text}}</span>
            <video
              class="video-player vjs-custom-skin"
              :src="activeHangp.videoFilePath"
              controls="controls"
              style="width:100%;"
            />
          </div>
          <div class="hangpai-l">
            <div
              v-for="(item,index) in videoData"
              :key="index"
              @click="handleHpClick(item)"
              :class="{'activehp':item.id===activeHangp.id}"
            >
              <!-- <img :src="item.img" :alt="item.title" /> -->
              <span>{{item.text}}</span>
              <img :src="item.pictureFilePath" alt="" srcset="">
            </div>
          </div>

    </div>
</template>

<script>
    export default {
      data(){
          return{
              activeHangp: {},
              videoData:[],
          }
      },
      methods:{
        loadData(data){
          if(data.length!=0){
            this.videoData = data
            this.activeHangp = this.videoData[0]
          }
        },
        handleHpClick(item) {
          this.activeHangp = item;
        },
      }
    }
</script>

<style lang="less" scoped>

.hangpsp {
    width: 100%;
  height: 21vh;
  display: flex;
  position: relative;
  h3.hp-title {
    position: absolute;
    bottom: 0vh;
    left: 0;
    font-weight: 400;
    font-size: 15px;
    width: 100%;
    span {
      float: right;
      color: @scolor;
    }
  }
  .hangpai-r {
    flex: 3;
    position: relative;
    margin-right: 11px;
    span{
      font-size: 14px;
      padding: 5px 10px;
      display: block;
      position: absolute;
      color: rgb(190, 190, 190);
    }
    video{
        height: 100%;
        background-color: rgba(51, 51, 51, 0.767);
    }
  }
  .hangpai-l {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
    padding-right: 9px;
    > div {
      margin-bottom: 11px;
      width: 100%;
      cursor: pointer;
      height: 57px;
      text-align: center;
      position: relative;
      &:hover{
        span{
          display: block;
        }
      }
      span{
        position: absolute;
        left:5px;
        top:5px;
        color: rgb(184, 184, 184);
        display: none;
      }
      i{
        color: #8b8c96;
        font-size: 50px;
      }
      img {
        width: 100%;
        height: 100%;
        margin: 0 0 3px 0;
        border: 0;
        padding: 0;
        display: block;

      }
    }
    .activehp {
        border: 1px solid @fcolor;
    }
  }
}
</style>
