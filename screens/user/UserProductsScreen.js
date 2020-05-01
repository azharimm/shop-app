import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FlatList, Platform, Button, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Color from '../../constants/Color';
import * as ProductActions from '../../store/actions/products'

const UserProductsScreen = (props) => {
    const dispatch = useDispatch()
    const userProducts = useSelector((state) => state.products.userProducts);

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', {productId: id})
    }

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do your really want to delete it?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(ProductActions.deleteProduct(id))}
            }
        ])
    }

    return (
        <FlatList
            data={userProducts}
            keyExtractor={(item) => item.id}
            renderItem={(itemData) => (
                <ProductItem
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onViewDetail={() => {}}
                    onAddToCart={() => {}}
                >
                    <Button
                        color={Color.primary}
                        title="Edit"
                        onPress={() => {editProductHandler(itemData.item.id)}}
                    />
                    <Button
                        color={Color.primary}
                        title="Delete"
                        onPress={deleteHandler.bind(this, itemData.item.id)}
                    />
                </ProductItem>
            )}
        />
    );
};

UserProductsScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Your Products',
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
                    title="Add"
                    iconName={
                        Platform.OS === 'android' ? 'md-create' : 'ios-create'
                    }
                    onPress={() => {
                        navData.navigation.navigate('EditProduct');
                    }}
                />
            </HeaderButtons>
        )
    };
};

export default UserProductsScreen;
