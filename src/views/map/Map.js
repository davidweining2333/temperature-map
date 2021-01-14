import React from 'react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './Map.less';
import 'leaflet/dist/leaflet.css';
import * as echarts from "echarts";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
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
                    lat: '30.662205'
                },
                {
                    key: 'bj',
                    name: '北京',
                    lang: '116.46',
                    lat: '39.92'
                },
                {
                    key: 'sh',
                    name: '上海',
                    lang: '121.4737021',
                    lat: '31.2303904'
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
                    text: '气温趋势图'
                },
                tooltip: {
                    trigger: 'axis',
                },
                xAxis: {
                    type: 'time',
                    // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '气温（℃）',
                    type: 'line',
                    data,
                    smooth: true
                }]
            });
        };
        this.randomData = function (now, oneDay, oneHour, value) {
            now = new Date(+now + oneHour);
            value = value + Math.random() * 10;
            return {
                name: now.toString(),
                value: [
                    [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/') + ` ${now.getHours()}:00:00`,
                    Math.round(value)
                ]
            };
        }

        this.generateData = function (baseTemp) {
            var data = [];
            var now = +new Date();
            var oneDay = 24 * 3600 * 1000;
            var oneHour = 3600 * 1000;
            var value = Math.random() * 1000;
            for (var i = 0; i < 30 * 24; i++) {
                data.push(this.randomData(now, oneDay, oneHour * i, baseTemp));
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
            L.marker([item.lat, item.lang]).addTo(this.map)
        });
        setTimeout(() => {
            this.map.fitBounds(this.state.dataSource.map(item => [item.lat, item.lang]));
        })
        // // add layer
        // this.layer = L.layerGroup().addTo(this.map);
        // this.map.setView(
        //     center, zoom
        // )
        this.temperatureCharts = echarts.init(document.getElementById('tempuratureCharts'));
        this.refreshCharts();

    }
    componentDidUpdate({ markerPosition }) {
        // check if position has changed 
        // if (this.props.markerPosition !== markerPosition) {
        //     this.marker.setLatLng(this.props.markerPosition);
        // }
    }
    render() {

        return <div className="body">
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
            <div className="statistics-area">
                {/* <h4>气温趋势图</h4> */}
                <div id="tempuratureCharts"></div>
            </div>
            <div id="map"></div>
        </div>
    }
}

export default Map;