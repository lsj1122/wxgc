<template>
  <div class="newsBox">
    <!-- <ul class="ul">
      <li
        v-for="(item, index) in arr"
        :key="index"
        :class="{ active: isActive == index }"
        @click="choose(index)"
      >
        <div><img :src="item.imgurl" alt="" /></div>
        <span class="itemname">{{ item.name }}</span>
      </li>
    </ul> -->
    <div class="ul">
      <!-- <div
        class="li"
        v-for="(item, index) in arr"
        :key="index"
        :class="{ active: isActive == index }"
        @click="choose(index)"
      >
        <div><img :src="item.imgurl" alt="" /></div>
        <span class="itemname">{{ item.name }}</span>
      </div> -->

      <el-carousel class="lunbo" :interval="5000" arrow="always">
        <el-carousel-item>
          <div
            class="li"
            v-for="(item, index) in arr"
            :key="index"
            :class="{ active: isActive == item.value }"
            @click="choose(item.value)"
          >
            <div><img :src="item.imgurl" alt="" /></div>
            <span class="itemname">{{ item.name }}</span>
          </div>
        </el-carousel-item>

        <el-carousel-item>
          <div
            class="li"
            v-for="(item, index) in arr2"
            :key="index"
            :class="{ active: isActive == item.value }"
            @click="choose(item.value)"
          >
            <div><img :src="item.imgurl" alt="" /></div>
            <span class="itemname">{{ item.name }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
      <!-- <div
       class="li"
        style="
          width: 200px;
          height: 50px;
          position: absolute;
          top: 30%;
          right: 5%;
        "
        @click="dialogVisible = true"
      >
        上传文件
      </div> -->
    </div>

    <!--  -->
    <div class="alarm_Box-table">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="580"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="sort" label="序号" align="center">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          align="center"
          :formatter="stateFormat"
        >
        </el-table-column>
        <el-table-column prop="createBy" align="center" label="创建人">
        </el-table-column>
        <el-table-column prop="projectName" align="center" label="项目名称">
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间">
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              style="border: 0; color: #1990fc"
              >查看</el-button
            >
            <el-button
              size="mini"
              @click="handleEditBianJi(scope.$index, scope.row)"
              style="border: 0; color: #1990fc"
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="handleHuiFu(scope.$index, scope.row)"
              style="border: 0; color: #1990fc"
              >回复</el-button
            >
            <el-button
              size="mini"
              @click="lookHuiFu(scope.$index, scope.row)"
              style="border: 0; color: #1990fc"
              >查看回复</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 查看的内容 -->
    <el-dialog
      title="查看具体信息"
      :visible.sync="dialogVisible2"
      width="45%"
      :modal-append-to-body="false"
    >
      <!-- 查看 -->
      <div class="addContent" v-if="dialogVisible2Show == 0">
        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: #000; margin-left: 2px">序号</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="暂无"
            v-model="form2.sort"
            :disabled="true"
          >
          </el-input>
        </p>
        <p>
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span>上传类型</span>
        </p>
        <p>
          <el-input
            placeholder="请输入内容"
            v-model="form2.input"
            :disabled="true"
          ></el-input>
        </p>
        <p>填写文字内容</p>
        <p>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="form2.textarea"
            :disabled="true"
          >
          </el-input>
        </p>
        <p>文件下载：</p>
        <p>
          <el-button @click="onDown()" v-if="form2.fileUrl ? true : false"
            >点击下载相应文件</el-button
          >
          <el-button v-else disabled>暂无下载文件</el-button>
        </p>
      </div>
      <!-- 编辑 -->
      <div class="addContent addContentEdit" v-if="dialogVisible2Show == 1">
        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">序号</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="请输入序号"
            v-model="form.sort"
          >
          </el-input>
        </p>

        <p>
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">选择上传类型</span>
        </p>
        <p>
          <el-select v-model="fOutvalue" placeholder="请选择类型">
            <el-option
              v-for="item in options2"
              :key="item"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">
          <span style="color: #ff0000; font-size: 18px">*</span>
          <span style="color: rgba(255, 255, 255, 0.5)">填写标题</span>
        </p>
        <p>
          <el-input
            type="text"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.title"
          >
          </el-input>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">填写内容</p>
        <p>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="form.textarea"
          >
          </el-input>
        </p>
        <p style="color: rgba(255, 255, 255, 0.5)">选择文件</p>
        <div>
          <!--                        <uploadcom title="上传文件" @uploading="upfile" style="display:inline-block" ref="up"/>-->
          <upload-file
            file-type="*"
            ref="clearData"
            multiple
            list-type="*"
            accept="*"
            max-size="100"
            @change="getFile"
          />
        </div>
      </div>

      <div class="newcenter-right">
        <el-button @click="dialogVisible2 = false">返回</el-button>
        <el-button
          @click="submit('编辑')"
          v-loading="loading"
          element-loading-text="拼命加载中"
          v-if="!disabledType"
          >编辑</el-button
        >
      </div>
    </el-dialog>

    <!-- 回复的弹框内容 -->
    <el-dialog
      :title="fuiFuTitle"
      :visible.sync="dialogVisible3"
      width="60%"
      height="600px"
      :modal-append-to-body="false"
    >
      <div class="addContent" v-if="huifuShow">
        <div class="div1">
          <span class="span1">选择文件：</span>
          <upload-file
            file-type="*"
            ref="clearData"
            multiple
            list-type="*"
            accept="*"
            max-size="100"
            @change="getFile"
          />
        </div>
        <div class="div2">
          <span class="span2">备注:</span>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="form3.textarea"
            :disabled="false"
          >
          </el-input>
        </div>
      </div>
      <div class="addContent" v-else>
        <el-table
          :data="huiFuitableData"
          v-loading="dataLoading"
          row-key="id"
          height="450px"
        >
          <el-table-column prop="id" label="序号" align="center">
          </el-table-column>

          <el-table-column prop="projectId" label="所属项目" align="center">
          </el-table-column>
          <el-table-column prop="fileName" label="文件" align="center">
          </el-table-column>

          <el-table-column prop="remake" label="备注" align="center">
          </el-table-column>

          <el-table-column prop="uploadName" label="上传人" align="center">
          </el-table-column>

          <el-table-column prop="uploadTime" label="上传时间" align="center">
          </el-table-column>

          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="huiFuDelete(scope.$index, scope.row)"
                style="border: 0; color: #1990fc"
                >删除</el-button
              >
              <el-button
                size="mini"
                @click="huiFuLook(scope.$index, scope.row)"
                style="border: 0; color: #1990fc"
                >查看</el-button
              >
              <el-button
                size="mini"
                @click="huiFuUpload(scope.$index, scope.row)"
                style="border: 0; color: #1990fc"
                >下载</el-button
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
          @current-change="loadPageData($event)"
          :total="total"
        >
        </el-pagination>
      </div>

      <div class="newcenter-right">
        <el-button @click="dialogVisible3 = false">返回</el-button>
        <el-button @click="huiFuSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- <el-image-viewer
  v-if="showBig"
     style="width:100%;height:100%"
    :on-close="closeViewer"
    :url-list="['https://newzhuochuang.oss-cn-hangzhou.aliyuncs.com/20210722/1626952047917_1626952042436.jpg']"
/> -->
    <fileView ref="fileView" title="文件预览"></fileView>
  </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { simpleUploadsReturnTtFile } from "@/views/sysproject/api/ttfile";
import uploadFile from "@/components/Upload/uploadFile";
import { handleBatchDownload } from "@/utils/zipDownFile";
import fileView from "@/components/filePreview/filePreview.vue";

import {
  newsList,
  addTtNewsCenter,
  addTtNewsCenterHuiFu,
  editNewsCenter,
  getPageHuiFui,
  lookHuiFuTableListDelete,
} from "@/views/viewPlate/enterPrise/api/newsCenter";
export default {
  props: {},
  components: {
    uploadFile,
    fileView,
    ElImageViewer,
  },
  data() {
    return {
      total: 1, // 默认总数0
      dataLoading: false,
      listQuery: {
        // 查看回复的 分页,
        pageIndex: 1,
        pageSize: 5,
        CId: "",
      },

      clickRow: {},
      files: [],
      dialogVisible: false, // 上传文件
      dialogVisible2: false, // 上传文件
      dialogVisible2Show: 0,
      disabledType: true,
      dialogVisible3: false, // 回复文件的弹框
      huifuShow: true, // 回复文件的弹框 中要显示的模块
      fileList: [],
      fuiFuTitle: "回复内容",
      fileListName: "",

      options2: [
        { name: "政策法规", value: 0 },
        { name: "典型案例", value: 1 },
        { name: "会议通知", value: 2 },
        // { name: "管理制度", value: 3 },
        { name: "培训文件", value: 4 },

        { name: "隐患整改", value: 5 },
        { name: "周报", value: 6 },
        { name: "制度性文件", value: 7 },
        { name: "月度分析报告", value: 8 },
        { name: "新闻稿", value: 9 },
      ],
      optionsOld: [
        { name: "政策法规", value: 0 },
        { name: "典型案例", value: 1 },
        { name: "会议通知", value: 2 },
        { name: "管理制度", value: 3 },
        { name: "培训文件", value: 4 },

        { name: "隐患整改", value: 5 },
        { name: "周报", value: 6 },
        { name: "制度性文件", value: 7 },
        { name: "月度分析报告", value: 8 },
        { name: "新闻稿", value: 9 },
      ],
      fOutvalue: "", //选择得到的
      tableData: [],
      huiFuitableData: [], //
      isActive: 0, // 默认0,
      arr: [
        {
          name: "政策法规",
          imgurl: require("../../../assets/compent/news1.png"),
          value: 0,
        },
        {
          name: "典型案例",
          imgurl: require("../../../assets/compent/news2.png"),
          value: 1,
        },
        {
          name: "会议通知",
          imgurl: require("../../../assets/compent/news3.png"),
          value: 2,
        },
        // {
        //   name: "管理制度",
        //   imgurl: require("../../../assets/compent/news4.png"),
        //   value: 3
        // },
        {
          name: "培训文件",
          imgurl: require("../../../assets/compent/news5.png"),
          value: 4,
        },
      ],
      arr2: [
        {
          name: "隐患整改",
          imgurl: require("../../../assets/compent/news6.png"),
          value: 5,
        },
        {
          name: "周报",
          imgurl: require("../../../assets/compent/news7.png"),
          value: 6,
        },
        {
          name: "制度性文件",
          imgurl: require("../../../assets/compent/news8.png"),
          value: 7,
        },
        {
          name: "月度分析报告",
          imgurl: require("../../../assets/compent/news9.png"),
          value: 8,
        },
        {
          name: "新闻稿",
          imgurl: require("../../../assets/compent/news10.png"),
          value: 9,
        },
      ],
      form: {
        // 上传文件
        title: "",
        textarea: "",
        filePath: "",
        sort: "",
        fileUrl: "",
        id: "",
      },
      form2: {
        // 查看
        title: "",
        input: "",
        textarea: "",
        fileUrl: "",
        sort: "",
      },
      form3: {
        // 回复
        textarea: "",
        fileUrl: "",
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    closeViewer() {
      this.showBig = false;
    },
    stateFormat(row, column, cellValue) {
      if (!cellValue) return "";
      if (cellValue.length > 30) {
        //最长固定显示10个字符
        return cellValue.slice(0, 30) + "...";
      }
      return cellValue;
    },
    getList() {
      newsList({ type: this.isActive }).then((res) => {
        // console.log(244, res);
        if (res.code == "success") {
          this.tableData = res.data;
        }
      });
    },
    choose(index) {
      this.isActive = index;
      this.getList();
    },
    handleEdit(index, row) {
      this.disabledType = true;
      console.log(index, row);
      // 存储地址
      this.dialogVisible2Show = 0;
      this.form2.fileUrl = row.fileUrl;

      this.switch();
      this.form2.textarea = row.text;
      this.form2.sort = row.sort;

      console.log(this.form2);
      console.log(row);
      this.dialogVisible2 = true;
    },
    switch() {
      switch (this.isActive) {
        case 0:
          this.fOutvalue = this.optionsOld[0].name;
          this.form2.input = this.optionsOld[0].name;
          break;
        case 1:
          this.fOutvalue = this.optionsOld[1].name;
          this.form2.input = this.optionsOld[1].name;
          break;
        case 2:
          this.fOutvalue = this.optionsOld[2].name;
          this.form2.input = this.optionsOld[2].name;
          break;
        case 3:
          this.fOutvalue = this.optionsOld[3].name;
          this.form2.input = this.optionsOld[3].name;
          break;
        case 4:
          this.fOutvalue = this.optionsOld[4].name;
          this.form2.input = this.optionsOld[4].name;
          break;
        case 5:
          this.fOutvalue = this.optionsOld[5].name;
          this.form2.input = this.optionsOld[5].name;
          break;
        case 6:
          this.fOutvalue = this.optionsOld[6].name;
          this.form2.input = this.optionsOld[6].name;
          break;
        case 7:
          this.fOutvalue = this.optionsOld[7].name;
          this.form2.input = this.optionsOld[7].name;
          break;
        case 8:
          this.fOutvalue = this.optionsOld[8].name;
          this.form2.input = this.optionsOld[8].name;
          break;
        case 9:
          this.fOutvalue = this.optionsOld[9].name;
          this.form2.input = this.optionsOld[9].name;
          break;
      }
    },
    switch2() {
      switch (this.fOutvalue) {
        case "政策法规":
          return 0;
          break;
        case "典型案例":
          return 1;
          break;
        case "会议通知":
          return 2;
          break;
        case "管理制度":
          return 3;
          break;
        case "培训文件":
          return 4;
          break;
        case "隐患整改":
          return 5;
          break;
        case "周报":
          return 6;
          break;
        case "制度性文件":
          return 7;
          break;
        case "月度分析报告":
          return 8;
          break;
        case "新闻稿":
          return 9;
          break;
      }
    },
    //编辑的方法
    handleEditBianJi(index, row) {
      this.disabledType = false;
      this.dialogVisible2Show = 1;
      this.fuiFuTitle = "查看具体内容";
      this.switch();

      this.form.title = row.title;
      this.form.textarea = row.text;
      this.form.sort = row.sort;
      this.form.fileUrl = row.fileUrl;
      this.form.id = row.id;
      this.fileList = [];
      this.dialogVisible2 = true;
    },
    handleHuiFu(index, row) {
      this.huifuShow = true;
      this.dialogVisible3 = true;
      this.fuiFuTitle = "回复内容";

      //
      this.clickRow = row;
    },
    lookHuiFu(index, row) {
      this.huifuShow = false;
      this.dialogVisible3 = true;
      this.fuiFuTitle = "查看回复内容";
      //
      this.clickRow = row;
      // 查看分页的回复
      this.loadPageData();
    },
    loadPageData() {
      this.listQuery.CId = this.clickRow.id;
      this.dataLoading = true;
      // alert(index)
      getPageHuiFui(this.listQuery)
        .then((res) => {
          console.log(280, res);
          if (res.code == "success") {
            console.log(281, res);
            this.huiFuitableData = res.data.records;
            this.total = res.data.total;
          }
          this.dataLoading = false;
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.dataLoading = false;
        });
    },
    getFile(file, fileList) {
      console.log(346, fileList);
      this.fileList = [];
      this.fileListName = "";
      // console.log(178, fileList);
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
        // 去除没个

        this.fileListName = this.fileListName + "," + fileList[i].name;
      }
      this.fileListName = this.fileListName.substr(1);
      console.log(this.fileListName);
      this.fileList = fd;
      for (var [a, b] of fd.entries()) {
        console.log(a, b);
      }
      // this.form.filePath =''
      // simpleUploadsReturnTtFile(this.fileList).then(res=>{
      //   console.log(res)
      //   // TODO 返回文件格式有问题
      //     if(res[0].filePath){
      //       this.form.filePath =   res[0].filePath
      //     }
      //   })
    },
    onDown() {
      // 压缩下载接口
      if (this.form2.fileUrl.length > 0) {
        var arr = [];
        arr.push(this.form2.fileUrl);
        handleBatchDownload(arr);
      } else {
        alert("暂无上传文件");
      }
    },
    // 新闻中心的增加
    submit(typeS) {
      let fOutvalue;
      if (this.fOutvalue.length <= 0) {
        this.$message({
          message: "请选择上传类型",
          type: "warning",
        });
        return;
      } else {
        fOutvalue = this.switch2();
      }

      if (!this.form.title) {
        this.$message({
          message: "请填写标题",
          type: "warning",
        });
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      var obj = {
        title: this.form.title,
        text: this.form.textarea,
        type: fOutvalue,
        create_by: this.$store.state.user.name,
        file_url: "", // 上传需要的地址字段
        fileUrl: this.form.fileUrl, // 编辑需要的地址字段
      };

      if (this.fileList) {
        simpleUploadsReturnTtFile(this.fileList).then((res) => {
          // TODO 返回文件格式有问题
          if (res) {
            obj.file_url = res[0].filePath;
            obj.fileUrl = res[0].filePath;
          }
          if (typeS == "添加") {
            addTtNewsCenter(obj).then((res) => {
              loading.close();
              this.clearDialogData();
              this.dialogVisible = false;
              // 重新请求数据
              this.getList();
            });
          } else if (typeS == "编辑") {
            obj.sort = this.form.sort;
            obj.id = this.form.id;
            obj.type = fOutvalue;
            editNewsCenter(obj).then((res) => {
              loading.close();
              this.clearDialogData();
              this.dialogVisible2 = false;
              // 重新请求数据
              this.getList();
            });
          }
        });
      }
    },
    // 回复 弹框的 的确认按键
    huiFuSubmit() {
      if (this.huifuShow == true) {
        //回复 按键
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        var obj = {
          CId: this.clickRow.id,
          fileName: this.fileListName,
          fileUrl: "", //上传文件的地址
          remake: this.form3.textarea, //备注
          uploadName: this.$store.state.user.realName,
        };

        if (this.fileList) {
          simpleUploadsReturnTtFile(this.fileList).then((res) => {
            // console.log(res);
            // TODO 返回文件格式有问题

            if (res) {
              //只有一个 返回地址
              obj.fileUrl = res[0].filePath;
            }
            console.log(509, obj);
            addTtNewsCenterHuiFu(obj).then((res) => {
              console.log(462, res);
              if (res.code == "success") {
                loading.close();
                this.clearDialogData();
                this.$notify({
                  title: "成功",
                  message: "添加添加回复内容",
                  type: "success",
                });
                this.dialogVisible3 = false;
              } else {
                this.$notify.error({
                  title: "错误",
                  message: "添加信息失败",
                });
              }
            });
          });
        } else {
          // addTtNewsCenterHuiFu(obj).then((res) => {
          //   // console.log(305, res);
          //   this.getList();
          //   this.clearDialogData();
          //   loading.close();
          //   this.dialogVisible = false;
          // });
        }
      } else {
        this.dialogVisible3 = false;
        //查看回复 按键
      }
    },
    // 清空弹框数据
    clearDialogData() {
      this.form = {
        title: "",
        textarea: "",
        filePath: "",
        sort: "",
        fileUrl: "",
        id: "",
      };
      this.fOutvalue = "";
      // 清空存放 文件的字段
      this.fileList = [];
      (this.form3 = {
        // 回复
        textarea: "",
        fileUrl: "",
      }),
        this.$nextTick(() => {
          this.$refs.clearData.clearData();
        });
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false;
      this.clearDialogData();
    },

    // 删除
    huiFuDelete(index, row) {
      // console.log(row)
      //  return
      lookHuiFuTableListDelete(row.id).then((res) => {
        console.log(res);
        if (res.code == "success") {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
          });
          // 查看分页的回复
          this.loadPageData();
        } else {
          this.$notify.error({
            title: "失败",
            message: "删除失败",
          });
        }
      });
    },
    // 查看 ，预览
    huiFuLook(index, row) {
      var type = row.fileUrl.substring(row.fileUrl.lastIndexOf(".") + 1);
      this.$refs.fileView.show(row.fileUrl, type); //(文件地址,文件类型)
    },
    // 查看回复的下载
    huiFuUpload(index, row) {
      console.log(row.fileUrl);

      if (row.fileUrl.length > 0) {
        var arr = [];
        arr.push(row.fileUrl);
        handleBatchDownload(arr);
      } else {
        alert("暂无上传文件");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-button:hover,
.el-button:focus {
  background-color: #c5def5;
}
/deep/.addContent /deep/.el-button:hover,
/deep/ .el-button:focus {
  background-color: none !important;
}

.newsBox .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: transparent;
}
.newsBox .el-table {
  /deep/.el-table__row--striped td {
    background-color: rgba(164, 229, 225, 0.05);
  }
}
</style>

<style lang="less" scoped>
.newcenter-right {
  float: right;
}
.newsBox {
  width: 100%;
  height: 100%;
  // min-height: 600px;
}
.ul {
  position: relative;
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: left;
  align-items: center;
  text-align: center;
  justify-content: center;

  .li {
    width: 240px;
    height: 100px;
    // margin-right: 50px;
    background: #1990fcbf;
    border-radius: 10px;
    border: 1px solid #ffffff;
    cursor: pointer;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    img {
      width: 65px;
      height: 65px;
      border-radius: 10px;
    }
  }
  .li:nth-child(4),
  .li:nth-child(5) {
    div {
      width: 65px;
      height: 65px;
      border-radius: 20px;
      background-color: rgba(176, 135, 172, 0.25);
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
      }
    }
  }
  li:nth-child(5) {
    div {
      background-color: rgba(168, 137, 134, 0.25);
    }
  }
  .active {
    border: 1px solid #fff;
    box-shadow: 0px 0px 8px 1px #1990fc;
  }
}

.alarm_Box-table {
  height: calc(73.8vh - 120px);
  margin-top: 24px;
  overflow: auto;
  width: 100%;
  // padding:0 50px;
  // background-color: #fff;
}

// 新闻中心添加
/deep/.el-dialog {
  padding: 0 10px;
  width: 45%;
  // border: 1px solid #0096ff;

  .el-dialog__header {
    padding: 0;
    .el-dialog__title {
      display: inline-block;
      width: 100%;
      text-align: center;
      margin-top: 20px;
    }
  }
  .el-dialog__body {
    .addContent {
      /deep/.el-table {
      }
      .div1 {
        display: flex;
        margin-bottom: 15px;
        // justify-content: space-around;
        // align-items: center;
        .span1 {
          display: inline-block;
          width: 100px;
        }
      }
      .div2 {
        display: flex;
        // justify-content: space-around;
        // align-items: center;
        .span2 {
          display: inline-block;
          box-sizing: border-box;
          width: 110px;
        }
      }
      .el-select {
        width: 100%;
      }
    }
    .newcenter-right {
      margin-top: 20px;
    }
  }
  .selectCondition {
    padding: 0;
    li {
      display: flex;
      justify-content: left;
      height: 40px;
      margin: 20px 0;
      span {
        width: 80px;
        line-height: 40px;
      }
      input {
        outline-style: none;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding: 13px 14px;
        padding: 5px 10px;
        font-size: 14px;
        flex: 1;
      }
      input:focus {
        // border-color: #66afe9;
        outline: 0;
        // -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        // 0 0 8px rgba(102, 175, 233, 0.6);
        // box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
        // 0 0 8px rgba(102, 175, 233, 0.6);
      }
    }
  }
}

.fujian-clarifi {
  height: 29px;
  a {
    color: deepskyblue;
    cursor: pointer;
  }
  span {
    // color: rgb(179, 179, 179);
    margin-left: 10px;
  }
}
.itemname {
  font-size: 16px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
}

.lunbo {
  width: 100%;
  height: 150px;
  /deep/.el-carousel__container {
    height: 100%;
  }
  /deep/.el-carousel__item {
    width: 100%;
    padding: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  /deep/.el-carousel__arrow {
    background-color: rgba(31, 45, 61, 0.2);
  }
  /deep/.el-carousel__indicators--horizontal {
    display: none;
  }
}
.addContentEdit p span:nth-child(2) {
  color: #000 !important;
  margin-left: 2px;
}
</style>
