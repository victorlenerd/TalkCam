import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    Alert,
    Image,
    Modal,
    TextInput,
    ScrollView,
    Dimensions,
    AsyncStorage,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';

import fs from 'react-native-fs';
import config from '../config';
import RNFetchBlob from 'react-native-fetch-blob'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationActions } from 'react-navigation';

const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const { width } = Dimensions.get('window');

export default class Reader extends Component {

    state = {
        loading: false,
        body: '',
        editedBody: [],
        modalVisible: false,
        uploadUrl: "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/recognizeText?",
    }

    async componentWillMount() {
        const { params: { image, type } } = this.props.navigation.state;

        try {
            this.setState({ loading: true })
            const imageData = await fs.readFile(image.uri, 'base64');
            const imageBlob = await Blob.build(imageData, { type : 'image/jpg;base64' }).then((blob) => blob);
            const uploadResponse = await this.uploadPhoto( imageBlob, type );
            const response = (type === 0) ? await this.receivePhotoData(uploadResponse) : uploadResponse;
            const body = this.prepareResponse(response);
            this.setState({ loading: false, body });
        } catch (err) {
            Alert.alert('File Upload Error', err.message, [{
                label: 'OK'
            }]);
        }

        this.setState({ loading: false });
    }

    uploadPhoto = (imageBlob, imageType ) => new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        const successStatus = (imageType === 0) ? 202: 200;

        request.onreadystatechange = (e) => {
            if (request.readyState !== 4) return;

            if (imageType === 1 && request.status == successStatus && request.status < 400) {
                resolve(JSON.parse(request.responseText));
            } else if (imageType === 0 && request.status == successStatus && request.status < 400) {
                resolve(request.getResponseHeader('Operation-Location'));
            } else {
                reject({ message: request.responseText });
            }
        };

        request.open('POST', `${this.state.uploadUrl}${ (imageType === 0) ? 'handwriting=true' : 'handwriting=false' }`);
        request.setRequestHeader('Ocp-Apim-Subscription-Key', config.api_key)
        request.setRequestHeader('Content-Type', 'application/octet-stream')
        request.send(imageBlob);
    });

    prepareResponse = (response) => {
        let text = "";

        response.regions.forEach((r) => {
            r.lines.forEach((l)=> {
                l.words.forEach((w)=> {
                    text += `${w.text} `
                });
            });
        });

        return text;
    }

    receivePhotoData = async (receiveUrl) => new Promise((resolve, reject) => {
        let interval = null;

        const checkResult = () => {
            fetch(`${receiveUrl}`, {
                headers: {
                    'Ocp-Apim-Subscription-Key': config.api_key,
                }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'Succeeded') {
                    clearInterval(interval);
                    resolve({ regions: [{ lines: data.recognitionResult.lines }] });
                };
            })
            .catch((err)=> {
                clearInterval(interval);
                reject(err);
            });
        }

        interval = setInterval(checkResult, 7000);
        checkResult();
    });

    saveNote = async () => {
        const time = Date.now();
        const data = {
            body: this.state.body,
            time,
        };

        try {
            let notes = await AsyncStorage.getItem('@WOKOSORO:NOTES_');
            if (notes === null) {
                notes = []
                notes.push(data);
                await AsyncStorage.setItem('@WOKOSORO:NOTES_', JSON.stringify(notes));
            } else {
                notes = JSON.parse(notes);
                notes.push(data);
                await AsyncStorage.setItem('@WOKOSORO:NOTES_', JSON.stringify(notes));
            }
            
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index: 0, 
                    actions: [
                        NavigationActions.navigate({ routeName: 'Notes' })     
                    ]
                })
            );
        } catch (err) {
            Alert.alert('File Error Error', err.message, [{
                label: 'OK'
            }]);
        }
    }

    editNote = () => {
        this.setState({
            editedBody: this.state.body.split('. '),
            modalVisible: true
        });
    }

    render() {
        const { loading, body }  = this.state;
        const bodies = body.split('. ');
        if (loading) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator />
                </View>
            );
        }

        return (
            <View style={{flex: 1}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}>
                    <View style={[styles.container, {paddingTop: 80}]}>
                        <View style={[styles.topTrans, { backgroundColor: '#0E86FA' }]}>
                            <TouchableOpacity style={styles.actionBttn} onPress={()=> { this.setState({ body: this.state.editedBody.join(' '), modalVisible: false }) }}>
                                <Text style={[styles.actionTxt, { color: '#fff' }]}>DONE</Text>
                            </TouchableOpacity>
                        </View>
                        <KeyboardAwareScrollView>
                            <View>
                                {this.state.editedBody.map((text, i)=> {
                                    return (
                                        <TextInput
                                            key={i}
                                            onChange={(e)=> {
                                                const bodies = this.state.editedBody;
                                                bodies[i] = e.nativeEvent.text;
                                                this.setState({
                                                    editedBody: bodies
                                                });
                                            }}
                                            multiline={true}
                                            value={this.state.editedBody[i]}
                                            style={styles.bodyText}>
                                        </TextInput>
                                    );
                                })}
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </Modal>
                <View style={styles.topTrans}>
                    <TouchableOpacity style={styles.actionBttn} onPress={this.editNote}>
                        <Image source={require('../images/pencil.png')} style={styles.icon} />
                        <Text style={styles.actionTxt}>EDIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBttn} onPress={this.saveNote}>
                        <Image source={require('../images/save.png')} style={styles.icon} />
                        <Text style={styles.actionTxt}>SAVE</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.container}>
                    <View style={{ marginBottom: 100, marginTop: 100 }}>
                        {bodies.map((text, i)=> {
                            return (<Text key={i} style={styles.bodyText}>{text}.</Text>)
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        flex: 1
    },

    topTrans: {
        width: width,
        paddingHorizontal: 20,
        height: 80,
        zIndex: 10,
        top: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowOpacity: 0.1
      },

    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    bodyText: {
        fontSize: 18,
        marginBottom: 15,
        lineHeight: 25
    },

    controlSpaces: {
        width,
        height: 100,
        backgroundColor: '#0E86FA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    icon: {
        width: 20,
        height: 20,
        marginRight: 10
    },

    actionTxt: {
        fontSize: 16,
        color: '#0E86FA'
    },

    actionBttn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 50
    }

});
