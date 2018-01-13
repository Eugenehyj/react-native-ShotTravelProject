import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Button,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    Modal
} from 'react-native';
import  ImageViewer  from 'react-native-image-zoom-viewer';
import  ForOnePress from '../util/CommonUtil';

export default class SingleShareCir extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            state:0,
            open: false,
            imageIndex:0,
        };
        this.dataToPost = [];
    }
    _renderImages = () => {
        let images =this.props.allMessage.blogImage!=null?this.props.allMessage.blogImage!=''?this.props.allMessage.blogImage.split('&'):'n':'n';
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
                                style={{height: 220, width: 220, resizeMode: 'cover'}}
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
    _ini =() =>{
        const image_ = this.props.allMessage.blogImage!=null?this.props.allMessage.blogImage!=''?this.props.allMessage.blogImage.split('&'):'n':'n';
        this.dataToPost=[];
        for(var i = 0;i<image_.length-1;i++){
            this.dataToPost.push({
                url: 'http://119.29.147.108:8080/TravelPro' + image_[i]
            })
        }
        //console.log(this.dataToPost);
    };
    render() {
        const image =this.props.allMessage!=''?this.props.allMessage.cub.userImage.split('&'):'';
        const {navigate} = this.props.navigation;
        return (
            <View style={{borderWidth:.3,borderColor:'#e0e0e0',backgroundColor:'white',marginBottom:10,}}>
                <View style={{padding:10,paddingBottom:0,}}>
                    <TouchableOpacity
                        onPress={() => ForOnePress(() => navigate('detailshare',{user:'detailshare',blogId:this.props.allMessage.blogId}))}
                    >
                    <View style={{flexDirection:'row'}}>
                        <View style={{justifyContent:'center'}}>
                            <Image
                                style={{height:35,width:35,borderRadius:50,}}
                                source={{uri:'http://119.29.147.108:8080/TravelPro'+image[0]}}
                            />
                        </View>
                        <View style={{marginLeft:5,}}>
                            <Text style={{color:'black'}}>{this.props.allMessage.cub.nicName}</Text>
                            <Text style={{color:'#b0b0b0'}}>{this.props.allMessage.date.replace('T',' ')}</Text>
                        </View>
                    </View>
                    <View style={{marginTop:10,}}>
                        <Text style={{color:'black'}}>{this.props.allMessage.blog}</Text>
                    </View>
                    <View style={{marginTop:10,flexDirection:'row',flexWrap:'wrap',}}>
                        {/*分享圈图片区域*/}
                        {this._renderImages()}
                    </View>

                    <View style={styles.bottomBtn}>
                        <View style={{flex:1,alignItems:'center',justifyContent:'flex-start',flexDirection:'row',}}>
                            <View style={{marginRight:10,flexDirection:'row',}}>
                                <Image
                                    style={{height:20,width:20,tintColor:'#909090',marginRight:5,}}
                                    source={{uri:'commet'}}
                                />
                                <Text style={{color:'#909090'}}>评论</Text>
                            </View>
                            <View style={{flexDirection:'row',}}>
                                <Image
                                    style={{height:20,width:20,tintColor:'#909090',marginRight:5,}}
                                    source={{uri:'zan'}}
                                />
                                <Text style={{color:'#909090'}}>点赞</Text>
                            </View>
                        </View>
                        <View style={{flex:1,alignItems:'center',justifyContent:'flex-end',flexDirection:'row'}}>
                            <Image
                                style={{height:20,width:20,tintColor:'#909090',marginRight:5,}}
                                source={{uri:'share'}}
                            />
                            <Text style={{color:'#909090'}}>分享</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
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
                            <Text style={{fontSize:20,}}>+</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
        marginTop:10,
    },
    modalBtn:{
        position:'absolute',
        width:30,
        height:30,
        right:10,
        top:20,
        backgroundColor:'rgba(255,255,255,0.7)',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        //transform:[{rotate:'45deg'}],
    },
});
