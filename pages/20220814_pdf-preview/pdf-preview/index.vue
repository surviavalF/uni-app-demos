<template>
  <div class="pdf-preview-page">
    <u-navbar :title="name">
      <view slot="right" class="button-group">
        <u-icon class="button-group__close" name="close" @click="onClose"></u-icon>
      </view>
    </u-navbar>
  </div>
</template>

<script>
let wv = {}
export default {
  data() {
    return {
      name: '',
      url: ''
    }
  },
  onLoad(option) {
    if (option.url) {
      option.url = decodeURIComponent(option.url)
    }
    this.name = option.name || 'PDF 预览'
    this.url = option.url || ''
    this.createPDFView()
  },
  methods: {
    createPDFView() {
      const { windowHeight, statusBarHeight } = uni.getSystemInfoSync()
      let webviewStyle = {
        top: `${statusBarHeight + 44}px`,
        height: `${windowHeight - statusBarHeight - 44}px`,
        bottom: 0,
        scalable: true
      }
      const webviewId = `pdf${new Date().getTime()}_${Math.ceil(Math.random() * 10)}`
      wv = plus.webview.create('', webviewId, webviewStyle)
      if (plus.os.name === 'Android') {
        this.url = `/static/pdf/web/viewer.html?file=${encodeURIComponent(this.url)}`
      }
      wv.loadURL(this.url)
      const currentWebview = this.$scope.$getAppWebview()
      currentWebview.append(wv)
    },
    onClose() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.button-group {
  @include flex-box(row, flex-start, center);
  &__close {
    width: 50rpx;
    height: 50rpx;
    margin-right: 20rpx;
  }
}
</style>
