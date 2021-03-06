import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import { MaterialIcons } from '@expo/vector-icons';
import Photo from './Photo';

const PHOTOS_DIR = FileSystem.documentDirectory + 'photos';

export default class GalleryScreen extends React.Component {
  state = {
    faces: {},
    images: {},
    photos: [],
    selected: [],
  };

  componentDidMount = async () => {
    const photos = await FileSystem.readDirectoryAsync(PHOTOS_DIR);
    this.setState({ photos });
  };

  toggleSelection = (uri, isSelected) => {
    let selected = this.state.selected;
    if (isSelected) {
      selected.push(uri);
    } else {
      selected = selected.filter(item => item !== uri);
    }
    this.setState({ selected });
  };

  chooseToPreview = async () => {
    const photos = this.state.selected;

    if (photos.length == 1) {
      // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      // if (status !== 'granted') {
      //   throw new Error('Denied CAMERA_ROLL permissions!');
      // }

      const promises = photos.map(photoUri => {
        return MediaLibrary.createAssetAsync(photoUri);
      });
        try {
          const results = await Promise.all(promises)
          console.log("print promises");
          console.log(results);

          let localURI = results[0].uri;

          console.log("print localURI");
          console.log(localURI);


      

          this.props.navigation.navigate('Preview', {imgType: 'taken', imgURI: localURI,})
        } catch(err){
        console.log(err);
      }

      //alert('Successfully saved photos to user\'s gallery!');
    } else if (photos.length == 0) {
      alert('No photos to save!');
    } else {
      alert('Please only choose one picture!')
    }
  };

  renderPhoto = fileName => 
    <Photo
      key={fileName}
      uri={`${PHOTOS_DIR}/${fileName}`}
      onSelectionToggle={this.toggleSelection}
    />;

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
            <MaterialIcons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.chooseToPreview}>
            <Text style={styles.whiteText}>Preview Selected</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.state.photos.map(this.renderPhoto)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4630EB',
  },
  pictures: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  button: {
    padding: 20,
  },
  whiteText: {
    color: 'white',
  }
});
