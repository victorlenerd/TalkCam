import React, { Component } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    TouchableOpacity
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default class Camera extends Component {

    state = {
        email: '',
        password: ''
    }

    validEmail = () => {

    }

    emailChange = () => {
        this.setState({ email: e.nativeEvent.text });
    }

    passwordChange = (e) => {
        this.setState({ password: e.nativeEvent.text });
    }

    renderFormError = (condition = false, msg) => {
        if (!condition) return null;

        return (
            <View style={styles.formError}>
                <Text>{msg}</Text>
            </View>
        ); 
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titleHeader}>Welcome.</Text>
                <View style={styles.formContainer}>
                    <View style={styles.formErrRow}>
                        <Text style={styles.label}>Email</Text>
                        {this.renderFormError(this.validEmail(), 'Enter a valid email address.')}
                        <TextInput placeholder='Enter Email' onChange={this.emailChange} />
                    </View>
                    <View style={styles.formErrRow}>
                        <Text style={styles.label}>Password</Text>
                        {this.renderFormError(this.state.password.length >= 6, 'The password should be at least 6 characters.')}
                        <TextInput placeholder='Enter Password' onChange={this.passwordChange} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20
    },
    formContainer: {
        marginTop: 100
    },
    formErrRow: {
        flexDirection: 'row',
        marginHorizontal: 10
    },
    titleHeader: {
        fontSize: 30
    },
    controlSpaces: {
        width, 
        height: 100, 
        backgroundColor: '#0E86FA',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionBtn: {
        flex: .5,
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionIcon: {
        width: 22,
        height: 22
    },
    label: {
        fontSize: 8
    }
});
