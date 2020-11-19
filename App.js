import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';


let chaveTeste = 1;

const App = () => {
  
  const [markers, setMarkers] = useState([
    {key:chaveTeste, coordinate: {latitude: 37.78825, longitude: -122.4324}},
  ]);
  const [polygonCoords, setPolygonCoords] = useState([]);

    const createMarker = (coordinate)=>{
      chaveTeste++;
      setMarkers((prevState)=>{return [...prevState, {key:chaveTeste,coordinate}]})
    }
    
    const showMarker = (marker)=>{
        return <Marker draggable coordinate={marker.coordinate} onDragEnd={(e)=>{updateMarkerCoord(marker.key, e.nativeEvent.coordinate)}} ></Marker>;
    }

    const updateMarkerCoord = (key, coordinate)=>{
      let markersUpdated = markers.filter((marker)=>{return marker.key!=key})
      markersUpdated.push({key, coordinate});
      markersUpdated.sort(function (a, b) {
        return a.key - b.key;
      });
      setMarkers(markersUpdated);
    }

    const fetchCoordinatesFromMarkers = () =>{
      setPolygonCoords([]);
      markers.map((marker)=>{
        const {coordinate} = marker
        setPolygonCoords((prevState)=>[...prevState, coordinate])
      })
    }

    useEffect(()=>{
      fetchCoordinatesFromMarkers()
    }, [markers])

  return (
    <MapView
      style={styles.map}
      loadingEnabled={true}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
      onLongPress = {(e)=>createMarker(e.nativeEvent.coordinate)}
      >
        {markers.map(marker => showMarker(marker))}
       <Polygon coordinates = {polygonCoords} fillColor='rgba(255, 138, 138, 0.5)'></Polygon>
      </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
})

export default App;
