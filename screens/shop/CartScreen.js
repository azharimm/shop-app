import React, {useState} from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Color from '../../constants/Color';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart'
import * as orderActions from '../../store/actions/orders'
import Card from '../../components/UI/Card'

const CartScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const cartTotalAmount = useSelector((state) => state.carts.totalAmount);
    const cartItems = useSelector((state) => {
        const transfromCartItems = [];
        for (const key in state.carts.items) {
            transfromCartItems.push({
                productId: key,
                productTitle: state.carts.items[key].productTitle,
                productPrice: state.carts.items[key].productPrice,
                quantity: state.carts.items[key].quantity,
                sum: state.carts.items[key].sum
            });
        }
        return transfromCartItems.sort((a,b) => a.productId > b.productId ? 1: -1);
    });
    const dispatch = useDispatch()

    const sendOrderHandler = async () => {
        setIsLoading(true)
        await dispatch(orderActions.addOrder(cartItems, cartTotalAmount))
        setIsLoading(false)
    }

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total:{' '}
                    <Text style={styles.amount}>
                        ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
                    </Text>
                </Text>
                {isLoading ? (
                    <View>
                        <ActivityIndicator size="small" color={Color.primary} />
                    </View>
                ): (
                    <Button
                        color={Color.accent}
                        title="Order Now"
                        disabled={cartItems.length === 0}
                        onPress={sendOrderHandler}
                    />
                )}
            </Card>
            <View>
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item.productId}
                    renderItem={(itemData) => (
                        <CartItem
                            quantity={itemData.item.quantity}
                            title={itemData.item.productTitle}
                            amount={itemData.item.sum}
                            deletable={true}
                            onRemove={() => {dispatch(cartActions.removeFromCart(itemData.item.productId))}}
                        />
                    )}
                />
            </View>
        </View>
    );
};

CartScreen.navigationOptions = {
    headerTitle: 'Your Carts'
}

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
