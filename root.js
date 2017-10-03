import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class Root extends Component {
    state = {
        ready: false,
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.camSpace}></View>
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
