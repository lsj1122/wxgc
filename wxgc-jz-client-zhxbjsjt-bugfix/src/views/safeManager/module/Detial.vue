<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属单位">
            <el-input v-model="form.company"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训次数">
            <el-input type="number" v-model="form.num"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="培训名称">
            <el-input v-model="form.trainName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有无计划">
            <el-radio v-model="form.hasPlan" label="有">有</el-radio>
            <el-radio v-model="form.hasPlan" label="无">无</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="教育计划">
            <el-input v-model="form.eduPlan"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育人">
            <el-input v-model="form.eduPerson"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="教育时间">
            <el-date-picker
              v-model="form.eduDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实施部门">
            <el-input v-model="form.impDep"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="填报人">
            <el-input v-model="form.addPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="填报日期">
            <el-date-picker
              v-model="form.addDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="天数或课时">
            <el-input type="number" v-model="form.dayClass"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="受教育人数">
            <el-input type="number" v-model="form.eduSum">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="教育内容">
            <el-input v-model="form.eduContent"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="培训小结">
            <el-input v-model="form.trainResult"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参加人员类型" prop="personType">
            <el-select
              v-model="form.personType"
              placeholder="请选择参加人员类型"
              :default-value="2"
            >
              <el-option label="管理人员培训" value="1"></el-option>
              <el-option label="普通人员培训" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="附件">
            <div v-for="item in files" :key="item.id" class="fujian-clarifi">
              <a @click="view(item.filePath)">{{ item.fileName }}</a
              ><span>[{{ item.createTime }},{{ item.fileSize }}]</span>
            </div>
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

            <el-button type="success" plain size="small" @click="downFn"
              >打包下载</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div>
      <el-button v-if="this.form.id" type="primary" @click="save"
        >保存</el-button
      >
    </div>
    <fileView ref="fileView" title="文件预览"></fileView>

  </div>
</template>

<script>
import uploadFile from "@/components/Upload/uploadFile";
import uploadcom from "@/components/upload";
import fileView from "@/components/filePreview/filePreview.vue";

import { handleBatchDownload } from "@/utils/zipDownFile";
import { updateTtSafetyDisclosure } from ".././api/ttsafetydisclosure";
import {
  selectFileById,
  simpleUploadsReturnTtFile,
} from "@/views/sysproject/api/ttfile";

export default {
  components: {
    uploadcom,
    uploadFile,
    fileView
  },
  props: {
    detdata: {
      type: Object,
    },
  },
  watch: {
    detdata: function (val) {
      this.form = { ...val };
      this.getFiles();
    },
  },
  data() {
    return {
      projectId: this.$store.getters.projectId,
      form: {},
      files: [],
      proList: [],
      fileList: [],
      rules: {
        personType: [
          { required: true, message: "请选择参加人员类型", trigger: "change" },
        ],
      },
    };
  },
  created() {},
  methods: {
    save() {
        var _this=this
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateTtSafetyDisclosure(this.form).then((res) => {
            _this.$message.success("保存成功！");
            _this.$refs.clearData.clearData(); //
            _this.fileList = [];
            _this.$emit("onSave");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getFiles() {
      selectFileById(this.form.fileId).then((res) => {
        if (res.code == "success") {
          this.files = res.data;
        }
      });
    },
    getFile(file, fileList) {
      this.fileList = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
        //   console.log(fileList[i].raw)
      }
      this.fileList = fd;

      //   for (var [a, b] of fd.entries()) {
      //      console.log(a, b);
      // }
      simpleUploadsReturnTtFile(this.fileList).then((res) => {
        console.log(res);
        // TODO 返回文件格式有问题
        if (this.form.fileId) {
          this.form.fileId += "," + res[0].id;
        } else {
          this.form.fileId = res[0].id;
        }
      });
    },
    downFn() {
      handleBatchDownload(
        this.files.map((item) => {
          return item.filePath;
        })
      );
    },
    view(path) {
      let type = path.substring(path.lastIndexOf(".") + 1);
      this.$refs.fileView.show(path, type); //(文件地址,文件类型)
    },
  },
};
</script>

<style lang="less" scoped>
.fujian-clarifi {
  height: 29px;
  a {
    color: deepskyblue;
    cursor: pointer;
  }
  span {
    color: rgb(179, 179, 179);
    margin-left: 10px;
  }
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
<style>
.messagebox {
  width: 900px;
}
</style>
