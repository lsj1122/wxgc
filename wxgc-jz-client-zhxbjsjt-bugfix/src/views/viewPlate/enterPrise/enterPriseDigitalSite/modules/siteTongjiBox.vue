<template>
  <div class="aa">
    <div id="text_li">
      <ul class="ul">
        <li v-for="(item, index) in data1" :key="index">
          <div class="itemname">{{ item.name }}</div>
          <div class="centerbox">
            <div class="centerboxin">
              <span v-bind:style="styleArr[index]">{{ item.value }}</span> 台
            </div>
          </div>
          <div class="newadd">
            {{flag==1?'今日新增':(flag==2?'7日内新增':'30天内新增' )}}
            <span class="font-color"
              >+{{
                data2.length > 0
                  ? data2[index].value >= 0
                    ? data2[index].value
                    : "-" + " " + data2[index].value
                  : ""
              }}</span
            >
          </div>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import {
  equipmentOne,
  equipmentTwo,
} from "@/views/viewPlate/enterPrise/api/enterPriseDigitalSite";
export default {
  components: {},
  data() {
    return {
      flag:null,
      styleArr: [
        { color: "#6c79f9" },
        { color: "#6CF9C6" },
        { color: "#D36CF9" },
        { color: "#E3F96C" },
        { color: "#F9A16C" },
        { color: "#6CABF9" },
      ],
      data1: [],
      data2: [], // 较上月的数组
    };
  },
  created() {
    this.ways(this.$store.state.video.isActive);
    this.flag =this.$store.state.video.isActive
  },
  methods: {

    ways(index) {
      this.flag =index
      equipmentOne({flag:index}).then((res) => {
        console.log(51, res);
        this.data1 = res.data;
      });
      equipmentTwo({flag:index}).then((res) => {
        console.log(52, res);
        this.data2 = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.font-color {
  color: #ff7800;
  font-family: "Acens";
}
.aa {
  height: 100%;
}
#text_li {
  height: 100%;
  // min-height: 300px;
  .ul {
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    list-style-type: none;
    li {
      width: 150px;
      height: 50%;
      .itemname {
        font-size: 18px;
        // font-family: PingFang SC;
        // font-weight: 400;
        color: #ffffff;
        height: 64px;
        line-height: 64px;
      }
      .centerbox {
        width: 120px;
        border-bottom: 1px solid #35405a;
        padding-bottom: 10px;
        .centerboxin {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100px;
          span {
            width: 43px;
            height: 21px;
            font-size: 30px;
            font-family: "Acens";
            letter-spacing: 3px;
            font-weight: bold;
            // color: #6c79f9;
          }
        }

        // span:nth-child(2) {
        //   color: pink;
        // }
      }
      .newadd {
        margin-top: 15px;
        height: 17px;
        font-size: 18px;
      }
    }
  }
}
</style>
