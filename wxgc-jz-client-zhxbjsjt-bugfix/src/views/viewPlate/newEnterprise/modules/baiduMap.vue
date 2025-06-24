<template>
  <div class="content-mid mapBox">
    <div class="bm-view" id="mapBOX">
      <!-- <div id="mapBOX" class="divmap"></div> -->
    </div>
    <div class="query-form">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-select
            v-model="mapSelect.projectId"
            size="small"
            placeholder="请选择项目"
          >
            <!-- <el-option value label="请选择项目"></el-option> -->
            <el-option
              v-for="(item, index) in projectOptions"
              :key="index"
              :label="item.projectName"
              :value="item.projectId"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="10">
          <el-select
            v-model="mapSelect.proType"
            size="small"
            placeholder="请选择工程类型"
          >
            <!-- <el-option value label="请选择"></el-option> -->
            <el-option
              v-for="(item, index2) in selOptions.dict2"
              :key="index2"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="2">
          <img
            style="cursor: pointer"
            src="../../../../assets/viewplate/screen.png"
            alt
            @click="searchProject"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { selectBigScreenCore } from "../api.js";
var $ = require("jquery");
import BaiMap from "BaiMap";
export default {
  name: "WxgcJzClientBaiduMap",

  data() {
    return {
      zoom: 14,
      projectOptions: [],
      mapSelect: {},
      center: { lng: 112.610688, lat: 26.896785 },
      mapLabelStyle: {
        // 设置label的样式
        color: "#d1e0e3",
        fontSize: "15px",
        boxShadow: "inset 0 0 5px #d1e0e3",
        background: "#081333",
        padding: "5px 15px",
        border: "1px solid #000",
        borderRadius: "3px",
      },
      mapLabelStyle2: {
        // 设置label的样式
        color: "#ffffff",
        fontSize: "14px",
        //  background: "#081333",
      },
      selOptions: {
        dict2: [
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
      },
    };
  },
  created() {
    this.getprojectInfo();
  },
  mounted() {},

  methods: {
    getprojectInfo() {
      selectBigScreenCore().then((res) => {
        console.log("大屏中心", res);
        this.projectOptions = res.data;
        (this.center = {
          lng: this.projectOptions[0].longitude,
          lat: this.projectOptions[0].dimension,
        }),
          this.initMap();
      });
    },
    // 地图函数方法
    initMap() {
      this.map = new BaiMap.Map("mapBOX");
      let point = new BaiMap.Point(this.center.lng, this.center.lat);
      //   this.map.setMapType(BMAP_EARTH_MAP);
      this.map.centerAndZoom(point, this.zoom);
      this.map.enableScrollWheelZoom(true); //启用滚轮放大缩小，默认禁用
      this.map.enableDragging(); //启用地图拖拽，默认启用
      this.map.enableDoubleClickZoom(); //启用双击放大，默认启用
      this.map.setMapStyleV2({
        styleId: "5TAdQxNjeZCWufCCglgwe1nyCktQnwTE",
      });
      this.queryMapData();
    },
    queryMapData() {
      this.addLabel();
    },
    addLabel() {
      var _this = this;
      //加载地图的数据
      this.map.clearOverlays();
      this.projectOptions.forEach((item) => {
        let point = new BaiMap.Point(
          Number(item.longitude) - 0.0005,
          Number(item.dimension) + 0.0005
        ); //x,y 坐标
        let label = new BaiMap.Label(
          `<a></a><i class="el-icon-office-building"></i>${item.projectName}`,
          {
            // 创建文本标注
            position: point,
            offset: new BaiMap.Size(0, 0),
          }
        );
        this.map.addOverlay(label); // 将标注添加到地图中
        label.setStyle(this.mapLabelStyle); //添加样式

        label.addEventListener("click", (res) => {
          console.log(174, res);
          console.log(174, item.projectId);
          for (var j = 0; j < _this.projectOptions.length; j++) {
            if (item.projectId == _this.projectOptions[j].projectId) {
              if (_this.projectOptions[j].onclickNumber == 1) {
                return;
              }
              _this.projectOptions[j].onclickNumber = 1;

              let pointDiv = new BaiMap.Point(
                Number(item.longitude) + 0.0006 - 0.0005,
                Number(item.dimension) + 0.0005
              ); //x,y 坐标
              let proBox = new BaiMap.Label(
                `<div class ='showProjectBox'>
                     <span class ='span1' name='${j}' @click="cancelSpan()"></span>
                     <p><i></i>${_this.projectOptions[j].projectName}</p>
                    
                     <p><i>项目类型: </i>${_this.projectOptions[j].projectType}</p>
                     <div style='display:flex;'> 
                     <i>设备统计: </i>   

                     <div class='right'>
                     <div>塔式起重机 ${_this.projectOptions[j].tj} 台</div> 
                     <div>施工升降机 ${_this.projectOptions[j].td} 台</div>
                     <div>水泥标养 ${_this.projectOptions[j].snbys} 台</div>
                     <div>扬尘检测 ${_this.projectOptions[j].ycjc} 台</div>
                     <div>智慧水电 ${_this.projectOptions[j].wisdomHydropower} 台</div>
                     <div>人数识别 ${_this.projectOptions[j].people} 台</div>
                     <div>卸料平台 ${_this.projectOptions[j].xlpt} 台</div>
                     <div>水质监测 ${_this.projectOptions[j].szjc} 台</div>
                     <div>喷淋控制器 ${_this.projectOptions[j].spray} 台</div>
                     <div>临边防护 ${_this.projectOptions[j].protect} 台</div>
                     </div>
                     </div> 
            
              
                
                     <span class='span2'">进入项目 ></span>
                  </div>`,
                {
                  // 创建文本标注
                  position: pointDiv,
                  offset: new BaiMap.Size(0, 0),
                }
              );
              _this.map.addOverlay(proBox); // 将标注添加到地图中
              proBox.setStyle(_this.mapLabelStyle2); //添加样式
              // proBox.addEventListener("click", (res) => {

              // });

              $(".showProjectBox .span2").each(function () {
                $(this).click(function () {
                  _this.$store.dispatch(
                    "project/setProjectId",
                    _this.projectOptions[j].projectId
                  );
                  _this.$store.dispatch(
                    "project/setProjectName",
                    _this.projectOptions[j].projectName
                  );
                  _this.$store.dispatch("project/setProjectChildrenIds", "");

                  _this.$nextTick(function () {
                    _this.$router.push("/viewPlate/describe/describe");
                  });
                });
              });

              $(".showProjectBox .span1").each(function () {
                $(this).click(function () {
                  var j = $(this).attr("name");
                  _this.projectOptions[j].onclickNumber = 0;
                  $(this).parent().remove();
                });
              });

              return;
            }
          }
        });
      });
    },
    proNameSelect1() {},
    searchProject() {
      // 选择后调整 地图的位置
      console.log(this.mapSelect);

      if (this.mapSelect.projectId) {
        let obj = this.projectOptions.filter((element) => {
          return element.projectId == this.mapSelect.projectId;
        });

        // 去取 横纵坐标
        let point = new BaiMap.Point(obj[0].longitude, obj[0].dimension);
        this.map.centerAndZoom(point, this.zoom + 3);
      } else {
        alert("请先选择项目");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
//中间大模块
.content-mid {
  //  border: 2px solid pink;
  width: 100%;
  height: 100%;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("../../../../assets/viewplate/bgc.png") no-repeat;
  background-size: 100% 100%;

  /////
  .query-form {
    position: absolute;
    top: 20px;
    left: 50%;
    z-index: 99;
    transform: translate(-50%, -10px);
    .mapQuery-btn {
      display: inline-block;
      height: 30px;
      width: 30px;
      font-size: 23px;
      line-height: 30px;
      // background: #010220;
      text-align: center;
      border: 1px solid #0d85a9;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
/* 地图 */
.mapBox {
  position: relative;
  height: 100%;
  ::v-deep label.BMapLabel {
    a {
      display: block;
      position: absolute;
      left: -26px;
      top: 0;
      width: 20px;
      height: 28px;
      background: url("../../../../assets/viewplate/map_label_ico.png")
        no-repeat;
    }
  }
  .bm-view {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -55%);
    width: 62vh;
    height: 62vh;
    border-radius: 50%;
    overflow: hidden;
    // background: pink;
    // box-shadow: 0 0  100px rgba(8, 48, 128, 1);
    box-shadow: 0 0 10px 20px rgb(5, 77, 234, 0.4);
    // .divmap {
    //      width: calc( 100% - 20px);
    //      height:calc( 100% - 20px) ;

    //   position: absolute;
    //   top: 50%;
    //   left: 50%;
    //   border-radius: 50%;
    //   transform: translate(-50%, -50%);
    // }
  }
  ::v-deep .showProjectBox {
    padding: 10px;
    padding-left: 30px;
    width: 400px;
    height: 260px;
    font-weight: 400;
    background: url("../../../../assets/viewplate/picture_tankuang.png")
      no-repeat;
    position: absolute;
    z-index: 9999;
    background-size: 400px 260px;
    color: #fff;
    p {
      width: 350px !important;
      i {
        margin-right: 10px;
      }
    }
    p:nth-of-type(1) {
      color: #0a94ff;
      font-family: PingFang SC;
      font-size: 18px;
      i {
        display: inline-block;
        width: 24px;
        height: 15px;
        background: url("../../../../assets/viewplate/picture_jiantou.png")
          no-repeat;
        background-size: 24px 15px;
        margin-right: 15px;
      }
    }
    p:nth-of-type(2) {
    }
    .span1 {
      display: inline-block;
      padding: 12px;
      width: 20px;
      height: 20px;
      position: absolute;
      top: 25px;
      right: 20px;
      background: url("../../../../assets/viewplate/picture_guanbi.png")
        no-repeat;
      background-size: 20px 20px;
    }
    .span2 {
      color: #0090ff;
      padding: 10px 0;
    }
    .right {
      margin-left: 10px;
      width: 250px;
      display: flex;
      flex-wrap: wrap;
      div {
        width: 50%;
      }
    }
  }
}
::v-deep .anchorBL {
  display: none;
}
</style>