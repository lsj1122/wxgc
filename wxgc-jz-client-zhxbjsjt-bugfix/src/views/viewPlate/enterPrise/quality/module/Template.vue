<template>
    <div style="height:100%" class="boot">   
      <div  class="top">
      <div></div>
            <el-select
     
              v-model="listQuery.proName"
              placeholder="请选择项目"
              @change="changeAir"
            >
              <el-option
               
                v-for="item in selectoptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              ></el-option>
            </el-select>
            </div> 
          <div class="bottom">
         <el-carousel trigger="click" height="320px" indicator-position= "none">
      <el-carousel-item v-for="item in tableData" :key="item" >
      <img :src="item.pictureFilePath" alt="" width="100%" height="100%">
      <div>{{item.text}}</div>
           <div class="bottom-text">
                <div class="text">
                  {{ item.text }}
                </div>
            </div>
      </el-carousel-item>
    </el-carousel>
       </div> 
    </div>
</template>

<script>
import { quailtydesli,sprayname } from "@/views/viewPlate/enterPrise/api/safetyManagement";
import {
  personInfo,
  attendance,
  chuqingInfo,
  zaichePeeple,
  projectName,
} from "@/views/viewPlate/enterPrise/api/enterPriseDescribe";
export default {

    name: 'WxgcJzClientTemplate',

    data() {
        return {
          projectName:"",
            tableData:[],
            selectoptions: [],
          listQuery:{
              proName:"",
               type:9,
            }
            
        };
    },
created(){
 
},
    mounted() {
  this.getProjectName();
       
            
    },

    methods: {

      // 切换项目名称
      changeAir(aa){
        console.log("项目名称",aa);
      // this.listQuery.proName = aa
        this.temple()
      },
        // 获取项目名称
    getProjectName() {
      projectName().then((res) => {
        if (res.code == "success") {
          this.selectoptions = res.data.map((item) => {
            return {
              value: item.proName,
            };
          });
   
          this.listQuery.proName = this.selectoptions[0].value
          console.log(222, this.projectName);
          this.temple()
          // // 添加全部
          // this.selectoptions.unshift({ value: "全部" });
          // console.log(this.selectoptions);
        }
      });
    },

          temple(){  
          console.log(1111,this.listQuery.proName);
      quailtydesli(this.listQuery)
        .then((res) => {
          if (res.code == "success") {
            this.tableData = res.data
            console.log("样板集", res.data);
          }
          
        })
        .catch((err) => {
          // console.log(JSON.stringify(err));
          // this.dataLoading = false;
        });
        }
    },
};
</script>

<style lang="scss" scoped>

.boot{
  height: 100%;
  width: 100%;
  position: relative;
.bottom{
  width: 100%;
  height: 330px;
  position: relative;
  position: absolute;
  bottom: 0%;
  left:0;
}
}
.top{
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
 padding-top: 8px;
}

.bottom-text{
  position: absolute;
  bottom: 0%;
  background: rgba(0, 0, 0, 0.379);
  height: 46px;
  width: 100%;
  .text{
    font-size: 14px;
    color: #fff;
    line-height: 46px;
    margin-left: 10px;
  }

}
</style>