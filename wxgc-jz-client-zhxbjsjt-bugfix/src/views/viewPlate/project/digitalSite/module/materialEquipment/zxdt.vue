<template>
  <div class="zxdt block">
    <div class="title">
      <div class="title_text">最新动态</div>
      <div>
        <el-button
        style=""
          size="small"
          @click="getNewWLinfo(0)"
          :class="{ active: isActive == 0 }"
          >收料</el-button
        >
        <el-button
          size="small"
          @click="getNewWLinfo(1)"
          :class="{ active: isActive == 1 }"
          >发料</el-button
        >
      </div>
    </div>
    <el-timeline class="content" v-loading="loading">
      <el-timeline-item
        :timestamp="item.date"
        placement="top"
        v-for="(item, index) in lineData"
        :key="index"
         
      >
        <el-card>
          <div style="color: #50ffc3">车牌号：{{ item.cph }}</div>
          <div>材料：{{ item.clmc }}</div>
          <div>实际重量：{{ item.sjzl }}</div>
          <!-- <div style="color: #e91959">重量偏差：{{ item.zlpc }}</div> -->
          <div>实际数量：{{ item.sjsl }}</div>
          <div style="color: #e91959">实际偏差：{{ item.sjwc? (item.sjwc +pclx):'暂无'}}</div>
        </el-card>
      </el-timeline-item>
      <p style="color: #b7b7b7" v-if="lineData.length<=0">暂无更多数据</p>
    </el-timeline>
  </div>
</template>

<script>
import { getNewWLinfo} from '../../api/wlys.js'
export default {
    data() {
        return {
            isActive: 0,
            dataSource: [
              [
                {
                  date: "20/05/19 12:03:19",
                  cph: "豫QW2345",
                  cl: "石砂",
                  sjzl: "26.8吨",
                  zlpc: "-2.4吨 / -8.3%",
                  sjsl: "11立方米",
                  slpc: "-1立方米 / -8.3%"
                },
               {
                 date: "20/05/19 13:12:56",
                  cph: "云AS4567",
                  cl: "砼",
                  sjzl: "18吨",
                  zlpc: "-1.2吨 / -5.5%",
                  sjsl: "8.5立方米",
                  slpc: "-0.5立方米 / -5.5%"
                },
                {
                  date: "20/05/20 12:45:19",
                  cph: "云VG4556",
                  cl: "干混砌筑砂浆(袋装)",
                  sjzl: "6.97吨",
                  zlpc: "6.97吨 / -12%",
                  sjsl: "6.97吨",
                  slpc: "-1.03吨 / -13%"
                },
                {
                  date: "20/05/21 2:15:54",
                  cph: "云VG2356",
                  cl: "石子",
                  sjzl: "5.668吨",
                  zlpc: "-1.33吨 / -19%",
                  sjsl: "5668立方米",
                  slpc: "-1332立方米 / -19%"
                }
              ],
              [
                {
                  date: "20/05/21 00:35:06",
                  cph: "津123333",
                  cl: "水泥",
                  sjzl: "21.031吨",
                  zlpc: "0吨 / 0%",
                  sjsl: "21.031吨",
                  slpc: "0吨 / 0%"
                }
              ]
            ],
            lineData: [],
            loading:true
        }
    },
    created() {
      // this.handLine(0)
      this.getNewWLinfo(0)
    },
    methods: {
      getNewWLinfo(unmber){
        this.loading =true
         this.isActive = unmber
        let obj =
          {lx:unmber,
          pageIndex:1,
          pageSize:-1,
          type:''
          }
        
        getNewWLinfo(obj).then(res=>{
            this.lineData = res.data.records
            this.loading =false
        }).catch(error=>{
           this.loading =false
        })
      },
      // handLine(value) {
      //   this.isActive = value
      //   this.lineData = this.dataSource[value]
      //   console.log(this.lineData, value);
      // }
    }
};
</script>

<style lang="less" scoped>
@import "./MQBaseStyle.less";

.zxdt {
  height: 100%;
  .content {
    height: 90%;
    overflow: auto;
    .el-card {
      color: #b7b7b7;
      background: none;
      border: 1px solid rgba(240, 248, 255, 0.3);
      text-align: left;
    }
  }
}
</style>