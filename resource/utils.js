import config from '../../config/config';

export const getModelUrl = (model,
                            modelAdjust = config.api_model_adjust || 'underscore',
                            apiFormat = config.api_format || '{/id}{/action}/') => {
  let modelUrl = model;
  if (modelAdjust === 'underscore') {
    modelUrl = model.replace(
      /([A-Z])/g,
      $1 => `_${$1.toLowerCase()}`
    ).replace(/^_/, '');
  } else if (modelAdjust === 'off') {
    // pass
  }
  return `${modelUrl}${apiFormat}`;
};

export const getModelUrlFull = (model,
                                apiRoot = config.api_root || '',
                                modelAdjust = config.api_model_adjust || 'underscore',
                                apiFormat = config.api_format || '{/id}{/action}/') => {
  return apiRoot.replace(/\/+?$/, '') + '/' + getModelUrl(model, modelAdjust, apiFormat);
};

export const getModelUrlRaw = (model,
                                apiRoot = config.api_root || '',
                                modelAdjust = config.api_model_adjust || 'underscore') => {
  return apiRoot.replace(/\/+?$/, '') + '/' + getModelUrl(model, modelAdjust, '');
};
