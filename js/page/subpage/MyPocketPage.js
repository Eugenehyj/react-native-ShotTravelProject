/**
 * 个人页面我的财富
 */


import React from "react";
import {
    AppRegistry,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
} from 'react-native';
import { StackNavigator, TabBarBottom, TabNavigator } from 'react-navigation';
import OneHeader from '../../group/element/OneHeader';

export default class mypocket extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View>
                <OneHeader
                    title="我的钱包"
                    navigation={this.props.navigation}
                />
            </View>
        );
    }
}