<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="margin-left:5px;">
      <el-row>
        <el-col :span="12">
          <el-form-item label="pm2.5" prop="pm2Value">
            <el-input v-model="temp.pm2Value" placeholder="pm2.5" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="pm10" prop="pm10Value">
            <el-input v-model="temp.pm10Value" placeholder="pm10" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="风速" prop="speed">
            <el-input v-model="temp.speed" placeholder="风速" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="噪声" prop="noise">
            <el-input v-model="temp.noise" placeholder="噪声" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="温度" prop="temp">
            <el-input v-model="temp.temp" placeholder="温度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="湿度" prop="humidity">
            <el-input v-model="temp.humidity" placeholder="湿度" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="this.projectId">
      <el-button type="primary" @click="updateData()">
        {{ $t('table.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import {selectRed,addOrUpdateTtYcjcRed}  from './api/ycjcworkdata.js'
  export default {
    name: 'projectInfo',
    components: {},
    data() {
      return {
        projectId: this.$store.getters.projectId,
        tableData: [], //当前数据
        temp: {
          "id": null,
          "pm2Value": null,
          "pm10Value": null,
          "speed": null,
          "noise": null,
          "temp": null,
          "humidity": null,
        },
        rules: { //校验功能
          pm2Value: [
            { required:  true , message: '必填pm2.5', trigger: ['blur', 'change'] },
          ],
          pm10Value: [
            { required:  true , message: '必填pm10', trigger: ['blur', 'change'] },
          ],
          // speed: [
          //   { required:  true , message: '必填风速', trigger: ['blur', 'change'] },
          // ],
          // noise: [
          //   { required:  true , message: '必填噪声', trigger: ['blur', 'change'] },
          // ],
          // temp: [
          //   { required:  true , message: '必填温度', trigger: ['blur', 'change'] },
          // ],
          // humidity: [
          //   { required:  true , message: '必填湿度', trigger: ['blur', 'change'] },
          // ],
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
      //查询当前
      loadPageData(){
        selectRed().then(res=>{
          if(res.data){
            this.temp=res.data;
          }
        }).catch(err=>{
          console.log(JSON.stringify(err))
        })
      },
      //增加/修改
      updateData(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let param=JSON.parse( JSON.stringify(this.temp));
            addOrUpdateTtYcjcRed(param).then(response => {
              if (response.code == "success") {
                this.loadPageData()
              }
              this.$notify({
                title: '操作提示',
                message: response.msg,
                type: response.code,
                duration: 2000
              })
            })
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
