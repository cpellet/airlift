import { Component } from 'react';
import Map, { NavigationControl, GeolocateControl, ScaleControl, Layer, ViewStateChangeEvent, MapLayerMouseEvent, Source, MapboxEvent} from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw'
class MapboxMap extends Component<any, any>{

    constructor(props: any){
        super(props);
        this.state = {'bbox':{}}
    }

    onLoad = (e: MapboxEvent) => {
        var draw = new MapboxDraw();
        e.target.addControl(draw);
    }


    render() {
        return (
            <Map
                mapStyle={this.props.theme === 'light' ? "mapbox://styles/mapbox/streets-v9" : "mapbox://styles/mapbox/dark-v9"}
                initialViewState={{
                    latitude: 48.711560,
                    longitude: 2.215030,
                    zoom: 14
                }}
                attributionControl={false}
                style={{ width: "fit", height: "calc(100vh - 55px)" }}
                boxZoom={false}
                mapboxAccessToken="pk.eyJ1IjoiY3BlbGxldCIsImEiOiJjaXAyNjRiOG4wMDA2dnpseXEzZWwxcGpkIn0.Mx1G74kM528rmSrUP4XCVQ"
                onLoad={this.onLoad}
            >
                <Source type='geojson' id='bbox' data={{ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4, 37.8] }, properties: {} }, { type: 'Feature', geometry: { type: 'Point', coordinates: [-123.5, 39.9] }, properties: {} }] }}><Layer id='point' type='fill' source='bbox' paint={{
                   
                }} /></Source>
                <NavigationControl showCompass={true}/>
                <GeolocateControl />
                <ScaleControl />
            </Map>
        );
    }
}

export default MapboxMap;