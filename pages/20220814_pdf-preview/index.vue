<template>
  <view class="page main">
    <u-navbar is-back title="pdf查看" />
    <view class="bottom-btn">
      <u-button type="primary" @click="opnePdf"> 查看pdf </u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  onLoad(option) {},
  methods: {
    opnePdf() {
      let url = encodeURIComponent(
        "https://vrgv-default0.obs.cn-east-3.myhuaweicloud.com/%E7%AE%A1%E7%AE%A1%E5%AE%89%E5%85%A8%E4%BC%81%E4%B8%9A%E8%AE%A4%E8%AF%81_%E4%BC%81%E4%B8%9A%E6%8E%88%E6%9D%83%E5%87%BD.pdf"
      );

      uni.navigateTo({
        url: `/pages/20220814_pdf-preview/pdf-preview/index?name=pdf文件&url=${url}`,
        animationType: "slide-in-bottom"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  background: #f6f6f6;
}
</style>
