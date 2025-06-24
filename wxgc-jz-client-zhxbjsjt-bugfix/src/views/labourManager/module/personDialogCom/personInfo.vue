<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
    <el-row :gutter="30">
      <h3 class="person-info-title">基本信息（扫描录入）</h3>
      <el-col :span="7">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" :disabled="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex" :disabled="!isEdit">
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="民族" prop="nation">
          <el-input v-model="ruleForm.nation" :disabled="!isEdit"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker :disabled="!isEdit" v-model="ruleForm.birthday" type="date"
                          placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input :disabled="!isEdit" v-model="ruleForm.idCard"></el-input>
        </el-form-item>
        <el-form-item label="住址" prop="address">
          <el-input :disabled="!isEdit" v-model="ruleForm.address"></el-input>
        </el-form-item>
        <el-form-item label="发证机关" prop="issueOffice">
          <el-input :disabled="!isEdit" v-model="ruleForm.issueOffice"></el-input>
        </el-form-item>


      </el-col>
      <el-col :span="9">
        <el-form-item label="手机号" prop="telephone">
          <el-input :disabled="!isEdit" v-model="ruleForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politicsStatus">
          <el-input :disabled="!isEdit" v-model="ruleForm.politicsStatus"></el-input>
        </el-form-item>
        <el-form-item label="文化程度" prop="eduLevel">
          <el-input :disabled="!isEdit" v-model="ruleForm.eduLevel"></el-input>
        </el-form-item>
        <el-form-item label="血型" prop="bloodType">
          <el-input :disabled="!isEdit" v-model="ruleForm.bloodType"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="contractPhone">
          <el-input :disabled="!isEdit" v-model="ruleForm.contractPhone"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyContract">
          <el-input :disabled="!isEdit" v-model="ruleForm.emergencyContract"></el-input>
        </el-form-item>
        <el-form-item label="有效期" prop="validityTime">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-date-picker
                style="width:100%"
                v-model="ruleForm.validityTime"
                value-format="yyyy-MM-dd"
                type="date"
                :disabled="!isEdit"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="11">
              <el-date-picker
                style="width:100%"
                :disabled="!isEdit"
                v-model="ruleForm.validityTimeEnd"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <div class="pic-uesr-info">
          <img :src="ruleForm.cardPhoto || '../../../../assets/noneID.png'" alt="" srcset="">
          <img :src="ruleForm.scenePhoto || '../../../../assets/nonexc.png'" alt="" srcset="">
          <img :src="ruleForm.qrCode || '../../../../assets/noneInfo.png'" alt="" srcset="">
        </div>
        <div class="btn-user-info">
          <el-button type="success" @click="save">{{ isEdit ? '保存' : '编辑' }}</el-button>
          <el-upload
            v-loading="uploadLoading"
            :action="action"
            :show-file-list="false"
            :data="uploadData"
            :headers="uploadHeaders"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <el-button slot="trigger" type="primary">上传头像</el-button>
          </el-upload>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <h3 class="person-info-title">岗位信息</h3>
      <el-col :span="7">
        <el-form-item label="人员类型" prop="personType">
          <el-input :disabled="!isEdit" v-model="ruleForm.personType"></el-input>
        </el-form-item>
        <el-form-item label="参建单位" prop="buildName">
          <el-input :disabled="!isEdit" v-model="ruleForm.buildName"></el-input>
        </el-form-item>
        <el-form-item label="所属队伍" prop="groupsId">
          <el-input :disabled="!isEdit" v-model="ruleForm.groupsId"></el-input>
        </el-form-item>
        <el-form-item label="所属班组" prop="teamName">
          <el-input :disabled="!isEdit" v-model="ruleForm.teamName"></el-input>
        </el-form-item>
        <el-form-item label="班组长" prop="teamLeader">
          <el-radio-group :disabled="!isEdit" v-model="ruleForm.teamLeader">
            <el-radio label="是" :value="1"></el-radio>
            <el-radio label="否" :value="0"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参加安全教育" prop="entryEdu">
          <el-radio-group :disabled="!isEdit" v-model="ruleForm.entryEdu">
            <el-radio label="是" :value="1"></el-radio>
            <el-radio label="否" :value="0"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="9">
        <el-form-item label="岗位工种" prop="jobs">
          <el-input :disabled="!isEdit" v-model="ruleForm.jobs"></el-input>
        </el-form-item>
        <el-form-item label="进场日期" prop="entryDate">
          <el-input :disabled="!isEdit" v-model="ruleForm.entryDate"></el-input>
        </el-form-item>
        <el-form-item label="退场日期" prop="exitDate">
          <el-input :disabled="!isEdit" v-model="ruleForm.exitDate"></el-input>
        </el-form-item>
        <el-form-item label="IC卡号" prop="icCard">
          <el-input :disabled="!isEdit" v-model="ruleForm.icCard"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">

      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import {getPersonDet, updateTtPerson, addTtPerson} from '../../api/ttperson'
import {getToken} from "@/utils/auth";

export default {
  props: {
    row: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      isEdit: false,
      fileList: [],
      ruleForm: {},
      rules: {},
      uploadLoading: false,
      action: location.protocol + '//' + location.host + process.env.VUE_APP_BASE_API + '/wxgc-base-system/wxgc/plus/tt-file/simpleUpload',
      uploadHeaders: {'X-Wxgc-Token': getToken()},
      uploadData: {
        currentUserId: this.$store.getters.userId,
        currentUserName: this.$store.getters.name,
        projectId: this.$store.getters.projectId,
      },
    }
  },
  watch: {
    row: function (val) {
      if (val.row) {
        this.isEdit = false
        this.ruleForm = {...val.row}
        this.getPerson()
      } else {
        this.ruleForm = {}
        this.isEdit = true
      }
    }
  },
  methods: {
    save() {

      if (this.ruleForm.id && this.isEdit) {
        this.putData()
      }
      if (!this.ruleForm.id && this.isEdit) {
        this.addData()
      }
      if (!this.isEdit) {
        this.isEdit = true
      }
    },
    putData() {
      updateTtPerson(this.ruleForm).then(res => {
        this.$message.success('编辑成功!')
        this.commitSuccess()
      })
    },
    addData() {
      addTtPerson(this.ruleForm).then(res => {
        this.$message.success('添加成功!')
        this.commitSuccess()
      })
    },
    getPerson() {
      getPersonDet(this.ruleForm.id).then(res => {
        if (res.code === 'success') {
          this.ruleForm = res.data
        }
      })
    },
    commitSuccess() {
      this.isEdit = false
      this.$emit('success')
      // console.log("111111111111")
      // console.log(this.$parent)
      // console.log(this.$parent.$parent)
      // console.log("22222222222")
      // console.log(this.$parent.$refs.user)
      // console.log(this.$parent.$parent.$refs.user)
      // this.$parent.$refs.user.loadPageData() // Refresh userTableVue's list page
    },
    handleChange(file, fileList) { //上传照片

    },
    // 上传成功的回调
    handleAvatarSuccess(res, file) {
      this.uploadLoading = false
      this.ruleForm.scenePhoto = res
    },
    // 上传之前做验证
    beforeAvatarUpload(file) {
      const isIMG = file.type.substr(0, 5) === 'image'
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isIMG) {
        this.$message.error('上传资源只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      // this.uploadLoading = true
      if (isIMG && isLt2M) {
        this.uploadLoading = true
      }

      return isIMG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
.pic-uesr-info {
  display: flex;
  margin-bottom: 25px;

  img {
    width: 124px;
    border: 1px solid #eee;
    margin-right: 10px;
  }

}

.person-info-title {
  padding-left: 10px;
  font-weight: 400;
  color: #505050;
  border-left: 3px solid #159eff;
  margin-left: 15px;
}

.btn-user-info {
  display: flex;
  align-items: center;

  > * {
    margin-right: 10px;
  }
}
</style>
