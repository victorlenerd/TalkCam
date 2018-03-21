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
import { StackNavigator } from 'react-navigation';

const { width, height } = Dimensions.get('window');

export default class Camera extends Component {

    state = {
        ready: false,
        cameraLight: 'auto',
        image: null
    }

    snap = async () => {
        const image = await this.camera.capture(false);
        this.setState({ ready: true, image });
    }

    cancel = () => {
        this.props.navigation.goBack();
    }

    changeFlashLight = async () => {
        try {
            if (this.state.cameraLight === 'auto') {
                const success = await this.camera.setFlashMode('on');
                this.setState({ cameraLight: 'on' });
                return;
            }
    
            if (this.state.cameraLight === 'on') {
                const success = await this.camera.setFlashMode('off');
                this.setState({ cameraLight: 'off' });
                return;
            }
    
            if (this.state.cameraLight === 'off') {
                const success = await this.camera.setFlashMode('auto');
                this.setState({ cameraLight: 'auto' });
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    renderFlashLightIcon = () => {
        if (this.state.cameraLight === 'auto') {
            return (
                <Image style={styles.actionSmallIcon} source={require('../images/automatic-flash.png')} resizeMode={'contain'} />                 
            );
        }

        if (this.state.cameraLight === 'off') {
            return (
                <Image style={styles.actionSmallIcon} source={require('../images/flash-off.png')} resizeMode={'contain'} />                 
            );
        }

        if (this.state.cameraLight === 'on') {
            return (
                <Image style={styles.actionSmallIcon} source={require('../images/flash.png')} resizeMode={'contain'} />                 
            );
        }

        return null;
    }

    renderCamera = () => {
        if (this.state.ready) {
            return (
                <Image style={{flex: 1, backgroundColor: '#0E86FA'}} resizeMode='contain' source={{ uri: this.state.image.uri }} />
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
                    flashMode: 'auto',             
                    focusMode: 'on',               
                    zoomMode: 'on',
                    ratioOverlayColor: '#0E86FA'
                }}
            />
        );
    }

    renderControls = ()=> {
        const { navigate, state: { params: { type } }} = this.props.navigation;

        if (this.state.ready) {
            return (
                <View style={styles.controlSpaces}>
                    <TouchableOpacity onPress={e => { this.setState({ ready: false }); }} style={[styles.actionBtn, { }]}>
                        <Image style={styles.actionIcon} source={require('../images/cross.png')} resizeMode={'contain'} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={e => {
                            navigate('Reader', {
                                image: this.state.image,
                                type
                            });
                        }}
                        style={[styles.actionBtn, {  }]}
                    >
                        <Image style={styles.actionIcon} source={require('../images/mark.png')} resizeMode={'contain'} /> 
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.controlSpaces}>
                <TouchableOpacity style={[styles.otherButton]} onPress={this.cancel}>
                    <Text style={{ fontSize: 18, color:'#FFC221' }}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.snap} style={[styles.talkButton]}>
                    <View style={styles.innerCircle}></View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.otherButton]} onPress={this.changeFlashLight}>
                    {this.renderFlashLightIcon()}
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.camSpace}>
                    {this.renderCamera()}
                    {this.renderControls()}
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
    otherButton: {
        width: 80,
        height: 80,
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
        paddingHorizontal: 20,
        backgroundColor: '#0E86FA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    actionBtn: {
        flex: .5,
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionIcon: {
        width: 18,
        height: 18
    },

    actionSmallIcon: {
        width: 22,
        height: 22
    }
});
