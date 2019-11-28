import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from 'react-native';
import MqttService from "./src/core/service/MqttService";


export default class App extends Component<Props> {
    state = {
        isConnected: false,
        message: ""
    };

    componentDidMount() {
        MqttService.connectClient(
            this.mqttSuccessHandler,
            this.mqttConnectionLostHandler
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
        MqttService.publishMessage("bigdata/gps", "Hello from the app");
    };
    render() {
        const { isConnected, message } = this.state;
        return (
            <View style={styles.container}>
                {!isConnected}
                <Text style={styles.welcome}>You received message: {message}</Text>
                <Button
                    onPress={setInterval(this.onPublish,2000)}
                    title="Publish"
                    color="#841584"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});

