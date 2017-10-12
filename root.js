import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import { CameraKitCamera } from 'react-native-camera-kit';
import fs from 'react-native-fs';

const { width, height } = Dimensions.get('window');

export default class Root extends Component {
    state = {
        ready: false,
        imageUri: ''
    }

    snap = async () => {
        const image = await this.camera.capture();
        const imageUri = await fs.readFile(image.uri, 'base64');
        this.setState({ ready: true, imageUri });
    }

    renderCamera = () => {
        if (this.state.ready) {
            return (
                <Image style={{flex: 1, backgroundColor: '#0E86FA'}} resizeMode='contain' source={{ uri: `data:image/jpg;base64,${this.state.imageUri}` }} />
            );
        }

        return (
            <CameraKitCamera
                ref={cam => this.camera = cam}
                style={{
                    flex: 1,
                    backgroundColor: '#000000'
                }}
                cameraOptions={{
                    flashMode: 'auto',             // on/off/auto(default)
                    focusMode: 'on',               // off/on(default)
                    zoomMode: 'on',                // off/on(default)
                    ratioOverlayColor: '#0E86FA' // optional
                }}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.camSpace}>
                    {this.renderCamera()}
                </View>
                <View style={styles.controlSpaces}>
                    <TouchableOpacity onPress={this.snap} style={[styles.talkButton]}>
                        <View style={styles.innerCircle}></View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    camSpace: {
        flex: 1
    },
    talkButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFC221',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    talkText: {
        color: '#ffffff',
        fontSize: 20
    },
    innerCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 1,
      borderColor: '#0E86FA'  
    },
    controlSpaces: {
        width, 
        height: 100, 
        backgroundColor: '#0E86FA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
