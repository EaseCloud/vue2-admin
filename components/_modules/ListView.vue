<template>

  <div>

    <header class="page-header">
      <h3 class="page-header-title">{{title}}</h3>
      <h4 class="page-header-subtitle">{{subtitle}}</h4>
      <div class="tooltips">
        <slot name="actions">
          <v-button v-if="options.can_create"
                      :to="{name: 'main_'+modelUnderscore+'_edit', params: {id: 0}}">
            新增
          </v-button>
          <v-button type="ghost" @click="$router.back()">返回</v-button>
        </slot>
      </div>
    </header>

    <div class="page-body has-footer">

      <section class="page-content">

        <slot name="before"></slot>

        <list-view-table :model="model"
                         :pk="pk"
                         :cols="cols"
                         :options="options"
                         ref="table"
                         :pager="pager"
                         :actions="actions"
                         :filters="getFilters"
                         @query="doQuery"></list-view-table>

        <slot name="after"></slot>

      </section>
    </div>

    <footer class="page-footer">
      <pagination @change="$refs.table.pageTo($event)"
                  :page="Number($route.query.page) || 1"
                  :page_count="pager.page_count"
                  :page_size="pager.page_size"/>
    </footer>

  </div>

</template>

<script lang="babel">
  export default {
    props: {
      title: String,
      subtitle: String,
      model: String,
      pk: {
        type: String,
        default: 'id',
      },
      cols: Array,
      actions: Array,
      options: {
        type: Object,
        default: () => ({}),
      },
      filters: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      const vm = this;
      return {
        items: [],
        pager: {
          page: Number(vm.$route.query.page) || 1,
          page_size: 10,
          page_count: 0,
        },
      };
    },
    computed: {
      getFilters() {
        const vm = this;
        return {
          ...vm.filters,
          ...vm.$route.query,
        };
      },
    },
    methods: {
      reload() {
      },
      doQuery(query) {
        const vm = this;
        const routeQuery = { ...vm.$route.query };
        Object.keys(query).forEach(key => {
          const value = query[key];
          if (value === null || value === undefined) {
            delete routeQuery[key];
          } else {
            routeQuery[key] = value;
          }
        });
        vm.$router.replace({
          query: routeQuery,
        });
      },
    },
  };
</script>

