<template>
  <el-dialog title="整改单" :visible.sync="dialogVisible" width="900px" top="5%">
    <el-form ref="form" label-width="80px" @submit.native.prevent>
      <!--        <el-row :gutter="20">-->
      <!--          <el-col :span="12">-->
      <!--            <el-form-item label="整改类型">-->
      <!--              <el-input v-model="form.zgtype"></el-input>-->
      <!--            </el-form-item>-->
      <!--          </el-col>-->
      <!--          <el-col :span="12">-->
      <!--            <el-form-item label="检查日期">-->
      <!--              <el-date-picker-->
      <!--                v-model="form.checkdate"-->
      <!--                type="datetime"-->
      <!--                placeholder="选择日期时间"-->
      <!--                default-time="12:00:00"-->
      <!--              ></el-date-picker>-->
      <!--            </el-form-item>-->
      <!--          </el-col>-->
      <!--        </el-row>-->

      <!--        <el-form-item label="参加人员">-->
      <!--          <el-input v-model="form.rectificationPersonAll"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="检查部位">-->
      <!--          <el-input v-model="form.problemArea"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="存在问题">-->
      <!--          <el-image style="width: 100px; height: 100px" :src="form.problemDescribe" fit="contain"></el-image>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="整改措施">-->
      <!--          <el-input v-model="form.rectificationRequirement"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="整改责任人">-->
      <!--          <el-input v-model="form.rectificationPerson"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-row :gutter="20">-->
      <!--          <el-col :span="12">-->
      <!--            <el-form-item label="隐患级别">-->
      <!--              <el-input v-model="form.hiddenDangerLevel"></el-input>-->
      <!--            </el-form-item>-->
      <!--          </el-col>-->
      <!--          <el-col :span="12">-->
      <!--            <el-form-item label="整改时限">-->
      <!--              <el-input v-model="form.zhenggsx"></el-input>-->
      <!--            </el-form-item>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <!--        <el-row :gutter="20">-->
      <!--          <el-col :span="12">-->
      <!--            <el-form-item label="复合情况">-->
      <!--              <el-input v-model="form.fuheqk"></el-input>-->
      <!--            </el-form-item>-->
      <!--          </el-col>-->
      <!--          <el-col :span="12">-->
      <!--            <el-form-item label="日期">-->
      <!--              <el-date-picker-->
      <!--                v-model="form.riqi"-->
      <!--                type="datetime"-->
      <!--                placeholder="选择日期时间"-->
      <!--                default-time="12:00:00"-->
      <!--              ></el-date-picker>-->
      <!--            </el-form-item>-->
      <!--          </el-col>-->
      <!--        </el-row>-->
      <div class="my-breadcrumb">
        <span @click="clickName" :class="{ active_punch: active === 0 }">{{
          form.name
        }}</span>
        <span
          v-for="(item, index) in userData"
          :key="index"
          @click="viewDet(index)"
          :class="{ active_punch: active === index + 1 }"
          ><i>></i>{{ item.name }}</span
        >
      </div>

      <template v-if="!showUser">
         <el-form-item label="问题部位" prop="problemArea">
                <el-input v-model="form.problemArea"  disabled='true'/>
              </el-form-item>
              <el-form-item label="问题类型" prop="problemType">
                <el-input v-model="form.problemType"  disabled='true'/>
              </el-form-item>
              
              <el-form-item label="影响级别" prop="influenceLevel">
               
                <el-select
                  v-model="form.influenceLevel"
                 
                  disabled='true'
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
                  v-model="form.problemDescribe"
                 
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="问题图片" prop="problemDescribe" >
                 <el-image
                  v-if="form.filePath1"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="form.filePath1"
                  :preview-src-list="[form.filePath1]"
                >
                </el-image>
                <el-input
                v-if="!form.filePath1"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>

              <!-- <el-form-item label="分包单位" prop="subcontractors">
                <el-input
                  v-model="form.subcontractors"
                  placeholder="分包单位"
                />
              </el-form-item> -->
              <el-form-item label="整改人" prop="rectificationPerson" >
                <el-input
                  v-model="form.rectificationPerson"
                 
                  disabled='true'
                />
              </el-form-item>
              <el-form-item label="整改措施" prop="rectificationMeasures">
                <el-input
                  v-model="form.rectificationMeasures"
                  
                  disabled='true'
                />
              </el-form-item>

               <el-form-item label="整改图片" prop="problemDescribe">
                    <el-image
                  v-if="form.filePath2"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="form.filePath2"
                  :preview-src-list="[form.filePath2]"
                >
                </el-image>
                <el-input
                v-if="!form.filePath2"
                 disabled
                 value="暂无图片"
                />
            
            
              </el-form-item>

              <el-form-item label="整改时限" prop="rectificationTimelimit">
                <el-date-picker
                disabled='true'
                  v-model="form.rectificationTimelimit"
                  align="right"
                  type="date"
                  value-format="yyyy-MM-dd"
               
                >
                </el-date-picker>
              </el-form-item>
          
                  <el-form-item label="复查图片" prop="problemDescribe">
                 <el-image
                  v-if="form.filePath3"
                  style="height: 50px; width: 50px;margin-right:10px"
                  :src="form.filePath3"
                  :preview-src-list="[form.filePath3]"
                >
                </el-image>
                <el-input
                v-if="!form.filePath3"
                 disabled
                 value="暂无图片"
                />
              </el-form-item>

             
               <el-form-item label="复查意见" prop="reviewResult" >
                <el-input v-model="form.reviewResult"  disabled='true' />
              </el-form-item>
              <el-form-item label="审核结果" prop="auditResult" >
                <el-input v-model="form.auditResult"  disabled='true' />
              </el-form-item>
            
              <el-form-item label="复查人" prop="reviewPerson">
                <el-input v-model="form.reviewPerson" disabled='true' />
              </el-form-item>
              <el-form-item label="抄送人" prop="chaosongPerson">
                <el-input v-model="form.chaosongPerson"   disabled='true'/>
              </el-form-item>
      </template>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      <!-- <el-button @click="exportZGD">导 出</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import { selectQualitySafe } from "@/views/qualityManager/api/ttQualitysafeManager";
import { downFile } from "@/utils/fileDown";
export default {
  data() {
    return {
      form: {},
      active: 0,
      showUser: false,
      punchData: {},
      dialogVisible: false,
      projectId: this.$store.getters.projectId,
      id: "",
    };
  },
  computed: {
    userData: function () {
      if (!this.form.ssManagerUser) {
        return [];
      }
      return this.form.ssManagerUser.filter((n) => {
        return n.status != 1;
      });
    },
  },
  methods: {
    viewPunch(row) {
      this.id = row.managerId;
      this.dialogVisible = true;
      this.active = 0;
      this.showUser = false;
      this.getdata(row.managerId);
    },
    close() {
      this.dialogVisible = false;
    },
    clickName() {
      this.showUser = false;
      this.active = 0;
    },
    getdata(id) {
      selectQualitySafe({ managerId: id }).then((res) => {
        console.log(175, res);
        this.form = res;
        // console.log(res.data[0])
      });
    },
    viewDet(i) {
      this.active = i + 1;
      this.showUser = true;
      this.punchData = { ...this.userData[i] };
    },
    exportZGD() {
      // exportZGD(this.id).then(res =>{
      //     console.log(res)
      // })
      // location.href = '/wxgc-api/wxgc/plus/tt-qualitysafe-manager/exportExcel?managerId='+this.id+'&projectId='+this.projectId
      downFile(
        "/wxgc/plus/tt-qualitysafe-manager/exportExcel",
        {
          managerId: this.id + "",
          projectId: this.projectId,
        },
        "整改单.xlsx"
      );
    },
  },
};
</script>

<style lang="less" scoped>
.my-breadcrumb {
  margin-bottom: 27px;
  display: flex;
  justify-content: flex-start;
  span {
    display: block;
    margin-right: 10px;
    cursor: pointer;
    i {
      color: #999;
      margin-right: 10px;
    }
    &:hover {
      color: cornflowerblue;
    }
  }
}
.active_punch {
  color: cornflowerblue;
}
</style>
