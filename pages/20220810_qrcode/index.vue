<template>
  <view class="qrcode">
    <u-navbar is-back title="生成二维码" />
    <view class="qrcode_data">
      <view class="input">
        <u-input v-model="qrCodeData"></u-input>
      </view>
      <view class="qr-box">
        <TkiQrcode
          ref="qrcode"
          :val="onStringify()"
          @result="getQrRBase64"
        ></TkiQrcode>
      </view>
      <view class="bottom-btn">
        <u-button type="default" @click="getCreateGGQrcode">
          刷新二维码
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import TkiQrcode from "./tki-qrcode/tki-qrcode";
import { pathToBase64 } from "@/utils/image-tools.js";
export default {
  data() {
    return {
      qrCodeData: "你想放啥放啥"
    };
  },
  components: {
    TkiQrcode
  },
  onLoad(option) {
    this.getCreateGGQrcode();
  },
  methods: {
    //传入tki-qrcode值
    onStringify() {
      return this.qrCodeData;
    },
    //生成二维码后的回调函数，将二维码路径转为base64
    getQrRBase64(e) {
      console.log(e);
      //二维码路径转为base64
      pathToBase64(e)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {});
    },
    //生成二维码
    getCreateGGQrcode() {
      let timer = setTimeout(() => {
        this.$refs.qrcode._makeCode();
        clearTimeout(timer);
      }, 50);
    }
  }
};
</script>

<style lang="scss" scoped>
.qrcode {
  width: 100%;
  background: #fff;
  &_data {
    margin: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    .input {
      width: 100%;
      border: 1rpx solid #999;
    }
    .qr-box {
      width: 367rpx;
      height: 367rpx;
      padding: 18rpx;
      margin-top: 50rpx;
      .tki-qrcode {
        width: 100%;
        height: 100%;

        /deep/ uni-image {
          width: 100% !important;
          height: 100% !important;
        }
      }
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
