import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Platform,
    Button,
    ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as CartAction from '../../store/actions/cart';
import * as ProductAction from '../../store/actions/products';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Color from '../../constants/Color';

const ProductsOverviewScreen = (props) => {
    const products = useSelector((state) => state.products.availableProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true)
        try {
            await dispatch(ProductAction.fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsRefreshing, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener(
            'willFocus',
            loadProducts
        );
        return () => {
            willFocusSub.remove();
        };
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => setIsLoading(false));
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            title: title
        });
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occured!</Text>
                <Button
                    title="Try Again"
                    onPress={loadProducts}
                    color={Color.primary}
                />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Color.primary} />
            </View>
        );
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Maybe start adding some.</Text>
            </View>
        );
    }
    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(
                            itemData.item.id,
                            itemData.item.title
                        );
                    }}
                    onAddToCart={() => {
                        dispatch(CartAction.addToCart(itemData.item));
                    }}
                >
                    <Button
                        color={Color.primary}
                        title="View Details"
                        onPress={() => {
                            selectItemHandler(
                                itemData.item.id,
                                itemData.item.title
                            );
                        }}
                    />
                    <Button
                        color={Color.primary}
                        title="Add to Cart"
                        onPress={() => {
                            dispatch(CartAction.addToCart(itemData.item));
                        }}
                    />
                </ProductItem>
            )}
        />
    );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'All Products',
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
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Cart"
                    iconName={
                        Platform.OS === 'android' ? 'md-cart' : 'ios-cart'
                    }
                    onPress={() => {
                        navData.navigation.navigate('Cart');
                    }}
                />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ProductsOverviewScreen;
