<template>
  <div class="app-container">
    <el-form v-loading="loading" element-loading-text="上传中,请勿刷新页面" ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="margin-left:5px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="活动开始时间" prop="numOne">
            <el-date-picker
              v-model="temp.numOne"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="活动进行天数"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="累计教育人数" prop="numTwo">
            <el-input-number v-model="temp.numTwo" controls-position="right" :min="0" placeholder="累计教育人数" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="累计教育人次" prop="numThree">
            <el-input-number v-model="temp.numThree" controls-position="right" :min="0" placeholder="累计教育人次" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="累计考试数量" prop="numFour">
            <el-input-number v-model="temp.numFour" controls-position="right" :min="0" placeholder="累计考试数量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平均考试通过率" prop="numFive">
            <el-input-number v-model="temp.numFive" controls-position="right" :min="0" placeholder="平均考试通过率" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育人次1" prop="numEduOne">
            <el-input-number v-model="temp.numEduOne" controls-position="right" :min="0" placeholder="教育人次1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育人次2" prop="numEduTwo">
            <el-input-number v-model="temp.numEduTwo" controls-position="right" :min="0" placeholder="教育人次2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育人次3" prop="numEduThree">
            <el-input-number v-model="temp.numEduThree" controls-position="right" :min="0" placeholder="教育人次3" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育人次4" prop="numEduFour">
            <el-input-number v-model="temp.numEduFour" controls-position="right" :min="0" placeholder="教育人次4" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育人次5" prop="numEduFive">
            <el-input-number v-model="temp.numEduFive" controls-position="right" :min="0" placeholder="教育人次5" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育百分比1" prop="numRaceOne">
            <el-input-number v-model="temp.numRaceOne" controls-position="right" :min="0" placeholder="教育百分比1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育百分比2" prop="numRaceTwo">
            <el-input-number v-model="temp.numRaceTwo" controls-position="right" :min="0" placeholder="教育百分比2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育百分比3" prop="numRaceThree">
            <el-input-number v-model="temp.numRaceThree" controls-position="right" :min="0" placeholder="教育百分比3" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育百分比4" prop="numRaceFour">
            <el-input-number v-model="temp.numRaceFour" controls-position="right" :min="0" placeholder="教育百分比4" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育百分比5" prop="numRaceFive">
            <el-input-number v-model="temp.numRaceFive" controls-position="right" :min="0" placeholder="教育百分比5" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="教育底图" prop="pictureUrl">
            <upload-file file-type="jpg/png" ref="clearData" list-type="picture" accept="image/*" max-size="20"   @change="getFile"/>
            <el-image
              v-if="temp.pictureUrl"
              style="height:50px;width:50px"
              :src="temp.pictureUrl"
              :preview-src-list="[temp.pictureUrl]">
            </el-image>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateData()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import uploadFile from '@/components/Upload/uploadFile'
  import {simpleUploads} from "@/views/sysproject/api/ttfile";
  import {addOrUpdateTtWifi, selectTtWifiByPro} from "@/views/safeManager/api/ttwifi";
  export default {
    name: 'TtWifi',
    components: {uploadFile},
    data() {
      return {
        loading: false,
        temp: {
          "id": null,
          "numOne": null,
          "numTwo": null,
          "numThree": null,
          "numFour": null,
          "numFive": null,
          "numEduOne": null,
          "numEduTwo": null,
          "numEduThree": null,
          "numEduFour": null,
          "numEduFive": null,
          "numRaceOne": null,
          "numRaceTwo": null,
          "numRaceThree": null,
          "numRaceFour": null,
          "numRaceFive": null,
          "projectId": null,
          "pictureUrl": null,
        },
        fileList: [],
        rules: { //校验功能
          numOne: [
            { required:  true , message: '必填活动开始时间', trigger: ['blur', 'change'] },
          ],
          numTwo: [
            { required:  true , message: '必填累计教育人数', trigger: ['blur', 'change'] },
          ],
          numThree: [
            { required:  true , message: '必填累计教育人次', trigger: ['blur', 'change'] },
          ],
          numFour: [
            { required:  true , message: '必填累计答题数量', trigger: ['blur', 'change'] },
          ],
          numFive: [
            { required:  true , message: '必填平均答题正确率', trigger: ['blur', 'change'] },
          ],
          numEduOne: [
            { required:  true , message: '必填教育人次1', trigger: ['blur', 'change'] },
          ],
          numEduTwo: [
            { required:  true , message: '必填教育人次2', trigger: ['blur', 'change'] },
          ],
          numEduThree: [
            { required:  true , message: '必填教育人次3', trigger: ['blur', 'change'] },
          ],
          numEduFour: [
            { required:  true , message: '必填教育人次4', trigger: ['blur', 'change'] },
          ],
          numEduFive: [
            { required:  true , message: '必填教育人次5', trigger: ['blur', 'change'] },
          ],
          numRaceOne: [
            { required:  true , message: '必填教育百分比1', trigger: ['blur', 'change'] },
            { validator:this.checkData , trigger: ['blur', 'change'] },
          ],
          numRaceTwo: [
            { required:  true , message: '必填教育百分比2', trigger: ['blur', 'change'] },
            { validator:this.checkData , trigger: ['blur', 'change'] },
          ],
          numRaceThree: [
            { required:  true , message: '必填教育百分比3', trigger: ['blur', 'change'] },
            { validator:this.checkData , trigger: ['blur', 'change'] },
          ],
          numRaceFour: [
            { required:  true , message: '必填教育百分比4', trigger: ['blur', 'change'] },
            { validator:this.checkData , trigger: ['blur', 'change'] },
          ],
          numRaceFive: [
            { required:  true , message: '必填教育百分比5', trigger: ['blur', 'change'] },
            { validator:this.checkData , trigger: ['blur', 'change'] },
          ],
        },
      }
    },
    created() {
      //加载分页数据
      this.loadPageData();
    },
    mounted() {
    },
    methods: {
      checkData(rule, value, callback){
        if(0<=Number(value)&&Number(value)<=100){
          callback();
        }else{
          callback(new Error("教育百分比1格式不正确"))
        }
      },
      getFile(file,fileList){
        this.fileList = []
        let fd = new FormData()
        for (let i = 0; i <fileList.length ; i++) {
          fd.append('fileList',fileList[i].raw)
        }
        this.fileList = fd
      },
      //查询当前项目
      loadPageData(){
        selectTtWifiByPro().then(res=>{
          if(res.code=="success" && res.data[0]){
            this.temp=res.data[0];
          }
        }).catch(err=>{
          console.log(JSON.stringify(err))
        })
      },
      //增加/修改
      updateData(){
        this.loading=true
        this.$refs['dataForm'].validate((valid) => {
          // if(this.fileList.length==0&&this.temp.id==""){
          //   this.$message.error("请上传教育底图")
          //   this.loading=false
          //   return
          // }
          if (valid) {
            simpleUploads(this.fileList).then(res=> {
              this.temp.pictureUrl = res[0]
              let param=JSON.parse( JSON.stringify(this.temp));
              addOrUpdateTtWifi(param).then(res=>{
                if (res.code == "success") {
                  this.loading=false
                  this.$refs.clearData.clearData()
                  this.loadPageData()
                }
                this.$notify({
                  title: '操作提示',
                  message: res.msg,
                  type: res.code,
                  duration: 2000
                })
              })
            })
          }else{
            this.loading=false
          }
        })
      },
    },
  }
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
  .el-icon-male{
    color: #42b983;
    font-size: 20px;
    font-weight: bold;
  }
  .el-icon-female{
    color: palevioletred;
    font-size: 20px;
    font-weight: bold;
  }
  .el-icon-question{
    color: rebeccapurple;
    font-size: 20px;
    font-weight: bold;
  }
</style>
