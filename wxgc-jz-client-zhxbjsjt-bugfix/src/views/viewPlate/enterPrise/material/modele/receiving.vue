<template>
    <div class="receiving" style="height:100%">
        <div id="echartswl3"></div>
    </div>
</template>

<script>
import { countvehicise } from "@/views/viewPlate/enterPrise/api/mater";
import echarts from "echarts";
export default {
    name: 'receiving',

    data() {
        return {
            totaltab:[],
            proName:[],
            value:[],
        };
    },

    mounted() {
        
        this.conntlook();
    },

    methods: {
            conntlook(){
let option = {
    flag:2
}
      countvehicise(option)
        .then((res) => {
          if (res.code == "success") {
            this.totaltab = res.data
            this.proName = res.data.map((item) => {

            return item.name;
          });
            this.value = res.data.map((item) => {
                return item.intValue;
          });
    
          
      console.log("收料单位",res.data);
      this.handechers();
              
            }
            // res.data.text=res.data.otherFilePath.substring(res.data.otherFilePath.lastIndexOf('/') + 1)
            
      

        });
    
        },
        handechers(){
            var myChart = echarts.init(document.getElementById("echartswl3"));
            var useData = {
    yAxisData:  this.proName,
    seriesData1:  this.value,
    //: [327, 1776, 507, 1200, 800],
    // seriesData3: [127, 776, 207, 1000, 300],

}

let option = {
    // "backgroundColor": '#152439',
    "tooltip": {
        "axisPointer": {
            "type": "shadow",
            textStyle: {
                color: "#fff"
            }
        },
    },
    grid: {
        borderWidth: 0,
        top: "10%",
        bottom: 40,
        left: "30%",
        textStyle: {
            color: "#fff"
        }
    },
    "legend": {
        icon: 'rect',
        right: 'center',
        top: '10',
        itemGap:200,
        textStyle: {
            color: '#90979c',
        },
    },
    "calculable": true,
    "xAxis": [{
       
        name:"单位:次",
        "type": "value",
        "trigger": "axis",
        "axisLine": {
            show:true,
            lineStyle: {
                color: 'rgba(255,255,255,0.7)'
            }
        },
        "splitLine": {
            "show": false
        },
        "axisTick": {
            "show": false
        },
        "splitArea": {
            "show": false
        },
        "axisLabel": {
            "interval": 0,
        },
    }],
    "yAxis": [{
        name:"公司名称",
        "type": "category",
        "splitLine": {
            "show": true,
             "lineStyle": {
                color: 'rgba(255,255,255,0.7)'
            }
        },
        "axisLine": {
            show:true,
            lineStyle: {
                color: 'rgba(255,255,255,0.7)'
            }
        },
        "axisTick": {
            "show": false
        },
        "axisLabel": {
            "interval": 0,

        },
        "splitArea": {
            "show": false
        },
        data: useData.yAxisData,
    }],
    "series": [{
            "name": "",
            "type": "bar",
            "stack": "总量",
            "barMaxWidth": 15,
            "barGap": "10%",
            "itemStyle": {
                normal:{
                     color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: '#2d58f0'
                    }, {
                        offset: 1,
                        color: '#81d9ff'
                    }]),
                }
            },
            "data": useData.seriesData1,
        },
        // {
        //     "name": "二级",
        //     "type": "bar",
        //     "stack": "总量",
        //     "itemStyle": {
        //           normal:{
        //              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
        //                 offset: 0,
        //                 color: '#ffb800'
        //             }, {
        //                 offset: 1,
        //                 color: '#ffdb1f'
        //             }]),
        //         }
        //     },
        //     "data": useData.seriesData2,
        // },
        // {
        //     "name": "三级",
        //     "type": "bar",
        //     "stack": "总量",
        //     "itemStyle": {},
        //     "data": useData.seriesData3,
        // }
    ]
}
        myChart.setOption(option);

        },
    },
};
</script>

<style lang="scss" scoped>
#echartswl3{
    height: 100%;
}
</style>