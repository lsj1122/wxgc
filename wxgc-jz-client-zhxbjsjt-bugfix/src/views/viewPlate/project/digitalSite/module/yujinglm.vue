<template>
  <div
    class="imgbox"
    @scroll="calculateOfffset"
    @mouseup="handleup"
    @mousemove="handlemove($event)"
  >
    <!-- 塔吊上面标签 -->
    <!-- <div
      class="biaoqian bianqian1"
      @click.stop="clickTaDiao(1)"
      :class="{ activate: activateIndex == 1 }"
    >
      1号塔吊
    </div>
    <div
      class="biaoqian bianqian2"
      @click.stop="clickTaDiao(2)"
      :class="{ activate: activateIndex == 2 }"
    >
      2号塔吊
    </div>
    <div
      class="biaoqian bianqian3"
      @click.stop="clickTaDiao(3)"
      :class="{ activate: activateIndex == 3 }"
    >
      3号塔吊
    </div> -->
    <!-- 图例数据 -->
    <div class="legend">
      <span v-for="(item, index) in typeTaJi" :key="index" style="legend-span"
        ><i
          :style="{
            backgroundColor: item.type,
          }"
          @mousedown="downItem($event, item.type, item.machineName)"
        ></i
        ><b @mousedown="downItem($event, '#ffffff', item.machineName)">{{
          item.machineName
        }}</b></span
      >
      <!-- <span
        ><i class="erhaoColor" @mousedown="downItem($event, '#9907fe')"></i
        >2号塔吊</span
      >
      <span
        ><i class="sanhaoColor" @mousedown="downItem($event, '#fe8207')"></i
        >3号塔吊</span
      > -->
    </div>
    <!-- 页面中的显示框 -->
    <div class="tankuang">
      <h3>预警螺母监测预警</h3>
      <el-select
        v-model="optionsValue"
        placeholder="请选择"
        @change="changeSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.machineName"
          :value="item.machineName"
        >
        </el-option>
      </el-select>
      <div class="table">
        <el-table
         class="scrollTable"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
            height="450"
        >
          <el-table-column prop="mvalue" label="状态" width="90">
            <template slot-scope="scope">
              <span class="font-class">{{
                scope.row.mvalue == 0 ? "正常" : "预警"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="mid" label="内容" width="200">
            <!-- <template slot-scope="scope">
              <span class="font-class">{{ scope.row.mid }}</span> 
            </template> -->
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 塔吊图片 -->
    <!-- <img
      id="imgWh"
      :src="yujinluomiIamge"
      alt=""
      srcset=""
      class="foundpit-img"
      @click.stop="hiddenBounced"
    /> -->
      <div id="imgWh"  class="foundpit-img"  @click.stop="hiddenBounced" :style="{backgroundImage:'url('+yujinluomiIamge+')'}">
      </div> 
    <!-- 跟随鼠标移动的小圆点 -->
    <i
      id="movitem"
      v-show="ismove"
      :style="{
        top: moveItem.valueY + 'px',
        left: moveItem.valueX + 'px',
        background: moveItem.bg,
      }"
    ></i>

    <!-- 标记过的小圆点（每个点） -->
    <span
      @click.stop="
        showDelete(item.id, item.xlocation, item.ylocation, item.type)
      "
      v-for="(item, index) in dataArr"
      class="jikendian"
      :class="{
        title: item.type == '#ffffff',
      }"
      :key="index"
      :style="{
        left: item.xlocation * 100 + '%',
        top: item.ylocation * 108 + '%',
        backgroundColor: item.type,
      }"
    >
      {{ item.type == "#ffffff" ? item.machineName : "" }}
    </span>
    <!-- 点击小圆点出现的删除框 -->
    <span
      class="shanchukuang"
      v-if="DeleteTanKuang"
      @click.stop="deleteBiaoJi()"
      :style="{
        left: deletedData.xlocation * 100 + '%',
        top: deletedData.ylocation * 108 + '%',
      }"
      >删除</span
    >
  </div>
</template>

<script>
import {
  getAllYuJingLm,
  addYuJingLm,
  deleteYuJingLm,
  getYuJingLuoMoList,
  TaJiInfo,
} from "../api/yujinglm";
import { selectType } from "@/views/sysproject/api/ttuploadfile";
export default {
  created() {
   
    //点的信息
    this.getAllYuJingLm1();
    this.initData(); // 读取图片的接口
    // if(this.$store.state.user.name =="hfkjg"  ||
    //    this.$store.state.project.projectName == '合肥市科技馆新馆（自然博物馆）'){
    //      this.linkShow =true
    //    }else{
    //       this.linkShow =false
    //    }
   
  },
  mounted() {
    this.calculateOfffset();
    // 得塔机的信息
    this.getTaJiInfo();
  },
  data() {
    return {
       linkShow:false,  //当时false 的时候 是修改后的样式，ture,让它显示之前的样式
      yujinluomiIamge: "",
      // 传的是点的类型，也是点的颜色
      typeColor: [
        "#078dff",
        "#9907fe",
        "#fe8207",
        "#C04A0B",
        "#359658",
        "#E5FE58",
        "#967814",
        "#899395",
        "#BEE0CA",
        "#4D5A3A",
      ],
      typeTaJi: [],
      // 塔吊上方
      activateIndex: 1,
      DeleteTanKuang: false,
      // 点击删除 小圆点的数据
      deletedData: {
        id: "",
        xlocation: 0,
        ylocation: 0,
      },
      // 小圆点数组
      dataArr: [],
      // 图片宽高
      imgLength: {
        w: 0,
        h: 0,
      },
      parentOffset: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      },
      // activateIndex: 1,
      moveItem: {
        bg: "",
        valueX: "",
        valueY: "",
      },
      //添加测点的参数
      ttwarningnut: {
        picType: "",
        pointNumber: "",
        valueX: "",
        valueY: "",
        type: "",
        XLocation: "",
        YLocation: "",
      },
      ismove: false,
      mouseUP: true,

      // select现行选中项
      optionsValue: "",

      // select下拉数据
      options: [],

      // 表格数据
      tableData: [],
      // 1号塔机数据
      tj1: [
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 001#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 002#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 003#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 004#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 005#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 006#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 007#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 008#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 009#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 010#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 011#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 012#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 013#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 014#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 015#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 016#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 017#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 018#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 019#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 020#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 021#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 022#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 023#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 024#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 025#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 026#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 027#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 1号塔机 028#",
        },
      ],
      // 2号塔机数据
      tj2: [
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 001#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 002#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 003#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 004#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 005#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 006#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 007#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 008#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 009#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 010#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 011#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 012#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 013#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 014#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 015#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 016#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 017#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 018#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 019#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 020#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 021#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 022#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 023#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 2号塔机 024#",
        },
      ],

      // 3号塔机数据
      tj3: [
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 001#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 002#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 003#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 004#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 005#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 006#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 007#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 008#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 009#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 010#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 011#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 012#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 013#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 014#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 015#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 016#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 017#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 018#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 019#",
        },
        {
          mvalue: "0",
          mid: "预警螺母 3号塔机 020#",
        },
      ],
    };
  },
  methods: {
    // 背景图
    initData() {
      selectType(19).then((res) => {
        console.log("背景图",res)
        if (res.data.length != 0) {
          this.yujinluomiIamge = res.data[0].pictureFilePath;
        }
      });
    },
    // 获取塔机的信息
    getTaJiInfo() {
      TaJiInfo({ pageIndex: 1, pageSize: 20 }).then((res) => {
        console.log("塔机的信息：", res);
        if (res.code == "success") {
          this.typeTaJi = res.data.records;
          // 关联选择
          this.options =res.data.records
          this.optionsValue =res.data.records?res.data.records[0].machineName:''
          // 如果预警落寞数只有一个 ，或者少于一个，，，默认自动匹配色号
          this.typeTaJi.forEach((item, index) => {
            item.type = this.typeColor[index];
          });
          console.log(541, this.typeTaJi);
          //已经布置过点的状态

          var newDataArr = this.dataArr;
          for (var i = 0; i < newDataArr.length; i++) {
            if (newDataArr[i].machineName == null) {
              newDataArr.splice(i, 1);
            }
          }
          var filternewDataArr = this.unique(newDataArr); //根据对象进行筛选  （并且筛选后的值）
          for (var i = 0; i < filternewDataArr.length; i++) {
            // 为了，#ffffff的值
            if (filternewDataArr[i].type == "#ffffff") {
              filternewDataArr.splice(i, 1);
            }
          }
          console.log(547, filternewDataArr);
          // 通过比较 塔机名字相同,添加 对应  塔机 的颜色
          for (var a = 0; a < this.typeTaJi.length; a++) {
            for (var b = 0; b < filternewDataArr.length; b++) {
              if (
                this.typeTaJi[a].machineName == filternewDataArr[b].machineName
              ) {
                this.typeTaJi[a].type = filternewDataArr[b].type;
              }
            }
          }
          console.log( 591,this.typeTaJi)
           //表格数据
          this.initialize();
        }
      });
    },
    unique(arr1) {
      const res = new Map();
      return arr1.filter((a) => !res.has(a.type) && res.set(a.type, 1));
    },
    //点击图片 隐藏删除框
    hiddenBounced() {
      this.DeleteTanKuang = false;
    },
    // 点击小圆点 显示删除框
    showDelete(id, xlocation, ylocation, type) {
      this.deletedData.id = id;
      this.deletedData.xlocation = xlocation;
      this.deletedData.ylocation = ylocation;
      this.DeleteTanKuang = true;

      console.log(xlocation);
      console.log(ylocation);
      //machineName 存在，则是标题

      if (type == "#ffffff") {
        this.deletedData.xlocation = Number(xlocation) + 80 / this.imgLength.w;
        this.deletedData.ylocation = Number(ylocation) + 5 / this.imgLength.h;
      }
    },
    // 刚进页面 给表格默认赋值 塔吊1的数据
    initialize() {
      let _this = this;
      // this.tableData = this.tj1;
      //预警螺母监测预警
      getYuJingLuoMoList().then((res) => {
        //mvalue 0 正常 ，1 预警

        if (res.length > 0) {
          console.log("606预警螺母监测预警", res);
          //修改数据
          var newArr = res;
          newArr.forEach((element) => {
            element.mid = "预警螺母" + " " + element.mid + "#";
          });
          console.log(522, newArr);
          _this.tableData = newArr;
        } else {
          console.log(627,this.typeTaJi)
          var eve =this.typeTaJi.length>0?this.typeTaJi[0].machineName :"塔机"
          // 对静态数据进行处理
           this.tj1.forEach((item,index)=>{   //预警螺母 1号塔机 001#
         var number =""
         var number2=index+1
         if(number2<10){
            number ="00" + number2
         }else if(10<=number2<100){
           number ="0" + number2
         }
        item.mid = "预警螺母" +" "+ eve  +' '+ number +"#"
      })
       this.tableData = this.tj1;

        this.$nextTick(function () {
            this.scrollAnima();
          }); 
      
        }
      });
    },
    deleteBiaoJi() {
      // 删除预警螺母
      console.log(this.deletedData.id);
      this.$confirm("此操作将删除该标记, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteYuJingLm(this.deletedData.id).then((res) => {
            if (res.code == "success") {
              // 重新请求后端小圆点数据
              this.getAllYuJingLm1();
              // 隐藏删除框
              this.DeleteTanKuang = false;
              // 隐藏拖动时的小圆点
              this.ismove = false;
            }
          });

          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          // 隐藏删除框
          this.DeleteTanKuang = false;
        });
    },
    getAllYuJingLm1() {
      // 获取预警螺母数据
      getAllYuJingLm().then((res) => {
        console.log("获取预警螺母数据点的", res);
        if (res.data.length > 0) {
          this.dataArr = res.data;
        }
      });
    },
    // 页面相关数据
    calculateOfffset() {
      this.$nextTick(() => {
        let combox = document.querySelector(".com-box");
        let parentbox = document.querySelector(".imgbox");
        this.parentOffset.y = combox.offsetTop + parentbox.offsetTop;
        this.parentOffset.x = combox.offsetLeft + parentbox.offsetLeft;
        //求取容器宽 高
        this.parentOffset.w = parentbox.offsetWidth;
        this.parentOffset.h = parentbox.offsetHeight;
        //求图片的宽、高
        this.imgLength.w = document.querySelector("#imgWh").offsetWidth;
        this.imgLength.h = document.querySelector("#imgWh").offsetHeight;
      });
    },
    // clickTaDiao(index) {
    //   // 点击塔吊上面对应的标签事件
    //   this.activateIndex = index;
    //   if (index == 1) {
    //     this.changeSelect("1号塔吊");
    //   }
    //   if (index == 2) {
    //     this.changeSelect("2号塔吊");
    //   }
    //   if (index == 3) {
    //     this.changeSelect("3号塔吊");
    //   }
    // },
    downItem(e, i, machineName) {
      console.log(e);
      //鼠标点击设备元素（左按下）触发
      //信息赋值给移动元素
      this.ttwarningnut.type = i;
      this.moveItem.bg = i;
      this.ismove = true;
      this.mouseUP = false;
      //这时候是塔机的名字
      if (machineName) {
        this.ttwarningnut.machineName = machineName;
        console.log(651, this.ttwarningnut.machineName);
      }
    },
    handlemove(e) {
      //鼠标移动中持续触发
      if (!this.mouseUP) {
        //移动元素跟随鼠标指针移动
        let xalias = e.clientX - this.parentOffset.x;
        let yalias = e.clientY - this.parentOffset.y;
        this.moveItem.valueX = xalias;
        this.moveItem.valueY = yalias;
        this.ttwarningnut.valueX = this.moveItem.valueX;
        this.ttwarningnut.valueY = this.moveItem.valueY;
        console.log("图片宽高", this.imgLength);
        // 计算百分比 适应不同尺寸的屏幕 小圆点位置相同
        this.ttwarningnut.XLocation =
          this.ttwarningnut.valueX / this.imgLength.w;
        this.ttwarningnut.YLocation =
          this.ttwarningnut.valueY / this.imgLength.h;
      }
    },
    //添加 点 的事件
    handleup() {
      // 放开鼠标左键后触发
      console.log(723, this.mouseUP);
      if (!this.mouseUP) {
        console.log("发送数据", this.ttwarningnut);
        addYuJingLm(this.ttwarningnut).then((res) => {
          if (res.code == "success") {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.ismove = false;
            this.getAllYuJingLm1();
          }
        });
      }
      this.mouseUP = true;
      this.showTip = true;
    },
    // 点击塔吊标签事件
    changeSelect(even) {
     
      this.tj1.forEach((item,index)=>{   //预警螺母 1号塔机 001#
         var number =""
         var number2=index+1
         if(number2<10){
            number ="00" + number2
         }else if(10<=number2<100){
           number ="0" + number2
         }
        item.mid = "预警螺母" +" "+ even +' '+ number +"#"
      })
       this.tableData = this.tj1;
      
      // 让其滚动
       this.$nextTick(function () {
            this.scrollAnima();
          }); 


      // if (even == "1号塔吊") {
      //   this.activateIndex = 1;
      //   this.optionsValue = "1号塔吊";
      //   this.tableData = this.tj1;
      // }
      // if (even == "2号塔吊") {
      //   this.activateIndex = 2;
      //   this.optionsValue = "2号塔吊";
      //   this.tableData = this.tj2;
      // }
      // if (even == "3号塔吊") {
      //   this.activateIndex = 3;
      //   this.optionsValue = "3号塔吊";
      //   this.tableData = this.tj3;
      // }
    },
     scrollAnima() {
      let parentEl = document.querySelector(".scrollTable ");  //外层的 table 
      let elem = parentEl.querySelector(".el-table__body-wrapper"); // table 外边框的高度
      let tablebox = elem.querySelector(".el-table__body");  //table 的实际 内容高度
        elem.scrollTop = 0;
      
      if (this.tableTimer == null) {
        this.tableTimer = setInterval(function () {
          elem.scrollTop++;
          if (elem.scrollTop + elem.offsetHeight >= tablebox.offsetHeight - 2) {
            elem.scrollTop = 0;
          }
        }, 45);
      }
      else{
        clearInterval(this.tableTimer)
        this.tableTimer = setInterval(function () {
          elem.scrollTop++;
          if (elem.scrollTop + elem.offsetHeight >= tablebox.offsetHeight - 2) {
            elem.scrollTop = 0;
          }
        }, 45);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.imgbox {
  position: relative;
  height: 100%;
  // img {
  //   user-select: none;
  //   width: 100%;
  //   height: 108%;
  // }
  .foundpit-img{
        user-select: none;
    width: 100%;
    height: 108%;
       background-repeat:no-repeat;
background-position:center;
background-origin:content-box;
    background-size: 95% 100%;/*按比例缩放*/
  }
    .foundpit-img2{
        user-select: none;
    width: 100%;
    height: 108%;
       background-repeat:no-repeat;
background-position:center;
background-origin:content-box;
    background-size: 100% 100%;/*按比例缩放*/
  }
  .legend {
    position: absolute;
    top: 50px;
    right: 50px;
    display: flex;
    width: 120px;
    height: auto;
    background-color: #2c3c4c;
    border: 2px solid #0d7da7;
    flex-direction: column;
    border-radius: 6px;
    text-align: center;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;

    span {
      margin: 8px;
      line-height: 12px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 100%;
        // margin-right: 5px;
      }
      b {
        width: 80px;
        font-weight: normal;
      }
    }
  }
  .tankuang {
    position: absolute;
    top: 25%;
    right: 50px;
    width: 300px;
    height: 550px;
    background-color: rgba(44, 60, 76, 0.5);
    border: 2px solid #0d7da7;
    border-radius: 10px;
    // overflow: auto;
    h3 {
      color: #07dbff;
      margin: 10px 20px;
    }
    /deep/.el-input {
      margin-left: 20px;
      width: 69%;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
    }
    .table {
      margin-top: 10px;
      height: 452px;
      // overflow: ;
    }
  }
}
.biaoqian {
  position: absolute;
  height: 30px;
  width: 70px;
  color: #7b8086;
  background-color: #253449;
  border-radius: 6px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.bianqian1 {
  right: 29.6%;
  top: 1%;
}
.bianqian2 {
  left: 21%;
  top: 14%;
}

.bianqian3 {
  left: 38.5%;
  top: 57.5%;
}
.font-class {
  font-weight: bold;
  color: rgb(8, 191, 111);
}

i#movitem {
  width: 13px;
  height: 13px;
  border: 2px solid #fff;
  position: absolute;
  z-index: 9;
  -webkit-animation: none;
  animation: none;
  border-radius: 50%;
}
.jikendian {
  position: absolute;
  display: inline-block;
  width: 13px;
  height: 13px;
  border: 2px solid #fff;
  border-radius: 100%;
  z-index: 10;
  &:hover {
    a.device-tips {
      display: block;
    }
  }
}
// .yihaoColor {  // 只代表颜色的顺序，不代表塔机的顺序
//   background-color: #078dff;
//   color: #3bbaf9;
// }
// .erhaoColor {
//   background-color: #9907fe;
// }
// .sanhaoColor {
//   background-color: #fe8207;
// }
.title {
  width: 100px;
  height: 30px;
  border-radius: 0;
  text-align: center;
  color: #253449;
  line-height: 30px;
  // background-color: transparent !important;
  background-color: #2c3c4c !important;
  color: #3bbaf9;
  border: 1px solid #3bbaf9;
  box-shadow: 0px 0px 1px 1px #3bbaf9;
  border-radius: 5px;
}
.shanchukuang {
  position: absolute;
  display: inline-block;
  width: 50px;
  height: 25px;
  margin-left: 20px;
  background-color: #2c3c4c;
  text-align: center;
  line-height: 20px;
  border: 2px solid #0d7da7;
  border-radius: 5px;
  cursor: pointer;
  z-index: 99;
}
.activate {
  color: #3bbaf9;
  border: 1px solid #3bbaf9;
  box-shadow: 0px 0px 2px 2px #3bbaf9;
}
</style>