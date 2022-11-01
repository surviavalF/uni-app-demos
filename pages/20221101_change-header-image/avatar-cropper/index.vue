<template>
  <view class="page content">
    <!-- <u-navbar
      is-back
      title="头像裁剪"
      :background="{ backgroundColor: '#000' }"
      back-icon-color="#fff"
      :back-text-style="{ color: '#fff' }"
      title-color="#fff"
    /> -->
    <view class="cropper-wrapper">
      <canvas
        class="cropper"
        :disable-scroll="true"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
        :style="{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }"
        canvas-id="cropper"
        id="cropper"
      ></canvas>
    </view>
    <view class="cropper-buttons safe-area-padding" :style="{ height: bottomNavHeight + 'px' }">
      <view class="upload" @tap="back">取消</view>
      <view class="getCropperImage" @tap="getCropperImage(false)">确定</view>
    </view>
  </view>
</template>

<script>
import WeCropper from './weCropper.js'
const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = width
export default {
  data() {
    return {
      // 底部导航的高度
      bottomNavHeight: 50,
      originWidth: 200,
      width: 0,
      height: 0,
      cropperOpt: {
        id: 'cropper',
        targetId: 'targetCropper',
        pixelRatio: device.pixelRatio,
        width,
        height,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (width - 200) / 2, // 裁剪框x轴起点
          y: (width - 200) / 2, // 裁剪框y轴期起点
          width: 200, // 裁剪框宽度
          height: 200 // 裁剪框高度
        },
        boundStyle: {
          // 裁剪矩形框的样式，其中可包含的属性为lineWidth-边框宽度(单位rpx)，color: 边框颜色，
          // mask-遮罩颜色，一般设置为一个rgba的透明度，如"rgba(0, 0, 0, 0.35)"
          lineWidth: 4,
          borderColor: 'rgb(255, 245, 245)',
          mask: 'rgba(0, 0, 0, 0.35)'
        }
      },
      // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
      fileType: 'jpg',
      src: '' // 选择的图片路径，用于在点击确定时，判断是否选择了图片
    }
  },
  onLoad(option) {
    let rectInfo = uni.getSystemInfoSync()
    this.width = rectInfo.windowWidth
    this.height = rectInfo.windowHeight - this.bottomNavHeight - rectInfo.statusBarHeight
    this.cropperOpt.width = this.width
    this.cropperOpt.height = this.height
    this.cropperOpt.pixelRatio = rectInfo.pixelRatio

    //初始化裁剪框
    this.cropperOpt.cut = {
      x: (this.width - this.originWidth) / 2,
      y: (this.height - this.originWidth) / 2,
      width: this.originWidth,
      height: this.originWidth
    }

    // 初始化
    this.cropper = new WeCropper(this.cropperOpt)
      .on('ready', ctx => {
        // wecropper is ready for work!
      })
      .on('beforeImageLoad', ctx => {
        // before picture loaded, i can do something
      })
      .on('imageLoad', ctx => {
        // picture loaded
      })
      .on('beforeDraw', (ctx, instance) => {
        // before canvas draw,i can do something
      })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('avatar_cropper_url', res => {
      this.src = res
      //  获取裁剪图片资源后，给data添加src属性及其值
      this.cropper.pushOrign(this.src)
    })
  },
  methods: {
    touchStart(e) {
      this.cropper.touchStart(e)
    },
    touchMove(e) {
      this.cropper.touchMove(e)
    },
    touchEnd(e) {
      this.cropper.touchEnd(e)
    },
    getCropperImage(isPre = false) {
      if (!this.src) return this.$u.toast('请先选择图片再裁剪')

      let cropper_opt = {
        destHeight: Number(this.destWidth), // uni.canvasToTempFilePath要求这些参数为数值
        destWidth: Number(this.destWidth),
        fileType: this.fileType
      }
      this.cropper.getCropperImage(cropper_opt, async (path, err) => {
        if (err) {
          uni.showModal({
            title: '温馨提示',
            content: err.message
          })
        } else {
          if (isPre) {
            uni.previewImage({
              current: '', // 当前显示图片的 http 链接
              urls: [path] // 需要预览的图片 http 链接列表
            })
          } else {
            uni.$emit('uAvatarCropper', path)
            this.$u.route({
              type: 'back'
            })
          }
        }
      })
    },
    back() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 1);
}

.cropper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 11;
}

.cropper-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #000;
}

.cropper-buttons {
  background-color: #000000;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  //   position: fixed;
  //   bottom: 0;
  //   left: 0;
  font-size: 28rpx;
  color: #fff;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 30rpx;
}

.cropper-buttons .upload {
  text-align: left;
}

.cropper-buttons .getCropperImage {
  text-align: right;
}
</style>
