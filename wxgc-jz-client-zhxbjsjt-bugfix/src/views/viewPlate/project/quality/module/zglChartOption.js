export function getoption(angle,value){
    //let angle = 0;//角度，用来做简单的动画效果的
    return {
        grid:{
            top:'20%',
            bottom:'2%'
        },
        title: {
            text: '{a|'+ value +'}{c|%}',
            x: 'center',
            y: 'center',
            textStyle: {
                rich:{
                    a: {
                        fontSize: 48,
                        color: '#29EEF3'
                    },
                    
                    c: {
                        fontSize: 20,
                        color: '#ffffff',
                        // padding: [5,0]
                    }
                }
            }
        },
        series:[{
                    name: "ring5",
                    type: 'custom',
                    coordinateSystem: "none",
                    renderItem: function(params, api) {
                        return {
                            type: 'arc',
                            shape: {
                                cx: api.getWidth() / 2,
                                cy: api.getHeight() / 2,
                                r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.80,
                                startAngle: (0+angle) * Math.PI / 180,
                                endAngle: (90+angle) * Math.PI / 180
                            },
                            style: {
                                stroke: "#0CD3DB",
                                fill: "transparent",
                                lineWidth: 1.5
                            },
                            silent: true
                        };
                    },
                    data: [0]
                }, {
                    name: "ring5",
                    type: 'custom',
                    coordinateSystem: "none",
                    renderItem: function(params, api) {
                        return {
                            type: 'arc',
                            shape: {
                                cx: api.getWidth() / 2,
                                cy: api.getHeight() / 2,
                                r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.80,
                                startAngle: (180+angle) * Math.PI / 180,
                                endAngle: (270+angle) * Math.PI / 180
                            },
                            style: {
                                stroke: "#0CD3DB",
                                fill: "transparent",
                                lineWidth: 1.5
                            },
                            silent: true
                        };
                    },
                    data: [0]
                }, {
                    name: "ring5",
                    type: 'custom',
                    coordinateSystem: "none",
                    renderItem: function(params, api) {
                        return {
                            type: 'arc',
                            shape: {
                                cx: api.getWidth() / 2,
                                cy: api.getHeight() / 2,
                                r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.90,
                                startAngle: (270+-angle) * Math.PI / 180,
                                endAngle: (40+-angle) * Math.PI / 180
                            },
                            style: {
                                stroke: "#0CD3DB",
                                fill: "transparent",
                                lineWidth: 1.5
                            },
                            silent: true
                        };
                    },
                    data: [0]
                }, {
                    name: "ring5",
                    type: 'custom',
                    coordinateSystem: "none",
                    renderItem: function(params, api) {
                        return {
                            type: 'arc',
                            shape: {
                                cx: api.getWidth() / 2,
                                cy: api.getHeight() / 2,
                                r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.90,
                                startAngle: (90+-angle) * Math.PI / 180,
                                endAngle: (220+-angle) * Math.PI / 180
                            },
                            style: {
                                stroke: "#0CD3DB",
                                fill: "transparent",
                                lineWidth: 1.5
                            },
                            silent: true
                        };
                    },
                    data: [0]
                }, {
                    name: "ring5",
                    type: 'custom',
                    coordinateSystem: "none",
                    renderItem: function(params, api) {
                        let x0 = api.getWidth() / 2;
                        let y0 = api.getHeight() / 2;
                        let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.90;
                        let point = getCirlPoint(x0, y0, r, (90+-angle))
                        return {
                            type: 'circle',
                            shape: {
                                cx: point.x,
                                cy: point.y,
                                r: 3
                            },
                            style: {
                                stroke: "#0CD3DB",//粉
                                fill: "#0CD3DB"
                            },
                            silent: true
                        };
                    },
                    data: [0]
                }, {
                    name: "ring5",  //绿点
                    type: 'custom',
                    coordinateSystem: "none",
                    renderItem: function(params, api) {
                        let x0 = api.getWidth() / 2;
                        let y0 = api.getHeight() / 2;
                        let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.90;
                        let point = getCirlPoint(x0, y0, r, (270+-angle))
                        return {
                            type: 'circle',
                            shape: {
                                cx: point.x,
                                cy: point.y,
                                r: 3
                            },
                            style: {
                                stroke: "#0CD3DB",      //绿
                                fill: "#0CD3DB"
                            },
                            silent: true
                        };
                    },
                    data: [0]
                }, {
                    name: '吃猪肉频率',
                    type: 'pie',
                    radius: ['76%', '64%'],
                    silent: true,
                    clockwise: true,
                    startAngle: 90,
                    z: 0,
                    zlevel: 0,
                    label: {
                        normal: {
                            position: "center",

                        }
                    },
                    data: [{
                            value: value,
                            name: "",
                            itemStyle: {
                                normal: {
                                    color: { // 完成的圆环的颜色
                                        colorStops: [{
                                            offset: 0,
                                            color: '#4FADFD' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#28E8FA' // 100% 处的颜色
                                        }]
                                    },
                                }
                            }
                        },
                        {
                            value: 100-value,
                            name: "",
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: "#173164"
                                }
                            }
                        }
                    ]
                },
                
                {
                    name: "",
                    type: "gauge",
                    radius: "76%",
                    center: ['50%', '50%'],
                    startAngle: 0,
                    endAngle: 359.9,
                    splitNumber: 8,
                    hoverAnimation: true,
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        length: 60,
                        lineStyle: {
                            width: 2,
                            color: "rgba(25, 106, 185, 0.2)"
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            opacity: 0
                        }
                    },
                    detail: {
                        show: false
                    },
                    data: [{
                        value: 0,
                        name: ""
                    }]
                },
                
            ]
    };

    //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)


}

function getCirlPoint(x0, y0, r, angle) {
    let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
    let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
    return {
        x: x1,
        y: y1
    }
}