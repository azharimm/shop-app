import React, {useEffect} from 'react'
import {View, ActivityIndicator, StyleSheet, AsyncStorage} from 'react-native'
import {useDispatch} from 'react-redux'
import Color from '../constants/Color'
import * as authActions from '../store/actions/auth'

const StartupScreen = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData')
            if(!userData) {
                props.navigation.navigate('Auth');
                return;
            }
            
            const trasformedData = JSON.parse(userData);
            const {token, userId, expiryDate} = trasformedData;
            const expirationDate = new Date(expiryDate);

            if(expiryDate <= new Date || !token || !userId) {
                props.navigation.navigate('Auth');
                return;
            }

            props.navigation.navigate('Shop');
            dispatch(authActions.authenticated(userId, token));

        }
        tryLogin();
    }, [dispatch])
    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Color.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen
