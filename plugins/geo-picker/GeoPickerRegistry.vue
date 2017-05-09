<template>

  <div id="geo-picker"
       tabindex="-1"
       class="ant-modal-wrap block-modal-form"
       :class="{invisible: !geopicker}">
    <div role="document" class="ant-modal" style="width: 520px;">
      <div class="ant-modal-content">
        <button class="ant-modal-close" @click="pickGeoAction(true)">
          <span class="ant-modal-close-x"></span>
        </button>
        <div class="ant-modal-header">
          <div class="ant-modal-title">坐标拾取</div>
        </div>
        <div class="ant-modal-body">
          <div v-if="geopicker">
            <div class="ant-form">
              <div class="ant-row">
                <div class="ant-col-4 ant-form-item-label">
                  <label>经度</label>
                </div>
                <div class="ant-col-4 ant-form-item-control">
                  <input type="text"
                         readonly
                         class="ant-input"
                         v-model="geopicker.lng"/>
                </div>
                <div class="ant-col-4 ant-form-item-label">
                  <label>纬度</label>
                </div>
                <div class="ant-col-4 ant-form-item-control">
                  <input type="text"
                         readonly
                         class="ant-input"
                         v-model="geopicker.lat"/>
                </div>
                <div class="ant-col-4 ant-form-item-label">
                  <label>搜索</label>
                </div>
                <div class="ant-col-4 ant-form-item-control">
                  <input type="text"
                         class="ant-input"
                         @change="pickGeoSearch"/>
                </div>
              </div>
              <div class="ant-row">
                <div class="ant-col-4 ant-form-item-label">
                  <label>地址标签</label>
                </div>
                <div class="ant-col-20 ant-form-item-control">
                  <input type="text"
                         class="ant-input"
                         v-model="geopicker.label"/>
                </div>
              </div>
            </div>
          </div>
          <div style="height: 280px; margin-top: 4px;" id="baidu_map"></div>
        </div>
        <div class="ant-modal-footer">
          <button type="button"
                  @click="pickGeoAction(false)"
                  class="ant-btn">
            <span>取消</span>
          </button>
          <button type="button"
                  @click="pickGeoAction(true)"
                  class="ant-btn ant-btn-primary">
            <span>确认</span>
          </button>
        </div>
      </div>
      <div tabindex="0" style="width: 0; height: 0; overflow: hidden;">sentinel</div>
    </div>
  </div>
</template>

<script type="text/babel">

  let map = null;
  let centerMarker = null;
  let moveendLock = false;

  export default {
    data() {
      return {
        geopicker: null,
      };
    },
    methods: {
      loadBMap(ak = 'D373d23acd37b0c4af370a517922e020') {
        const vm = this;
        return new Promise((resolve, reject) => {
          const BMap = window.BMap = window.BMap || {};
          // if already loaded
          if (BMap.version) {
            resolve(BMap);
            return;
          }
          // or load now
          (() => {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `http://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=bmap_init`;
            document.head.appendChild(script);
          })();
          // timeout
          const loadTimer = setTimeout(() => { reject('timeout'); }, 5000);
          // script loaded
          window.bmap_init = () => {
            clearTimeout(loadTimer);
            // clean useless vars
            delete window.bmap_init;
            // 在这里初始化一个全局的地图对象
            map = new BMap.Map('baidu_map');
            map.setCurrentCity('佛山');
            map.enableScrollWheelZoom(true);
            map.addEventListener('moveend', e => {
              if (!vm.geopicker || moveendLock) return;
              const pt = map.getCenter();
              // 移动完毕，设置选定的位置为当前
              vm.setLocation(pt);
            });
            map.addEventListener('click', e => {
              // 暂时屏蔽移动定位事件，用点击的覆盖物作为定位
              moveendLock = true;
              if (e.overlay) vm.setLocation(e.overlay.point);
              setTimeout(() => {
                moveendLock = false;
              }, 2000);
            });
            // 加载成功
            resolve(BMap);
          };
        });
      },
      initMap(lng, lat, zoom = 13) {
        const vm = this;
        vm.loadBMap().then(BMap => {
          // 初始化百度地图
          const center = new BMap.Point(lng, lat);
          this.setLocation(center);
          map.clearOverlays();
          map.centerAndZoom(center, 13);
        });
      },
      pickGeoSearch(e) {
        const vm = this;
        vm.loadBMap().then(BMap => {
          const local = new BMap.LocalSearch(map, {
            renderOptions: { map },
          });
          local.search(e.target.value);
        });
      },
      setLocation(pt) {
        const vm = this;
        vm.loadBMap().then(BMap => {
          const geoc = new BMap.Geocoder();
          // 判断是否移动过，如果移动了，更新标签（这里加了浮点精度判断）
          if (Math.hypot(pt.lng - vm.geopicker.lng, pt.lat - vm.geopicker.lat) > 1e-6) {
            geoc.getLocation(pt, rs => {
              const addr = rs.addressComponents;
              vm.geopicker.label = [
                addr.province,
                addr.city,
                addr.district,
                addr.street,
                addr.streetNumber,
              ].join('');
            });
          }
          // VM 坐标登记到新位置
          vm.geopicker.lat = pt.lat;
          vm.geopicker.lng = pt.lng;
          // 重新制定标签
          if (centerMarker) map.removeOverlay(centerMarker);
          // 创建标注
          const marker = centerMarker = new BMap.Marker(pt);
          // 将标注添加到地图中
          map.addOverlay(marker);
          marker.setAnimation(window.BMAP_ANIMATION_BOUNCE);
        });
      },
    },
  };
</script>

