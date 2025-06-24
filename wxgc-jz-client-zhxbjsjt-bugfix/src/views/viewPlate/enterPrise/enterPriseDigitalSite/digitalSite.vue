<template>
  <div class="content">
    <!-- <div class="time-controller" style="height:40px;min-height:40px">
            <el-button-group>
            <el-button type="primary" size="mini" @click="wifiChoose(0)">今日</el-button>
            <el-button type="primary" size="mini" @click="wifiChoose(1)">本周</el-button>
            <el-button type="primary" size="mini" @click="wifiChoose(1)">当月</el-button>
            </el-button-group>
          </div> -->
    <timeButton @zongLanChoose="zongLanChoose($event)"></timeButton>

    <div class="content-box">
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'现场设备统计'"
          :title2="'Field equipment statistics'"
        >
          <div class="icon-document">
            <div class="siteTongji" style="height: 100%">
              <siteTongjiBox ref="siteTongjiBox"></siteTongjiBox>
            </div>
          </div>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'项目报警次数统计'"
          :title2="'Alarm frequency statistics'"
        >
          <div class="icon-document">
            <div class="projectWranTongji" style="height: 100%">
              <projectWranTongjiBox
                ref="projectWranTongji"
              ></projectWranTongjiBox>
            </div>
          </div>
        </com-line>
      </div>
      <!-- 中间部分 -->
      <div class="content-mid">
        <com-line
          class="content-left-top"
          :title="'设备预警报警统计'"
          :title2="'Equipment warning statistics'"
        >
          <template #head>
            <el-select
              v-model="wfvalue"
              placeholder="请选择类型"
              @change="changeAlarm"
            >
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </template>

          <div class="icon-document">
            <div class="fWarnTongji" style="height: 100%">
              <fWarnTongjiBox ref="fWarnTongjiBox"></fWarnTongjiBox>
            </div>
          </div>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'设备进场统计'"
          :title2="'Statistics of equipment entry and exit'"
        >
          <template #head>
            <el-select
              v-model="fOutvalue"
              placeholder="请选择类型"
              @change="changeOutTongji"
            >
              <el-option
                v-for="item in options2"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </template>
          <div class="icon-document">
            <div class="fOutTongji" style="height: 100%">
              <fOutTongjiBox ref="fOutTongji"></fOutTongjiBox>
            </div>
          </div>
        </com-line>
      </div>
      <!-- 右边部分 -->
      <div class="content-right">
        <com-line
          class="content-left-top"
          :title="'报警详情'"
          :title2="'Alarm details'"
        >
          <div class="icon-document">
            <div class="alarmDeatils" style="height: 100%">
              <alarmDeatilsBox ref="alarmDeatils"></alarmDeatilsBox>
            </div>
          </div>
        </com-line>
      </div>
    </div>
  </div>
</template>

<script>
import siteTongjiBox from "./modules/siteTongjiBox";
import projectWranTongjiBox from "./modules/projectWranTongjiBox";
import fWarnTongjiBox from "./modules/fWarnTongjiBox";
import fOutTongjiBox from "./modules/fOutTongjiBox";
import alarmDeatilsBox from "./modules/alarmDeatilsBox";
import timeButton from "../aModules/timeButton";

import ComLine from "../../components/comline";
export default {
  props: {},
  components: {
    ComLine,
    siteTongjiBox,
    projectWranTongjiBox,
    fWarnTongjiBox,
    fOutTongjiBox,
    alarmDeatilsBox,
    timeButton,
  },
  data() {
    return {
      isActive: 2, //默认选中 "今日", "本周", "当月"
      options: ["塔式起重机", "施工升降机", "扬尘监测设备"],
      wfvalue: "塔式起重机",
      options2: [
        "塔式起重机",
        "施工升降机",
        "卸料平台",
        "扬尘监测设备",
        "视频设备",
        "智能水电表",
      ],
      fOutvalue: "塔式起重机",
    };
  },
  mounted() {},
  methods: {
    changeAlarm() {
      var type = null;
      for (var i = 0; i < this.options.length; i++) {
        // 传的是1,2,3
        if (this.wfvalue == this.options[i]) {
          type = i + 1;
        }
      }
      // 调用自组件的方法
      this.$refs.fWarnTongjiBox.ways(this.isActive, type);
    },
    changeOutTongji() {
      var type = null;
      for (var i = 0; i < this.options2.length; i++) {
        if (this.fOutvalue == this.options2[i]) {
          type = i + 1;
        }
      }
      // 调用自组件的方法
      this.$refs.fOutTongji.ways(this.isActive, type);
    },
    zongLanChoose(index) {
      this.isActive = index;
       //现场设备统计
      this.$refs.siteTongjiBox.ways(this.isActive);
      //项目报警次数统计
      this.$refs.projectWranTongji.ways(this.isActive);
      // 调用设备预警报警统计
      this.changeAlarm();
      // 调用设备进场统计
      this.changeOutTongji();
      // 调用报警详情
      this.$refs.alarmDeatils.ways(this.isActive);
    },
  },
};
</script>


<style lang="less" scoped>
.content {
  /deep/.el-input__inner {
    height: 30px;
    line-height: 30px;
    background-color: #00112c;
  }
  /deep/.el-select__caret {
    height: 30px;
    line-height: 30px;
  }
}

.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // min-height: 830px;
  // overflow:auto;
  display: flex;
  flex-direction: column;
  .content-box {
    display: flex;
  }
}

/*   内容的左边 */
.content-left {
  width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  //  border: 2px solid pink;
  .icon-document {
    width: 100%;
    height: 34.5vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 中间 */
.content-mid {
  //  border: 2px solid pink;
  position: relative;
  width: 600px;
  min-width: 600px;
  flex-grow: 1;
  display: flex;
  margin: 0 18px;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .icon-document {
    width: 100%;
    height: 34.5vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 右边 */
.content-right {
  //  border: 2px solid pink;
  width: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .icon-document {
    width: 100%;
    height: 77vh;
    min-height: 700px;
    box-sizing: border-box;
  }
}
.alarmDeatils {
  height: 100%;
}
</style>