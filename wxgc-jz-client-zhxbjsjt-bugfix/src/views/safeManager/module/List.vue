<template>
    <div class="security-clari-list">
        <div class="add-parent">
            <el-popover
                ref="newItemPopover"
                style="margin-right:5px"
                placement="top"
                width="230"
                trigger="click"
                @show="clearInput"
                >
                <div class="add-box">
                    <el-input v-model="newitemValue" style="width:160px;margin-right:5px" placeholder="请输入内容" size="mini"></el-input>
                    <el-button type="primary" size="mini" @click="saveNewItem">保存</el-button>
                </div>
                <el-button slot="reference" type="primary" size="mini">新建</el-button>
            </el-popover>

            <el-popconfirm
                confirm-button-text='确定'
                cancel-button-text='取消'
                icon="el-icon-info"
                icon-color="red"
                @onConfirm="dele"
                title="确定删除这条信息？"
            >
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
        </div>

        <a v-for="item in listData" :class="{'active':item.id===current.id}" :key="item.id" @click="handlefn(item)">[{{item.addDate}}]{{item.trainName}}</a>

    </div>
</template>

<script>
    export default {
        props:{
            listData:Array
        },
        data(){ 
            return{
                newitemValue:'',
                current:{}
            }
        },
        computed: {
            index() {
                let i = 0
                if(this.current){
                    this.listData.forEach((n,j) =>{
                        n.id === this.current ? i = j : null
                    })
                }
                return i
            }
        },
        watch: {
          current:function (val){
              this.$emit('onclick',val)
          },
          listData:function (){
              this.current = this.listData[this.index] 
          }
        },
        methods:{
            // Method to clear input when popover opens
            clearInput() {
                this.newitemValue = '';
            },
            handlefn(item){
                this.current = item
            },
            dele(){
                this.$emit('onDel',this.current.id)
            },
            saveNewItem(){
                this.$emit('onAdd', this.newitemValue);
                // Ensure the popover is closed after saving
                if (this.$refs.newItemPopover) {
                    this.$refs.newItemPopover.doClose();
                }
            },
            cancel(){}
        }
    }
</script>

<style lang="less" scoped>
.security-clari-list{
    color: #333;
    text-align: left;
    a{
        width: 100%;
        display: block;
        padding: 3px 0;
        margin-bottom: 4px;
        color: rgb(94, 94, 94);
        cursor: pointer;
    }
    a.active{
        background: rgb(237, 247, 255);
        color: rgb(0, 152, 253);
        cursor: auto;
    }
    .add-parent{
        margin-bottom: 10px;
    }
}
</style>