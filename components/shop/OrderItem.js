import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import CartItem from './CartItem';
import Color from '../../constants/Color';

const OrderItem = (props) => {
    const [showDetails, setShowDetails] = useState(false);
    console.log(props.items.items)
    return (
        <View style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>
                    ${props.amount.toFixed(2)}
                </Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button
                color={Color.primary}
                title={showDetails ? "Hide Details" : "Show Details"}
                onPress={() => {
                    setShowDetails((prevState) => !prevState);
                }}
            />
            {showDetails && (
                <View style={styles.detailItem}>
                    {props.items.items.map((cartItem, index) => (
                        <CartItem
                            quantity={cartItem.quantity}
                            amount={cartItem.sum}
                            title={cartItem.productTitle}
                            key={index}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: '#888'
    },
    detailItem: {
        width: '100%'
    }
});

export default OrderItem;
