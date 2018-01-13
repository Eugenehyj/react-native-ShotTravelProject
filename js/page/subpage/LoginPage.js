/**
 * 登录页面
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
    TextInput,
    AsyncStorage,
    DeviceEventEmitter,
} from 'react-native';
import { StackNavigator, TabBarBottom, TabNavigator } from 'react-navigation';
import OneHeader from '../../group/element/OneHeader';
import ForOnePress from '../../util/CommonUtil';
import Spinkit from 'react-native-spinkit';

export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userName:'',
            password:'',
            allMessage:'',
            isLoading:false,
            isNotWork:'',
        };

    }
    //注册通知
    componentDidMount(){
        DeviceEventEmitter.addListener('Register',(dic)=>{
            //接收到详情页发送的通知，刷新首页的数据，改变按钮颜色和文字，刷新UI
            if(dic.isRegister){
                this.props.navigation.goBack();
            }
        });
    }
    componentWillUnmount(){

    };
    _fetchData = () =>{
        //const { params } = this.props.navigation.state;
        fetch('http://119.29.147.108:8080/TravelPro/login?cubb.userName='
            +this.state.userName+'&cubb.password='+this.state.password+'&cubb.token=002')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.message==='登录成功'){
                    //this._save('userName',this.state.userName);
                    //查询用户信息
                    this._Message();
                    //alert(this.state.allMessage);
                    this.setState({isLoading:false});
                }
                else{
                    alert('密码错误');
                    this.setState({isLoading:false});
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error);
                this.setState({isLoading:false});
            });
    };
    _Message = ()=>{
        fetch('http://119.29.147.108:8080/TravelPro/getUser?cub.userName='+this.state.userName+'&cub.cubb.token=002')
            .then((response_) => response_.json())
            .then((responseJson) => {
                console.log(responseJson);
                //通知上一页面
                DeviceEventEmitter.emit('ChangeUI', {uName:responseJson.user,setCounter:'no'});
                this.props.navigation.goBack();
            })
            .catch((error) => {
                alert(error);
                console.error(error);
            });
    };
    render(){
        return(
            <View>
                <OneHeader
                    title="登陆/注册"
                    navigation={this.props.navigation}
                    other={true}
                    subPage="Register"
                />
                <View style={{marginTop:80,alignItems:'center'}}>
                    <View style={{width:'100%'}}>
                        <TextInput
                            style={{paddingLeft:10,backgroundColor:'#fff'}}
                            placeholder="账号"
                            multiline={false}
                            underlineColorAndroid = {'transparent'}
                            onChangeText={(text) => {
                                this.setState({
                                    userName: text
                                })
                            }}
                        >
                        </TextInput>
                    </View>
                    <View style={{borderTopWidth:.4,borderColor:'#e8eae9',width:'100%'}}>
                        <TextInput
                            style={{paddingLeft:10,backgroundColor:'#fff'}}
                            placeholder="密码不小于6位"
                            password ={true}
                            multiline={false}
                            underlineColorAndroid = {'transparent'}
                            onChangeText={(text) => {
                                this.setState({
                                    password: text
                                })
                            }}
                        >
                        </TextInput>
                    </View>
                    <View style={{marginTop:5,paddingLeft:5,paddingRight:5,}}>
                        <Text style={{fontSize:12,}}>
                            *温馨提示：未注册的账号，登陆时自动注册且代表您已同意《xxxx协议》
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => ForOnePress(()=>{this.setState({isLoading:true});this._fetchData()})}
                        style={[styles.btn,{backgroundColor:this.state.userName==''|this.state.password==''?'#e8eae9':'#f5ce4d',}]}
                        disabled = {this.state.userName==''|this.state.password==''?true:false}
                    >
                        <Text style={{fontSize:16}}>登陆</Text>
                    </TouchableOpacity>
                    {this.state.isLoading?
                        <View style={styles.loading}>
                            <Spinkit
                                isVisible={this.state.isLoading}
                                style={{}}
                                size={50}
                                color={'#3b77ff'}
                                type={'Circle'}
                            />
                        </View>:null
                    }
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    btn:{
        marginTop:20,
        width:300,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
    },
    loading:{
        position:'absolute',
        height:'200%',
        width:'100%',
        top:-70,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0)',
    },
});