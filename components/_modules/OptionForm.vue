<template>

  <embed-form :fields="options"
              @submit="submit(options)"></embed-form>

</template>


<script lang="babel">
  import api from '../../resource/api';

  export default {
    props: ['options'],
    methods: {
      reload() {
        const vm = this;
        api('Option').get({ action: 'all' }).then(resp => {
          vm.options.forEach(opt => {
            const value = resp.data[opt.key];
            if (opt.type === 'gallery') {
              const data = value && value.split(',') || [];
              const images = [];
              const xhrs = [];
              data.forEach(id => {
                xhrs.push(api('Image').get({ id }).then(resp2 => {
                  images.push(resp2.data);
                }));
              });
              Promise.all(xhrs).then(() => {
                opt.value = images;
              });
            } else if (opt.type === 'switch') {
              opt.value = value === 'True';
            } else if (opt.type === 'number') {
              opt.value = Number(value);
            } else {
              opt.value = value;
            }
          });
        });
      },
      submit() {
        const vm = this;
        Promise.all(vm.options.map(opt => api('Option').save({
          action: 'set',
        }, {
          name: opt.key,
          value: opt.type === 'gallery'
            ? opt.value.map(img => img.id).join()
            : opt.value,
        }))).then(() => {
          vm.notify('设置保存成功');
        });
      },
    },
  };
</script>

