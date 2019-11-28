import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import MqttService from "./src/core/service/MqttService";

export default class App extends Component {
    state = {
        isConnected: false,
        message: "",
        trip: '',
        route:'',
        vehicle:'',
        latitude: null,
        longitude: null,
    };

    componentDidMount() {


        MqttService.connectClient(
            this.mqttSuccessHandler,
            this.mqttConnectionLostHandler
        );
        this.getLocation();
    }

    getLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // console.log("wokeeey");
                console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => console.log("Location error:" + error.message),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    onWORLD = message => {
        this.setState({
            message
        });
    };

    mqttSuccessHandler = () => {
        console.info("connected to mqtt");
        MqttService.subscribe("WORLD", this.onWORLD);

        this.setState({
            isConnected: true
        });
    };

    mqttConnectionLostHandler = () => {
        this.setState({
            isConnected: false
        });
    };
    onPublish = () => {
        this.getLocation();
        const message = this.state.route + " " + this.state.trip + " " + this.state.vehicle + " " + this.state.latitude + " " + this.state.longitude;
        console.log("Message:", message)
        MqttService.publishMessage("bigdata/gps", message);
    };


    sendMessage = () => {
    setInterval(this.onPublish,10000);
}


    render() {
        const { isConnected, message } = this.state;
        return (
            <View style={styles.container}>
                {!isConnected}
                <TextInput style={styles.input}
                           underlineColorAndroid="transparent"
                           placeholder="Trip id"
                           placeholderTextColor="#9a73ef"
                           autoCapitalize="none"
                           onChangeText={(text) => this.setState({trip: text})}/>

                <TextInput style={styles.input}
                           underlineColorAndroid="transparent"
                           placeholder="Route id"
                           placeholderTextColor="#9a73ef"
                           autoCapitalize="none"
                           onChangeText={(text) =>this.setState({route: text})}/>
                <TextInput style={styles.input}
                           underlineColorAndroid="transparent"
                           placeholder="Vehicle id"
                           placeholderTextColor="#9a73ef"
                           autoCapitalize="none"
                           onChangeText={(text) =>this.setState({vehicle: text})}/>
                <Button
                    onPress={this.sendMessage()}
                    title="Send"
                    color="#841584"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 23
    },
    input: {
        margin: 15,
        height: 40,
        paddingLeft: 10,
        borderColor: '#7a42f4',
        borderWidth: 1
    },
    submitButton: {
        backgroundColor: '#7a42f4',
        padding: 10,
        margin: 15,
        height: 40,
    },
    submitButtonText: {
        color: 'white'
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});

