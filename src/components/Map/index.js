import React from "react";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainer = React.useRef(null);
  const map = React.useRef(null);
  const marker = React.useRef(null);

  const [mapConfig, setMapConfig] = React.useState({
    lng: -70,
    lat: 42,
    zoom: 9,
  });

  const clickHandler = (e) => {
    let { lng, lat } = e.lngLat;
    lng = lng.toFixed(4);
    lat = lat.toFixed(4);

    setMapConfig({
      lng: lng,
      lat: lat,
      zoom: 13,
    });

    map.current.flyTo({
      center: [lng, lat],
      zoom: 13,
      speed: 0.5,
    });

    marker.current.setLngLat([lng, lat]).addTo(map.current);
  };

  React.useEffect(() => {
    if (!map.current && !marker.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [mapConfig.lng, mapConfig.lat],
        zoom: mapConfig.zoom,
      });

      marker.current = new mapboxgl.Marker();

      map.current.on("click", clickHandler);

      map.current.on("move", () => {
        setMapConfig({
          lng: map.current.getCenter().lng.toFixed(4),
          lat: map.current.getCenter().lat.toFixed(4),
          zoom: map.current.getZoom().toFixed(2),
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div ref={mapContainer} style={{ height: "500px" }}></div>
    </div>
  );
};

export default Map;
