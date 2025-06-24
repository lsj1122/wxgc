<template>
  <div class="boot">
    <div class="top">
      <el-select
        clearable
        class="selectType"
        v-model="listQuery.proName"
        placeholder="请选择项目名称"
      >
        <el-option
          v-for="item in selectoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
        style="width: 180px; margin-left: 10px; margin-right: 8px"
        v-model="listQuery.date"
        type="date"
        placeholder="选择日期"
      >
      </el-date-picker>
      <el-button type="primary" @click="seach">搜索</el-button>
    </div>
    <template>
      <div class="bottom">
        <div class="bottomsum" v-for="(item, index) in tableData" :key="index">
          <div class="bottom_t">{{ item.projectName }}</div>
          <div class="bottom_c">
            <div class="bottom_c_l" style="margin-right: 188px">
              <div style="margin-bottom: 12px">
                商品名称： <span>{{ item.goodsName }}</span>
              </div>
              <div style="margin-bottom: 12px">
                规格型号： <span>{{ item.goodsModel }}</span>
              </div>
              <div style="margin-bottom: 12px">
                过磅时间： <span>{{ item.enterTime }}</span>
              </div>
              <div style="margin-bottom: 12px">
                单位名称： <span>{{ item.companyName }}</span>
              </div>
            </div>
            <div class="bottom_c_r">
              <div style="margin-bottom: 12px">
                司 机： <span>{{ item.driverName }}</span>
              </div>

              <div style="margin-bottom: 12px">
                重量：
                <span>{{ item.netWeight }}{{ item.unitOfMeasurement }}</span>
              </div>

              <div style="margin-bottom: 12px">
                电话： <span>{{ item.driverMobile }}</span>
              </div>
            </div>
          </div>
          <div class="bottom_b">
            <el-button class="weigh" @click.stop="cheakimg(item)"
            >过磅照片
            </el-button
            >
            <el-button class="weigh" @click.stop="cheakvieo(item)"
            >过磅视频
            </el-button
            >
          </div>
        </div>
      </div>
    </template>
    <el-dialog
      title="查看过磅图片"
      :visible.sync="dialogVisibleimg"
      width="50%"
      :before-close="handleClose"
      center="center"
    >
      <img
        :src="pitcimg.enterLicenseName"
        alt=""
        style="width: 100%; height: 100%"
      />
    </el-dialog>
    <el-dialog
      title="查看过磅视频"
      :visible.sync="dialogVisiblevideo"
      width="50%"
      center="center"
      :before-close="handleClose"
    >
      <video-player
        x5-video-player-type
        class="vjs-custom-skin video-player"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        @play="onPlayerPlay($event)"
      ></video-player>
    </el-dialog>
    <el-alert v-show="ashow" title="消息提示的文案" type="info"></el-alert>
  </div>
</template>

<script>
import moment from "moment";
import {
  safetyStatistics,
  securityIssueStatisticsDate,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
import {weightdetailed} from "@/views/viewPlate/enterPrise/api/mater";

export default {
  name: "weighingDetails",

  data() {
    return {
      dialogVisiblevideo: false,
      dialogVisibleimg: false,
      listQuery: {
        proName: "",
        date: "",
        startTime: "",
        endTime: "",
      },
      tableData: [],
      selectoptions: [],
      ashow: false,
      pitcimg: {},
    };
  },

  mounted() {
    this.getProjectName();
    this.detailed();
  },

  methods: {
    cheakimg(val) {
      this.pitcimg = val;
      console.log("图片", val);
      this.dialogVisibleimg = true;
    },
    cheakvieo(val) {
      console.log(1111);
      alert("暂无视频");
    },

    seach() {
      this.detailed();
    },

    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
          console.log("项目", this.selectoptions);
        }
      });
    },
    detailed() {
      if (this.listQuery.date) {
        this.listQuery.startTime = moment(this.listQuery.date).format(
          "YYYY-MM-DD 00:00:00"
        );
        this.listQuery.endTime = moment(this.listQuery.date).format(
          "YYYY-MM-DD 23:59:59"
        );
        console.log("开始", this.listQuery.startTime);
      } else {
        this.listQuery.startTime = '';
        this.listQuery.endTime = '';
      }
      weightdetailed(this.listQuery).then((res) => {
        if (res.code == "success") {
          this.tableData = res.data;
          //   this.totaltab = res.data
          //   this.proName = res.data.map((item) => {

          //   return item.name;
          // });
          //   this.value = res.data.map((item) => {
          //       return item.intValue;
          // });

          console.log("过磅明细", res.data);
        }
        // res.data.text=res.data.otherFilePath.substring(res.data.otherFilePath.lastIndexOf('/') + 1)
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.boot {
  height: 100%;

  .top {
    display: flex;
    justify-content: end;
    padding-top: 12px;
  }

  .bottom {
    margin-top: 24px;
    height: 70vh;
    overflow-y: scroll;
    padding-left: 24px;
    overflow: auto;

    .bottomsum {
      height: 25vh;

      .bottom_t {
        font-size: 16px;
        color: #f3f3f3;
        margin-bottom: 24px;
        margin-top: 12px;
      }

      .bottom_c {
        display: flex;
        // flex-wrap: wrap;
        font-size: 14px;
        color: #f3f3f3;
        justify-content: start;
        align-items: center;
      }

      .bottom_b {
        .weigh {
          font-size: 14px;
          font-family: pmzd;
          color: #e8f3ff;
          font-weight: 400;
          background: url("../../../../../assets/compent/anbk.png") no-repeat;
          border: none;
          margin-right: 13px;
          width: 120px;
          height: 40px;
        }
      }

      // button {

      //     background: url("../../../../../assets/compent/anbk.png") no-repeat;
      //     background-size: 100%,100%;
      //     font-size: 14px;
      //     font-family: pmzd;
      //     color: #E8F3FF;
      //     font-weight: 400;
      //     line-height: 28px;
      // }
    }
  }
}
</style>
