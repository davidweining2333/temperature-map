import React from 'react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './Map.less';
import 'leaflet/dist/leaflet.css';
import * as echarts from "echarts";
import cities from "../../data/cities.csv";
import historydata from "../../data/historydata.csv";
import lines from "../../data/lines.csv";

console.log(cities);
console.log(historydata);
console.log(lines);
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12.5, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: [
                {
                    key: 'cd',
                    name: '成都',
                    lang: '104.071887',
                    lat: '30.662205',
                    color: "orange"
                },
                {
                    key: 'bj',
                    name: '北京',
                    lang: '116.46',
                    lat: '39.92',
                    color: "yellow"
                },
                {
                    key: 'sh',
                    name: '上海',
                    lang: '121.4737021',
                    lat: '31.2303904',
                    color: "green"
                }
            ],
            linesDataSource: [
                {
                    key: "1",
                    name: "西安-郑州-武汉",
                    latLangs: [["34.345408", "108.945194"], ["34.753091", "113.630756"], ["30.59816", "114.312606"]],
                    color: "red"
                },
                {
                    key: "2",
                    name: "成都-北京-上海",
                    latLangs: [['30.662205', '104.071887'], ['39.92', '116.46'], ['31.2303904', '121.4737021']],
                    color: "yellow"
                }
            ],
            columns: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '经度',
                    dataIndex: 'lang',
                    key: 'lang',
                },
                {
                    title: '纬度',
                    dataIndex: 'lat',
                    key: 'lat',
                }
            ],
            linesColumns: [
                {
                    title: '线路名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                // {
                //     title: '经度',
                //     dataIndex: 'lang',
                //     key: 'lang',
                // },
                // {
                //     title: '纬度',
                //     dataIndex: 'lat',
                //     key: 'lat',
                // }
            ]
        }
        this.temperatureCharts = void 0;
        this.refreshCharts = function (record) {
            let base = 20;
            if (record) {
                switch (record.key) {
                    case "cd":
                        base = 10;
                        break;
                    case "bj":
                        base = 0;
                        break;
                    case "sh":
                        base = 20;
                        break;
                }
            }
            let data = this.generateData(base);

            this.temperatureCharts.setOption({
                grid: { top: 10, bottom: 20, right: 20 },
                title: {
                    text: `${record.name}气温趋势图`,
                    textStyle: {
                        color: "white"
                    }
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'time',
                    axisPointer: {
                        value: '2021-10-7',
                        snap: true,
                        lineStyle: {
                            color: '#004E52',
                            opacity: 0.5,
                            width: 2
                        },
                        label: {
                            show: true,
                            formatter: function (params) {
                                return echarts.format.formatTime('yyyy-MM-dd', params.value);
                            },
                            backgroundColor: '#004E52'
                        },
                        handle: {
                            show: true,
                            color: '#004E52'
                        }
                    },
                    // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                dataZoom: [{
                    type: 'inside',
                    throttle: 50
                }],
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    showSymbol: false,
                    // itemStyle: {
                    //     show: false,
                    //     opacity: 0
                    // },
                    name: '气温（℃）',
                    type: 'line',
                    data,
                    smooth: true
                }]
            }, true);
        };
        this.refreshLineCharts = function (record) {
            let base = 200;
            if (record) {
                switch (record.key) {
                    case "cd":
                        base = 10;
                        break;
                    case "bj":
                        base = 0;
                        break;
                    case "sh":
                        base = 20;
                        break;
                }
            }
            let data = this.generateData(base, 100);

            this.temperatureCharts.setOption({
                grid: { top: 10, bottom: 20, right: 20 },
                title: {
                    text: `${record.name}流量趋势图`,
                    textStyle: {
                        color: "white"
                    }
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'time',
                    axisPointer: {
                        value: '2021-01-28',
                        snap: true,
                        lineStyle: {
                            color: '#004E52',
                            opacity: 0.5,
                            width: 2
                        },
                        label: {
                            show: true,
                            formatter: function (params) {
                                return echarts.format.formatTime('yyyy-MM-dd', params.value);
                            },
                            backgroundColor: '#004E52'
                        },
                        handle: {
                            show: true,
                            color: '#004E52'
                        }
                    },
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    throttle: 50
                }],
                series: [{
                    name: '流量',
                    type: 'line',
                    data,
                    smooth: true,
                    showSymbol: false,
                }]
            }, true);
        };
        this.randomData = function (now, oneDay, oneHour, value, changBase) {
            now = new Date(+now + oneHour);
            value = value + Math.random() * (changBase || 10);
            return {
                name: now.toString(),
                value: [
                    [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/') + ` ${now.getHours()}:00:00`,
                    Math.round(value)
                ]
            };
        }

        this.generateData = function (baseTemp, changBase) {
            var data = [];
            var now = +new Date();
            var oneDay = 24 * 3600 * 1000;
            var oneHour = 3600 * 1000;
            var value = Math.random() * 1000;
            for (var i = 0; i < 30 * 24; i++) {
                data.push(this.randomData(now, oneDay, oneHour * i, baseTemp, changBase));
            }
            return data;
        }
    }
    componentDidMount() {
        // create map
        this.map = L.map('map', {
            center: [30.662205, 104.071887],
            crs: L.CRS.EPSG3857,
            zoom: 14,
            layers: [
                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                }),
            ]
        });

        // add marker
        // this.marker = L.marker([30.662205, 104.071887], {

        // }).addTo(this.map);
        this.state.dataSource.forEach(item => {
            let marker = L.marker([item.lat, item.lang], {
                data: item
            });
            let circleMarker = L.circleMarker([item.lat, item.lang], {
                color: item.color,
                data: item
            });
            marker.bindTooltip(item.name).openTooltip();
            marker.addTo(this.map);
            circleMarker.addTo(this.map);
            marker.on("click", (event) => {
                this.refreshCharts(event.target.options.data);
            });
        });
        this.state.linesDataSource.forEach(item => {
            let line = L.polyline(item.latLangs, { color: item.color, data: item });
            line.bindTooltip(item.name).openTooltip();
            line.addTo(this.map)
            line.on("click", (event) => {
                this.refreshLineCharts(event.target.options.data);
            });
        });
        setTimeout(() => {
            this.map.fitBounds(this.state.dataSource.map(item => [item.lat, item.lang]).concat(this.state.linesDataSource.map(item => item.latLangs)));
        })
        // // add layer
        // this.layer = L.layerGroup().addTo(this.map);
        // this.map.setView(
        //     center, zoom
        // )
        this.temperatureCharts = echarts.init(document.getElementById('tempuratureCharts'));
        // this.refreshCharts();

    }
    componentDidUpdate({ markerPosition }) {
        // check if position has changed 
        // if (this.props.markerPosition !== markerPosition) {
        //     this.marker.setLatLng(this.props.markerPosition);
        // }
    }
    render() {

        return <div className="body">
            <div className="header">A Map Application</div>
            <div className="content">
                <div className="leftPanel">
                    <div className="markes-table-area">
                        <h4>位置列表</h4>
                        <Table dataSource={this.state.dataSource} columns={this.state.columns} size="small"
                            onRow={record => {
                                return {
                                    onClick: event => {
                                        this.map.setView([record.lat, record.lang]);
                                        this.refreshCharts(record);
                                        console.log(record)
                                    }, // 点击行
                                };
                            }} />
                    </div>
                    <div className="lines-table-area">
                        <h4>线路列表</h4>
                        <Table dataSource={this.state.linesDataSource} columns={this.state.linesColumns} size="small"
                            onRow={record => {
                                return {
                                    onClick: event => {
                                        this.map.fitBounds(record.latLangs);
                                        this.refreshLineCharts(record);
                                        console.log(record)
                                    }, // 点击行
                                };
                            }} />
                    </div>
                </div>
                <div className="rightPanel">
                    <div id="map"></div>
                    <div className="statistics-area">
                        {/* <h4>气温趋势图</h4> */}
                        <div id="tempuratureCharts"></div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Map;