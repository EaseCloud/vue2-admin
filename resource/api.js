import Vue from 'vue';
import VueResource from '../lib/vue-resource';

Vue.use(VueResource);

export default function resource(model) {
  const modelUnderscore = model.replace(
    /([A-Z])/g,
    $1 => `_${$1.toLowerCase()}`
  ).replace(/^_/, '');
  return Vue.resource(`${modelUnderscore}{/id}{/action}/`);
}

