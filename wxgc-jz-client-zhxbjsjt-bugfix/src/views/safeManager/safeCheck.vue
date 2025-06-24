<template>
  <div class="app-container">
    <!--搜索框-->
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.checkTime"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择检查时间"
      >
      </el-date-picker>
      <!-- <el-input
        v-model="listQuery.auditResult"
        placeholder="审核结果"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.chaosongPerson"
        placeholder="抄送人"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      /> -->

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
        v-if="daochuZhengGaiShow"
        v-waves
        :loading="downloadLoading2"
        class="filter-item"
        type="primary"
        plain
        icon="el-icon-download"
        @click="handleDownloadZhang2"
      >
        导出整改单
      </el-button>
    </div>

    <!-- 选显卡，显示 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审核" name="first"></el-tab-pane>
      <el-tab-pane label="已完成" name="second"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="third"></el-tab-pane>
    </el-tabs>
    <div class="tablebox">
      <!--显示列表-->
      <el-table
        :data="tableData"
        v-loading="dataLoading"
        row-key="id"
        height="100%"
        stripe
        fit
        highlight-current-row
        @selection-change="changeCheckBoxValue"
      >
        <el-table-column min-width="140" type="selection"></el-table-column>
        <el-table-column prop="projectName" label="项目名称" align="center">
        </el-table-column>
        <el-table-column prop="problemType" label="问题类型" align="center">
        </el-table-column>
        <el-table-column prop="checkPerson" label="检查人" align="center">
        </el-table-column>
        <el-table-column prop="checkTime" label="检查时间" align="center">
        </el-table-column>
        <el-table-column
          prop="rectificationPerson"
          label="整改人"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="rectificationTimelimit"
          label="整改时限"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="auditResult" label="审核结果" align="center">
        </el-table-column>
        <!-- <el-table-column prop="problemDescribe" label="问题描述" align="center">
        </el-table-column>

        <el-table-column prop="createBy" label="创建人" align="center">
        </el-table-column> -->

        <!-- <el-table-column
          prop="rectificationRequirement"
          label="整改措施"
          align="center"
        >
        </el-table-column>



        <el-table-column
          prop="exportStaus"
          label="整改单导出状态"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.exportStaus == null || scope.row.exportStaus == 0
                ? "未导出过"
                : "导出过"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="replyStatus"
          label="是否回复"
          align="center"
          width="130"
        >
          <template slot-scope="scope">
            <el-dropdown
              size="mini"
              split-button
              :type="scope.row.replyStatus == 0 ? 'info' : 'success'"
              @command="handleCommand($event, scope.row)"
              >{{ scope.row.replyStatus == 0 ? "未回复" : "已回复" }}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">未回复</el-dropdown-item>
                <el-dropdown-item command="1">已回复</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column> -->

        <el-table-column fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="
                ($store.state.user.realName == scope.row.rectificationPerson &&
                  scope.row.auditResult != '同意' &&
                  scope.row.auditResult != '拒绝' &&
                  scope.row.auditResult == '待整改') ||
                scope.row.auditResult == '重写' && $store.state.user.realName == scope.row.rectificationPerson
              "
              size="mini"
              @click.stop="rectification(scope.row)"
            >整改
            </el-button>
            <el-button
              v-if="
                $store.state.user.realName == scope.row.reviewPerson &&
                scope.row.auditResult != '同意' &&
                scope.row.auditResult != '拒绝' &&
                scope.row.auditResult == '已整改'
              "
              size="mini"
              @click.native.prevent="handleEdit(scope)"
            >审批
            </el-button>
            <el-button size="mini" @click.native.prevent="handlelook(scope.row)"
            >查看
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <!-- 导出整改单的弹框 -->
    <el-dialog
      title="整改单填写"
      :visible.sync="daochuBoxshow"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataFormZhengGai"
        :rules="rules2"
        :model="temp2"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="整改单编号" prop="text">
                <el-input
                  v-model="temp2.text"
                  placeholder="请输入整改单编号"
                  type="text"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="zhengGaiDanCancel">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          :loading="confirmLoading"
          @click="zhengGaiDan"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 添加的弹出层 -->
    <el-dialog
      title="新增安全检查"
      :visible.sync="newSafetyInfoShow"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataForm"
        :rules="safetyRules"
        :model="safetyTemp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="问题部位">
                <el-input
                  v-model="safetyTemp.problemArea"

                />
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-select
                  filterable
                  allow-create
                  default-first-option
                  v-model="safetyTemp.problemType"

                >
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="影响级别" prop="influenceLevel">
                <el-select
                  v-model="safetyTemp.influenceLevel"

                >
                  <el-option
                    v-for="item in hiddenDangerLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="问题描述">
                <el-input
                  type="textarea"

                  v-model="safetyTemp.problemDescribe"
                  maxlength="255"
                  show-word-limit
                  :autosize="{ minRows: 2, maxRows: 10 }"
                >
                </el-input>
              </el-form-item>

              <el-form-item label="问题图片">
                <upload-file
                  file-type="jpg/png"
                  ref="clearDataUpload5"
                  multiple
                  list-type="picture"
                  accept="image/*"
                  max-size="20"
                  limit="1"
                  @change="getFile"
                />
              </el-form-item>
              <el-form-item label="整改人" prop="rectificationPerson">
                <el-select
                  v-model="safetyTemp.rectificationPerson"
                  value-key="id"
                  filterable
                  clearable

                  @change="handleSelectZGR"
                >
                  <el-option
                    v-for="item in rectificationPersonArr"
                    :key="item.id"
                    :label="item.realname"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                  v-model="safetyTemp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"

                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="复查人" prop="reviewPerson">
                <el-select
                  @focus="getFuChaRen2"
                  v-model="safetyTemp.reviewPerson"

                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in restaurants2"
                    :key="item.id"
                    :label="item.realname"
                    :value="item.realname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-select
                  @focus="getFuChaRen2"
                  v-model="safetyTemp.chaosongPerson"

                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in restaurants2"
                    :key="item.id"
                    :label="item.realname"
                    :value="item.realname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary" @click="safeCheckAdd()">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
    <!--查看的弹出层 审批-->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeAddInfo"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataFormLook"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="问题部位" prop="problemArea">
                <el-input
                  v-model="temp.problemArea"

                  disabled
                />
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input
                  v-model="temp.problemType"

                  disabled
                />
              </el-form-item>

              <el-form-item label="影响级别" prop="influenceLevel">
                <el-select
                  v-model="temp.influenceLevel"

                  disabled
                >
                  <el-option
                    v-for="item in influenceLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  disabled
                  v-model="temp.problemDescribe"

                  type="textarea"
                  maxlength="255"
                  show-word-limit
                  :autosize="{ minRows: 2, maxRows: 10 }"
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe">
                <el-image
                  v-if="temp.filePath1"
                  style="height: 80px; width: 80px; margin-right: 5px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath1]"
                >
                </el-image>
              </el-form-item>
              <el-form-item label="整改人" prop="rectificationPerson">
                <el-input
                  disabled
                  v-model="temp.rectificationPerson"

                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  disabled
                  v-model="temp.rectificationMeasures"

                />
              </el-form-item>

              <el-form-item label="整改图片" prop="problemDescribe">
                <el-image
                  v-if="temp.filePath2"
                  style="height: 50px; width: 50px; margin-right: 5px"
                  :src="temp.filePath2"
                  :preview-src-list="[temp.filePath2]"
                >
                </el-image>
              </el-form-item>
              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                  disabled
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"

                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="复查图片" prop="problemDescribe">
                <upload-file
                  file-type="jpg/png"
                  ref="clearDataUpload2"
                  multiple
                  list-type="picture"
                  accept="image/*"
                  max-size="20"
                  limit="1"
                  @change="getreview"
                />
              </el-form-item>

              <el-form-item label="复查意见" prop="reviewResult">
                <el-input v-model="temp.reviewResult"/>
              </el-form-item>
              <!-- <el-form-item label="审核结果" prop="auditResult">
                <el-input
                  v-model="temp.auditResult"
                  placeholder="审核结果"
                  disabled
                />
              </el-form-item> -->
              <!-- <el-form-item label="审核人" prop="auditPerson">
                <el-input v-model="temp.checkPerson" placeholder="审核人" />
              </el-form-item> -->
              <!--            <el-form-item label="现场图片路径" prop="sencePicturePath">-->
              <!--              <el-input v-model="temp.sencePicturePath" placeholder="现场图片路径" />-->
              <!--            </el-form-item>-->
              <!-- <el-form-item label="备注" prop="remark">
                <el-input v-model="temp.remark" placeholder="备注" />
              </el-form-item> -->
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input
                  v-model="temp.reviewPerson"

                  disabled
                />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input
                  v-model="temp.chaosongPerson"

                  disabled
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="agree"> 同意</el-button>
        <el-button @click="refuse"> 拒绝</el-button>
        <el-button @click="reject"> 驳回</el-button>
        <el-button @click="cancelAgree"> 取消</el-button>

      </div>
    </el-dialog>
    <!-- 查看弹出层 -->
    <el-dialog
      title="查看表单"
      :visible.sync="lookdialogFormVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataFormLook"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="问题部位" prop="problemArea">
                <el-input
                  v-model="temp.problemArea"

                  disabled
                />
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input
                  v-model="temp.problemType"

                  disabled
                />
              </el-form-item>

              <el-form-item label="影响级别" prop="influenceLevel">
                <el-select
                  v-model="temp.influenceLevel"

                  disabled
                >
                  <el-option
                    v-for="item in influenceLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  disabled
                  v-model="temp.problemDescribe"

                  type="textarea"
                  maxlength="255"
                  show-word-limit
                  :autosize="{ minRows: 2, maxRows: 10 }"
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe">
                <el-image
                  v-if="temp.filePath1"
                  style="height: 80px; width: 80px; margin-right: 5px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath1]"
                >
                </el-image>
              </el-form-item>
              <el-form-item label="整改人" prop="rectificationPerson">
                <el-input
                  disabled
                  v-model="temp.rectificationPerson"

                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  disabled
                  v-model="temp.rectificationMeasures"

                />
              </el-form-item>

              <el-form-item label="整改图片" prop="problemDescribe">
                <el-image
                  v-if="temp.filePath2"
                  style="height: 50px; width: 50px; margin-right: 5px"
                  :src="temp.filePath2"
                  :preview-src-list="[temp.filePath2]"
                >
                </el-image>
              </el-form-item>
              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                  disabled
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"

                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="复查图片" prop="problemDescribe">
                <el-image
                  v-if="temp.filePath3"
                  style="height: 50px; width: 50px; margin-right: 5px"
                  :src="temp.filePath3"
                  :preview-src-list="[temp.filePath3]"
                >
                </el-image>
              </el-form-item>

              <el-form-item label="复查意见" prop="reviewResult">
                <el-input
                  disabled
                  v-model="temp.reviewResult"

                />
              </el-form-item>
              <!-- <el-form-item label="审核结果" prop="auditResult">
                <el-input
                  v-model="temp.auditResult"
                  placeholder="审核结果"
                  disabled
                />
              </el-form-item> -->
              <!-- <el-form-item label="审核人" prop="auditPerson">
                <el-input v-model="temp.checkPerson" placeholder="审核人" />
              </el-form-item> -->
              <!--            <el-form-item label="现场图片路径" prop="sencePicturePath">-->
              <!--              <el-input v-model="temp.sencePicturePath" placeholder="现场图片路径" />-->
              <!--            </el-form-item>-->
              <!-- <el-form-item label="备注" prop="remark">
                <el-input v-model="temp.remark" placeholder="备注" />
              </el-form-item> -->
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input
                  v-model="temp.reviewPerson"

                  disabled
                />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input
                  v-model="temp.chaosongPerson"

                  disabled
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">

      </div>
    </el-dialog>
    <!-- 查看弹窗 编辑 -->
    <el-dialog
      title="整改表单"
      :visible.sync="editwindow"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
    >
      <el-form
        ref="dataFormedit"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="120px"
        style="margin-left: 5px"
      >
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="问题部位" prop="problemArea">
                <el-input
                  v-model="temp.problemArea"

                  disabled
                />
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input
                  v-model="temp.problemType"

                  disabled
                />
              </el-form-item>

              <el-form-item label="影响级别" prop="influenceLevel">
                <el-select
                  v-model="temp.influenceLevel"

                  disabled
                >
                  <el-option
                    v-for="item in influenceLevel"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="问题描述" prop="problemDescribe">
                <el-input
                  disabled
                  v-model="temp.problemDescribe"

                  type="textarea"
                  maxlength="255"
                  show-word-limit
                  :autosize="{ minRows: 2, maxRows: 10 }"
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe">
                <el-image
                  v-if="temp.filePath1"
                  style="height: 80px; width: 80px; margin-right: 5px"
                  :src="temp.filePath1"
                  :preview-src-list="[temp.filePath1]"
                >
                </el-image>
              </el-form-item>
              <el-form-item label="整改人" prop="rectificationPerson">
                <el-input
                  disabled
                  v-model="temp.rectificationPerson"

                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  v-model="temp.rectificationMeasures"

                />
              </el-form-item>

              <el-form-item label="整改图片" prop="problemDescribe">
                <upload-file
                  file-type="jpg/png"
                  ref="clearDataUpload"
                  multiple
                  list-type="picture"
                  accept="image/*"
                  max-size="20"
                  limit="1"
                  @change="getRectification"
                />
              </el-form-item>
              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                  disabled
                  v-model="temp.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"

                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="复查图片" prop="problemDescribe">
                <el-image
                  v-if="temp.filePath3"
                  style="height: 50px; width: 50px; margin-right: 5px"
                  :src="temp.filePath3"
                  :preview-src-list="[temp.filePath3]"
                >
                </el-image>
              </el-form-item>

              <el-form-item label="复查意见" prop="reviewResult">
                <el-input
                  disabled
                  v-model="temp.reviewResult"

                />
              </el-form-item>
              <!-- <el-form-item label="审核结果" prop="auditResult">
                <el-input
                  v-model="temp.auditResult"
                  placeholder="审核结果"
                  disabled
                />
              </el-form-item> -->
              <!-- <el-form-item label="审核人" prop="auditPerson">
                <el-input v-model="temp.checkPerson" placeholder="审核人" />
              </el-form-item> -->
              <!--            <el-form-item label="现场图片路径" prop="sencePicturePath">-->
              <!--              <el-input v-model="temp.sencePicturePath" placeholder="现场图片路径" />-->
              <!--            </el-form-item>-->
              <!-- <el-form-item label="备注" prop="remark">
                <el-input v-model="temp.remark" placeholder="备注" />
              </el-form-item> -->
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input
                  v-model="temp.reviewPerson"

                  disabled
                />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input
                  v-model="temp.chaosongPerson"

                  disabled
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button type="primary" @click="updateData()">
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {simpleUploadsReturnTtFile} from "@/views/sysproject/api/ttfile";
import uploadFile from "@/components/Upload/uploadFile";
import {exportDocx} from "@/api/docx";

import {
  getPageTtQualitysafeManager,
  getAllTtQualitysafeManager,
  addTtQualitysafeManager,
  updateTtQualitysafeManager,
  deleteTtQualitysafeManager,
  selectProblemList,
  getPerson,
  problemAdd,
  addItem,
  updataItem,
  changeReplyState,
  zhanggaiDanBianHao,
} from ".././qualityManager/api/ttQualitysafeManager.js";
import {deepClone, parseTime} from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
export default {
  name: "safeCheck",
  components: {Pagination, uploadFile},
  data() {
    return {
      //

      //
      lookdialogFormVisible: false,
      editwindow: false,
      confirmLoading: false,
      loading: null,
      filePath3: "",
      filePath2: "",
      rectificationPersonArr: [],
      fileList: [],
      fileListObject: {
        fileList1: [], //  放图片,
        fileList2: [], //放音频
      },
      newSafetyInfoShow: false,
      activeName: "first",
      daochuBoxshow: false,
      selectoptions: [],
      influenceLevel: [{value: "一般"}, {value: "严重"}, {value: "紧急"}],
      hiddenDangerLevel: [
        {value: "一般"},
        {value: "严重"},
        {value: "紧急"},
      ],
      tableData: [], //当前分页数据
      allTableData: [], //所有表格数据，下载时候回加载
      //表头（主要是下载excel时候使用）
      columns: [
        // { label: "检查部门", field: "department" },
        {label: "项目名称", field: "projectName"},
        {label: "问题类型", field: "problemType"},
        {label: "检查人", field: "checkPerson"},
        {label: "检查时间", field: "checkTime"},
        {label: "整改人", field: "rectificationPerson"},
        {label: "整改时限", field: "rectificationTimelimit"},
        {label: "审核结果", field: "auditResult"},
        // { label: "影响级别", field: "influenceLevel" },
        // // {label: "隐患级别", field: "influenceLevel"},
        // { label: "问题描述", field: "problemDescribe" },
        // { label: "创建人", field: "createBy" },

        // { label: "整改措施", field: "rectificationRequirement" },

        // // {label: "审核结果", field: "auditResult"},
        // { label: "整改单导出状态", field: "exportStaus" },

        // { label: "是否回复", field: "replyStatus" },
      ],
      restaurants: [],
      safetyTemp: {
        audioUrl: "", //录音地址
        problemType: "", //问题分类
        problemArea: "", //问题部位
        httpFilePath: [], //现场图片路径,在文件上传成功后会返回路径
        problemDescribe: "", //问题描述
        rectificationRequirement: "",
        rectificationPerson: "", //整改人  （英文）
        rectificationPersonRealname: "", //  整改人(汉字)
        subcontractors: "", //分包单位
        influenceLevel: "一般", //影响级别
        rectificationTimelimit: "", //整改时限
        reviewPerson: "", //复查人(名字用逗号隔开) （英文）
        reviewPersonRealname: "", //复查人    (汉字))
        chaosongPerson: "", //抄送人(名字用逗号隔开) （英文）
        chaosongPersonRealname: "", // 抄送人 (汉子)
        // createTime:  new Date(),//创建时间
        status: 1,
        createBy: "", //创建人,取登录人
        dataType: 1, //0质量1安全
        department: "", //检查部门
        sysUserId: "", //整改人id
        checkPerson: "", //检查人
        reviewResult: "", //复查意见
        auditResult: "",
        rectificationMeasures: "",
      },
      safetyRules: {
        problemType: [
          {
            required: true,
            message: "必填问题分类",
            trigger: ["blur", "change"],
          },
        ],
        department: [
          {
            required: true,
            message: "必填检查部门",
            trigger: ["blur", "change"],
          },
        ],
        rectificationPerson: [
          {
            required: true,
            message: "必填整改人",
            trigger: ["blur", "change"],
          },
        ],
        influenceLevel: [
          {
            required: true,
            message: "必填影响级别",
            trigger: ["blur", "change"],
          },
        ],
        rectificationTimelimit: [
          {
            required: true,
            message: "必填整改时限",
            trigger: ["blur", "change"],
          },
        ],
        reviewPerson: [
          {
            required: true,
            message: "必填复查人",
            trigger: ["blur", "change"],
          },
        ],
      },
      dataLoading: false,
      total: 0,
      listQuery: {
        //搜索条件
        pageIndex: 1,
        pageSize: 10,
        dataType: 1, //安全为1
        status: 1, //1 待审核 a 2 是已完成   3是 已拒绝
        checkTime: undefined,
        checkPerson: undefined,
        auditResult: undefined,
        auditPerson: undefined,
        chaosongPerson: undefined,
        value: "", //项目名字
        name: "",
      },
      downloadLoading: false,
      downloadLoading2: false,
      daochuZhengGaiShow: false,
      textMap: {
        update: "编辑",
        create: "新增",
        look: "审批",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      types: [],
      temp: {
        filePath2: null,
        managerId: null,
        checkTime: null,
        checkPerson: null,
        problemArea: null,
        problemType: null,
        problemLevel: null,
        influenceLevel: null,
        hiddenDangerLevel: null,
        problemDescribe: null,
        subcontractors: null,
        rectificationPerson: null,
        rectificationRequirement: null,
        rectificationTimelimit: null,
        projectId: null,
        reviewTime: null,
        reviewOverTime: null,
        auditResult: null,
        auditPerson: null,
        hasDel: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        dataType: 1,
        status: 2,
        sencePicturePath: null,
        remark: null,
        reviewPerson: null,
        chaosongPerson: null,
        reviewPersonAll: null,

        ssManagerUser: [
          {
            filePath1: "",
            filePath2: "",
            filePath3: "",
            filePath4: "",
            filePath5: "",
            filePath6: "",
            filePath7: "",
            filePath8: "",
            filePath9: "",
          },
          {
            filePath1: "",
            filePath2: "",
            filePath3: "",
            filePath4: "",
            filePath5: "",
            filePath6: "",
            filePath7: "",
            filePath8: "",
            filePath9: "",
          },
        ],
      },

      newTempImageUrl0: {},
      newTempImageUrl1: {},
      temp2: {
        text: null,
      },
      rules2: {
        text: [
          // { required:  true , message: '必填内容', trigger: ['blur', 'change'] },
          {required: true, message: "不能为空,不能含有中文或特殊字符"},

          {
            pattern: /^[a-zA-Z0-9_]{0,}$/,
            message: "不能含有中文或特殊字符",
            trigger: ["blur", "change"],
          },
        ],
      },
      changeCheckBoxValueInfo: [],
      rules: {
        //校验功能
        checkTime: [
          {
            required: true,
            message: "必填检查时间",
            trigger: ["blur", "change"],
          },
        ],
        checkPerson: [
          {
            required: true,
            message: "必填检查人",
            trigger: ["blur", "change"],
          },
        ],
        // problemArea: [
        //   {
        //     required: true,
        //     message: "必填问题部位",
        //     trigger: ["blur", "change"],
        //   },
        // ],
        // problemType: [
        //   { required:  true , message: '必填问题类型', trigger: ['blur', 'change'] },
        // ],
        // problemLevel: [
        //   { required:  true , message: '必填问题级别', trigger: ['blur', 'change'] },
        // ],
        influenceLevel: [
          {
            required: true,
            message: "必填影响级别",
            trigger: ["blur", "change"],
          },
        ],
        hiddenDangerLevel: [
          {
            required: true,
            message: "必填隐患级别",
            trigger: ["blur", "change"],
          },
        ],
      },
      restaurants2: [],
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
  },
  mounted() {
    console.log("当前",);
  },

  methods: {
    cancelAdd() {
      this.newSafetyInfoShow = false;
      this.fileListObject.fileList1 = 0;
      this.$refs.clearDataUpload5.clearData();
    },
    cancelUpdate(){
      this.editwindow = false;
      this.temp.filePath2 = '';
      this.$refs.clearDataUpload.clearData();
    },
    cancelAgree(){
      this.dialogFormVisible = false;
      this.temp.filePath3 = '';
      this.$refs.clearDataUpload2.clearData();
    },
    getRectification(file, fileList, limitType) {

      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
        console.log("this.temp.filePath2", fileList[i].raw);
      }
      this.temp.filePath2 = fd;
    },
    getreview(file, fileList, limitType) {
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
        console.log(55555, fileList[i].raw);
      }
      this.temp.filePath3 = fd;
    },
    handlelook(val) {
      this.lookdialogFormVisible = true;
      this.temp = val;
    },
    rectification(val) {
      this.editwindow = true;
      this.temp = val;
    },

    // 同意流程
    agree() {
      if (this.temp.filePath3 && typeof this.temp.filePath3 == 'object') {
        simpleUploadsReturnTtFile(this.temp.filePath3).then((res) => {
          this.filePath3 = res[0].filePath;
          let option = {
            name: this.temp.reviewPerson,
            status: 2,
            managerId: this.temp.managerId,
            reviewResult: this.temp.reviewResult,
            reviewPicture: this.filePath3,
          };
          updataItem(option).then((res) => {
            if (res.code == "success") {
              this.$message({
                message: "已同意",
                type: "success",
              });
              this.dialogFormVisible = false;
              this.$refs.clearDataUpload2.clearData();
              this.loadPageData();
            }
          });
        });
      } else {
        let option = {
          name: this.temp.reviewPerson,
          status: 2,
          managerId: this.temp.managerId,
          reviewResult: this.temp.reviewResult,
          reviewPicture: "",
        };

        updataItem(option).then((res) => {
          if (res.code == "success") {
            this.$message({
              message: "已同意",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.$refs.clearDataUpload2.clearData();
            this.loadPageData();
          }
        });
      }

    },
    refuse() {
      if (this.temp.filePath3 && typeof this.temp.filePath3 == 'object') {
        simpleUploadsReturnTtFile(this.temp.filePath3).then((res) => {
          this.filePath3 = res[0].filePath;

          let option = {
            name: this.temp.reviewPerson,
            status: 3,
            managerId: this.temp.managerId,
            reviewResult: this.temp.reviewResult,
            reviewPicture: this.filePath3,
          };

          updataItem(option).then((res) => {
            if (res.code == "success") {
              this.$message({
                message: "已拒绝",
                type: "success",
              });
              this.dialogFormVisible = false;
              this.$refs.clearDataUpload2.clearData();
              this.loadPageData();
            }
          });
        });
      } else {
        let option = {
          name: this.temp.reviewPerson,
          status: 3,
          managerId: this.temp.managerId,
          reviewResult: this.temp.reviewResult,
          reviewPicture: "",
        };

        updataItem(option).then((res) => {
          if (res.code == "success") {
            this.$message({
              message: "已拒绝",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.$refs.clearDataUpload2.clearData();
            this.loadPageData();
          }
        });
      }
    },
    reject() {
      if (this.temp.filePath3 && typeof this.temp.filePath3 == 'object') {
        simpleUploadsReturnTtFile(this.temp.filePath3).then((res) => {
          this.filePath3 = res[0].filePath;

          let option = {
            name: this.temp.reviewPerson,
            status: 1,
            managerId: this.temp.managerId,
            reviewResult: this.temp.reviewResult,
            reviewPicture: this.filePath3,
          };

          updataItem(option).then((res) => {
            if (res.code == "success") {
              this.$message({
                message: "已驳回",
                type: "success",
              });
              this.dialogFormVisible = false;
              this.$refs.clearDataUpload2.clearData();
              this.loadPageData();
            }
          });
        });
      } else {
        let option = {
          name: this.temp.reviewPerson,
          status: 1,
          managerId: this.temp.managerId,
          reviewResult: this.temp.reviewResult,
          reviewPicture: "",
        };
        console.log(1111, option);
        updataItem(option).then((res) => {
          if (res.code == "success") {
            this.$message({
              message: "已驳回",
              type: "success",
            });
            this.dialogFormVisible = false;
            this.$refs.clearDataUpload2.clearData();
            this.loadPageData();
          }
        });
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter((item) => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    handleCommand(command, row) {
      changeReplyState({replyStatus: command, managerId: row.managerId}).then(
        (res) => {
          if (res.code == "success") {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.$message.error("修改失败");
          }
          //加载分页数据
          this.loadPageData();
        }
      );
    },
    // 添加类容 ///
    safeCheckAdd() {
      var _this = this;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          _this.loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          _this.safetyTemp.checkPerson = this.$store.state.user.realName;
          if (_this.fileListObject.fileList1 == 0 ? false : _this.fileListObject.fileList1.get("fileList")) {
            //传了图片
            simpleUploadsReturnTtFile(_this.fileListObject.fileList1).then(
              (res) => {
                console.log(1265, res);
                for (var i = 0; i < res.length; i++) {
                  _this.safetyTemp.httpFilePath.push(res[i].filePath);
                }
                if (
                  _this.fileListObject.fileList2 == 0
                    ? false
                    : _this.fileListObject.fileList2.get("fileList")
                ) {
                  simpleUploadsReturnTtFile(
                    _this.fileListObject.fileList2
                  ).then((res) => {
                    _this.safetyTemp.audioUrl = res[0].filePath;
                    _this.addListSubmit();
                  });
                } else {
                  _this.addListSubmit();
                }
              }
            );
          } else {
            // 没传图片
            if (
              _this.fileListObject.fileList2 == 0
                ? false
                : _this.fileListObject.fileList2.get("fileList")
            ) {
              simpleUploadsReturnTtFile(_this.fileListObject.fileList2).then(
                (res) => {
                  console.log(1296, res);
                  _this.safetyTemp.audioUrl = res[0].filePath;
                  console.log(1298, _this.safetyTemp.audioUrl);
                  _this.addListSubmit();
                }
              );
            } else {
              _this.addListSubmit();
            }
          }
        }
      });
    },
    addListSubmit() {
      var _this = this;
      //问题分类添加
      let prop = 1; //1 是安全 0 是质量
      var aa = this.restaurants.some(function (item) {
        //true 有相同的， false 都不同
        return item.name == _this.safetyTemp.problemType;
      });
      if (!aa) {
        let data = {
          name: this.safetyTemp.problemType,
          type: prop,
        };
        problemAdd(data).then((res) => {
        });
      }
      this.safetyTemp.createBy = this.$store.getters.realName;
      addItem(this.safetyTemp).then((res) => {
        _this.loading.close();
        this.newSafetyInfoShow = false;
        this.clearSafetyTempInfo();
        this.loadPageData();
        this.$refs.clearDataUpload5.clearData();
        this.$nextTick(() => {
          this.$refs.clearDataUpload.clearData();
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    clearSafetyTempInfo() {
      (this.fileListObject = {
        fileList1: [], //  放图片,
        fileList2: [], //放音频
      }),
        (this.safetyTemp = {
          audioUrl: "", //录音地址
          problemType: "", //问题分类
          problemArea: "", //问题部位
          httpFilePath: [], //现场图片路径,在文件上传成功后会返回路径
          problemDescribe: "", //问题描述
          rectificationRequirement: "",
          rectificationPerson: "", //整改人  （英文）
          rectificationPersonRealname: "", //  整改人(汉字)

          subcontractors: "", //分包单位
          influenceLevel: "一般", //影响级别
          rectificationTimelimit: "", //整改时限
          reviewPerson: "", //复查人(名字用逗号隔开) （英文）
          reviewPersonRealname: "", //复查人    (汉字))

          chaosongPerson: "", //抄送人(名字用逗号隔开) （英文）
          chaosongPersonRealname: "", // 抄送人 (汉子)
          // createTime:  new Date(),//创建时间
          status: 1,
          createBy: "", //创建人,取登录人
          dataType: 1, //0质量1安全
          department: "", //检查部门
          sysUserId: "", //整改人id
          checkPerson: "", //检查人
        });
    },

    getFuChaRen2() {
      if (!this.safetyTemp.rectificationPerson) {
        this.$message({
          message: "请先选择整改人",
          type: "warning",
        });
        this.restaurants2 = [];
      } else {
        let fucharenData = [];
        // console.log(this.rectificationPersonArr);
        // console.log(this.safetyTemp.rolesStr);
        // for (var i = 0; i < this.rectificationPersonArr.length; i++) {
        //   if (
        //     this.rectificationPersonArr[i].rolesStr == this.safetyTemp.rolesStr
        //   ) {
        //     fucharenData.push(this.rectificationPersonArr[i]);
        //   }
        // }
        this.restaurants2 = JSON.parse(JSON.stringify(this.rectificationPersonArr));
      }
    },
    getFuChaRen() {
      var _this = this;
      // 请求整改人，复查然，查送人数据
      var obj = {
        pageIndex: 1,
        pageSize: 1000,
      };

      getPerson(obj).then((res) => {
        console.log("请求整改人", res);
        if (res.data.length > 0) {
          // 获取数据
          _this.restaurants2 = res.data;
          _this.rectificationPersonArr = res.data;
        }
      });
    },
    querySearch(queryString, cb) {
      // var restaurants = this.restaurants;
      var restaurants = this.restaurants;

      console.log(1026, this.restaurants);
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },

    //加载 问题分类 整改人，复查人，抄送人的数据
    loadAll() {
      var _this = this;
      let prop = 1; //1 是安全 0 质量
      selectProblemList(prop).then((res) => {
        console.log("问题分类", res);
        if (res.code == "success") {
          this.types = res.data.map((item) => {
            return {
              value: item.name,
            };
          });

          // 获取数据
          _this.restaurants = res.data;
        }
        console.log(111, this.types);
      });
    },
    handleSelectZGR(item) {
      this.safetyTemp.rectificationPerson = item.realname;
      this.safetyTemp.rolesStr = item.rolesStr;
      this.safetyTemp.sysUserId = item.id;
    },
    handleSelect(item) {
      this.restaurants = [];
    },

    handleClick(tab, event) {
      this.listQuery.pageIndex = 1;
      console.log(929, tab.index);
      if (tab.index == 0) {
        //待审核
        this.listQuery.status = 1;
      } else if (tab.index == 1) {
        //已完成
        this.listQuery.status = 2;
      } else if (tab.index == 2) {
        //已拒绝
        this.listQuery.status = 3;
      }
      this.loadPageData();
    },
    getFile(file, fileList, limitType) {
      this.fileList = [];
      this.fileListObject = {
        fileList1: [], //  放图片,
        fileList2: [], //放音频
      };
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
        console.log(55555, fileList[i].raw);
      }
      if (limitType == "mp3") {
        this.fileListObject.fileList2 = fd;
      } else {
        this.fileListObject.fileList1 = fd;
      }
    },

    // 添加类容结束 ///

    changeCheckBoxValue(val) {
      // 监听复选框的值
      this.changeCheckBoxValueInfo = val;
    },
    //删除单行
    deleteRow(index, rows) {
      this.$confirm("你确定要删除?", "系统警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          console.log(rows[index].managerId);
          let res = await deleteTtQualitysafeManager(rows[index].managerId);
          if (res.code == "success") {
            this.listQuery.pageIndex =
              this.listQuery.pageIndex > 1 ? this.listQuery.pageIndex - 1 : "1";
            this.loadPageData();
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
      getPageTtQualitysafeManager(this.listQuery)
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
    //下载Excel表格
    handleDownload() {
      this.downloadLoading = true;
      let self = this;
      getPageTtQualitysafeManager(this.listQuery).then((res) => {
        if (res.code == "success") {
          this.allTableData = res.data.records;
          this.allTableData.forEach((item) => {
            item.exportStaus =
              item.exportStaus == null || item.exportStaus == 0
                ? "未导出过"
                : "导出过";
            item.replyStatus = item.replyStatus == 0 ? "未回复" : "已回复";
          });
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
              filename: "安全检查",
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
            return v[j];
          }
        })
      );
    },
    //重置临时变量值
    resetTemp() {
      let that = this;
      this.fileList = [];
      this.temp = {
        managerId: null,
        checkTime: null,
        checkPerson: null,
        problemArea: null,
        problemType: null,
        problemLevel: null,
        influenceLevel: null,
        hiddenDangerLevel: null,
        problemDescribe: null,
        subcontractors: null,
        rectificationPerson: null,
        rectificationRequirement: null,
        rectificationTimelimit: null,
        projectId: null,
        reviewTime: null,
        reviewOverTime: null,
        auditResult: null,
        auditPerson: null,
        hasDel: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        dataType: 1,
        status: 2,
        sencePicturePath: null,
        remark: null,
        reviewPerson: null,
        chaosongPerson: null,
        reviewPersonAll: null,
        ssManagerUser: [
          {
            filePath1: "",
            filePath2: "",
            filePath3: "",
            filePath4: "",
            filePath5: "",
            filePath6: "",
            filePath7: "",
            filePath8: "",
            filePath9: "",
          },
          {
            filePath1: "",
            filePath2: "",
            filePath3: "",
            filePath4: "",
            filePath5: "",
            filePath6: "",
            filePath7: "",
            filePath8: "",
            filePath9: "",
          },
        ],
      };
    },
    //增加窗口弹出之前恢复默认值
    handleCreate() {
      // this.dialogStatus = "create";
      // this.dialogFormVisible = true;
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
      // 安全检查，问题分类
      this.loadAll();
      this.getFuChaRen();
      this.newSafetyInfoShow = true;
      this.$nextTick(() => {
        this.resetTemp();
      });
    },
    //增加
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.dataType = 1; //安全为1
          this.temp.createBy = this.$store.getters.name;
          let param = JSON.parse(JSON.stringify(this.temp));
          addTtQualitysafeManager(param)
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
      // this.temp.updateBy = this.$store.getters.name;
      // let param = JSON.parse(JSON.stringify(this.temp));
      if (this.temp.filePath2 && typeof this.temp.filePath2 == 'object') {
        simpleUploadsReturnTtFile(this.temp.filePath2).then((res) => {
          this.filePath2 = res[0].filePath
          let option = {
            managerId: this.temp.managerId,
            rectificationMeasures: this.temp.rectificationMeasures,
            rectificationPicture: this.filePath2,
            auditResult: this.temp.auditResult,
            status: this.temp.status,
          };
          updataItem(option).then((response) => {
            if (response.code == "success") {
              this.loadPageData();
              this.editwindow = false;
            }
            this.$notify({
              title: "操作提示",
              message: response.msg,
              type: response.code,
              duration: 2000,
            });


            this.$refs.clearDataUpload.clearData();
            this.editwindow = false;
          });
        });
      } else {

        let option = {
          managerId: this.temp.managerId,
          rectificationMeasures: this.temp.rectificationMeasures,
          rectificationPicture: this.filePath2,
          auditResult: this.temp.auditResult,
          status: this.temp.status,
        };
        updataItem(option).then((response) => {
          if (response.code == "success") {
            this.loadPageData();
            this.editwindow = false;
          }
          this.$notify({
            title: "操作提示",
            message: response.msg,
            type: response.code,
            duration: 2000,
          });


          this.$refs.clearDataUpload.clearData();
          this.editwindow = false;
        });
      }


    },
    //弹出修改窗口之前，填充值
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogStatus = "look";
      this.temp = this.$options.data().temp;
      let tempsss = deepClone(scope.row);
      let obj = deepClone(scope.row);
      if (obj.ssManagerUser && obj.ssManagerUser.length == 0) {
        tempsss.ssManagerUser[0] = this.temp.ssManagerUser[0];
        tempsss.ssManagerUser[1] = this.temp.ssManagerUser[1];
        this.temp = tempsss;
      } else if (obj.ssManagerUser && obj.ssManagerUser.length == 1) {
        tempsss.ssManagerUser[0] = obj.ssManagerUser[0];
        tempsss.ssManagerUser[1] = this.temp.ssManagerUser[1];
        this.temp = tempsss;
      } else {
        this.temp = tempsss;
      }
      this.newTempImageUrl0 = this.temp.ssManagerUser
        ? this.temp.ssManagerUser[0]
        : "";
      this.newTempImageUrl1 = this.temp.ssManagerUser
        ? this.temp.ssManagerUser[1]
        : "";

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

    //导出整改单 弹框
    handleDownloadZhang2() {
      this.temp2.text = "";
      this.daochuBoxshow = true;
    },
    // 取消整改单
    zhengGaiDanCancel() {
      this.daochuBoxshow = false;
      this.confirmLoading = false;
    },
    //导出整改单 导出
    zhengGaiDan() {
      this.confirmLoading = true;
      this.$refs["dataFormZhengGai"].validate((valid) => {
        if (valid) {
          let idsss = this.changeCheckBoxValueInfo.map((item) => {
            return item.managerId;
          });
          if (idsss.length <= 0) {
            this.confirmLoading = false;
            alert("请先选择要导出的内容");

            return;
          }

          let p = "&serialNumber=" + this.temp2.text;
          if (idsss != null && idsss.length > 0)
            for (let id of idsss) {
              p += "&ids=" + id;
            }
          let email = "&email=" + this.$store.state.user.email;
          //  window.location.href ="/wxgc/plus/word/test2?X-Wxgc-Token="+this.$store.getters.token+p;   //填地址
          window.location.href =
            process.env.VUE_APP_BASE_API +
            "/wxgc/plus/word/test2?X-Wxgc-Token=" +
            this.$store.getters.token +
            p +
            email;
          this.$message({message: "正在导出"});
          this.confirmLoading = false;
        } else {
          this.confirmLoading = false;
        }
      });
    },
    // 导出整改单的操作  （前端导出，存在问题）
    daochuZhengGaiDan() {
      return;
      let data = {
        echartUrl1: "",
        checkNumber: this.temp2.text,
        projectName: this.$store.state.project.projectName,
        table: this.changeCheckBoxValueInfo,
      };
      console.log(data);

      exportDocx("../../../assets/temp.docx", data, `脚本.docx`);
    },

    //添加的关闭回调
    closeAddInfo() {
      // (this.fileListObject = {
      //   fileList1: [], //  放图片,
      //   fileList2: [], //放音频
      // }),
      this.safetyTemp = {};
      console.log(2034, 'closeAddInfo')
      this.$refs.clearDataUpload.clearData();
      this.$refs.clearDataUpload2.clearData();
      this.$refs.clearDataUpload5.clearData();
      this.temp.filePath1 = '';
      this.temp.filePath2 = '';
      this.temp.filePath3 = '';
      this.temp.filePath4 = '';
      this.temp.filePath5 = '';
      this.temp.filePath6 = '';
      this.temp.filePath7 = '';
      this.temp.filePath8 = '';
      this.temp.filePath9 = '';
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  margin-top: 10vh !important;
}

::v-deep .el-dialog__body {
  max-height: 760px !important;
  overflow: auto;
}

::v-deep .el-select {
  max-width: 188px !important;
}

.app-container {
  height: 100%;
}

.tablebox {
  height: calc(100% - 140px);
}

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
