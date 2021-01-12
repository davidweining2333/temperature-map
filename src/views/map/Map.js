import React from 'react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'antd/dist/antd.css';
import { Table } from 'antd';
import './Map.less';
import 'leaflet/dist/leaflet.css';

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
        // // add layer
        // this.layer = L.layerGroup().addTo(this.map);
        // this.map.setView(
        //     center, zoom
        // )
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
                <Table dataSource={this.state.dataSource} columns={this.state.columns} size="small" />
            </div>
            <div id="map"></div>
        </div>
    }
}

export default Map;