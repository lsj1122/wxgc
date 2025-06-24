<template>
  <div class="pManagement">
    <!-- <div class="notice">
        <span>通知公告：通知公告通知公告通知公告</span>
    </div> -->
    <timeButton timeButtonShow='false'></timeButton>

    <div class="content-p">
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'现场状态统计'"
          :title2="'Project status statistics'"
        >
          <div class="icon-document">
            <div class="siteTongji" style="height:100%">
              <projectStatus></projectStatus>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'项目类型统计'"
          :title2="'Project type statistics'"
        >
          <div class="icon-document">
            <div class="siteProTongji" style="height:100%">
              <siteEcharts></siteEcharts>
            </div>
          </div>
        </com-line>
      </div>
      <div class="content-right">
        <com-line
          class="content-left-top"
          :title="'项目库'"
          :title2="'Project library'"
        >
          <div class="icon-document">
            <div class="projectLibrary" style="height:100%">
              <projectLibrary></projectLibrary>
            </div>
          </div>
        </com-line>
      </div>
    </div>
  </div>
</template>

<script>
import projectStatus from './modules/projectStatus'
import siteEcharts from './modules/siteEcharts'
import projectLibrary from './modules/projectLibrary'
import timeButton from "../aModules/timeButton";

import ComLine from "../../components/comline";
export default {
  props: {},
  components:{ComLine,projectStatus,siteEcharts,projectLibrary,timeButton},
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
   
<style lang="less" scoped>
.pManagement {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // min-height: 830px;
  // overflow:auto;
  display: flex;
  flex-direction: column;
  .notice {
    width: 392px;
    height: 30px;
    line-height: 30px;
    // background: rgba(17,57,174,0.5);
    background: linear-gradient(
      to right,
      rgba(17, 57, 174, 0.5),
      rgba(17, 57, 174, 0)
    );
    padding-left: 15px;
    margin: 5px 0;
    span {
      width: 232px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #fff;
    }
  }
  .content-p {
    display: flex;
  }
  // 左边
  .content-left {
    width: 600px;
    flex: 1;
    // border: 2px solid pink;
    margin-right: 15px;
    .icon-document {
      width: 100%;
      height: 34.7vh;
      min-height: 300px;
      box-sizing: border-box;
    }
  }
   // 右边
  .content-right {
    flex: 2;
    // border: 2px solid pink;
    .icon-document {
      width: 100%;
      height: 76.2vh;
      min-height: 685px;
      box-sizing: border-box;
    }
  }
}
</style>