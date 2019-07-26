import Vue from 'vue/dist/vue.esm.js';
import Vuex from 'vuex';

import api from './api';

const REFRESH_INTERVAL_TIME = 120000;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    showResume: false,
    products: {},
    invoice: {},
    status: false,
    loading: false,
    actionMessage: '',
    actionProductId: null,
    intervalId: null,
    gif: null,
  },
  mutations: {
    setProduct: (state, payload) => {
      Object.assign(state.products[payload.id], payload);
    },
    setActionMessage: (state, payload) => {
      state.actionMessage = payload;
    },
    setActionProduct: (state, payload) => {
      state.actionProductId = payload;
    },
    setProducts: (state, payload) => {
      state.products = payload;
    },
    toggleResume: state => {
      state.showResume = !state.showResume;
    },
    setInvoice: (state, payload) => {
      state.invoice = payload;
    },
    setStatus: (state, payload) => {
      state.status = payload;
    },
    setInvoiceSettled: (state, payload) => {
      state.invoice.settled = payload;
      state.status = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setIntervalId: (state, payload) => {
      state.intervalId = payload;
    },
    setGif: (state, payload) => {
      state.gif = payload;
    },
  },
  actions: {
    getProducts: context => {
      api.products().then((response) => {
        const products = response.user_products.reduce((acc, product) => {
          acc[product.id] = { ...product, amount: 0 };

          return acc;
        }, {});
        context.commit('setProducts', products);
        context.dispatch('startGetProductsInterval');
      });
    },
    decrementProduct: (context, payload) => {
      const amount = payload.amount - 1 > 0 ? payload.amount - 1 : 0;
      context.commit('setActionProduct', payload.id);
      context.commit('setActionMessage', 'decrement');
      context.commit('setProduct', { ...payload, amount });
      context.dispatch('startGetProductsInterval');
      context.dispatch('buy');
    },
    incrementProduct: (context, payload) => {
      if (payload.amount === 0) {
        context.dispatch('updateProduct', payload);
      }
      context.commit('setActionProduct', payload.id);
      if (payload.stock > payload.amount) {
        context.commit('setProduct', { ...payload, amount: payload.amount + 1 });
        context.commit('setActionMessage', 'increment');
        context.dispatch('stopGetProductsInterval');
        context.dispatch('buy');
      } else {
        context.commit('setActionMessage', 'maxStock');
      }
    },
    updateProduct: (context, payload) => {
      api.product(payload.id).then((response) => {
        context.commit('setProduct', response.user_product);
      });
    },
    buy: context => {
      if (context.getters.totalAmount) {
        const cartProducts = context.getters.cartProducts;

        context.commit('setLoading', true);

        api.buy(cartProducts).then((response) => {
          context.commit('setInvoice', response.invoice);
          context.commit('setLoading', false);
        });
      } else {
        context.commit('setLoading', false);
        context.commit('setInvoice', {});
      }
    },
    toggleResume: context => {
      context.commit('toggleResume');
    },
    cleanCart: context => {
      context.getters.productsAsArray.forEach(product => {
        context.commit('setProduct', { ...product, amount: 0 });
      });
      context.commit('setLoading', false);
      context.dispatch('startGetProductsInterval');
    },
    cleanInvoice: context => {
      context.commit('setInvoice', {});
      context.commit('setStatus', false);
    },
    updateInvoiceSettled: context => {
      api.checkInvoiceStatus(context.state.invoice.r_hash).then((response) => {
        context.commit('setInvoiceSettled', response.data.settled);
      });
    },
    testInvoice: context => {
      context.commit('setInvoiceSettled', true);
    },
    setLoading: (context, payload) => {
      context.commit('setLoading', payload);
    },
    startGetProductsInterval: context => {
      if (context.getters.totalAmount === 0 && !context.state.intervalId) {
        const interval = setInterval(() => {
          context.dispatch('getProducts');
        }, REFRESH_INTERVAL_TIME);
        context.commit('setIntervalId', interval);
      }
    },
    stopGetProductsInterval: context => {
      if (context.state.intervalId) {
        clearInterval(context.state.intervalId);
        context.commit('setIntervalId', null);
      }
    },
    getGif: context => {
      api.getGif().then((response) => {
        context.commit('setGif', response.gif_url.gif_url);
      });
    },
  },
  getters: {
    productsAsArray: state => (Object.keys(state.products).map(key => ({ id: key, ...state.products[key] }))),
    onSaleProducts: (state, getters) => (getters.productsAsArray
      .filter(product => product.for_sale)),
    totalAmount: (state, getters) => (
      getters.onSaleProducts.reduce((acc, product) => acc + product.amount, 0)
    ),
    totalPrice: (state, getters) => (
      getters.onSaleProducts.reduce((acc, product) => acc + product.price * product.amount, 0)
    ),
    cartProducts: (state, getters) => {
      const products = getters.productsAsArray.reduce((acc, product) => {
        if (product.amount > 0) {
          acc[product.id] = {
            amount: product.amount,
          };
        }

        return acc;
      }, {});

      return products;
    },
    buyDescription: (state, getters) => {
      const description = [];
      getters.productsAsArray.forEach(product => {
        if (product.amount > 0) {
          description.push(`${product.amount} x ${product.name}`);
        }
      });

      return description.join(',\n');
    },
  },
});

export default store;
