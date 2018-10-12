/* eslint no-console: 0 */
/* global document */

import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMinus, faPlus, faTrashAlt, faShoppingBasket, faTimes, faClipboard, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';
import VueQrcode from '@xkeshi/vue-qrcode';
import VueClipboard from 'vue-clipboard2';
import VueTouch from 'vue-touch';

import App from '../app.vue';
import store from '../store';

library.add(faMinus, faPlus, faTrashAlt, faShoppingBasket, faTimes, faClipboard, faCheckCircle);

document.addEventListener('DOMContentLoaded', () => {
  Vue.component('font-awesome-icon', FontAwesomeIcon);
  Vue.component('font-awesome-layers', FontAwesomeLayers);
  Vue.component('font-awesome-layers-text', FontAwesomeLayersText);
  Vue.component(VueQrcode.name, VueQrcode);
  Vue.use(VueClipboard);
  Vue.use(VueTouch, {name: 'v-touch'});

  Vue.config.productionTip = false;

  if (document.getElementById('app') !== null) {
    const el = document.getElementById('app');

    return new Vue({
      el,
      store,
      render: h => h(App),
    });
  }

  return '';
});
