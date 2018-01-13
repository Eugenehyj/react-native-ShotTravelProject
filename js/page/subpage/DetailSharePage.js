/**
 * 动态正文
 */


import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Image,
    ScrollView,
    TextInput,
    Modal, AsyncStorage, DeviceEventEmitter, Alert,
    RefreshControl, Dimensions,
    TouchableHighlight,
} from 'react-native';
import OneHeader from '../../group/element/OneHeader';
import Swiper from 'react-native-swiper';
import  ImageViewer  from 'react-native-image-zoom-viewer';
import moment from "moment/moment";
import ForOnePress from '../../util/CommonUtil';
import Spinkit from 'react-native-spinkit';
import Toast, {DURATION} from 'react-native-easy-toast';

export default class detailshare extends React.Component{
    constructor(props){
        super(props);
        this._fetchData();
        this.state = {
            state:0,
            allMessage:'',
            cub:'',
            cb:'',
            open: false,
            isImageShow: true,
            isInput:true,
            commetInput:'',
            commentHolder:'输入评论',
            recallID:0,
            isRefreshing:false,
            imageIndex:0,
            isLoading:true,
        };
        this.dataToPost = [];
        this.subCub=[];
        this.itemCommet = [];
    };
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    };
    _renderImages = () => {
        let images =this.state.allMessage.blogImage!=null?this.state.allMessage.blogImage!=''?this.state.allMessage.blogImage.split('&'):'n':'n';
        if(images.length>1){
            let imageItem = [];
            for(let i=0;i<images.length-1;i++){
                imageItem.push({
                    image:images[i],
                    index:i,
                });
            }
            //console.log(imageItem);
            if(imageItem.length==1){
                return (
                    <View>
                        <TouchableOpacity
                            onPress={() => {this._ini();this.setState({open: true})}}
                        >
                            <Image
                                style={{height: 260, width: 260, resizeMode: 'cover'}}
                                source={{uri: 'http://119.29.147.108:8080/TravelPro' + imageItem[0].image}}
                            />
                        </TouchableOpacity>
                    </View>
                );
            }
            else{
                return (
                    imageItem.map(i =>
                        <View key={i.index} style={{marginBottom:10,marginRight:10,}}>
                            <TouchableOpacity
                                onPress={() => {this._ini();this.setState({open: true,imageIndex:i.index});}}
                            >
                                <Image
                                    style={{height:80,width:80,resizeMode: 'cover'}}
                                    source={{uri:'http://119.29.147.108:8080/TravelPro'+i.image}}
                                />
                            </TouchableOpacity>
                        </View>
                    )

                );
            }
        }else{
            return (
                null
            );
        }
    };
    //渲染评论
    _renderItems = () => {
        //加判断使得没有数据时不进入
        if(this.state.allMessage!=null&&this.state.allMessage!=''){
            //下列循环可以优化，每次点击回复目标都会重新装载一次，可以试着减少执行次数**
            if(this.state.isInput){
                this.itemCommet = [];
                for(var i=0;i<this.state.cb.length;i++){
                    const image =this.subCub[i].cub!=''?this.subCub[i].cub.userImage.split('&'):'';
                    var reName = '';
                    //匹配回复的昵称
                    for(var j=0;j<this.state.cb.length;j++){
                        if(this.state.cb[i].recallId==this.state.cb[j].userId){
                            reName = '回复'+this.subCub[j].cub.nicName+'：';
                            break;
                        }
                    }
                    //重新组合数据结构
                    this.itemCommet.push({
                        commetId:this.state.cb[i].commetId,
                        commet:this.state.cb[i].commet,
                        date:this.state.cb[i].date,
                        recallId:this.state.cb[i].recallId,
                        nicName:this.subCub[i].cub.nicName,
                        userId:this.subCub[i].cub.id,
                        userImage:image[0],
                        recallName:reName,
                        index:i,
                    })
                }
                // console.log('新的数据结构:');
                // console.log(this.itemCommet);
            }
            if (this.itemCommet.length==null|this.itemCommet.length=='') {
                return (
                    <View style={{backgroundColor:'#fff',height:70,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{color:'#909090'}}>暂时没有评论</Text>
                    </View>
                );
            } else{
                return (
                    this.itemCommet.map(i =>i!=''?
                        <TouchableOpacity
                            key={i.index}
                            style={styles.commetText}
                            onPress={()=>{
                                try {
                                    AsyncStorage.getItem(
                                        'NameId',
                                        (error,result)=>{
                                            if (error){
                                                console.log('取值失败:'+error);
                                            }else{
                                                console.log('取值NameId成功');
                                                if(result!=null&&result!=i.userId){
                                                    this.setState({
                                                        commentHolder:'回复'+i.nicName+'：',
                                                        isInput:false,
                                                        recallID:i.userId,
                                                    })
                                                }
                                                else if(result==null){
                                                    Alert.alert('登陆','请先登录', [{text:"我知道了"}]);
                                                }
                                                else{
                                                    Alert.alert('删除','确认删除该评论？',
                                                        [
                                                            {text:"取消", onPress:this.close},
                                                            {text:"确认", onPress:this.confirm},
                                                        ]
                                                    )
                                                }
                                            }
                                        }
                                    )
                                }catch(error) {
                                    alert('失败' + error);
                                }

                            }}
                        >
                            <Image
                                style={{height:35,width:35,borderRadius:50,}}
                                source={{uri:'http://119.29.147.108:8080/TravelPro'+i.userImage}}
                            />
                            <View style={{marginLeft:10,}}>
                                <Text style={{color:'#909090',fontSize:12,marginBottom:10,}}>{i.nicName}</Text>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{color:'#111120',}}>{i.recallName}</Text>
                                    <Text style={{color:'black'}}>
                                        {i.commet}
                                    </Text>
                                </View>
                            </View>
                            <View style={{position:'absolute',right:0,width:115,top:10}}>
                                <Text style={{fontSize:12,color:'#909090'}}>{i.date.replace('T',' ')}</Text>
                            </View>
                        </TouchableOpacity>:<View key={i}/>
                    )

                );
            }
        }
    };
    _ini =() =>{
        const image_ = this.state.allMessage.blogImage!=null?this.state.allMessage.blogImage!=''?this.state.allMessage.blogImage.split('&'):'n':'n';
        this.dataToPost=[];
        for(var i = 0;i<image_.length-1;i++){
            this.dataToPost.push({
                url: 'http://119.29.147.108:8080/TravelPro' + image_[i]
            })
        }
        //console.log(this.dataToPost);
    };
    _fetchData = () =>{
        const { params } = this.props.navigation.state;
        fetch('http://119.29.147.108:8080/TravelPro/getOneShare?blogId='+params.blogId)
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('朋友圈所有数据：');
                // console.log(responseJson);
                this.subCub=[];
                for(var k=0;k<responseJson.message.cb.length;k++){
                    this.subCub.push({
                        cub:responseJson.message.cb[k].cub
                    });
                }
                 // console.log('取出所有评论用户：');
                 // console.log(this.subCub);
                this.setState({
                    allMessage:responseJson.message,
                    cub:responseJson.message.cub,
                    cb:responseJson.message.cb,
                    isLoading:false,
                })
            })
            .catch((error) => {
                console.error(error);
                this.refs.toast.show(error,2000);
                this.setState({
                    isLoading:false,
                })
            });
    };
    _preSend = () =>{
        try {
            AsyncStorage.getItem(
                'NameId',
                (error,result)=>{
                    if (error){
                        console.log('取值失败:'+error);
                    }else{
                        console.log('取值NameId成功');
                        if(result!=null){
                            this._sendCommet(result)
                        }
                        else{
                            Alert.alert('登陆','请先登录', [{text:"我知道了"}]);
                        }
                    }
                }
            )
        }catch(error) {
            alert('失败' + error);
        }
    };
    _sendCommet = (userId) =>{
        const { params } = this.props.navigation.state;
        let formData = new FormData();
        formData.append('blogId', params.blogId);
        formData.append('date', moment().format('YYYY-MM-DD HH:mm:ss'));
        formData.append('userId',userId);
        formData.append('recallId',this.state.recallID);
        formData.append('commet',this.state.commetInput);

        console.log(formData);
        const REQUEST_URL = 'http://119.29.147.108:8080/TravelPro/pushCommet';
        fetch(REQUEST_URL,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
                'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;',
            },
            body:formData,
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({isInput:true});
                this._fetchData();
            }).catch((error) => {
            this.refs.toast.show(error,2000);
        });
    };
    _onRefresh = () =>{
        this.setState({isRefreshing: true});
        this._fetchData();
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
            });
        }, 500);
    };
    render(){
        const image =this.state.cub!=''?this.state.cub.userImage.split('&'):'';
        return(
            <View style={{}}>
                <View style={{height:'100%'}}>
                    <View style={{height:70}}>
                        <OneHeader
                            title="动态正文"
                            navigation={this.props.navigation}
                        />
                    </View>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                                progressBackgroundColor="#ffffff"
                            />
                        }
                    >
                    {/*主体*/}
                    <View style={styles.main}>
                        <View style={{flexDirection:'row'}}>
                            <View style={{justifyContent:'center'}}>
                                <Image
                                    style={{height:35,width:35,borderRadius:50,}}
                                    source={{uri:'http://119.29.147.108:8080/TravelPro'+image[0]}}
                                />
                            </View>
                            <View style={{marginLeft:5,}}>
                                <Text style={{color:'black'}}>{this.state.cub.nicName}</Text>
                                <Text style={{color:'#b0b0b0'}}>{this.state.allMessage.date?this.state.allMessage.date.replace('T',' '):null}</Text>
                            </View>
                        </View>
                        <View style={{marginTop:10,}}>
                            <Text style={{color:'black'}}>{this.state.allMessage.blog}</Text>
                        </View>
                        <View style={{marginTop:10,marginBottom:10,flexDirection:'row',flexWrap:'wrap',}}>
                            {/*分享圈图片区域*/}
                            {this._renderImages()}
                        </View>
                    </View>
                    {/*详细*/}
                    <View style={{flex:1,marginBottom:10,}}>
                        <View style={styles.commetTitle}>
                            <Text>评论</Text>
                        </View>
                        <View>
                            {this._renderItems()}
                        </View>
                    </View>
                    </ScrollView>
                    {/*<TouchableHighlight
                        onPress={() => {this._ini();this.setState({open: true})}}
                    >
                        <Text>Show Modal</Text>
                    </TouchableHighlight>*/}
                    {/*底部功能*/}
                    <View style={{borderWidth:.3,borderColor:'#e0e0e0',backgroundColor:'white'}}>
                        {this.state.isInput?
                        <View style={styles.bottomBtn}>
                            <TouchableOpacity
                                onPress={()=>{
                                    try {
                                        AsyncStorage.getItem(
                                            'NameId',
                                            (error,result)=>{
                                                if (error){
                                                    console.log('取值失败:'+error);
                                                }else{
                                                    if(result!=null){
                                                        this.setState({isInput:false});
                                                    }
                                                    else{
                                                        Alert.alert('登陆','请先登录', [{text:"我知道了"}]);
                                                    }
                                                }
                                            }
                                        )
                                    }catch(error) {
                                        alert('失败' + error);
                                    }
                                }}
                                style={styles.bottomCommon}
                            >
                                <Image
                                    style={styles.bottomImage}
                                    source={{uri:'commet'}}
                                />
                                <Text style={{color:'#909090'}}>评论</Text>
                            </TouchableOpacity>
                            <View style={styles.bottomCommon}>
                                <Image
                                    style={styles.bottomImage}
                                    source={{uri:'zan'}}
                                />
                                <Text style={{color:'#909090'}}>点赞</Text>
                            </View>
                            <View style={styles.bottomCommon}>
                                <Image
                                    style={styles.bottomImage}
                                    source={{uri:'share'}}
                                />
                                <Text style={{color:'#909090'}}>分享</Text>
                            </View>
                        </View>:
                        <View style={styles.bottomBtn}>
                            <TextInput
                                placeholder={this.state.commentHolder}
                                underlineColorAndroid = {'transparent'}
                                style={{flex:5,paddingLeft:10,paddingRight:10}}
                                multiline={true}
                                onChangeText={(text) => {
                                    this.setState({
                                        commetInput: text
                                    })
                                }}
                                onBlur={()=>{
                                    this.setState({
                                        isInput:true,
                                        commentHolder:'输入评论',
                                        recallID:0,
                                    })
                                }}
                            >
                            </TextInput>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <TouchableOpacity
                                    style={[styles.sendBtn,{backgroundColor:this.state.commetInput==''?'#b0b0b0':'red',}]}
                                    onPress={()=>ForOnePress(()=>{this.setState({isLoading:true});this._preSend()})}
                                    disabled = {this.state.commetInput==''?true:false}
                                >
                                    <Text style={{color:'#fff'}}>发送</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        }
                    </View>
                </View>
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
                {/*模态框*/}
                <Modal
                    visible={this.state.open}
                    // modalDidOpen={() => console.log(this.dataToPost)}
                    // modalDidClose={() => this.setState({open: false})}
                    onRequestClose={() => this.setState({open: false})}
                    style={{flex:1,justifyContent:'center',arguments:'center'}}>
                    <View style={{flex:1}}>
                        <ImageViewer
                            imageUrls={this.dataToPost}
                            index={this.state.imageIndex}
                        />
                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => this.setState({open: false})}>
                            <Text style={{fontSize:16,color:'red'}}>关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Toast
                    ref="toast"
                    style={{backgroundColor:'rgba(0,0,0,.7)'}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'#fff'}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomBtn:{
        flexDirection:'row',
        borderTopWidth:.3,
        borderColor:'#e0e0e0',
        justifyContent:'space-around',
        height:40,
    },
    main:{
        //marginTop:60,
        borderWidth:.3,
        borderColor:'#e0e0e0',
        backgroundColor:'white',
        marginBottom:10,
        padding:10,
        paddingBottom:0,
    },
    commetTitle:{
        backgroundColor:'#fff',
        height:40,
        borderBottomWidth:.3,
        borderColor:'#e0e0e0',
        justifyContent:'center',
        paddingLeft:10,
    },
    commetText:{
        height:70,
        backgroundColor:'#fff',
        borderTopWidth:.3,
        borderColor:'#e0e0e0',
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:10,
    },
    bottomCommon:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row',
    },
    bottomImage:{
        height:20,
        width:20,
        tintColor:'#909090',
        marginRight:5,
    },
    sendBtn:{
        justifyContent:'center',
        alignItems:'center',
        width:40,
        height:30,
        borderRadius:5,
        elevation: 5,
        shadowOffset: {width: 10, height: 10},
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    modalBtn:{
        position:'absolute',
        width:45,
        height:45,
        right:10,
        top:20,
        backgroundColor:'rgba(255,255,255,0.5)',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        //transform:[{rotate:'45deg'}],
    },
    loading:{
        position:'absolute',
        height:'100%',
        width:'100%',
        top:70,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,0)',
    },
});
