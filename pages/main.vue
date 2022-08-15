<template>
  <view class="page mine-page">
    <u-navbar title="首页">
      <view slot="right" class="right-operate">
        <u-icon name="scan" @click="toBarcodePage"></u-icon>
      </view>
    </u-navbar>
    <view class="allDemos">
      <view
        v-for="(item, index) in demosList"
        :key="'demo_' + index"
        class="onecDemo"
        @click="toDemo(item.url)"
      >
        <view class="demoData">
          {{ item.name }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { scanCode } from "@/utils/barcode";

export default {
  data() {
    return {
      demosList: [
        {
          name: "组织架构",
          url: "/pages/20220814_organization/index"
        },
        {
          name: "pdf查看",
          url: "/pages/20220814_pdf-preview/index"
        },
        {
          name: "树结构选择器",
          url: "/pages/20220812_tree/index"
        },
        {
          name: "模仿 Collapse 折叠面板",
          url: "/pages/20220810_collapse/index"
        },
        {
          name: "html2canvas截图",
          url: "/pages/20220810_html2canvas/index"
        },
        {
          name: "生成二维码",
          url: "/pages/20220810_qrcode/index"
        }
      ]
    };
  },

  methods: {
    //扫码功能
    toBarcodePage() {
      scanCode();
    },
    //跳转对应页面
    toDemo(url) {
      uni.navigateTo({
        url: url
      });
    }
  }
};
</script>

<style lang="scss">
.mine-page {
  background: #f6f6f6;
  width: 100%;
  overflow: auto;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  .right-operate {
    margin: 0 30rpx;
    display: flex;
    align-items: center;

    /deep/ .u-icon__icon {
      color: $uni-text-color !important;
      font-size: $uni-font-size-lg !important;
      &:last-child {
        margin-left: 32rpx;
      }
    }
  }
  .allDemos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 30rpx;
    grid-column-gap: 30rpx;
    margin: 20rpx;
    .onecDemo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10rpx;
      background: #fff;
      border-radius: 20rpx;
      border: 1rpx solid #999;
      .demoData {
        text-align: center;
      }
    }
  }
}
</style>
