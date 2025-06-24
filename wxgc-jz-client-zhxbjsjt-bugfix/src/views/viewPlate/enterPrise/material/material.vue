<template>
   <div class="content">
    <timeButton @zongLanChoose="Handover"></timeButton>
    <div class="content-box">
      <!--  -->
      <div class="content-left">
        <com-line
          class="content-left-top"
          :title="'本月收料车次统计'"
          :title2="'Statistics of vehicles receiving materials this month'"
        >     
          <div class="icon-document">
            <div class="safetyPro" style="height: 100%">
              <vehicles ref="spEcharts"></vehicles>
            </div>
          </div>
        </com-line>

        <com-line
          class="content-left-top"
          :title="'本月材料重量统计'"
          :title2="'Material weight statistics of this month'"
        >
          
  
          <div class="icon-document">
            <div class="safetyMend" style="height: 100%">
              <weight ref="smend"></weight>
            </div>
          </div>
        </com-line>
      </div>
      <!--  -->
      <div class="content-mid">
        <com-line
          class="content-left-top"
          :title="'本月收料单位统计'"
          :title2="'Statistics of material receiving unit in this month'"
        >
     
          <div class="icon-document">
            <div class="dangerEcharts" style="height: 100%">
              <receiving ref="dangerEcharts"></receiving>
            </div>
          </div>
        </com-line>
        <com-line
          class="content-left-top"
          :title="'累计收料过磅统计'"
          :title2="'Cumulative material receipt weighing statistics'"
        >
         
          <div class="icon-document">
            <div class="equipmentEcharts" style="height: 100%">
              <receipt ref="equipEcharts"></receipt>
            </div>
          </div>
        </com-line>
      </div>

      <div class="content-right">
          <com-line
          class="content-left-top"
          :title="'材料过磅明细'"
          :title2="'Material weighing details'"
        >
        
        
          <div class="icon-document">
            <div class="safetyEducation" style="height: 100%;">
              <weighingDetails ref="sEducation"></weighingDetails>
            </div>
          </div>
        </com-line>
      
     
      </div>
    </div>
    
  </div>
</template>

<script>
import ComLine from "../../components/comline";
import timeButton from "../aModules/timeButton";
import vehicles from "./modele/vehicles.vue";
import weight from "./modele/weight.vue"; 
import receiving from "./modele/receiving.vue"; 
import receipt from "./modele/receipt.vue";
import weighingDetails from "./modele/weighingDetails.vue";

export default {
    name: 'material',

    data() {
        return {
            
        };
    },
components:{
    ComLine,
    timeButton,
    vehicles,
    weight,
    receiving,
    receipt,
    weighingDetails
},
    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="scss" scoped>
.content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // min-height: 830px;
  // overflow:auto;
  display: flex;
  flex-direction: column;
  .content-box {
    display: flex;
  }
}

/*   内容的左边 */
.content-left {
  // width: 600px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  //    border: 2px solid pink;
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 中间 */
.content-mid {
  //    border: 2px solid pink;
  position: relative;
  // width: 600px;
  flex: 1;
  min-width: 600px;
  flex-grow: 1;
  display: flex;
  margin: 0 18px;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
 
  .icon-document {
    width: 100%;
    height: 37vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}

/*   内容的 右边 */
.content-right {
  //    border: 2px solid pink;
  // width: 600px;
  flex: 1;
    min-width: 600px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  .icon-document {
    width: 100%;
    height: 80vh;
    min-height: 300px;
    box-sizing: border-box;
  }
}
.vp-project-content .el-button {
  // 默认状态
  background: none;
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 186, 255, 0.5);
}
.active {
  //选中状态
  color: #00baff !important;
  border: 1px solid rgba(0, 186, 255, 1) !important;
}
::v-deep .el-dialog .el-dialog__header {
  margin-top: 20px;
  .el-dialog__title {
    color: #fff;
  }
}
::v-deep .el-dialog {
  width: 50%;
  // max-height: 680px;
  min-height: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0vh !important;
}
::v-deep .el-pagination {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>