import { Component } from 'react';
import Map, { NavigationControl, GeolocateControl, ScaleControl, Layer, ViewStateChangeEvent, Marker, Source, MapboxEvent, MapRef } from 'react-map-gl';
import { IconLocation } from '@tabler/icons-react'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

const callApiDatasetMetadata = async (uuid: string) => {
    // fetch the API endpoint (GET request)
    const response = await fetch('https://api.resourcewatch.org/v1/dataset/' + uuid + '?includes=layer,metadata')
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

const getTileLayerUrlForTreeCoverLoss = (obj: any) => {
    // drill down to get a useful object
    const layerConfig = obj['data']['attributes']['layer'][0]['attributes']['layerConfig'];
    // get the URL template parameters
    const defaultParams = layerConfig['params_config'];

    // get the full templated URL
    let url = layerConfig['source']['tiles'][0];
    // substitute default parameters iteratively
    for (const param of defaultParams) {
        url = url.replace('{' + param['key'] + '}', param['default'].toString());
    }
    return url;
}

const getLayerSlug = (obj: any) => {
    return obj['data']['attributes']['layer'][0]['attributes']['slug'];
}


const addTileLayerToMap = (mapVar: any, title: string, url: string) => {
    // need to first add a source
    mapVar.addSource(title, {
        'type': 'raster',
        'tiles': [
            url
        ],
        'tilesize': 256
    });
    // then add the layer, referencing the source
    mapVar.addLayer({
        'id': title,
        'type': 'raster',
        'source': title,
        'paint': {
            'raster-opacity': 1  // let mapbox baselayer peak through
        }
    });
}


type CProps = { display: boolean, theme: string };
type CState = {};
class MapboxMap extends Component<CProps, CState>{

    onLoad = async (e: MapboxEvent) => {
        var draw = new MapboxDraw();
        e.target.addControl(draw);
        const datasetId = 'b584954c-0d8d-40c6-859c-f3fdf3c2c5df';
        const metadata = await callApiDatasetMetadata(datasetId);
        const slug = getLayerSlug(metadata);
        const tileLayerUrl = getTileLayerUrlForTreeCoverLoss(metadata);
        addTileLayerToMap(e.target, slug, tileLayerUrl);
    }

    render() {
        return (
            <Map
                mapStyle={this.props.display ? 'mapbox://styles/mapbox/satellite-v9' : this.props.theme === 'light' ? "mapbox://styles/mapbox/streets-v9" : "mapbox://styles/mapbox/dark-v9"}
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
                onMove={(e: ViewStateChangeEvent) => {
                    console.log(e);
                }}
            >
                <Source type='geojson' id='bbox' data={{ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [-122.4, 37.8] }, properties: {} }, { type: 'Feature', geometry: { type: 'Point', coordinates: [-123.5, 39.9] }, properties: {} }] }}><Layer id='point' type='fill' source='bbox' paint={{

                }} /></Source>
                <NavigationControl showCompass={true} />
                <GeolocateControl />
                <ScaleControl />
                <Marker
                    key={`marker-1`}
                    longitude={2.352222}
                    latitude={48.856613}
                >
                    <IconLocation size={20} />
                </Marker>
            </Map>
        );
    }
}

export default MapboxMap;