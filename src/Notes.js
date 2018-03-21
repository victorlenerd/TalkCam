import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    Text,
    ActionSheetIOS,
    Alert,
    Platform,
    AsyncStorage
} from 'react-native';

import moment from 'moment';
import Swipeout from 'react-native-swipeout';

moment.updateLocale('en', {
    relativeTime : {
      past:   "%s",
      s:  "1 SEC",
      m:  "1 MIN",
      mm: "%d MINS",
      h:  "AN HOUR",
      hh: "%d HOURS",
      d:  "A DAY",
      dd: "%d DAYS",
      M:  "A MONTH",
      MM: "%d MONTHS",
      y:  "A YEAR",
      yy: "%d YEARS"
    }
  });

export default class Notes extends Component {

    state = {
        notes: []
    }

    async componentWillMount () { 
        try {
            const notes = await AsyncStorage.getItem('@WOKOSORO:NOTES_');
            if (notes !== null) {
                this.setState({
                    notes: JSON.parse(notes)
                });
            }
        } catch (err) {
            Alert.alert('Error Error', err.message, [{
                label: 'OK'
            }]);
        }
    }

    renderActionBttn = () => {
        return (
          <View style={styles.actionBttnContainer}>
            <TouchableOpacity
                style={styles.actionBttn}
                onPress={() => {

                    if (Platform.OS !== 'ios') {
                        Alert.alert(
                        'Type Of Document',
                        'What Type Of Document Do You Want To Snap ?',
                        [
                            { text: 'Typed', onPress: () => this.props.navigation.navigate('Camera', { type: 1 }) },
                            { text: 'Hand Written', onPress: () => this.props.navigation.navigate('Camera', { type: 0 }) },
                            { text: 'Canel', style: 'cancel' }
                        ]);
                    } else {
                        ActionSheetIOS.showActionSheetWithOptions({
                            title: 'Type Of Document',
                            message: 'What Type Of Document Do You Want To Snap ?',
                            options: ['Hand Written', 'Typed', 'Canel'],
                            cancelButtonIndex: 2
                        }, (index) => {
                            if (index !== 2) {
                                this.props.navigation.navigate('Camera', {
                                    type: index
                                });
                            }
                        });
                    }


                }}
            >
              <Image
                resizeMode='contain' 
                source={require('../images/add.png')}
                style={styles.icon} 
              />
            </TouchableOpacity>
          </View>
        );
    }

    renderHeader = () => (<View style={styles.listHeader}><Text style={styles.notesCount}>{this.state.notes.length}</Text><Text style={styles.noteText}>Notes</Text></View>);

    renderItem = ({ index, item }) => {
        var swipeoutBtns = [
            {
                component: <View style={{justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#e74c3c', paddingLeft: 10, paddingRight: 10}}><Text style={{color:'#fff', fontSize: 10}}>DELETE</Text></View>,
                onPress: this.deleteItem
            }
        ];

        return (
            <TouchableOpacity style={styles.noteRow}>
                <Swipeout style={{backgroundColor: '#fff'}} right={swipeoutBtns}>
                    <View style={{padding: 20}}>
                        <View>
                            <Text style={styles.noteBodyText}>{item.body.substring(0, 50)}</Text>
                        </View>
                        <View>
                            <Text style={styles.noteBodyTime}>{moment(item.time).fromNow()}</Text>
                        </View>
                    </View>
                </Swipeout>
            </TouchableOpacity>
        )
    }

    renderMain = () => {
        if (this.state.notes.length > 0) {
            return (
                <FlatList
                    data={this.state.notes}
                    ListHeaderComponent={this.renderHeader}
                    renderItem={this.renderItem}
                />
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Image
                    resizeMode='contain' 
                    source={require('../images/safebox.png')}
                    style={styles.emptyIcon} 
                />
                <Text style={styles.emptyTxt}>You Don't Have Any Saved Notes.</Text>
            </View>
        )
    }

    render () {
        return(
            <View style={styles.container}>
                {this.renderMain()}
                {this.renderActionBttn()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    actionBttn: {
        width: 50,
        height: 50,
        marginRight: 20,
        marginBottom: 20,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        backgroundColor: '#FFC221',
        shadowColor: '#000000',
        shadowOffset: {
            width: 2,
            height: 4
        },
        shadowOpacity: 0.1
      },
      
      emptyIcon: {
        width: 200,
        height: 200
      },

      icon: {
        width: 22,
        height: 22
      },
    
      actionBttnContainer: {
        width: 50,
        height: 200,
        bottom: 0,
        right: 0,
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },

      emptyContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      },

      emptyTxt: {
        width: 300,
        marginTop: 50,
        textAlign: 'center',
        color: '#2c3e50',
        fontWeight: 'bold',
        fontSize: 25
      },

      noteRow: {
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
        flexDirection: 'column',
      },

      listHeader: {
        height: 100,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
      },

      notesCount: {
        fontSize: 24,
        marginLeft: 10,
        fontWeight: '400'
      },

      noteText: {
        fontSize: 25,
        marginLeft: 20,
        color: '#666',
      },

      noteBodyText: {
        fontSize: 16,
      },

      noteBodyTime: {
        marginTop: 10,
        textAlign: 'right',
        fontSize: 14,
        color: '#666'
      }
});