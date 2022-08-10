<template>
  <view class="page qr-wrap">
    <u-navbar is-back title="模仿 Collapse 折叠面板" />
    <view class="grid-container">
      <view
        v-for="(collapseItem, collapseIndex) in kitList"
        :key="'kits_' + collapseItem.appId"
        class="onceCollapse"
        :id="'kits_' + collapseIndex"
        :style="{ 'max-height': openMyAppHeight(collapseItem, collapseIndex) }"
      >
        <view
          class="collapseTitle"
          @click="collapseItemChange(collapseIndex, collapseIndex)"
        >
          <view class="collapseTitle_left">
            <image class="image" :src="collapseItem.appIcon"></image>
          </view>
          <view class="collapseTitle_mid">
            <view class="collapseTitle_mid_title u-line-2"
              >{{ collapseItem.appName }}
            </view>
          </view>
          <view class="collapseTitle_right">
            <view class="showTag">
              <view v-if="!!collapseItem.show">
                收起<u-icon name="arrow-up" size="20" color="#ffffff"></u-icon>
              </view>
              <view v-else>
                展开<u-icon name="arrow-down" size="20" color="#ffffff"></u-icon
              ></view>
            </view>
          </view>
        </view>
        <view v-if="!!collapseItem.show" class="bordertop"></view>
        <u-empty
          text="暂无套件菜单"
          mode="list"
          v-if="
            !collapseItem.menuTypeList || collapseItem.menuTypeList.length == 0
          "
        ></u-empty>
        <view
          class="grid-container_allCard"
          v-for="(allItem, allIndex) in collapseItem.menuTypeList"
          :key="'kits_' + collapseItem.appId + '_' + allIndex"
        >
          <view v-if="allItem.menuList.length > 0" class="card-box">
            <view class="card-box_title"> {{ allItem.appMenuTypeName }} </view>
            <view class="card-box_allData">
              <view
                class="onceData"
                v-for="(subItem, subIndex) in allItem.menuList"
                :key="
                  'kits_' + collapseItem.appId + '_' + allIndex + '_' + subIndex
                "
              >
                <view class="onceData_top">
                  <image class="image" :src="subItem.applicationIcon"></image>
                </view>
                <view class="onceData_down u-line-1">
                  {{ subItem.applicationName }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

/* 为什不用u-view自带的 u-Collapse? 有几个条件：1.页面需要快速的响应不能放在
onReady() 里请求数据接口。2.页面有下拉刷新可以刷新数据。
这就导致了我不能在获取完接口后直接使用 u-Collapse 的
this.$refs.collapseView.init(); 只能写在 setTimeout 里来延时刷新。而页面又有下拉
刷新，就会导致不停下拉刷会产生无数个 setTimeout
页面卡死，只能自己写一个类似的组件。 */

<script>
import dataList from "./data.js";
export default {
  data() {
    return {
      kitList: [],
      kitLoading: true
    };
  },
  components: {},
  onLoad(option) {
    this.getQueryCheckKitList();
  },

  methods: {
    openMyAppHeight(item, index) {
      let title = 140;
      let minTitleNumber = item.menuTypeList.length;
      let menuNumber = 0;
      item.menuTypeList.forEach((items) => {
        menuNumber = Math.ceil(items.menuList.length / 4) + menuNumber;
      });
      let defaultLen = item.show
        ? menuNumber * 214 + minTitleNumber * 80 + title
        : title;
      return defaultLen + "rpx";
    },
    //拉取已经配置的套件应用
    getQueryCheckKitList() {
      this.kitList = dataList;
      this.kitLoading = false;
    },
    collapseItemChange(index) {
      const self = this;
      if (self.kitList[index].show) {
        self.kitList[index].show = !self.kitList[index].show;
      } else {
        self.kitList[index].show = true;
      }
      self.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.qr-wrap {
  width: 100%;
  background: #f6f6f6;
  .grid-container {
    background-color: #f6f6f6;
    padding: 30rpx;
    .onceCollapse {
      overflow: hidden;
      transition: max-height 0.2s linear;
      margin-bottom: 30rpx;
      background: #ffffff;
      border-radius: 24rpx;
      box-shadow: $uni-black-box-shadow;

      .collapseTitle {
        padding: 20rpx 30rpx;
        display: flex;
        align-items: center;
        width: 100%;
        &_left {
          .image {
            width: 100rpx;
            height: 100rpx;
            text-align: center;
            border-radius: 28rpx;
            aspect-ratio: auto 138 / 180;
            display: block;
          }
        }
        &_mid {
          flex: 1;
          width: 0;
          margin: 0 30rpx;
          padding: 6rpx 0;
          &_title {
            line-height: 36rpx;
            font-size: 32rpx;
            font-weight: bold;
            letter-spacing: 1rpx;
            color: #444;
          }
        }
        &_right {
          background: #ff6a00;
          color: #fff;
          border-radius: 50rpx;
          font-size: 24rpx;
          .showTag {
            padding: 6rpx 10rpx;
            /deep/.u-icon__icon {
              margin-left: 6rpx;
            }
          }
        }
      }
      .bordertop {
        margin: 0 30rpx;
        border-top: 1rpx solid #ddd;
      }
      .grid-container_allCard {
        border-radius: 24rpx;
        .card-box {
          border-radius: 24rpx;
          background: #ffffff;
          &_title {
            color: #222222;
            font-size: 32rpx;
            font-weight: bold;
            padding: 35rpx 35rpx 0 35rpx;
          }
          &_allData {
            border-radius: 24rpx;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-row-gap: 10rpx;
            grid-column-gap: 10rpx;
            .onceData {
              width: 100%;
              margin: 35rpx 0;
              @include flex-box(column, space-between);
              border-radius: 24rpx;
              background: #fff;
              &_top {
                .image {
                  width: 100rpx;
                  height: 100rpx;
                  text-align: center;
                  border-radius: 28rpx;
                  aspect-ratio: auto 138 / 180;
                }
              }
              &_down {
                text-align: center;
                width: 100%;
                font-size: $uni-font-size-mini;
                color: $uni-text-color-desc;
              }
            }
          }
        }
        & ~ .allCard {
          margin-top: 20rpx;
        }
      }
    }
    .u-empty {
      margin: 20rpx 0 !important;
    }
  }
}
</style>
