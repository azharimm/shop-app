import React, { useState } from 'react';
import { createStore, combineReducers } from 'redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import productReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart'
import orderReducer from './store/reducers/orders'
import ShopNavigator from './navigation/ShopNavigator';
import { composeWithDevTools } from 'redux-devtools-extension'

const rootReducers = combineReducers({
    products: productReducer,
    carts: cartReducer,
    orders: orderReducer
});

const store = createStore(rootReducers, composeWithDevTools());

const fetchFonts = () => {
    return Font.loadAsync({
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
    });
};

export default function App() {
    const [fontLoaded, setFontLoaded] = useState(false);
    if (!fontLoaded) {
        return (
            <AppLoading
                startAsync={fetchFonts}
                onFinish={() => setFontLoaded(true)}
            />
        );
    }
    return (
        <Provider store={store}>
            <ShopNavigator />
        </Provider>
    );
}
