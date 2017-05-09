import Vue from 'vue';
import ImageViewer from './ImageViewer.vue';

const el = document.createElement('div');
el.innerHTML = '<image-viewer></image-viewer>';
document.body.appendChild(el);

export default {
  install(Vue) {
    const ImageViewerComponent = Vue.extend(ImageViewer);
    const imageViewer = new ImageViewerComponent({ el });
    Vue.mixin({
      components: { ImageViewer },
      computed: {},
      methods: {
        previewImages(images, index = 0) {
          imageViewer.images = images;
          imageViewer.index = index;
        },
      },
    });
  },
};

