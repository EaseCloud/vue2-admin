import Vue from 'vue';
import VueResource from 'vue-resource';
import config from '../../config/config';

Vue.use(VueResource);

// TODO: 这里的第二个参数尚未调通，原因是 data() 方法的时机 vm 尚未加载完全
export default function resource(model, api_root = config.api_root) {
  const modelAdjust = config.api_model_adjust || 'underscore';
  let modelUrl = model;
  if (modelAdjust === 'underscore') {
    modelUrl = model.replace(
      /([A-Z])/g,
      $1 => `_${$1.toLowerCase()}`
    ).replace(/^_/, '');
  } else if (modelAdjust === 'off') {
    // pass
  }
  let resource = `${modelUrl}${config.api_format || '{/id}{/action}/'}`;
  return Vue.resource(
    resource,  // url
    {},  // params
    {
      patch: { method: 'PATCH' },
      post: { method: 'POST' },
    },  // actions
    { root: api_root },  // TODO: options$$1
  );
}

