<template>
  <div class="app">
    <div ref="map_canvas" id="map_canvas">
         
    </div>

    <div class="bottonBac">
         <!-- <el-date-picker
              style="width: 180px;
    margin-top: 10px;
    margin-left: 20px; 
    "
              v-model="time1"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker> -->
       <img src="@/assets/ht.png" alt="" @click="decelerate" />
                <img
                  v-if="zt == 1"
                  src="@/assets/zt.png"
                  alt=""
                  @click="stopMap"
                />
                <img v-if="zt == 0" src="@/assets/play.png" @click="startMap" />
                <img src="@/assets/kj.png" @click="accelerate" alt="" />

              <button @click="rest">返回上一层</button>  
     <!-- <button @click="startMap">开始</button>
    <button @click="stopMap">暂停</button>
    <button @click="accelerate">加速</button>
    <button @click="decelerate">减速</button>
    <button @click="rest">返回</button> -->
  </div>
  </div>
</template>

<script>
import { array } from "jszip/lib/support";
import { helper } from "echarts/lib/export";
export default {
  name: "consultMap",

  props: {
    lookData: Array
  },
  data() {
    return {
      zt:0,
      // 保存覆盖物小车
      marker: {},
      // 小车的初始速度
      speed: 300,
      // 【重点！！！】存放 ajax 请求的数据
      pois: [],
      // 对数据进行处理转换成百度需要的经纬度数据
      arrPois: [],
      // 保存百度地图的对象
      map: null,
      // 保存路书的对象
      lushu: null,
      // 保存导航用来生成路线对象
      drv: null,
      dialogFormVisible: false,
      num: {
        data: 2022
      },
    };
  },

  mounted() {
    console.log("地图......................");

    this.pois = this.lookData;
    console.log("数据",this.pois);
  
  },
  created() {},
  watch: {
    lookData:{
    deep: true,
    handler(newVal) {
      this.pois = newVal;
       this.arrPois = this.pois.map(
      item => new BMap.Point(Number(item.lng), Number(item.lat))
    );
       this.initBaiduMap();
    }
    }
  },
  methods: {
    rest() {
      this.$emit("clickGoback");
    },
    open() {
      this.dialogFormVisible = true;
    },
    startMap() {
      this.marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
      this.marker.hide();
      this.lushu.start();
      this.zt = 1
    },
    stopMap() {
      this.lushu.pause();
      this.zt = 0
    },
    accelerate() {
      this.lushu._opts.speed = this.lushu._opts.speed + 100;
    },
    decelerate() {
      this.lushu._opts.speed = this.lushu._opts.speed - 100;
    },
    // 初始化百度地图
    initBaiduMap() {
      this.map = new BMap.Map(this.$refs.map_canvas);
      // 启用滚轮放大缩小
      this.map.enableScrollWheelZoom();
      // 设置地图中心点和缩放登记
      this.map.centerAndZoom(
        new BMap.Point(116.869041, 31.637099),
        14
      );
      this.initDrivingRoute();
    },
    // 实例化一个驾车导航用来生成路线
    initDrivingRoute() {
      var self = this;
      this.drv = new BMap.DrivingRoute(this.map, {
        onSearchComplete: function(res) {
          if (self.drv.getStatus() == BMAP_STATUS_SUCCESS) {
            // 将数据显示到地图上
            self.map.setViewport(self.arrPois);

            // 设置开始时候的小车图标
            self.marker = new BMap.Marker(self.arrPois[0], {
              icon: new BMap.Icon(
                require("@/assets/Group.svg"),
                new BMap.Size(40, 52),
                { anchor: new BMap.Size(27, 13) }
              )
            });

            // 开始时候小车上显示的提示文字
            var label = new BMap.Label("请点击开始", {
              offset: new BMap.Size(0, -50)
            });
            label.setStyle({
              border: "1px solid rgb(204, 204, 204)",
              color: "rgb(0, 0, 0)",
              borderRadius: "4px",
              padding: "10px",
              background: "rgb(255, 255, 255)"
            });
            self.marker.setLabel(label);
            self.map.addOverlay(self.marker);

            // 控制小车移动的核心方法，就是不断绘制覆盖物小车
            BMapLib.LuShu.prototype._move = function(
              initPos,
              targetPos,
              effect
            ) {
              var pointsArr = [initPos, targetPos]; //点数组

              var me = this,
                //当前的帧数
                currentCount = 0,
                //步长，米/秒
                timer = 1,
                step = this._opts.speed / (1000 / timer),
                //初始坐标
                init_pos = this._projection.lngLatToPoint(initPos),
                //获取结束点的(x,y)坐标
                target_pos = this._projection.lngLatToPoint(targetPos),
                //总的步长
                count = Math.round(
                  me._getDistance(init_pos, target_pos) / step
                );

              //显示折线
              this._map.addOverlay(
                new BMap.Polyline(pointsArr, {
                  strokeColor: "blue",
                  strokeWeight: 5,
                  strokeOpacity: 0.5
                })
              );

              //如果小于1直接移动到下一点
              if (count < 1) {
                me._moveNext(++me.i);
                return;
              }

              me._intervalFlag = setInterval(function() {
                //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
                if (currentCount >= count) {
                  clearInterval(me._intervalFlag);
                  if (me.i < me._path.length) {
                    var data_info = [];
                    var cc = me.i;
                    if (me.i % 33 == 0) {
                      for (var i in self.arrPois[cc]) {
                        var str = self.arrPois[cc][i];
                        data_info.push(str);
                      }
                    }
                    self.lushu._opts.defaultContent = self.pois[me.i].tim + (self.pois[me.i].posture == 0 ? "sos":self.pois[me.i].posture == -1 ? "脱帽":self.pois[me.i].posture == -2 ? "倒地":"正常");
                    // self.lushu._opts.defaultContent = ;
                    var opts = {
                      width: 250, // 信息窗口宽度
                      height: 80, // 信息窗口高度
                      title: "信息窗口", // 信息窗口标题

                      enableMessage: true //设置允许信息窗发送短息
                    };

                    for (var i = 0; i < data_info.length; i++) {
                      var marker = new BMap.Marker(
                        new BMap.Point(data_info[0], data_info[1])
                      ); // 创建标注
                      var content = data_info[0] + "," + data_info[1];

                      self.map.addOverlay(marker); // 将标注添加到地图中
                      addClickHandler(content, marker);
                    }

                    function addClickHandler(content, marker) {
                      marker.addEventListener("click", function(e) {
                        openInfo(content, e);
                      });
                    }
                    function openInfo(content, e) {
                      var p = e.target;
                      var point = new BMap.Point(
                        p.getPosition().lng,
                        p.getPosition().lat
                      );
                      var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
                      map.openInfoWindow(infoWindow, point); //开启信息窗口
                    }
                  }

                  //移动的点已经超过总的长度
                  if (me.i > me._path.length) {
                    return;
                  }
                  //运行下一个点
                  me._moveNext(++me.i);
                } else {
                  currentCount++;
                  var x = effect(init_pos.x, target_pos.x, currentCount, count),
                    y = effect(init_pos.y, target_pos.y, currentCount, count),
                    pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
                  //设置marker
                  if (currentCount == 1) {
                    var proPos = null;
                    if (me.i - 1 >= 0) {
                      proPos = me._path[me.i - 1];
                    }
                    if (me._opts.enableRotation == true) {
                      me.setRotation(proPos, initPos, targetPos);
                    }
                    if (me._opts.autoView) {
                      if (!me._map.getBounds().containsPoint(pos)) {
                        me._map.setCenter(pos);
                      }
                    }
                  }
                  //正在移动
                  me._marker.setPosition(pos);
                  //设置自定义overlay的位置
                  me._setInfoWin(pos);
                }
              }, timer);
            };
            self.lushu = new BMapLib.LuShu(self.map, self.arrPois, {
              defaultContent: self.lookData[0].tim +(self.lookData[0].posture == 0 ? "sos":self.lookData[0].posture == -1 ? "脱帽":self.lookData[0].posture == -2 ? "倒地":"正常") ,
              autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
              // 一直显示的汽车图标
              icon: new BMap.Icon(
                  require("@/assets/Group.svg"),
                new BMap.Size(40, 52),
                { anchor: new BMap.Size(27, 13) }
              ),
              // 运动的速度
              speed: self.speed,
              enableRotation: false, //是否设置marker随着道路的走向进行旋转
              // 到达终点时候显示的坐标位置和提示文字
              landmarkPois: [
                {
                  lng: self.arrPois[self.arrPois.length - 1].lng,
                  lat: self.arrPois[self.arrPois.length - 1].lat,
                  html: "已完成",
                  pauseTime: 2
                }
              ]
            });
          }
        }
      });

      // 开始的位置，就是 数组的 0 下标
      let start = new BMap.Point(this.arrPois[0].lng, this.arrPois[0].lat);
      // 结束位置，就是 数组的 最后一个下标
      let end = new BMap.Point(
        this.arrPois[this.arrPois.length - 1].lng,
        this.arrPois[this.arrPois.length - 1].lat
      );

      // 开始搜索，将会自动触发回调函数  onSearchComplete
      this.drv.search(start, end);
    }
  }
};
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 95vh;
  z-index: 99999;
  position: absolute;
  left: 0;
  top: 0;

  #map_canvas {
    width: 100%;
    height: 75vh;
  }
  .bottonBac{
       position: absolute;
    z-index: 9999999;
    right: 4%;
  bottom: 22%;
    background: #001c40;
    border-radius: 2%;
    width: 14%;
    height: 10%;
    // left: 2%;
    img{
      width: 25px;
        height: 25px;
        margin-left: 45px;
        margin-top: 10px;
    }
     button {
          height: 33px;
       background: #1890ff;
    color: #fff;
    width: 100px;
    margin-left: 30%;
    margin-top: 10px;
  }
  }
 
}
</style>
