import osmnx as ox
from enum import Enum

class NetworkType(Enum):
    PUBLIC = 'drive'
    PUBLIC_SERVICE = 'drive-service'
    WALK = 'walk'
    BIKE = 'bike'
    ALL = 'all'
    ALL_WITH_PRIVATE = 'all_private'

def gdfFromGeoQuery(query):
    return ox.geocode_to_gdf(query)

def graphFromBBox(latmax, latmin, longmax, longmin, networktype):
    return ox.graph_from_bbox(latmax, latmin, longmax, longmin, network_type=networktype)

def graphFromCircle(lat, long, radius, networktype):
    return ox.graph_from_point((lat, long), dist=radius, network_type=networktype)

def graphFromAddress(address, networktype):
    return ox.graph_from_address(address, network_type=networktype)

def graphFromPlaceQuery(query, networktype):
    return ox.graph_from_place(query, network_type=networktype)

def networkStats(graph, basic = False):
    if(basic):
        return ox.basic_stats(graph)
    else:
        return ox.extended_stats(graph, bc=True)

def gdfFromGraph(graph):
    g_proj = ox.project_graph(graph)
    return ox.graph_to_gdfs(g_proj, edges=False)

def prepGraphForItinaryCalculations(graph):
    g = ox.speed.add_edge_speeds(graph)
    return ox.speed.add_edge_travel_times(g)

def getNearestNodes(graph, lat, long):
    return ox.distance.nearest_nodes(graph, X=lat, Y=long)

def getQuickestPath(graph, origin, dest):
    return ox.shortest_path(graph, origin, dest, weight='travel_time')

def getBuildingsGeometriesForQuery(query):
    return ox.geometries_from_place(query, {'buildings', True})