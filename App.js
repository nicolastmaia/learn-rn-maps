import { Button, Icon, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

let chaveTeste = 0;

const App = () => {
  const [editing, setEditing] = useState(false);
  const [remove, setRemove] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [polygonCoordinate, setPolygonCoordinate] = useState([]);

  const toggleEditing = () => {
    setEditing((prevState) => !prevState);
    setRemove(false);
  };

  const toggleRemove = () => {
    setRemove((prevState) => !prevState);
  };

  const createMarker = (coordinate) => {
    if (editing) {
      chaveTeste++;
      setMarkers((prevState) => {
        return [...prevState, { key: chaveTeste, coordinate }];
      });
    }
  };

  const renderMarker = (marker) => {
    return (
      <Marker
        pinColor='green'
        key={marker.key}
        draggable
        coordinate={marker.coordinate}
        title={`${marker.key}`}
        onPress={() => removeMarker(marker.key)}
        onDragEnd={(e) => {
          updateMarkerCoordinate(marker.key, e.nativeEvent.coordinate);
        }}
      ></Marker>
    );
  };

  const updateMarkerCoordinate = (markerKey, coordinate) => {
    let editedMarkersArray = markers.filter((marker) => {
      return marker.key != markerKey;
    });
    editedMarkersArray.push({ key: markerKey, coordinate });
    editedMarkersArray.sort(function (a, b) {
      return a.key - b.key;
    });
    setMarkers(editedMarkersArray);
  };

  const removeMarker = (markerKey) => {
    if (remove) {
      let editedMarkersArray = markers.filter((marker) => {
        return marker.key != markerKey;
      });
      editedMarkersArray.sort(function (a, b) {
        return a.key - b.key;
      });
      setMarkers(editedMarkersArray);
    }
  };

  const fetchCoordinateFromMarkers = () => {
    setPolygonCoordinate([]);
    markers.map((marker) => {
      const { coordinate } = marker;
      setPolygonCoordinate((prevState) => [...prevState, coordinate]);
    });
  };

  useEffect(() => {
    fetchCoordinateFromMarkers();
  }, [markers]);

  return (
    <>
      <MapView
        style={styles.map}
        loadingEnabled={true}
        moveOnMarkerPress={false}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onLongPress={(e) => createMarker(e.nativeEvent.coordinate)}
      >
        {editing ? markers.map((marker) => renderMarker(marker)) : <></>}
        {polygonCoordinate.length > 0 ? (
          <Polygon
            coordinates={polygonCoordinate}
            fillColor='rgba(255, 138, 138, 0.5)'
          />
        ) : (
          <></>
        )}
      </MapView>
      {editing ? (
        <>
          <Button success style={styles.editingButton} onPress={toggleEditing}>
            <Icon type='Ionicons' name='checkmark-outline' />
            <Text>Finish Editing</Text>
          </Button>
          <Button
            danger={remove}
            warning={!remove}
            style={styles.removeButton}
            onPress={toggleRemove}
          >
            <Icon type='Ionicons' name='trash-outline' />
            <Text>Remove Pin: {remove ? 'ON' : 'OFF'}</Text>
          </Button>
        </>
      ) : (
        <Button success style={styles.editingButton} onPress={toggleEditing}>
          <Icon type='Ionicons' name='golf-outline' />
          <Text>Start Editing</Text>
        </Button>
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
  editingButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  removeButton: { position: 'absolute', bottom: 5, left: 5 },
});

export default App;
