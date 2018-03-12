import Vue from 'vue';
import VueResource from 'vue-resource';
import config from '../../config/config';
import * as utils from './utils';

Vue.use(VueResource);

const wrapFormData = json => {
  if (json instanceof FormData) return json;
  const formdata = new FormData();
  Object.keys(json).forEach(key => {
    const value = json[key];
    // if (typeof value === 'object') {
    //   formdata.append(key, JSON.stringify(json[key]));
    // } else {
    formdata.append(key, json[key]);
    // }
  })
  return formdata;
};

const callMethod = (resource, method, args) => {
  let params, data;
  if (args.length > 1) {
    params = args[0];
    data = args[1];
  } else {
    params = {};
    data = args[0];
  }
  const formdata = wrapFormData(data);
  return resource[method].apply(resource, [params, formdata]);
};

// TODO: 这里的第二个参数尚未调通，原因是 data() 方法的时机 vm 尚未加载完全
export default function resource (model, api_root = config.api_root) {
  const resource = Vue.resource(
    utils.getModelUrl(model),  // url
    {},  // params
    {
      patch: { method: 'PATCH' },
      post: { method: 'POST' },
    },  // actions
    { root: api_root },  // TODO: options$$1
  );
  if ((config.api_media_type || 'json') === 'json') return resource;
  if (config.api_media_type === 'multipart') {
    const wrapper = {
      get: resource.get,
      query: resource.get,
      delete: resource.delete
    };
    const unsafeActions = [
      'save', 'post', 'put', 'patch'
    ]
    for (let i = 0; i < unsafeActions.length; ++i) {
      const method = unsafeActions[i]
      wrapper[method] = function () {
        return callMethod(resource, method, arguments)
      }
    }
    return wrapper
  }
}
