import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import { CameraKitCamera } from 'react-native-camera-kit';

export default class Root extends Component {
    state = {
        ready: false,
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.camSpace}>
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
                            ratioOverlay:'1:1',            // optional, ratio overlay on the camera and crop the image seamlessly
                            ratioOverlayColor: '#00000077' // optional
                        }} />
                </View>
                <TouchableOpacity style={[styles.talkButton, (this.state.ready) ? { opacity: 1 } : { opacity: 0.2 } ]}>
                    <Text style={styles.talkText}>Start Talking</Text>
                </TouchableOpacity>
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
        height: 100,
        backgroundColor: '#336E7B',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    talkText: {
        color: '#ffffff',
        fontSize: 20
    }
});
