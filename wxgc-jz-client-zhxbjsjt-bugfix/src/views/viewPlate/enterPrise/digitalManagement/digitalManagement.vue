<template>
  <div class="content">
    <!-- <div class="time-controller" style="height: 40px; min-height: 40px">
      <el-button-group>
        <el-button type="primary" size="mini" @click="wifiChoose(0)"
          >今日</el-button
        >
        <el-button type="primary" size="mini" @click="wifiChoose(1)"
          >本周</el-button
        >
        <el-button type="primary" size="mini" @click="wifiChoose(1)"
          >当月</el-button
        >
      </el-button-group>
    </div> -->
    <timeButton @zongLanChoose="Handover"></timeButton>

    <div class="content-box">
      <!--  -->
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'项目报警统计'"
          :title2="'Safety Statistics'"
        >
        <!-- <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="Projectalarm"
              />
            </el-tooltip>
          </template> -->
          <!-- <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <span @click="openDialog" class="el-icon-s-unfold"></span>
            </el-tooltip>
          </template> -->

          <!-- <template #head>
            <el-button-group>
              <el-button
                :class="{ active: index1 == 1 }"
                type="primary"
                size="mini"
                @click="spChoose(0)"
                >按项目</el-button
              >
              <el-button
                :class="{ active: index1 == 2 }"
                type="primary"
                size="mini"
                @click="spChoose(1)"
                >按类型</el-button
              >
              <el-button
                :class="{ active: index1 == 3 }"
                type="primary"
                size="mini"
                @click="spChoose(2)"
                >按时间</el-button
              >
            </el-button-group>
          </template> -->
          <div class="icon-document">
            <div class="safetyPro" style="height: 100%">
              <safetyProEcharts ref="spEcharts"></safetyProEcharts>
            </div>
          </div>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'近7天隐患整改统计'"
          :title2="'Rectification of potential safety hazards'"
        >
           <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="statistics"
              />
            </el-tooltip>
          </template>
          <!-- <template #head>
            <el-button-group>
              <el-button
                :class="{ active: index2 == 1 }"
                type="primary"
                size="mini"
                @click="smendChoose(0)"
                >按项目</el-button
              >
              <el-button
                :class="{ active: index2 == 2 }"
                type="primary"
                size="mini"
                @click="smendChoose(1)"
                >按时间</el-button
              >
            </el-button-group>
          </template> -->
          <!-- <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <span @click="openDialog2" class="el-icon-s-unfold"></span>
            </el-tooltip>
          </template> -->
          <div class="icon-document">
            <div class="safetyMend" style="height: 100%">
              <safetyMendEcharts ref="smend"></safetyMendEcharts>
            </div>
          </div>
        </com-line>
      </div>
      <!--  -->
      <div class="content-mid">
        <com-line
          class="content-left-top"
          :title="'近7天安全问题统计'"
          :title2="'Hazard identification'"
        >
       
          <div class="icon-document">
            <div class="dangerEcharts" style="height: 100%">
              <dangerEcharts ref="dangerEcharts"></dangerEcharts>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'机械设备统计'"
          :title2="'Statistics of mechanical equipment'"
        >
         <!-- <template #button>
            <el-tooltip
              class="item"
              effect="dark"
              content="查看详细数据"
              placement="top-start"
            >
              <img
                class="el-img"
                src="../../../../assets/compent/ytb.png"
                alt=""
                @click="equipment"
              />
            </el-tooltip>
          </template> -->
       
          <div class="icon-document">
            <div class="equipmentEcharts" style="height: 100%">
              <equipmentEcharts ref="equipEcharts"></equipmentEcharts>
            </div>
          </div>
        </com-line>
      </div>

      <!--  -->
      <div class="content-right">
          <com-line
          class="content-left-top"
          :title="'安全教育统计'"
          :title2="'Safety education statistics'"
        >
          <!-- <template #head>
            <el-button-group>
              <el-button
                :class="{ active: index4 == 1 }"
                type="primary"
                size="mini"
                @click="sEducationChoose(0)"
                >安全教育次数</el-button
              >
              <el-button
                :class="{ active: index4 == 2 }"
                type="primary"
                size="mini"
                @click="sEducationChoose(1)"
                >安全教育类型</el-button
              >
            </el-button-group>
          </template> -->
          <div class="icon-document">
            <div class="safetyEducation" style="height: 100%">
              <safetyEducation ref="sEducation"></safetyEducation>
            </div>
          </div>
        </com-line>
      
        <com-line
          class="content-left-top"
          :title="'优秀安全项目'"
          :title2="'Excellent safety project'"
        >
          <div class="icon-document" style="height: 100%">
            <outstandingProject></outstandingProject>
          </div>
        </com-line>
      </div>
    </div>
    
  </div>
</template>

<script>
import safetyProEcharts from "./modules/safetyProEcharts";
import safetyMendEcharts from "./modules/safetyMendEcharts";
import dangerEcharts from "./modules/dangerEcharts";
import safetyEducation from "./modules/safetyEducation";
import equipmentEcharts from "./modules/equipmentEcharts";
import outstandingProject from "./modules/outstandingProject";

import timeButton from "../aModules/timeButton";

import ComLine from "../../components/comline";
import {projectName} from '../api/enterPriseDescribe'

export default {
  props: {},
  components: {
    ComLine,
    safetyProEcharts,
    safetyMendEcharts,
    dangerEcharts,
    safetyEducation,
    equipmentEcharts,
    outstandingProject,
    timeButton,
  },
  data() {
    return {
      index1: 1,
      index2: 1,
      index3: 1,
      index4: 1,
      index5: 1,
      safetyDialog: false,
      // 分页
      
     
    };
  },
  mounted() {
    this.getProName();
   
  },
  methods: {
    // 显示对话框 
    // 项目报警统计弹窗
    Projectalarm(){
      this.$refs.spEcharts.safetyDialog = true;
    },
    // 近7天隐患整改统计弹窗
    statistics(){
       this.$refs.smend.DialogVisible = true;
      
    },
    // 机械设备弹窗
    equipment(){
      this.$refs.equipEcharts.DialogVisible = true;
    },
    openDialog2() {
      this.$refs.smend.getQualitysafeManagerStatus();
      this.$refs.smend.DialogVisible = true;
    },
    // 获取项目名称
    getProName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
        }
      });
    },
    Handover(index) {
      this.index1 = 1;
      this.index2 = 1;
      this.index3 = 1;
      this.index4 = 1;
      this.index5 = 1;
      // 安全问题统计更新图表
      this.$refs.spEcharts.getSafetyProject(index);
      this.$refs.spEcharts.getSafetyTypes(index);
      this.$refs.spEcharts.getSafetyTimes(index);

      // 安全隐患整改更新图表
      this.$refs.smend.getSafeManagerTime(index);
      this.$refs.smend.getSafetyMeasures(index);

      // 危险源识别更新图表
      this.$refs.dangerEcharts.handelEcharts();

      // 安全教育统计更新图表
      this.$refs.sEducation.handelEcharts();

      // 机械设备统计更新图表
      this.$refs.equipEcharts.handelEcharts();
    },
    spChoose(item) {
      this.index1 = item + 1;
      if (item == 0) {
        this.$refs.spEcharts.handelEcharts();
      } else if (item == 1) {
        this.$refs.spEcharts.handelEcharts2();
      } else {
        this.$refs.spEcharts.handelEcharts3();
      }
    },
    smendChoose(item) {
      this.index2 = item + 1;
      if (item == 0) {
        this.$refs.smend.handelEcharts();
      } else {
        this.$refs.smend.handelEcharts2();
      }
    },
    dangerChoose(item) {
      this.index3 = item + 1;
      if (item == 0) {
        this.$refs.dangerEcharts.handelEcharts();
      } else {
        this.$refs.dangerEcharts.handelEcharts2();
      }
    },
    sEducationChoose(item) {
      this.index4 = item + 1;
      if (item == 0) {
        this.$refs.sEducation.handelEcharts();
      } else {
        this.$refs.sEducation.handelEcharts2();
      }
    },
    equipChoose(item) {
      this.index5 = item + 1;
      if (item == 0) {
        this.$refs.equipEcharts.handelEcharts();
      } else {
        this.$refs.equipEcharts.handelEcharts2();
      }
    },
    // 打开安全问题统计详情框
    openDialog() {
      this.$refs.spEcharts.safetyDialog = true;
      // this.$refs.spEcharts.getProName()
      this.$refs.spEcharts.pageSelectQualitysafeManagerByDateByName()
     
    },
  },
};
</script>

<style lang="less" scoped>
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
  // width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;


  //    border: 2px solid pink;
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
   
  }
}

/*   内容的 中间 */
.content-mid {
  //    border: 2px solid pink;
  position: relative;
  // width: 600px;
  flex: 1;
  min-width: 600px;
  flex-grow: 1;
  display: flex;
  margin: 0 18px;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
 
 
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
    
  }
}
.content-left-top{
  margin-bottom: 20px;
}
/*   内容的 右边 */
.content-right {
  //    border: 2px solid pink;
  // width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
   
  }
}
.vp-project-content .el-button {
  // 默认状态
  background: none;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 186, 255, 0.5);
}
.active {
  //选中状态
  color: #00baff !important;
  border: 1px solid rgba(0, 186, 255, 1) !important;
}
/deep/ .el-dialog .el-dialog__header {
  margin-top: 20px;
  .el-dialog__title {
    color: #fff;
  }
}
/deep/ .el-dialog {
  width: 50%;
  // max-height: 680px;
  min-height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0vh !important;
}
/deep/ .el-pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>