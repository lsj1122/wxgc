<template>
  <div class="videoList">
    <div class="oneList">
      已安装监控的项目共<span>{{ projectNumber }}</span
      >个,视频共<span>{{ videoNumber }}</span
      >路。
    </div>
    <div class="select">
      <el-input v-model="selectInput" placeholder="输入项目名称"></el-input
      ><el-button type="success" @click="selectList">搜索</el-button>
    </div>
    <div class="listContent">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          title=""
          :name="item.proId"
          v-for="(item, index) in list"
          :key="index"
        >
          <template slot="title">
            {{ item.proName }} <span class=""></span>
          </template>
          <div
            class="litsvideo"
            @click="IsActive($event, item2)"
            v-for="(item2, index2) in item.videoList"
            :key="index2"
            :titleID="item2.id"
          >
          <img v-if="item2.status == 1" src="../../../../../assets/compent/zxjk.png" alt="" style="margin-right:5px">
          <img v-else src="../../../../../assets/compent/lxjk.png" alt="" style="margin-right:5px">
            {{ item2.videoName  + (item2.status == 1 ? '（在线）':'（离线）')}}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      modal-append-to-body="false"
      class="dialogstyle"
    >
      <span>最多选中{{playNumber}}条，请先取消前面的选中</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
var $ = require("jquery");
import { videoListInfo } from "@/views/viewPlate/enterPrise/api/videoMonitoring";
export default {
  components: {},
  props: ["videoName"],
  data() {
    return {
      playNumber:'',
      number: 0,
      activeClass: false, // 0为默认选择第一个，-1为不选择
      activeNames: [""],
      playerOptions: [],
      playerItems: [],
      projectNumber: "",
      videoNumber: "",
      selectInput: "", //搜索的值
      list: [
        // {
        //   name: 1,
        //   pro: "华侨城迁建项目",
        //   data: [
        //     "华侨城城市广场材料堆场",
        //     "工人文化宫西1塔机",
        //     "工人文化宫车辆出入口",
        //   ],
        // },
        // {
        //   name: 2,
        //   pro: "华侨城城市广场",
        //   data: [
        //     "华侨城城市广场材料堆场2",
        //     "工人文化宫西1塔机2",
        //     "工人文化宫车辆出入口2",
        //   ],
        // },
      ],
      dialogVisible: false,
    };
  },
  created() {
    this.createPlayerOptions()
    this.ways("");
  },
  mounted() {},
  methods: {
    //清空数据的方法
    clearInfo() {
      this.createPlayerOptions()
      this.number = 0;
      $(".el-collapse-item__content .active").removeClass("active");
      $(".listContent .aa").removeClass("aa");
      // 去除右边方块

      for (var b = 0; b < this.playerOptions.length; b++) {
        this.playerOptions[b].sources[0].src = "";
      }
    },
    ways(value) {

      // var obj ={videoProVO:{ proName:'',videoName:''}}

      videoListInfo({ proName: value }).then((res) => {
        this.list = res.data;
        this.$store.dispatch("video/getVideoList", res.data);
        for (var z = 0; z < this.list.length; z++) {
          for (var j = 0; j < this.list[z].videoList.length; j++) {
            if (!this.list[z].videoList[j].id) {
              this.list[z].videoList.splice(j, 1);
            }
          }
        }
        this.projectNumber = res.data.length;
        this.videoNumber = 0;
        for (var i = 0; i < res.data.length; i++) {
          this.videoNumber =
            Number(this.videoNumber) + res.data[i].videoList.length;
        }
      });
    },
    selectList() {
      this.clearInfo();
      this.ways(this.selectInput);
      // 清除数据
      // $(".el-collapse-item__content .active").removeClass("active");
      //  清除数据
      // this.number = 0;
      var obj = {
        playerOptions: this.playerOptions,
        clickeNumber: this.number,
      };
      // console.log('xgl',obj)
      // this.$store.dispatch("video/changeVideoLength", obj);
      // this.$emit("creationArr");
    },
    handleChange(val) {
      console.log('handleChange',val)
    },

    createPlayerOptions() {
      this.playerOptions = [];
      this.playNumber = this.$store.state.video.playNumber;

      for (var i = 0; i < this.playNumber; i++) {
        // alert(1)
        var Options = {
          playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
          autoplay: true, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:5", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [
            {
              withCredentials: false,
              type: "application/x-mpegURL",
              src: "",
            },
          ],
          hls: true,
          // poster:
          //   "https://wxgc-erp.oss-cn-hangzhou.aliyuncs.com/video/video-cover.png", // 你的封面地址
          width: document.documentElement.clientWidth, // 播放器宽度
          notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true, //时间分割线
            durationDisplay: true, //总时间
            remainingTimeDisplay: false, //剩余播放时间
            progressControl: true, // 进度条
            fullscreenToggle: true, // 全屏按钮
          },
        };
        // Options.sources[0].src = urlB[i];
        this.playerOptions.push(Options);
        // this.videobox.push(this.videoArr[i])
      }
    },
    IsActive: function (e, item2) {
      console.log(192, e,item2)
      //
      // console.log(136, item2);
      //
      var indexArr = [];
      console.log('e.target.getAttribute("class")',e.target.getAttribute("class"))
      if (e.target.getAttribute("class").indexOf(" active") != -1) {
        // 先修改值，
        var lg = $(".el-collapse-item__content .active").length;
        // console.log($(".el-collapse-item__content .active").length);
        for (var a = 0; a < lg; a++) {
          // console.log($(".el-collapse-item__content .active").eq(a).text());
          // 这里是判断名字 相等 改
          if ($(".el-collapse-item__content .active").eq(a).attr("titleID") == item2.id ) {
            // replace(/[ ]/g,"") 去除空格
            $(".el-collapse-item__content .active").eq(a).removeClass("active");
            //先修改值，
            // alert(a)
            //  this.playerOptions[a].sources[0].src = '';
            //  this.playerOptions[a].videxObject =''
            // console.log(150,this.playerOptions)
            // console.log(137, this.playerOptions);
            //清空地址
            for (var b = 0; b < this.playerOptions.length; b++) {
              if (this.playerOptions[b].videxObject) {
                if (this.playerOptions[b].videxObject.id == item2.id) {
                  this.playerOptions[b].sources[0].src = "";
                  this.playerOptions[b].videxObject = "";
                }
              }
            }
          }
        }

        //去除类名 (关闭视屏)
        // e.target.classList.remove("active");
        this.number = this.number - 1;
        // 减得时候判断 那个位置
      } else {
        this.number = this.number + 1;
        console.log(237, this.playerOptions)

        //判断
        for (let [index, item] of this.playerOptions.entries()) {
          //entries()  类似于for in
          console.log(index, item);
          console.log(item.sources[0].src)
          if (item.sources[0].src == undefined || item.sources[0].src == "") {
            // this.playerOptions[i].sources[0].src = "";
            // 替换 videobox
            // this.videobox.splice(index, 1, row);
            // 替换资源路径
            console.log(index)
            this.playerOptions[index] = {
              ...this.playerOptions[index],
              videxObject: item2,
            };
            this.playerOptions[index].sources[0].src = item2.videoUrl;
            break;
          }
        }
        console.log(258, this.playerOptions)

        this.playNumber = this.$store.state.video.playNumber; //当前播放几个框（1,4,9）
        //判断最后展示几个
        if (this.playNumber == 4) {
          if (this.number > 4) {
            this.number = 4;
            // indexArr.pop();
            this.dialogVisible = true;
            return;
          }
        } else if (this.playNumber == 1) {
          if (this.number > 1) {
            this.number = 1;
            this.dialogVisible = true;
            return;
          }
        } else if (this.playNumber == 9) {
          if (this.number > 9) {
            this.number = 9;
            this.dialogVisible = true;
            return;
          }
        } else if (this.playNumber == 16) {
          if (this.number > 16) {
            this.number = 16;
            this.dialogVisible = true;
            return;
          }
        }
        //    if (this.number > this.playNumber) {
        //     this.number = 4;
        //     // indexArr.pop();
        //     this.dialogVisible = true;
        //     return;

        // }else{
        //   if (this.number > 1) {
        //     this.number = 1;
        //     this.dialogVisible = true;
        //     return;
        //   }


        //添加类名 (添加视频)

        // console.log(this.playerOptions);
        e.target.classList.add("active");
        e.target.parentNode.parentNode.previousSibling.childNodes[0].childNodes[1].classList.add(
          "aa"
        );
      }

      // 控制方格的显示消失
      var a = [];
      var p = e.target.parentNode.children;
      for (var i = 0, pl = p.length; i < pl; i++) {
        a.push(p[i]);
      }
      let type = a.some(function (item, index) {
        return item.getAttribute("class") == "active";
      });
      if (type == false) {
        //这时候没有的选中的项目
        e.target.parentNode.parentNode.previousSibling.childNodes[0].childNodes[1].classList.remove(
          "aa"
        );
      }
      //通知 父组件 ，创建数组
      //
      var obj = {
        playerOptions: this.playerOptions,
        clickeNumber: this.number,
      };
      this.$store.dispatch("video/changeVideoLength", obj);
      this.$emit("creationArr");
    },
    fillLunBoActive: function (obj) {
      //
      var items = $(".el-collapse-item__content");
      let ids = [];
      obj.forEach((e) =>{
        ids.push(e.videxObject.id)
      })
      console.log('ids',ids)
      var lg =items.length;

      for (let i = 0; i < obj.length; i++) {
        this.playerOptions[i].videxObject = obj[i].videxObject;
      }
      this.$store.dispatch("video/changeVideoLength", obj);

      for (var a = 0; a < lg; a++) {
        let item = items.eq(a);
        let children =  item.children();
        let childenLen = children.length
        for (var b = 0; b < childenLen; b++) {
          let childenItem = children.eq(a);
          let titleId = childenItem.attr('titleId');
          for (let i = 0; i < ids.length; i++) {
            let id = ids[i]
            if (id = titleId){
              childenItem.addClass('active')
            }
          }
        }
      }

    },
    // 控制方格的显示消失
    closeNameBgc() {
      // console.log(231, this.$store.state.video.name);
      var videoID = this.$store.state.video.name
        ? this.$store.state.video.name.videxObject.id
        : "";
      // console.log(232, videoID);
      this.number = this.number - 1;
      //
      $(".el-collapse-item__content .active");
      var lg = $(".el-collapse-item__content .active").length;
      // console.log($(".el-collapse-item__content .active").length);
      for (var a = 0; a < lg; a++) {
        // console.log($(".el-collapse-item__content .active").eq(a).text());
        // 这里是判断名字 相等 改
        if (
          $(".el-collapse-item__content .active").eq(a).attr("titleID") ==
          videoID
        ) {
          $(".el-collapse-item__content .active").eq(a).removeClass("active");

          for (var b = 0; b < this.playerOptions.length; b++) {
            if (this.playerOptions[b].videxObject) {
              if (this.playerOptions[b].videxObject.id == videoID) {
                this.playerOptions[b].sources[0].src = '';
                this.playerOptions[b].videxObject = '';
              }
            }
          }
        }
      }
      var lgNum = $(".el-collapse-item").length;

      for (var c = 0; c < lgNum; c++) {
        if ($(".el-collapse-item:eq(" + c + ") .active").length == 0) {
          //  alert(c)
          // console.log($(".el-collapse-item:eq(" + c + ")"));
          $(
            ".el-collapse-item:eq(" + c + ") .el-collapse-item__header span"
          ).removeClass("aa");
        }
      }

      //
      //
    },
  },
};
</script>
<style lang="less" scoped>
.videoList {
  height: 100%;
  padding-top: 10px;
  // min-height: 600px;
}
::v-deep .active{
  border-bottom: none;
}
.oneList {
  position: relative;
  top: -10px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #ffffff;
  span {
    font-size: 32px;
    font-family: Acens;
    color: #eaff34;
  }
}
.select {
  margin-bottom: 10px;
  .el-input {
    width: 210px;
    margin-right: 20px;
    /deep/.el-input__inner {
      height: 30px;
      background: rgba(0, 17, 44, 0.5);
      border: 1px solid #134487;
    }
  }
  /deep/.el-button {
    background: #2453c9;
    border: 0px;
    color: #ffffff;
    height: 32px;
  }
}

////
.listContent {
  width: 100%;
  height: calc(100% - 100px);
  overflow: auto;
  .el-collapse {
    padding-left: 20px;
    background-color: transparent;
    border: 0px;
    // /deep/.el-collapse-item{
    //     //  background-color: pink !important;
    // }

    /deep/.el-collapse-item__header {
      position: relative;
      background-color: transparent;
      border: 0px;
      color: #ffffff;
      .el-collapse-item__arrow {
        position: absolute;
        left: -22px;
      }
      .aa {
        position: absolute;
        top: 35%;
        right: 10px;
        display: inline-block;
        width: 14px;
        height: 14px;
        background: #477bff;
        border: 2px solid #ffffff;
        z-index: 10;
      }
    }
    /deep/.el-collapse-item__wrap {
      background-color: transparent !important;
      border: 0px;
      font-family: PingFang SC;
    }
    /deep/.el-collapse-item__content {
      color: #ffffff;
      font-family: PingFang SC;
      overflow: hidden;
      padding: 0;
      div {
        padding: 5px 10px;
        cursor: pointer;
      }
    }
  }
}
.active {

  color: #5bbbff;
  display: table;
}
</style>
<style>
.dialogstyle .el-dialog__header {
  padding: 20px !important;
}
</style>

