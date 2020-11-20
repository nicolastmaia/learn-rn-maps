import {Button, Icon, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapView, {Marker, Polygon} from 'react-native-maps';

let chaveTeste = 0;

const App = () => {
  const [editing, setEditing] = useState(false);
  const [remove, setRemove] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState([]);

  const toggleEditing = () => {
    setEditing((prevState) => !prevState);
    setRemove(false);
  };

  const toggleRemove = () => {
    setRemove((prevState) => !prevState);
  };

  const removeMarker = (markerKey) => {
    if (remove) {
      let markersUpdated = markers.filter((marker) => {
        return marker.key != markerKey;
      });
      markersUpdated.sort(function (a, b) {
        return a.key - b.key;
      });
      setMarkers(markersUpdated);
    }
  };

  const createMarker = (coordinate) => {
    if (editing) {
      chaveTeste++;
      setMarkers((prevState) => {
        return [...prevState, {key: chaveTeste, coordinate}];
      });
    }
  };

  const renderMarker = (marker) => {
    return (
      <Marker
        key={marker.key}
        draggable
        coordinate={marker.coordinate}
        title={`${marker.key}`}
        onPress={() => removeMarker(marker.key)}
        onDragEnd={(e) => {
          updateMarkerCoord(marker.key, e.nativeEvent.coordinate);
        }}></Marker>
    );
  };

  const updateMarkerCoord = (markerKey, coordinate) => {
    let markersUpdated = markers.filter((marker) => {
      return marker.key != markerKey;
    });
    markersUpdated.push({key: markerKey, coordinate});
    markersUpdated.sort(function (a, b) {
      return a.key - b.key;
    });
    setMarkers(markersUpdated);
  };

  const fetchCoordinatesFromMarkers = () => {
    setPolygonCoords([]);
    markers.map((marker) => {
      const {coordinate} = marker;
      setPolygonCoords((prevState) => [...prevState, coordinate]);
    });
  };

  useEffect(() => {
    fetchCoordinatesFromMarkers();
  }, [markers]);

  return (
    <>
      <MapView
        style={styles.map}
        loadingEnabled={true}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onLongPress={(e) => createMarker(e.nativeEvent.coordinate)}>
        {editing ? markers.map((marker) => renderMarker(marker)) : <></>}
        {polygonCoords.length > 0 ? (
          <Polygon
            coordinates={polygonCoords}
            fillColor="rgba(255, 138, 138, 0.5)"
          />
        ) : (
          <></>
        )}
      </MapView>
      <Button
        success
        style={{position: 'absolute', bottom: 5, right: 5}}
        onPress={toggleEditing}>
        {editing ? (
          <Icon type="Ionicons" name="checkmark-outline" />
        ) : (
          <Icon type="Ionicons" name="golf-outline" />
        )}
      </Button>
      {editing ? (
        <Button
          danger
          style={{position: 'absolute', bottom: 5, left: 5}}
          onPress={toggleRemove}>
          <Icon type="Ionicons" name="trash-outline" />
          <Text>Remove: {remove ? 'ON' : 'OFF'}</Text>
        </Button>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default App;
