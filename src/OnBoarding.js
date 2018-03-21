import  React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image
} from 'react-native';

import AppIntro from 'react-native-app-intro';

export default class OnBoarding extends Component {
    finish = () => {
        this.props.navigation.navigate('Notes');
    }

    render() {
        return (
            <AppIntro
                leftTextColor='#2c3e50'
                rightTextColor='#2c3e50'
                activeDotColor='#2c3e50'
                dotColor='rgba(0,0,0,0.2)'
                onDoneBtnClick={this.finish}
                onSkipBtnClick={this.finish}
            >
                <View style={[styles.slide]}>
                    <Image resizeMode='contain' source={require('../images/photo-camera.png')} style={styles.slideIcon}/>
                    <Text style={[styles.headerTxt, { color: '#2c3e50' }]}>Take A Photo Of Typed Or Hand Written Document.</Text>
                </View>
                <View style={[styles.slide]}>
                    <Image resizeMode='contain' source={require('../images/headphones.png')} style={styles.slideIcon}/>
                    <Text style={[styles.headerTxt, { color: '#2c3e50' }]}>Listen To Audio Of The Document's Content.</Text>
                </View>
            </AppIntro>
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        backgroundColor: '#FFC221',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
        padding: 20
    },

    slideIcon: {
        width: 200,
        height: 200,
        marginBottom: 20
    },

    headerTxt: {
        width: 200,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});