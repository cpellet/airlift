import { Component } from 'react';
import Map from 'react-map-gl';

class MapboxMap extends Component<any, any>{
    render() {
        return (
            <Map
                mapStyle={this.props.theme === 'light' ? "mapbox://styles/mapbox/streets-v9" : "mapbox://styles/mapbox/dark-v9"}
                initialViewState={{
                    latitude: 48.711560,
                    longitude: 2.215030,
                    zoom: 14
                }}
                style={{ width: "fit", height: "calc(100vh - 55px)" }}
                mapboxAccessToken="pk.eyJ1IjoiY3BlbGxldCIsImEiOiJjaXAyNjRiOG4wMDA2dnpseXEzZWwxcGpkIn0.Mx1G74kM528rmSrUP4XCVQ"
            />
        );
    }
}

export default MapboxMap;