import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: JSON.parse(localStorage.getItem('cart')) || {},
    }),
    actions: {
        addToCart(product, quantity) {
            if (!this.cart[product._id]) {
                this.cart[product._id] = { ...product, quantity: quantity };
            } else {
                this.cart[product._id].quantity += quantity;
            }
            this.saveCart();
        },
        removeFromCart(product) {
            if (this.cart[product._id]) {
                delete this.cart[product._id];
                this.saveCart();
            }
        },
        clearCart() {
            this.cart = {};
            this.saveCart();
        },
        saveCart() {
          localStorage.setItem('cart', JSON.stringify(this.cart));
        },
    },
    getters: {
        getProductById: (state) => (id) => state.cart.id,
        cartItems: (state) => Object.values(state.cart),
        totalQuantity: (state) => Object.values(state.cart).reduce((sum, product) => sum + product.quantity, 0),
        totalPrice: (state) => Object.values(state.cart).reduce((sum, product) => sum + product.quantity * product.unitPrice, 0),
    },
})