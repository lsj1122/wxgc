<template>
  <div class="app-container">
    <el-form
      v-loading="loading"
      element-loading-text="上传中,请勿刷新页面"
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="right"
      label-width="120px"
      style="margin-left: 5px"
    >
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="id" prop="id">
            <el-input  v-model="temp.id" placeholder="id" disabled/>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              type="text"
              v-model="temp.projectName"
              placeholder="项目名称"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目id" prop="projectId">
            <el-input
              v-model="temp.projectId"
              placeholder="项目id"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目经理" prop="projectManager">
            <el-input v-model="temp.projectManager" placeholder="项目经理"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目经理手机号" prop="phoneNumber">
            <el-input v-model="temp.phoneNumber" placeholder="项目经理手机号"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工程状态" prop="projectStatus">
            <el-select
              v-model="temp.projectStatus"
              clearable
              filterable
              placeholder="请选择工程状态"
            >
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工程类型" prop="projectType">
            <el-select
              v-model="temp.projectType"
              clearable
              filterable
              placeholder="请选择工程类别"
            >
              <el-option
                v-for="item in options1"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工程用途" prop="projectPurpose">
            <el-select
              v-model="temp.projectPurpose"
              clearable
              filterable
              placeholder="请选择工程用途"
            >
              <el-option
                v-for="item in options2"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="xaxis">
            <el-input type="number" v-model="temp.xaxis" placeholder="x坐标"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="yaxis">
            <el-input type="number" v-model="temp.yaxis" placeholder="y坐标"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建筑面积" prop="buildArea">
            <el-input
              type="number"
              v-model="temp.buildArea"
              placeholder="建筑面积"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工程造价" prop="projectPrice">
            <el-input
              type="number"
              v-model="temp.projectPrice"
              placeholder="工程造价"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建设单位" prop="buildCompany">
            <el-input v-model="temp.buildCompany" placeholder="建设单位"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设计单位" prop="designCompany">
            <el-input v-model="temp.designCompany" placeholder="设计单位"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监理单位" prop="supervisorCompany">
            <el-input v-model="temp.supervisorCompany" placeholder="监理单位"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="施工(总包)单位" prop="constructCompany">
            <el-input
              v-model="temp.constructCompany"
              placeholder="施工(总包)单位"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全监督单位" prop="safeCompany">
            <el-input v-model="temp.safeCompany" placeholder="安全监督单位"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="质量监督单位" prop="qualityCompany">
            <el-input
              v-model="temp.qualityCompany"
              placeholder="质量监督单位"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="城市id" prop="cityId">
            <el-input
              type="number"
              v-model="temp.cityId"
              placeholder="城市id"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在城市" prop="city">
            <!--            <el-input-->
            <!--              v-model="temp.city"-->
            <!--              placeholder="请勿带上'市',例如:北京市则填入'北京'"-->
            <!--            />-->
            <el-cascader
              v-model="temp.city"
              ref="cascader"
              @change="selectCity"
              :props="{
                value:'name',
                label:'name',
                children:'subCityList'
              }"
              :show-all-levels="false"
              style="width: 100%"
              :options="cityOptions"></el-cascader>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="开工时间" prop="startDate">
            <el-date-picker
              v-model="temp.startDate"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开工时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预计完工时间" prop="endDate">
            <el-date-picker
              v-model="temp.endDate"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="完工时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
            <el-col :span="6">
          <el-form-item label="项目排名" prop="sort">
          <el-input
              v-model="temp.sort"
              placeholder="项目排名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目全景图" prop="projectPicture">
            <upload-file
              file-type="jpg/png"
              ref="clearData"
              list-type="picture"
              accept="image/*"
              max-size="20"
              @change="getFile"
            />
            <el-image
              v-if="temp.projectPicture"
              style="height: 50px; width: 50px"
              :src="temp.projectPicture"
              :preview-src-list="[temp.projectPicture]"
            >
            </el-image>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目概况" prop="projectSurvey">
            <el-input
              type="textarea"
              :rows="8"
              v-model="temp.projectSurvey"
              placeholder="项目概况"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="宣传视频" prop="projectVideo">
            <upload-file
              file-type="mp4"
              ref="clearData1"
              list-type="video"
              accept="video/*"
              max-size="1000"
              @change="getFile1"
            />
            <el-button size="small" type="primary" @click="uploadVideo()"
            >点击上传视频
            </el-button
            >
          </el-form-item>
          <el-form-item label="上传进度">
            <el-progress
              style="top: 10px"
              :text-inside="true"
              :stroke-width="18"
              :percentage="upTotal"
            ></el-progress>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="this.projectId">
      <el-button type="primary" @click="updateData()">
        {{ $t("table.confirm") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import uploadFile from "@/components/Upload/uploadFile";
import {addOrUpdateTtProject, selectAllCityByTree, selectPro} from "./api/ttProject.js";
import {simpleUploads} from "@/views/sysproject/api/ttfile";
import OSS from "ali-oss";
import moment from "moment";

export default {
  name: "projectInfo",
  components: {uploadFile},
  data() {
    return {
      fileName1: "",
      fileList1: "",
      ossConfig: {
        region: "oss-cn-hangzhou",
        accessKeyId: "LTAI4GKpzVjLoHp8rrrpTLFK",
        accessKeySecret: "sQHHfIvEr981dLIMUPwlSxJsx7cQcB",
        bucket: "newzhuochuang",
      },
      loading: false,
      upTotal: 0,
      projectId: this.$store.getters.projectId,
      cityOptions: [],
      options: ["在建", "完工", "筹备", "立项", "停工", "竣工验收"],
      options1: [
        "房屋建筑工程",
        "市政公用工程",
        "机电安装工程",
        "铁路工程",
        "公路工程",
        "港口与航通工程",
        "水利水电工程",
        "电力工程",
        "矿山工程",
        "冶炼工程",
        "化工石油工程",
        "通信工程",
        "其他",
      ],
      options2: [
        "居住建筑",
        "住宅建筑",
        "宿舍建筑",
        "商业建筑",
        "综合建筑",
        "教育建筑",
        "道路交通",
      ],
      tableData: [], //当前数据
      temp: {
        projectName: this.$store.getters.projectName,
        projectId: this.$store.getters.projectId,
        projectManager: "",
        phoneNumber: "",
        projectStatus: "",
        projectType: "",
        projectPurpose: "",
        xaxis: "",
        yaxis: "",
        buildArea: "",
        projectPrice: "",
        buildCompany: "",
        designCompany: "",
        supervisorCompany: "",
        constructCompany: "",
        safeCompany: "",
        qualityCompany: "",
        cityId: "",
        city: "",
        startDate: "",
        endDate: "",
        projectPicture: "",
        projectSurvey: "",
        createTime: "",
        createBy: "",
        updateTime: "",
        updateBy: "",
        sort:"",
      },
      fileList: [],
      rules: {
        //校验功能
        projectManager: [
          {
            required: true,
            message: "必填项目经理",
            trigger: ["blur", "change"],
          },
        ],
    
        phoneNumber: [
          { required:  true , message: '请检查手机号是否填写', trigger: ['blur', 'change'] },
          { pattern: /^1[0-9]{10}$/, message: "请检查手机号是否正确", trigger: "blur",}
        ],
        projectStatus: [
          {
            required: true,
            message: "必填工程状态",
            trigger: ["blur", "change"],
          },
        ],
        projectType: [
          {
            required: true,
            message: "必填工程类型",
            trigger: ["blur", "change"],
          },
        ],
        projectPurpose: [
          {
            required: true,
            message: "必填工程用途",
            trigger: ["blur", "change"],
          },
        ],
        city: [
          {
            required: true,
            message: "必填所在城市",
            trigger: ["blur", "change"],
          },
        ],
        xaxis: [
          {required: true, message: "必填x坐标", trigger: ["blur", "change"]},
        ],
        yaxis: [
          {required: true, message: "必填y坐标", trigger: ["blur", "change"]},
        ],
        buildArea: [
          {
            required: true,
            message: "必填建筑面积",
            trigger: ["blur", "change"],
          },
        ],
        // projectPrice: [
        //   { required:  true , message: '必填工程造价', trigger: ['blur', 'change'] },
        // ],
        startDate: [
          {
            required: true,
            message: "必填开工时间",
            trigger: ["blur", "change"],
          },
        ],
        endDate: [
          {
            required: true,
            message: "必填完工时间",
            trigger: ["blur", "change"],
          },
        ],
        projectSurvey: [
          {
            required: true,
            message: "必填项目概况",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {
    //加载分页数据
    this.loadPageData();
    this.selectAllCityByTree()
  },
  mounted() {
  },
  methods: {
    selectCity() {
      let node = this.$refs.cascader.getCheckedNodes()[0];
      console.log(node)
      if (node) {
        this.temp.cityId = node.data.weatherCode;
      }
    },
    selectAllCityByTree() {
      selectAllCityByTree({}).then(res => {
        if (res.code == 'success') {
          this.cityOptions = res.data
        }
      })
    },
    uploadVideo() {
      this.loading = true;
      if (!this.fileName1) {
        this.$message.error("请选择视频");
        this.loading = false;
        return;
      }
      let that = this;
      new OSS(this.ossConfig)
        .multipartUpload(
          moment().format("yyyyMMDD") + "/" + this.fileName1,
          this.fileList1,
          {
            progress: function (p, checkpoint) {
              that.upTotal = parseInt(p * 100);
            },
            meta: {year: 2021, people: "test"},
            mime: "image/jpeg",
          }
        )
        .then((res) => {
          this.temp.projectVideo =
            "https://" +
            this.ossConfig.bucket +
            "." +
            this.ossConfig.region +
            ".aliyuncs.com" +
            "/" +
            moment().format("yyyyMMDD") +
            "/" +
            this.fileName1;
          this.loading = false;
        });
    },
    getFile1(file, fileList) {
      this.fileName1 = fileList[0].name;
      this.fileList1 = fileList[0].raw;
    },
    getFile(file, fileList) {
      console.log(322, this.fileList);
      this.fileList = [];
      let fd = new FormData();
      for (let i = 0; i < fileList.length; i++) {
        fd.append("fileList", fileList[i].raw);
      }
      this.fileList = fd;
      console.log(322, this.fileList);
    },
    //查询当前项目
    loadPageData() {
      selectPro()
        .then((res) => {
          if (res.code == "success" && res.data) {
            res.data.projectName
              ? res.data.projectName
              : (res.data.projectName = this.$store.getters.projectName);
            this.temp = res.data;
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    //增加/修改

    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (this.fileList.length == 0 && this.temp.id == "") {
          this.$message.error("请上传项目全景图");
          this.loading = false;
          return;
        }
        if (valid) {
          simpleUploads(this.fileList).then((res) => {
            this.temp.projectPicture = res[0];
            let param = JSON.parse(JSON.stringify(this.temp));
            Array.isArray(param.city)
            if (Array.isArray(param.city)) {
              param.city = param.city[param.city.length - 1]
            }
            addOrUpdateTtProject(param).then((response) => {
              if (response.code == "success") {
                this.loadPageData();
                this.$refs.clearData.clearData();
              }
              this.$notify({
                title: "操作提示",
                message: response.msg,
                type: response.code,
                duration: 2000,
              });
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
