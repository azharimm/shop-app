import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useSelector } from 'react-redux';
import Color from '../../constants/Color';

const CartScreen = (props) => {
    const cartTotalAmount = useSelector((state) => state.carts.totalAmount);
    const cartItems = useSelector(state => {
        const transfromCartItems = [];
        for (const key in state.carts.carts) {
            transfromCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.carts.items[key].quantity,
                sum: state.carts.items[key].sum,
            })
        }
        return transfromCartItems
    })
    return (
        <View style={styles.screen}>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
                </Text>
                <Button color={Color.accent} title="Order Now" disabled={cartItems.length === 0} />
            </View>
            <View>
                <FlatList />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Color.primary
    }
});

export default CartScreen;
