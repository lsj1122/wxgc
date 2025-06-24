<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.machineNumber"
        placeholder="设备编号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t("table.search") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t("table.add") }}
      </el-button>

      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("table.export") }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="warning"
        @click="handleCancelAlarm"
      >
        {{ $t("取消报警") }}
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="success"
        @click="handlePLNew"
      >
        {{ $t("喷淋设置") }}
      </el-button> -->

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="success"
        @click="PMSet"
      >
        {{ $t("PM浓度比例设置") }}
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="success"
        @click="yuZhiSet"
      >
        {{ $t("阈值设置") }}
      </el-button>
    </div>
    <!--显示列表-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      v-loading="dataLoading"
      row-key="id"
      height="calc(100vh - 260px)"
      stripe
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="80">
        <template slot-scope="scope">
          {{
            scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize
          }}
        </template>
      </el-table-column>
      <el-table-column prop="machineName" label="设备名称" align="center">
      </el-table-column>

      <el-table-column prop="machineNumber" label="设备编号" align="center">
      </el-table-column>

      <el-table-column prop="machineFactory" label="设备厂家" align="center">
      </el-table-column>
      <el-table-column prop="projectName" label="项目名称" align="center">
      </el-table-column>
      <el-table-column prop="innerDate" label="进场时间" align="center">
      </el-table-column>

      <el-table-column prop="machineState" label="设备状态" align="center">
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            v-if="scope.row.machineState == 0"
            >在线</el-tag
          >
          <el-tag
            type="info"
            effect="dark"
            v-else-if="scope.row.machineState == 1"
            >离线</el-tag
          >
          <!-- <el-tag type="danger" effect="dark" v-else>报警</el-tag> -->
        </template>
      </el-table-column>

      <!--  -->
      <!-- <el-table-column prop="showerState" label="喷淋状态" align="center">
        <template slot-scope="scope">
          {{ handleshowerState(scope.row.showerState) }}
        </template>
      </el-table-column> -->

      <!-- <el-table-column prop="matchingState" label="匹配状态" align="center">
        <template slot-scope="scope">
          {{
            scope.row.matchingState == 0
              ? "已匹配"
              : scope.row.matchingState == 0
              ? "未匹配"
              : ""
          }}
        </template>
      </el-table-column> -->

      <el-table-column fixed="right" width="430" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleEdit(scope)" size="mini"
            >编辑</el-button
          >
          <el-button size="mini" type="primary" @click="lookOneInfo(scope)"
            >查看</el-button
          >
          <el-button size="mini" type="info" @click="control(scope.row)"
            >设置</el-button
          >
          <!-- <el-button size="mini" style="margin-left: 1px">转发</el-button> -->
          <el-button size="mini" type="warning" @click="lockYcjc(scope.row)"
            >锁机</el-button
          >
          <el-button size="mini" type="success" @click="handlePLNew(scope)">
            {{ $t("喷淋设置") }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      class="el-pagination"
      v-show="total > 0"
      background
      layout="prev, pager, next"
      :current-page.sync="listQuery.pageIndex"
      :page-size.sync="listQuery.pageSize"
      @current-change="loadPageData"
      :total="total"
    >
    </el-pagination>

    <!--增加或修改弹出层-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24"
            ><div class="grid-content bg-purple">
              <el-form-item label="设备名称" prop="machineName">
                <el-input v-model="temp.machineName" placeholder="设备名称" />
              </el-form-item>
              <el-form-item label="设备厂家" prop="machineFactory">
                <el-input
                  v-model="temp.machineFactory"
                  placeholder="设备厂家"
                />
              </el-form-item>

              <el-form-item label="设备编号" prop="machineNumber">
                <el-input v-model="temp.machineNumber" placeholder="设备编号" />
              </el-form-item>
              <el-form-item label="所属项目" prop="projectId">
                <el-cascader
                  style="width: 100%"
                  ref="cascaderArr"
                  v-model="temp.projectId"
                  :options="projectIdList"
                  @change="handleChange"
                  :show-all-levels="false"
                  :props="{ checkStrictly: true }"
                ></el-cascader>
              </el-form-item>
              <!-- <el-form-item label="主机编号" prop="hostNumber">
                <el-input v-model="temp.hostNumber" placeholder="主机编号" />
              </el-form-item> -->
              <el-form-item label="产权备案号">
                <el-input
                  v-model="temp.propertyNumber"
                  placeholder="产权备案号"
                />
              </el-form-item>
              <el-form-item label="进场时间" prop="innerDate">
                <el-date-picker
                  v-model="temp.innerDate"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="进场时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="产权单位">
                <el-input
                  v-model="temp.propertyCompany"
                  placeholder="产权单位"
                />
              </el-form-item>
              <el-form-item label="安装单位">
                <el-input
                  v-model="temp.installCompany"
                  placeholder="安装单位"
                />
              </el-form-item></div
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 喷淋设置 -->
    <el-dialog
      :title="commentSetTitle"
      :visible.sync="dialogFormVisiblePL"
      width="60%"
      :close-on-click-modal="false"
    >
      <!-- 喷淋设置 的 form -->
      <el-form
        v-if="commentSetTitle == '喷淋设置'"
        ref="dataFormPL"
        :rules="rulesPL"
        :model="tempPL"
        label-position="right"
        label-width="150px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <!-- <el-form-item label="设备序号" prop="machineNum">
                <el-input
                  v-model="tempPL.machineNum"
                  placeholder="设备序号"
                  disabled
                />
              </el-form-item> -->
              <el-form-item label="设备编号" prop="machineNumber">
                <el-input
                  v-model="tempPL.machineNumber"
                  placeholder=" 设备编号"
                  disabled
                />
              </el-form-item>
              <el-form-item label="工作时间(s)" prop="sprayPeriod">
                <el-input
                  type="number"
                  v-model="tempPL.sprayPeriod"
                  placeholder="工作时间(s)"
                />
              </el-form-item>
              <el-form-item label="喷淋开关" prop="taskType">
                <el-radio-group v-model="tempPL.taskType">
                  <el-radio :label="0">立即执行</el-radio>
                  <el-radio :label="1">延迟执行</el-radio>
                  <el-radio :label="2">定时执行</el-radio>
                  <el-radio :label="3">关闭定时</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="延迟时间(s)"
                prop="delay"
                v-if="tempPL.taskType && tempPL.taskType == 1"
              >
                <el-input
                  type="number"
                  v-model="tempPL.delay"
                  placeholder="延迟时间(s)"
                  class="input-with-select"
                >
                  <el-select
                    v-model="tempPL.unit"
                    slot="append"
                    placeholder="请选择单位"
                    style="width: 110px"
                  >
                    <el-option label="s(秒)" value="s"></el-option>
                    <el-option label="h(小时)" value="h"></el-option>
                    <el-option label="d(天)" value="d"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>

              <el-form-item
                label="cron表达式"
                prop="cron"
                v-if="tempPL.taskType && tempPL.taskType == 2"
              >
                <el-input
                  v-model="tempPL.cron"
                  placeholder="请输入cron执行表达式"
                >
                  <template slot="append">
                    <el-button type="primary" @click="handleShowCron">
                      生成表达式
                      <i class="el-icon-time el-icon--right"></i>
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- PM浓度比例设置 的 form -->
      <el-form
        v-if="commentSetTitle == 'PM浓度比例设置'"
        ref="dataFormPL"
        :rules="rulesPL"
        :model="tempPL"
        label-position="right"
        label-width="150px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="设备编号" prop="machineNumbersString">
                <el-input
                  v-model="tempPL.machineNumbersString"
                  placeholder=""
                  disabled
                />
              </el-form-item>
              <el-form-item label="版本号" prop="">
                <el-input
                  v-model="tempPL.vesionsString"
                  placeholder=""
                  disabled
                />
              </el-form-item>
              <el-form-item
                label="PM2.5浓度比例（%）"
                prop="pm2ConcentrationRatio"
              >
                <el-input
                  type="number"
                  v-model="tempPL.pm2ConcentrationRatio"
                  placeholder="PM2.5浓度比例（%）"
                />
              </el-form-item>

              <el-form-item
                label="PM10浓度比例（%）"
                prop="pm10ConcentrationRatio"
              >
                <el-input
                  type="number"
                  v-model="tempPL.pm10ConcentrationRatio"
                  placeholder="PM10浓度比例（%）"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        v-if="commentSetTitle == '阈值设置'"
        ref="dataFormPL"
        :rules="rulesPL"
        :model="tempPL"
        label-position="right"
        label-width="150px"
        style="margin-left: 5px"
      >
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="版本号" prop="">
              <el-input
                v-model="tempPL.vesionsString"
                placeholder=""
                disabled
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="设备编号" prop="machineNumbersString">
              <el-input
                v-model="tempPL.machineNumbersString"
                placeholder=""
                disabled
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="厂家及设备类型">
              <el-input
                v-model="tempPL.typesString"
                placeholder="厂家及设备类型"
                disabled
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="PM2.5预警/ug/m³" prop="pm2AlarmValue">
              <el-input
                type="number"
                v-model="tempPL.pm2AlarmValue"
                placeholder="PM2.5预警值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="PM2.5报警/ug/m³" prop="pm2WarningValue">
              <el-input
                type="number"
                v-model="tempPL.pm2WarningValue"
                placeholder="PM2.5报警值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="PM10预警/ug/m³" prop="pm10AlarmValue">
              <el-input
                type="number"
                v-model="tempPL.pm10AlarmValue"
                placeholder="PM10预警值"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="PM10报警/ug/m³" prop="pm10WarningValue">
              <el-input
                type="number"
                v-model="tempPL.pm10WarningValue"
                placeholder="PM10报警值"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风速预警值/m/s" prop="speedAlarmValue">
              <el-input
                type="number"
                v-model="tempPL.speedAlarmValue"
                placeholder="风速预警值/m/s"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风速报警值/m/s" prop="speedWarningValue">
              <el-input
                type="number"
                v-model="tempPL.speedWarningValue"
                placeholder="风速报警值/m/s"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="噪音预警/db" prop="noiseAlarmValue">
              <el-input
                type="number"
                v-model="tempPL.noiseAlarmValue"
                placeholder="噪音预警/db"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="噪音报警/db" prop="noiseWarningValue">
              <el-input
                type="number"
                v-model="tempPL.noiseWarningValue"
                placeholder="噪音报警/db"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="温度预警/℃" prop="tempAlarmValue">
              <el-input
                type="number"
                v-model="tempPL.tempAlarmValue"
                placeholder="温度预警/℃"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="温度报警/℃" prop="tempWarningValue">
              <el-input
                type="number"
                v-model="tempPL.tempWarningValue"
                placeholder="温度报警/℃"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="湿度预警值/%RH" prop="humidityAlarmValue">
              <el-input
                type="number"
                v-model="tempPL.humidityAlarmValue"
                placeholder="湿度预警值/%RH"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="湿度报警/%RH" prop="humidityWarningValue">
              <el-input
                type="number"
                v-model="tempPL.humidityWarningValue"
                placeholder="湿度报警/%RH"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblePL = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          v-if="commentSetTitle == '喷淋设置'"
          @click="upDataPL('喷淋设置')"
        >
          {{ $t("table.confirm") }}
        </el-button>
        <el-button
          type="primary"
          v-if="commentSetTitle == 'PM浓度比例设置'"
          @click="upDataPL('PM浓度比例设置')"
        >
          {{ $t("table.confirm") }}
        </el-button>
        <el-button
          type="primary"
          v-if="commentSetTitle == '阈值设置'"
          @click="upDataPL('阈值设置')"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!-- oneLook -->
    <el-dialog
      title="查看"
      :visible.sync="dialogFormVisibleOneLook"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        v-loading="loadingLook"
        ref="dataFormPL"
        :model="tempPL"
        label-position="right"
        label-width="170px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="设备编号">
              <el-input
                v-model="tempPL.machineNumber"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="PM10预警值(ug/m³)">
              <el-input
                v-model="tempPL.pm10AlarmValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="PM10报警值(ug/m³)">
              <el-input
                v-model="tempPL.pm10WarningValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风速预警值(m/s)">
              <el-input
                v-model="tempPL.speedAlarmValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="风速报警值(m/s)">
              <el-input
                v-model="tempPL.speedWarningValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="噪音预警值(db)">
              <el-input
                v-model="tempPL.noiseAlarmValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="噪音报警值(db)">
              <el-input
                v-model="tempPL.noiseWarningValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="温度预警值(℃)">
              <el-input
                v-model="tempPL.tempAlarmValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="湿度报警值(℃)">
              <el-input
                v-model="tempPL.humidityWarningValue"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="传感器安装状态">
              <el-input
                type="textarea"
                :rows="4"
                placeholder=""
                v-model="tempPL.sensor"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- 喷淋查看 -->

          <el-col :span="12">
            <el-form-item label="所属项目" prop="">
              <el-input v-model="tempPL.projectName" placeholder="" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备状态">
              <el-input
                :value="
                  tempPL.machineState == 0
                    ? '在线'
                    : tempPL.machineState == 1
                    ? '离线'
                    : ''
                "
                placeholder=""
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定时状态">
              <el-input
                disabled
                :value="
                  tempPL.taskStatus == null
                    ? '无任务'
                    : tempPL.taskStatus == 0
                    ? '运行中'
                    : tempPL.taskStatus == 1
                    ? '暂停中'
                    : ''
                "
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定时周期">
              <el-input disabled v-model="tempPL.cron" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次喷淋时间">
              <el-input disabled v-model="tempPL.nextTaskTime" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleOneLook = false">
          {{ $t("table.cancel") }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="Cron表达式生成器"
      :visible.sync="openCron"
      append-to-body
      destroy-on-close
      class="scrollbar"
    >
      <crontab
        @hide="openCron = false"
        @fill="crontabFill"
        :expression="expression"
      ></crontab>
    </el-dialog>

    <!--  点击设置页面 -->
    <el-dialog
      title="设置"
      :visible.sync="dialogControlVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dialogSettingForm"
        :rules="rules"
        :model="controlForm"
        label-position="right"
        label-width="150px"
        style="margin-left: 5px"
      >
        <el-form-item
          :label="item.desc"
          :prop="item.name"
          v-for="item in registerReturnJson"
          :key="item"
        >
          <el-input v-model="controlForm[item.name]" placeholder="" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogControlVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary" @click="settingsBys">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  lockYcjc,
  machineRegisterycjc,
} from "@/views/digitalConstructionSite/snbys/api/elewaterworkdata";
import {
  getPageTtYcjc,
  addTtYcjc,
  updateTtYcjc,
  deleteTtYcjc,
  lookOneInfoYCJC,
  dustAlarmStatusControl,
  dustSprayStatusControlYCJC,
  dustPMConcentration,
  dustThresholdDataControl,
} from "./api/ttycjc.js";
import { deepClone, parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getPageSysProject } from "@/views/sysproject/api/sysproject.js";
import Crontab from "@/components/Crontab";
export default {
  name: "machine",
  components: { Pagination, Crontab },
  data() {
    return {
      loadingLook: false,
      dialogControlVisible: false, // 设置
      registerReturnJson: {},
      controlForm: {},
      // 是否显示Cron表达式弹出层
      openCron: false,
      allTableData: [], //所有表格数据，下载时候回加载
      columns: [
        { label: "设备名称", field: "machineName" },
        { label: "设备编号", field: "machineNumber" },
        { label: "设备厂家", field: "machineFactory" },
        { label: "项目名称", field: "projectName" },
        { label: "进场时间", field: "innerDate" },
        { label: "设备状态", field: "machineState" },
      ],
      commentSetTitle: "",
      dialogFormVisibleOneLook: false,
      dialogFormVisiblePL: false,
      dataFormPL: {},
      rulesPL: {
        pm10ConcentrationRatio: [
          {
            required: true,
            message: "必填PM10浓度比例",
            trigger: ["blur", "change"],
          },
        ],
        pm2ConcentrationRatio: [
          {
            required: true,
            message: "必填PM2.5浓度比例",
            trigger: ["blur", "change"],
          },
        ],
        pm2AlarmValue: [
          {
            required: true,
            message: "必填PM2.5预警值",
            trigger: ["blur", "change"],
          },
        ],
        pm2WarningValue: [
          {
            required: true,
            message: "必填PM2.5 报警值",
            trigger: ["blur", "change"],
          },
        ],
        pm10AlarmValue: [
          {
            required: true,
            message: "必填PM10预警值",
            trigger: ["blur", "change"],
          },
        ],
        pm10WarningValue: [
          {
            required: true,
            message: "必填PM10 报警值",
            trigger: ["blur", "change"],
          },
        ],
        speedAlarmValue: [
          {
            required: true,
            message: "必填风速预警值",
            trigger: ["blur", "change"],
          },
        ],
        speedWarningValue: [
          {
            required: true,
            message: "必填风速报警值",
            trigger: ["blur", "change"],
          },
        ],
        noiseWarningValue: [
          {
            required: true,
            message: "必填噪音报警值",
            trigger: ["blur", "change"],
          },
        ],
        tempAlarmValue: [
          {
            required: true,
            message: "必填温度预警值",
            trigger: ["blur", "change"],
          },
        ],

        tempWarningValue: [
          {
            required: true,
            message: "必填温度报警值",
            trigger: ["blur", "change"],
          },
        ],
        humidityAlarmValue: [
          {
            required: true,
            message: "必填湿度预警值",
            trigger: ["blur", "change"],
          },
        ],
        humidityWarningValue: [
          {
            required: true,
            message: "必填湿度报警值",
            trigger: ["blur", "change"],
          },
        ],
        noiseAlarmValue: [
          {
            required: true,
            message: "必填噪音预警值",
            trigger: ["blur", "change"],
          },
        ],
        taskType: [
          {
            required: true,
            message: "必选喷淋开关",
            trigger: ["blur", "change"],
          },
        ],
        delay: [
          {
            required: true,
            message: "必填延迟时间(s)",
            trigger: ["blur", "change"],
          },
        ],
        cron: [
          {
            required: true,
            message: "必填cron执行表达式",
            trigger: ["blur", "change"],
          },
        ],
        sprayPeriod: [
          {
            required: true,
            message: "必填工作时间(s)",
            trigger: ["blur", "change"],
          },
        ],
      },
      tempPL: {},
      //
      multipleSelection: [],
      tableData: [], //当前分页数据
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 15,
        id: undefined,
        machineFactory: undefined,
        innerDate: undefined,
        createTime: undefined,
        createBy: undefined,
      },
      downloadLoading: false,
      textMap: {
        update: "编辑",
        create: "新增",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      temp: {},
      rules: {
        //校验功能
        machineName: [
          {
            required: true,
            message: "必填设备名称",
            trigger: ["blur", "change"],
          },
        ],
        machineNumber: [
          {
            required: true,
            message: "必填设备编号",
            trigger: ["blur", "change"],
          },
        ],
        hostNumber: [
          {
            required: true,
            message: "必填主机编号",
            trigger: ["blur", "change"],
          },
        ],
        innerDate: [
          {
            required: true,
            message: "必填进场时间",
            trigger: ["blur", "change"],
          },
        ],
        machineFactory: [
          {
            required: true,
            message: "必填设备厂家",
            trigger: ["blur", "change"],
          },
        ],
      },
      noRotate: false,
      checkAll: false,
      isIndeterminate: false,
      projectIdList: [],
    };
  },
  created() {
    getPageSysProject({ pageIndex: 1, pageSize: -1 }).then((res) => {
      this.projectIdList = this.handleProject(res.data.records);
    });
    //加载分页数据
    this.loadPageData();
  },
  mounted() {},
  methods: {
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.tempPL.cron;
      this.openCron = true;
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.tempPL.cron = value;
    },
    handleChange(list) {
      const checkNode = this.$refs.cascaderArr.getCheckedNodes();
      this.temp.projectName = checkNode[0].data.label;
      this.temp.projectId = checkNode[0].data.value;
    },
    handleProject(list) {
      if (list) {
        list.forEach((item) => {
          item["value"] = item.proId;
          item["label"] = item.proName;
          if (item.children && item.children.length !== 0) {
            this.handleProject(item.children);
          } else {
            delete item.children;
          }
        });
        return list;
      }
    },
    handlePLNew(scope) {
      this.dialogFormVisiblePL = true;
      this.commentSetTitle = "喷淋设置";
      this.tempPL = {
        deviceId: scope.row.id,
        cron: "",
        delay: 0,
        // 设备类型 0 扬尘检测、1 喷淋设备
        deviceType: 0,
        taskType: 0,
        unit: "s",
        sprayPeriod: 30,
        machineNum: scope.row.machineNum,
        machineNumber: scope.row.machineNumber,
      };

      this.$nextTick(() => {
        this.$refs["dataFormPL"].clearValidate();
      });
    },
    PMSet() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: "请先选中",
          type: "warning",
        });
        return;
      } else {
        this.dialogFormVisiblePL = true;
        this.commentSetTitle = "PM浓度比例设置";

        this.tempPL = { machineNumbers: [], vesions: [] };
        let arr = [];
        let arr2 = [];
        this.multipleSelection.forEach((item) => {
          arr.push(item.machineNumber); // 设备编号集合
          arr2.push(item.vesion ? item.vesion : ""); // 版本号
          this.tempPL.machineNumbers.push(item.machineNumber);
          this.tempPL.vesions.push(item.vesion ? item.vesion : ""); // 版本号
        });
        this.tempPL.machineNumbersString = arr.join(";"); // // 设备编号集合
        this.tempPL.vesionsString = arr2.join(";"); // // 设备编号集合

        // 操作
        this.$nextTick(() => {
          this.$refs["dataFormPL"].clearValidate();
        });
      }
    },
    yuZhiSet() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: "请先选中",
          type: "warning",
        });
        return;
      } else {
        this.dialogFormVisiblePL = true;
        this.commentSetTitle = "阈值设置";
        this.tempPL = { machineNumbers: [], vesions: [], types: [] };
        let arr = [];
        let arr2 = [];
        let arr3 = [];
        this.multipleSelection.forEach((item) => {
          arr.push(item.machineNumber); // 设备编号集合
          arr2.push(item.vesion ? item.vesion : ""); // 版本号

          arr3.push(item.type ? item.type : ""); // 厂家及设备类型

          this.tempPL.machineNumbers.push(item.machineNumber);
          this.tempPL.vesions.push(item.vesion ? item.vesion : ""); // 版本号
          this.tempPL.types.push(item.type ? item.type : ""); // 版本号
        });
        this.tempPL.machineNumbersString = arr.join(";"); // // 设备编号集合
        this.tempPL.vesionsString = arr2.join(";"); // // 设备编号集合
        this.tempPL.typesString = arr2.join(";"); // // 设备编号集合

        // 操作
        this.$nextTick(() => {
          this.$refs["dataFormPL"].clearValidate();
        });
      }
    },
    handleshowerState(showerState) {
      let name = null;
          if (num == 0) {
        name = "喷淋空闲";
      }
      if (num == 1) {
        name = "平台开启喷淋中";
      }
      if (num == 2) {
        name = "扬尘超标喷淋中";
      }
      if (num == 3) {
        name = "喷淋间歇中";
      }
      return name;
    },
    lookOneInfo(scope) {
      this.loadingLook = true;
      this.dialogFormVisibleOneLook = true;
      lookOneInfoYCJC({ id: scope.row.id })
        .then((res) => {
          console.log("主键查询扬尘监测预警值设置表", res);
          this.dialogFormVisibleOneLook = true;
          if (res.data) {
            this.tempPL = {...res.data,...scope.row};

            console.log(989, this.tempPL);
            let sensor =
              "湿度传感器状态 : " +
              (this.tempPL.humiditySensor == 0
                ? "未安装"
                : this.tempPL.humiditySensor == 1
                ? "安装"
                : "") +
              " ; " +
              "噪音传感器状态 : " +
              (this.tempPL.noiseSensor == 0
                ? "未安装"
                : this.tempPL.noiseSensor == 1
                ? "安装"
                : "") +
              " ; " +
              "pm10传感器状态 : " +
              (this.tempPL.pm10Sensor == 0
                ? "未安装"
                : this.tempPL.pm10Sensor == 1
                ? "安装"
                : "") +
              " ; " +
              "pm2传感器状态 : " +
              (this.tempPL.pm2Sensor == 0
                ? "未安装"
                : this.tempPL.pm2Sensor == 1
                ? "安装"
                : "") +
              " ; " +
              "风速传感器状态 : " +
              (this.tempPL.speedSensor == 0
                ? "未安装"
                : this.tempPL.speedSensor == 1
                ? "安装"
                : "") +
              " ; " +
              "温度传感器状态 : " +
              (this.tempPL.tempSensor == 0
                ? "未安装"
                : this.tempPL.tempSensor == 1
                ? "安装"
                : "") +
              " ; " +
              "风向传感器状态 : " +
              (this.tempPL.windDirectionSensor == 0
                ? "未安装"
                : this.tempPL.windDirectionSensor == 1
                ? "安装"
                : "");
            this.tempPL.sensor = sensor;
            this.loadingLook = false;
            console.log('this.tempPL',this.tempPL)
          } else {
            this.tempPL = {};
            this.loadingLook = false;
          }
        })
        .catch((error) => {
          this.loadingLook = false;
        });
    },
    upDataPL(name) {
      if (name == "喷淋设置") {
        this.$refs["dataFormPL"].validate((valid) => {
          if (valid) {
            dustSprayStatusControlYCJC(this.tempPL)
              .then((response) => {
                if (response.code == "success") {
                  this.dialogFormVisiblePL = false;
                  this.loadPageData();
                }
                this.$notify({
                  title: "操作提示",
                  message: response.msg,
                  type: response.code,
                  duration: 3000,
                });
              })
              .catch((err) => {
                console.log(err);
                this.errorMsg();
              });
          }
        });
      }

      if (name == "PM浓度比例设置") {
        this.$refs["dataFormPL"].validate((valid) => {
          if (valid) {
            dustPMConcentration(this.tempPL)
              .then((response) => {
                if (response.code == "success") {
                  this.dialogFormVisiblePL = false;
                  this.loadPageData();
                }
                this.$notify({
                  title: "操作提示",
                  message: response.msg,
                  type: response.code,
                  duration: 2000,
                });
              })
              .catch((err) => {
                console.log(err);
                this.errorMsg();
              });
          }
        });
      }

      if (name == "阈值设置") {
        this.$refs["dataFormPL"].validate((valid) => {
          if (valid) {
            dustThresholdDataControl(this.tempPL)
              .then((response) => {
                if (response.code == "success") {
                  this.dialogFormVisiblePL = false;
                  this.loadPageData();
                }
                this.$notify({
                  title: "操作提示",
                  message: response.msg,
                  type: response.code,
                  duration: 2000,
                });
              })
              .catch((err) => {
                console.log(err);
                this.errorMsg();
              });
          }
        });
      }
    },
    handleCancelAlarm() {
      if (this.multipleSelection.length <= 0) {
        this.$message({
          message: "请先选中",
          type: "warning",
        });
        return;
      } else {
        //处理的接口
        console.log("this.multipleSelection", this.multipleSelection);
        let machineNumbers = [];
        this.multipleSelection.forEach((item) => {
          machineNumbers.push(item.machineNumber);
        });
        dustAlarmStatusControl({ machineNumbers: machineNumbers }).then(
          (res) => {
            if (res.code == "success") {
              this.$message({
                message: res.msg,
                type: "success",
              });
              // this.$refs.multipleTable.clearSelection();
            } else {
              this.$message.error("修改失败");
            }
          }
        );
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //删除单行
    deleteRow(index, rows) {
      let _this = this;
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await deleteTtYcjc(rows[index].id);
          if (res.code == "success") {
            if (rows.length == 1) {
              _this.listQuery.pageIndex =
                _this.listQuery.pageIndex - 1 > 0
                  ? _this.listQuery.pageIndex - 1
                  : 1;
              _this.loadPageData();
            } else {
              rows.splice(index, 1);
            }
          }
          this.$message({
            type: "success",
            message: res.msg,
          });
        })
        .catch((err) => {
          // this.errorMsg()
        });
    },
    //分页查询
    loadPageData() {
      this.dataLoading = true;
      getPageTtYcjc(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    //搜索
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.loadPageData();
    },

    //重置临时变量值
    resetTemp() {
      let that = this;
      this.temp = {};
    },
    //增加窗口弹出之前恢复默认值
    handleCreate() {
       if (
        !this.$store.getters.projectId ||
        this.$store.getters.projectChildrenIds.length > 0
      ) {
        this.$message({
          message: "请先选择具体项目再添加数据",
          type: "warning",
        });
        return;
      }
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //增加
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.createBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          addTtYcjc(param)
            .then((response) => {
              if (response.code == "success") {
                this.dialogFormVisible = false;
                this.loadPageData();
              }
              this.$notify({
                title: "操作提示",
                message: response.msg,
                type: response.code,
                duration: 2000,
              });
            })
            .catch((err) => {
              console.log(err);
              this.errorMsg();
            });
        }
      });
    },
    //修改
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.updateBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          updateTtYcjc(param).then((response) => {
            if (response.code == "success") {
              this.dialogFormVisible = false;
              this.loadPageData();
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 2000,
            });
          });
        }
      });
    },
    //弹出修改窗口之前，填充值
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogStatus = "update";
      this.temp = deepClone(scope.row);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    close() {
      this.imagecropperShow = false;
    },
    //错误提示
    errorMsg(msg) {
      if (!msg) msg = "服务器异常,稍后再试试";
      this.$notify({
        title: "操作提示",
        message: msg,
        type: "error",
        duration: 2000,
      });
    },
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getPageTtYcjc(this.listQuery).then((res) => {
        if (res.code == "success") {
          this.allTableData = res.data.records;
          console.log(this.allTableData);
          import("@/vendor/Export2Excel").then((excel) => {
            const tHeader = [];
            const filterVal = [];
            for (let column of self.columns) {
              tHeader.push(column.label);
              filterVal.push(column.field);
            }
            const data = this.formatJson(filterVal);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "列表",
            });
            this.downloadLoading = false;
          });
        } else {
          this.errorMsg("下载数据失败");
        }
      });
    },
    formatJson(filterVal) {
      return this.allTableData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            if (j == "machineState") {
              let name = "";
              if (v[j] == 0) {
                name = "在线";
              } else if (v[j] == 1) {
                name = "离线";
              } else {
                name = "";
              }
              return name;
            } else {
              return v[j];
            }
          }
        })
      );
    },
    // 点击控制按钮
    control(row) {
      console.log(row);
      if (row.registerReturnJson) {
        this.controlForm = this.$options.data().controlForm;
        this.registerReturnJson = JSON.parse(row.registerReturnJson);
        console.log(this.registerReturnJson);
        this.registerReturnJson.forEach((item) => {
          // 初始化设置表单值
          this.$set(this.controlForm, item.name, item.val);
          // 初始化设置表单效验
          this.$set(this.rules, item.name, [
            {
              required: true,
              message: `必填${item.desc}`,
              trigger: ["blur", "change"],
            },
          ]);
        });
        this.controlForm.id = row.id;
        this.dialogControlVisible = true;
        this.$nextTick(() => {
          this.$refs.dialogSettingForm.clearValidate();
        });
        return;
      }
      this.$message.warning("暂不可设置");
    },
    settingsBys() {
      let _this = this;
      this.$refs["dialogSettingForm"].validate((valid) => {
        if (valid) {
          // 组装数据
          this.registerReturnJson.forEach((item) => {
            item.val = this.controlForm[item.name];
          });
          machineRegisterycjc(
            { list: this.registerReturnJson },
            this.controlForm.id
          )
            .then((res) => {
              if (res.code == "success") {
                this.$message.success("设置成功！");
                // 关闭页面，刷新数据
                this.dialogControlVisible = false;
                _this.loadPageData();
              }
            })
            .catch((res) => {
              this.$message.error("设置失败！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 锁机按钮
    lockYcjc(row) {
      this.$confirm("此操作将该设备锁机, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          lockYcjc(row.id)
            .then((res) => {
              if (res.code == "success") {
                this.$message.success("锁机成功");
              }
            })
            .catch((error) => {
              this.$message.error("锁机失败");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消锁机",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 20px;
}
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
.el-icon-male {
  color: #42b983;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-female {
  color: palevioletred;
  font-size: 20px;
  font-weight: bold;
}
.el-icon-question {
  color: rebeccapurple;
  font-size: 20px;
  font-weight: bold;
}
</style>
