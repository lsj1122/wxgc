<template>
  <div>
    <!--图片预览-->
    <el-image-viewer
      v-if="showBig"
      style="width: 100%; height: 100%"
      :on-close="closeViewer"
      :url-list="[this.imageSrc]"
      :z-index="10000"
    />
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="width"
      destroy-on-close
      :before-close="handleClose"
      :modal-append-to-body="false"
    >
      <iframe
        id="iframe"
        :src="src"
        :style="{ width: '100%', height: iframeHeight }"
        frameborder="1"
        v-if="txtPre"
      ></iframe>
      <!--  office 预览  -->
      <iframe
        v-if="iframeVisible"
        ref="jgIframe"
        :src="src"
        :style="{ width: '100%', height: iframeHeight }"
        frameborder="0"
        id="jgIframe"
      ></iframe>
      <!--  视频 音频 监控流  -->

      <video-player
        v-if="videoVisible"
        ref="videoPlayer"
        class="video-player vjs-custom-skin"
        :playsinline="true"
        :options="playerOptions"
      />

      <!--  PDF预览  -->
      <pdf
        v-if="pdfVisible"
        :style="{ display: pdfVisible }"
        ref="pdf"
        :src="pdfUrl"
        style="height: 100%"
        :page="currentPage"
        @num-pages="pageCount = $event"
        @page-loaded="currentPage = $event"
        @loaded="loadPdfHandler"
      >
      </pdf>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="pdfVisible"
        :style="{ display: pdfVisible }"
      >
        {{ currentPage }} / {{ pageCount }}
        <el-button
          type="primary"
          plain
          @click="changePdfPage(0)"
          v-if="currentPage > 1"
          >上一页</el-button
        >
        <el-button
          type="primary"
          plain
          @click="changePdfPage(1)"
          v-if="currentPage < pageCount"
          >下一页</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { videoPlayer } from "vue-video-player";
// import 'video.js/dist-old/video-js.css'
import "vue-video-player/src/custom-theme.css";
import "videojs-contrib-hls";
import pdf from "vue-pdf";
export default {
  name: "index",
  components: {
    videoPlayer,
    pdf,
    ElImageViewer,
  },
  props: {
    title: { type: String, default: "预览" },
    width: { type: String, default: "80%" },
  },
  data() {
    return {
      showBig: false,
      txtPre: false, //txt展示
      txt: ["txt"],
      imageType: ["jpeg", "png", "jpg", "bmp", "webp", "gif", "svg"], //图片
      objectType: ["webm", "ogg", "mp4", "mpeg", "avi"], // 视频
      pdfType: ["pdf", "text/plain"],
      officeType: [
        "xls",
        "xlsx",
        "word",
        "ppt",
        "excel",
        "doc",
        "docx",
        "pptx",
      ],
      liveType: ["application/x-mpegURL"],
      dialogVisible: false, //控制弹窗是否显示
      previewImage: false, //控制图片预览组件显示
      imageSrc: "", //预览图片的地址
      iframeVisible: false, //office预览样式
      src: "", //office预览的地址
      iframeHeight: "100%",
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [], //默认视频播放地址和类型
        hls: true,
        poster: "", // 你的封面地址
        width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true, //时间分割线
          durationDisplay: true, //总时间
          remainingTimeDisplay: true, //剩余播放时间
          progressControl: true, // 进度条
          fullscreenToggle: true, // 全屏按钮
        },
      },
      videoVisible: false,
      pdfVisible: false,
      pdfUrl: "", //pdf的url
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
    };
  },
  computed: {
    viewType() {
      return [
        ...this.imageType,
        ...this.objectType,
        ...this.officeType,
        ...this.liveType,
        ...this.pdfType,
        ...this.txt,
      ];
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.changeIfame();
      })();
    };
  },
  methods: {
    closeViewer() {
      this.showBig = false;
    },
    handleClose(done) {
      this.txtPre = false;
      this.dialogVisible = false;
      this.previewImage = false;
      this.imageSrc = "";
      this.iframeVisible = false;
      this.src = "";
      this.videoVisible = false;
      this.playerOptions.sources = [];
      this.pdfVisible = false;
      this.pdfUrl = "";
      this.$emit("close");
    },
    show(url, type) {
      if (this.viewType.indexOf(type) == -1) {
        this.$message.error("不支持此类型预览");
        return;
      }
      let isLocalUrl = false;
      // url=url.replaceAll("\\","/"); //主要是本地文件路径
      // if(url.indexOf(":/")!=-1){ //访问本地磁盘，修改成nginx配置的资源路径
      //   isLocalUrl=true;
      //   url=url.substring(url.indexOf(":/")+2)
      //   url=url.substring(url.indexOf("/"))
      //   url=process.env.VUE_APP_RESOURCE +url;
      // }

      // console.log(url)
      /* url = encodeURIComponent(url)*/
      // console.log(url)
      if (this.imageType.indexOf(type) != -1) {
        //图片
        this.imageSrc = url;
        // console.log(this.imageSrc)
        this.showBig = true;
      } else if (this.officeType.indexOf(type) != -1) {
        //office文档
        if (isLocalUrl) {
          //访问本地office
          this.src = "https://www.office.wx.com/op/view.aspx?src=" + url;
        } else {
          this.src = "https://view.officeapps.live.com/op/view.aspx?src=" + url;
        }
        this.iframeVisible = true;
        this.changeIfame();
      } else if (this.objectType.indexOf(type) != -1) {
        //视频音频
        this.playerOptions.sources = [
          {
            type: "video/" + type, // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: url,
          },
        ];
        this.videoVisible = true;
      } else if (this.liveType.indexOf(type) != -1) {
        //监控直播流
        this.playerOptions.sources = [
          {
            withCredentials: false,
            type: type,
            src: url,
          },
        ];
        this.videoVisible = true;
      } else if (this.pdfType.indexOf(type) != -1) {
        //PDF
        this.pdfUrl = url;
        console.log(this.src);
        this.pdfVisible = true;
        this.changeIfame();
      } else if (this.txt.indexOf(type) != -1) {
        //txt
        this.txtPre = true;
        this.src = url;
        this.changeIfame();
      }
      if (this.imageType.indexOf(type) == -1) {
        // 非图片类型，显示弹框
        this.dialogVisible = true;
      }
    },
    changeIfame() {
      const deviceHeight = document.documentElement.clientHeight;
      this.iframeHeight = Number(deviceHeight) - 130 + "px"; //数字是页面布局高度差
    },
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .video-js {
  .vjs-big-play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
::v-deep .el-dialog {
  margin-top: 10vh !important;
  height: 80% !important;
  max-height: 95vh !important;
}
::v-deep .el-dialog__body {
  height: 85% !important;
  overflow: auto !important;
  max-height: 800px !important;
  background-color: transparent;
}
::v-deep .el-dialog__wrapper {
  // overflow: auto!important;
}
.vjs-custom-skin {
  height: 100% !important;
  width: 100% !important;
  background-color: pink !important;
}
::v-deep .vjs-fluid {
  padding: 0 !important;
  height: 100% !important;
}
</style>
