import Vue from 'vue';
import VueResource from 'vue-resource';
import config from '../../config/config';
import * as utils from './utils';

Vue.use(VueResource);

// TODO: 这里的第二个参数尚未调通，原因是 data() 方法的时机 vm 尚未加载完全
export default function resource(model, api_root = config.api_root) {
  return Vue.resource(
    utils.getModelUrl(model),  // url
    {},  // params
    {
      patch: { method: 'PATCH' },
      post: { method: 'POST' },
    },  // actions
    { root: api_root },  // TODO: options$$1
  );
}

