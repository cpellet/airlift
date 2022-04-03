from parameters import *
import geojson

class Algorithm:
    def __init__(self, name, description, return_type, parameters):
        self.name = name
        self.description = description
        self.return_type = return_type
        self.parameters = parameters

    def export_signature(self) -> dict:
        return {
            'name': self.name,
            'descr': self.description,
            'return_type': self.return_type.export_signature(),
            'parameters': [p.export_signature() for p in self.parameters]
        }


algos = [
    Algorithm('Auto Bus', 'Generate bus routes for an area', Int("Area", "Area to generate bus routes for"),
              [GeoJson("Start", "Start of area", geojson.Point((-115.81, 37.24))), GeoJson("End", "End of area", geojson.Point((-115.81, 37.24))), Int("Max stops", "Maximum number of stops")]),
]
