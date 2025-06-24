<template>
  <div class="time-controller" style="height: 32px; min-height: 32px">
    <!-- <el-button-group v-if="timeButtonShow ? false : true">
      <el-button
        type="primary"
        size="mini"
        v-for="(item, index) in dateChooseArr"
        :key="index"
        :class="{ active: isActive == index + 1 }"
        @click="Choose(index + 1)"
        >{{ item }}</el-button
      >
    </el-button-group> -->
    <div class="notice" v-if="timeButtonShow2 ? false : true">
      <img src="../../../../assets/compent/Vector.png" alt="">
      <span>通知公告：</span>
      <div class="scroll_area">
        <div class="content">
          <div class="scrolltxt">
            <div>{{contentinfo}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 

<script>
var $ = require("jquery");
import { newsList2,newsListnew } from "@/views/viewPlate/enterPrise/api/newsCenter";
export default {
  components: {},
  props: ["timeButtonShow", "timeButtonShow2"],
  data() {
    return {
      dateChooseArr: ["今日", "7天内", "30天内"],
      isActive: 2, //默认选中 "今日", "本周", "当月"
      contentinfo: "",
    };
  },
  created() {
     console.log(decodeURIComponent(location.search.split('=')[1]) );
    this.getnotice();
    // this.getList();
    
  },
  mounted() {
    // this.scroll()
  },
  methods: {
    Choose(index) {
      this.isActive = index;
      // 调用父组件的方法
      this.$emit("zongLanChoose", index);
    },
    //
    // getList() {
    //   var _this =this
    //   var obj ={
    //     pageIndex: 1,
    //     pageSize: 10,
    //     type: 0
    //   }
    //   newsList2().then((res) => {
    //     //type : 2 是会议通知类容
    //     console.log("通知公告", res);
    //     if (res.code == "success" && res.data.records.length >= 1) {
    //       this.contentinfo = res.data.records[0].text;
    //       this.$nextTick(() => {
    //       _this.scroll()
    //   })
    //     }
    //   });
    // },
    getnotice(){
      var _this =this
      let option={
        type:1
      }
           newsListnew(option).then((res) => {
        if (res.code == "success") {
          this.contentinfo = res.data.text;
          console.log("通知公告",res);
          this.$nextTick(() => {
          _this.scroll()
      })
        }
        // res.data.text=res.data.otherFilePath.substring(res.data.otherFilePath.lastIndexOf('/') + 1)
      });
    },

    scroll(){
       // 字体滚动
            $(".scroll_area").each(function () {
              var obj = $(this);
              var dw = obj.find(".content").eq(0).width();
              var cw = obj.find(".scrolltxt").width();
              var cx = 0;

              //宽度超出当前content宽度才滚动
            console.log(cw)
                console.log(dw)
              if (cw > dw) {
                console.log(cw)
                console.log(dw)
                var scrollval = null; //滚动事件变量

                obj.find(".scrolltxt").eq(0).append(obj.find(".scrolltxt").eq(0).html());

                scrollval = setInterval(function () {
                  obj.find(".scrolltxt").eq(0).css({
                      left: "-" + cx + "px",
                    });

                  if (cx > cw - dw + dw) cx = 0;

                  cx++;
                }, 30);

                $(obj).mousemove(function () {
                  clearInterval(scrollval);
                });

                $(obj).mouseleave(function () {
                  scrollval = setInterval(function () {
                    obj.find(".scrolltxt").eq(0).css({
                        left: "-" + cx + "px",
                      });

                    if (cx > cw - dw + dw) cx = 0;

                    cx++;
                  }, 30);
                });
              }
            });
    }
  },
};
</script>
<style lang="scss" scoped>
.active {
  //选中状态
  color: #fff;
}
.time-controller {
  display: flex;
  margin-bottom: 10px;
}
.notice {
  display: flex;
  justify-content: start;
  align-items: center;
  width: 450px;
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  // background: rgba(17,57,174,0.5);
  img{
    width: 20px;
    height: 20px;
    margin-right: 11px;
  }
  background: linear-gradient(
    to right,
    rgba(17, 57, 174, 0.5),
    rgba(17, 57, 174, 0)
  );
  // padding-left: 15px;
  // margin: 5px 0;
  // margin-left: 20px;
  span {
    width: 78px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #fff;
  }
}

.scroll_area {
  height: 30px;
  // background: #f2f2f2;
  width: 300px;
}

.scroll_area .content {
  overflow: hidden;
  position: relative;
  color: rgba(255,255, 255, 0.8);
 height: 100%;
  margin-bottom: 10px;
}

.scroll_area .scrolltxt {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
}

.scroll_area .scrolltxt div {
  display: inline-block;
}
</style>
