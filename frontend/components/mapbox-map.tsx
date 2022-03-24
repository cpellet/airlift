import { Component } from 'react';
import Map from 'react-map-gl';

class MapboxMap extends Component {

    render() {
        return (
            <Map
                reuseMaps
                mapStyle="mapbox://styles/mapbox/streets-v9"
                initialViewState={{
                    latitude: 48.711560,
                    longitude: 2.215030,
                    zoom: 14}}
                style={{ width: "fit", height: "94vh" }}
                mapboxAccessToken="pk.eyJ1IjoiY3BlbGxldCIsImEiOiJjaXAyNjRiOG4wMDA2dnpseXEzZWwxcGpkIn0.Mx1G74kM528rmSrUP4XCVQ"
            />
        );
    }
}

export default MapboxMap;

