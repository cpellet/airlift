from flask import Flask
from flask_cors import CORS
import osmnx as ox
import datetime

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {"message": "Hello from Airlift!", "version": "0.0.1", "time":datetime.datetime.now()}

@app.route("/nlq")
def nlqresolve():
    gdf = ox.geocode_to_gdf("Manhattan, New York, New York, USA")
    print(gdf)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)