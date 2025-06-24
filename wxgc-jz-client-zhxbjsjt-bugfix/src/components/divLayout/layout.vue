<template>
    <div class="div-layout">
        <div class="div-layout-left">
            <slot name="left"></slot>
        </div>
        <div class="div-layout-right">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.div-layout{
    width:100%;
    height:100%;
    display: flex;
    .div-layout-left{
        width:300px;
        padding: 10px;
        background-color: #fff;
        // flex: 1;
    }
    .div-layout-right{
        // flex: 1;
        padding: 10px;
        margin-left: 15px;
        background-color: #fff;
        // overflow: auto;
        width:calc(100% - 300px);
        overflow-x: auto;
    }
}
</style>