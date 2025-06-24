const warr = [
    {
        case: '小雨',
        icon: 'iconxiaoyu '
    },
    {
        case: '多云',
        icon: 'iconduoyun '
    },

    {
        case: '阴',
        icon: 'iconyintian '
    },

    {
        case: '大雨',
        icon: 'icondayu '
    },

    {
        case: '中雨',
        icon: 'iconzhongyu '
    },

    {
        case: '雷阵雨',
        icon: 'iconleizhenyu '
    },

    {
        case: '暴雨',
        icon: 'iconbaoyu '
    },

    {
        case: '阵雨',
        icon: 'iconzhenyu '
    },

    {
        case: '晴',
        icon: 'iconqingtian '
    },

    {
        case: '大雪',
        icon: 'icondaxue '
    },

    {
        case: '小雪',
        icon: 'iconxiaoxue '
    },

    {
        case: '雾',
        icon: 'iconwu1 '
    },

    {
        case: '雨夹雪',
        icon: 'iconyujiaxue '
    },

    {
        case: '阵雪',
        icon: 'iconzhenxue '
    },

    {
        case: '霾',
        icon: 'iconmai '
    },
         
]

export default function (param) { 
    let icon= ''
    warr.forEach(item=>{
        if(param.includes(item.case)){
            icon = 't-icon ' + item.icon
        }
    })
    return icon;
}