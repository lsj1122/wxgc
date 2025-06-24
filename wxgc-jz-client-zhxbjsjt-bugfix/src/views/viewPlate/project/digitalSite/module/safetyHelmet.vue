<template>
    <div class="anquanmao">
        <div class="aqm-content" :style="{'background-image':`url(${imgsrc})`}">
            <div class="aqm-con-left">
                <i class="iconfont iconanquanmao2 anquanmao-icon" @click="showLeft=!showLeft"></i>
                <div v-if="showLeft">
                    <h3>统计</h3>
                    <div class="aqm-head">
                        <span>现场作业<b>200</b>人</span>
                        <span><i class="el-icon-caret-right"></i> 今日出勤<b>350</b>人</span>
                    </div>
                    <h3>工作区</h3>
                    <el-tree
                        :data="mdata"
                        :props="defaultProps"
                        @node-click="handleNodeClick">
                    </el-tree>
                </div>
            </div>
            <div class="aqm-con-right">
                <div class="aqm-con-right-item" v-if="isShowDian('t3')">
                    <span v-show="active===0">入口<i>0人</i></span>
                    <a @click="openTip(0)"></a>
                </div>
                <div class="aqm-con-right-item" style="top:8%;left:56%" v-if="isShowDian('t1')">
                    <span v-show="active===1">姜楠中移作业面<i>0人</i></span>
                    <a @click="openTip(1)"></a>
                </div>
                <div class="aqm-con-right-item" style="top:63%;left:24%" v-if="isShowDian('t5')">
                    <span v-show="active===2">205钢筋棚<i>0人</i></span>
                    <a @click="openTip(2)"></a>
                </div>
                <div class="aqm-con-right-item" style="top:43%;left:63%" v-if="isShowDian('t4')">
                    <span v-show="active===3">出口<i>0人</i></span>
                    <a @click="openTip(3)"></a>
                </div>

                <div class="aqm-con-right-item right-item-da" style="top:1%;left:33%" v-if="isShowDian('t2')">
                    <span v-show="active===4">
                        <a>329操作台场地<i>42人</i></a>
                        <div class="aqm-div-list">
                            <ul>
                                <li v-for="(item,index) in sdata" :key="index">
                                    <img src="../../../../../assets/avatar.png" alt="" srcset="">
                                    <p>{{ item.name }}<br>{{ item.deparment }}</p>
                                </li>
                            </ul>
                        </div>
                    </span>
                    <a @click="openTip(4)" class="isCollision"></a>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {selectType} from "@/views/sysproject/api/ttuploadfile";
    export default {
        data () {
            return {
                imgsrc:'',
                value:'',
                activeTree:[],
                showLeft:false,
                options:[
                    {label:'全部',value:1}
                ],
                active:'',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                sdata:[
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'张姜',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李鹏',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'姜将',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'赵化',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'王占江',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'方达',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'窦建国',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李至',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'钱花中',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'周包林',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'黄历年',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'赵国强',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'王二民',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李怀玉',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'崔大海',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李正化',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'胡耀邦',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'赵铁木',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'毛艾',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                    {name:'李华',deparment:'东北建建筑集团第一建筑公司'},
                ],
                mdata: [
                    {
                        label: '施工区',
                        children: [
                            {id:'t1',label: '姜楠中移作业面(0)'},
                            {id:'t2',label: '329操作台场地(42)'},
                            {id:'t3',label: '入口(0)'},
                            {id:'t4',label: '出口(0)'},
                            {id:'t5',label: '205钢筋棚(0)'},
                        ]
                    }, {
                        label: '人帽一体化闸机(23)',
                        children: [{}]
                    }, {
                        label: '演示区(10)',
                        children: [{}]
                    }, {
                        label: '办公区(44)',
                        children: [{}]
                    }, {
                        label: '1(0)',
                        children: [{}]
                    }, {
                        label: '工地兴趣室(0)',
                        children: [{}]
                    }
                ],
            }
        },
        created() {
            this.getBG();
        },
        methods: {
            getBG() {
                selectType(12).then((res) => {
                    if (res.data.length!=0) {
                        this.imgUrl = res.data[res.data.length-1].pictureFilePath;
                    }
                });
            },
            handleNodeClick(node){
                let f = this.activeTree.some((n)=>{
                    return n === node.id
                })
                if(!f){
                    this.activeTree.push(node.id)
                }
                console.info(this.activeTree)
            },
            isShowDian(id){
                return this.activeTree.some((n)=>{
                    return n === id
                })
            },
            openTip(n){
                if(this.active===n){
                    this.active = ''
                }else{
                    this.active = n
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .bac{
        background-color: rgba(12,151,199,0.2);
    }
    .anquanmao{
        height: 106%;
        display: flex;
        flex-direction: column;
        >div{
            .bac;
        }
    }
    .aqm-head{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 10px;
        span{
            margin:7px 0;
            b{
                color: rgb(8, 214, 197);
                padding: 0 3px;
            }
        }
    }
    .aqm-content{
        flex: 1;
        background-repeat: no-repeat;
        margin-top: 15px;
        position: relative;
        background-size: 100% 100%;
        display: flex;
        .aqm-con-left{
            width: 300px;
            padding: 10px;
            background: rgba(0,0,0,0.63);
            -moz-user-select: none; /*火狐*/
            -webkit-user-select: none; /*webkit浏览器*/
            -ms-user-select: none; /*IE10*/
            -khtml-user-select: none; /*早期浏览器*/
            user-select: none;
            box-shadow: 34px 0 35px rgba(0,0,0,0.64);
            >i.anquanmao-icon{
                cursor: pointer;
                display: block;
                background: dodgerblue;
                color: #fff;
                width: 50px;
                height: 50px;
                line-height: 50px;
                text-align: center;
                border-radius: 100%;
                font-size: 19px;
                &:hover{
                    opacity: 0.95;
                }
            }
            >div>h3{
                color: dodgerblue;
            }
            /deep/.el-tree {
                color: #e2e5eb;
                background:none;
                .el-tree-node__content:hover {
                    background-color: #272d353b;
                }
                .el-tree-node__label {
                    font-size: 16px;
                }
                .el-tree-node__content:focus,.el-tree-node__content:active{
                    background-color: #272d353b;
                }
                .el-tree-node:focus > .el-tree-node__content {
                    background-color: #202d41;
                }
                .el-tree-node {
                    margin: 5px 0;
                }

            }
        }
        .aqm-con-right{
            flex: 1;
            position: relative;
        }
    }
    .aqm-con-right-item{
        position: absolute;
        top: 29%;
        left: 12%;
        >span{
            width: 220px;
            min-height: 56px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: rgb(0,31,45,0.88);
            border: 1px solid #0d6171;
            border-radius: 11px;
            position: relative;
            >a{
                width: 100%;
                display: flex;
                justify-content: space-around;
            }
            &::before{
                content: '\25BC';
                position: absolute;
                top:52px;
                color: #001f2d;
            }
            i{
                color: coral;
            }
        }
        >a{
                display: block;
    padding: 3px;
    background: #0f2131c2;
    width: 30px;
    height: 15px;
    border-radius: 65%;
        position: absolute;
    border: 1px solid #0d6171;
    top: 80px;
    left: 94px;
            &::before{
                content:'';
                    display: block;
    width: 10px;
    height: 6px;
    background: #00b5c2;
    border-radius: 100%;
    position: absolute;
    top: 8px;
    left: 13px;
            }
        }
    }
    .right-item-da{
        >span{
            flex-direction: column;
            justify-content: flex-start;
            width: 300px;
            >a{
                padding: 10px 0;
                justify-content: space-around;
                border-bottom: 1px solid #eee;
            }
            &::before{
                top: 335px;
            }
            div.aqm-div-list{
                height: 300px;
                overflow: hidden;
                overflow-y: auto;
                width: 100%;
                ul{
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    li{
                        display: flex;
                        align-items: center;
                        padding: 0 10px;
                        img{
                            width: 45px;
                            height: 45px;
                            border:1px solid #5f5f5f;
                        }
                        p{
                            flex: 1;
                            margin-left: 8px;
                        }
                    }
                }
            }
        }
        >a{
            top:360px;
            left:133px;
        }
    }
    @keyframes shadowAnim{
        0% {box-shadow: 0 0 rgb(255, 45, 45);}
        25% {box-shadow: 0 0 10px 1px rgb(255, 45, 45);}
        50% {box-shadow: 0 0 20px 3px rgb(255, 45, 45);}
        75% {box-shadow: 0 0 30px 5px rgb(255, 45, 45);}
        100% {box-shadow: 0 0 40px 7px rgb(255, 17, 17);}
    }
    .isCollision{
            animation: shadowAnim 1s infinite;
            animation-timing-function: cubic-bezier(0.25,0.1,0.25,1);
    }
    .aqm-content{
        overflow: scroll;
    }
</style>
