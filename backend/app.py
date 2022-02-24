from flask import Flask
import osmnx as ox

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello from Airlift!"

@app.route("/nlq")
def nlqresolve():
    gdf = ox.geocode_to_gdf("Manhattan, New York, New York, USA")
    print(gdf)