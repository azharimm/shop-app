import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Button
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Color from '../../constants/Color'

const AuthScreen = () => {
    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorMessage="Please enter a valid email address"
                            onValueChange={() => {}}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorMessage="Please enter a valid password"
                            onValueChange={() => {}}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            <Button title="Login" color={Color.primary} onPress={() => {}} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title="Switch to Signup" color={Color.accent} onPress={() => {}} />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        height: '50%',
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        marginTop: 10,
    }
});

export default AuthScreen;
