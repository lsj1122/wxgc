<template>
    <com-box :title="'天气预报'" class="container-mid-bottom">
        <template #head>
                <el-date-picker
                    v-model="dateValue"
                    type="date"
                    size="mini"
                    style="width:160px"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    @change="onchange"
                    placeholder="选择日期查询天气">
                </el-date-picker>
        </template>
        <div style="width:100%;display:flex;flex-direction: row;text-align: center">
            <div class="weather-publish" v-for="(item,index) in weather" :key="index">
                <div>{{item.date|| item.createTime}}</div>
                <div style="margin:10px 0">
                    <b :class="weatherico(item.wea || item.wea)"></b>
                </div>
                <div style="padding:10px;">{{item.wea || item.wea}}</div>
                <div>{{item.temNight || item.tem_night}}℃  -  {{item.temDay || item.tem_day}}℃</div>
            </div>
        </div>
    </com-box>
</template>

<script>
    import weatherico from '@/utils/weatherIcon.js'
    import ComBox from '@/views/viewPlate/components/combox'
    import {selectTtWeatherByPro} from "@/views/viewPlate/project/greenManagement/api/ttweather";
    import moment from "moment";
    export default {
        props: {
            wdata: Array
        },
        components: {
          ComBox
        },
        computed: {
          weather(){
              return this.dateValue ? this.data : this.wdata
          }
        },
        data() {
            return {
                data: [],
                dateValue: null,
                pickerOptions: {
                    // disabledDate(time) {
                    //     return time.getDate() > moment().format('yyyy-MM-dd');
                    // }
                },
            }
        },
        created () {
            // this.query();
        },
        methods: {
            weatherico,
            query(){
              //2021-03-01
              selectTtWeatherByPro(this.dateValue).then(res=>{
                    if (res.code=="success") {
                        this.data = res.data
                    }
                })
            },
            onchange(date){
              if(date){
                this.query()
              }
            }
        }
    }
</script>

<style lang="less" scoped>
@import url('../../../../../styles/iconfont-weapp-icon.css');
    .weather-publish {
        width: 20%;
        height: 100%;
        color: #bbbbbb;
        padding-top: 20px;
    }
    .container-mid-bottom{
        height:calc(35.5% - 26px);
    }
    .com-box{
        margin-bottom:0 !important;
    }
</style>
