import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FlatList, Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as orderActions from '../../store/actions/orders'
import Color from '../../constants/Color'

const OrdersScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true)
        dispatch(orderActions.fetchOrder()).then(() => setIsLoading(false));
    }, [dispatch])

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Color.primary} />
        </View>
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
                <OrderItem
                    items={itemData.item}
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                />
            )}
        />
    );
};

OrdersScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName={
                        Platform.OS === 'android' ? 'md-menu' : 'ios-menu'
                    }
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default OrdersScreen;
