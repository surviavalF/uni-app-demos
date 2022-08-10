<template>
  <view class="page qr-wrap">
    <u-navbar is-back title="html2canvas截图" />
    <view class="detail">
      <Html2canvas
        ref="html2canvas"
        :domId="domId"
        @renderFinish="renderFinish"
      >
        <view id="detailMiddle">
          <view class="detail__middle">
            <view class="oncLine">
              <view class="title">姓名：</view>
              <view class="lable">xxxxxx</view>
            </view>
            <view class="oncLine">
              <view class="title">手机号码：</view>
              <view class="lable">151xxxx1511</view>
            </view>
            <view v-if="userCardData.userEmail" class="oncLine">
              <view class="title">邮箱：</view>
              <view class="lable">151xxxxxxx@163.com</view>
            </view>
            <view class="oncLine">
              <view class="title">所在地区：</view>
              <view class="lable">
                辽宁省/大连市/甘井子区/跨海大桥高新区上桥方向第五个桥墩
              </view>
            </view>
          </view>
          <view class="detail__qr">
            <view class="qr-box">
              <image :src="qrRBase64" />
            </view>
          </view>
        </view>
      </Html2canvas>
    </view>
    <TkiQrcode
      v-show="tkiQrcodeShow"
      ref="qrcode"
      :val="onStringify()"
      @result="getQrRBase64"
    ></TkiQrcode>
    <view class="bottom-btn">
      <view
        class="onceBtn"
        v-for="item in bottomBtnData"
        :key="item.type"
        @click="createQRImg(item.type)"
      >
        <u-avatar
          :text="item.btnName"
          bg-color="#ff6a00"
          size="80"
          mode="circle"
        ></u-avatar>
        <view class="btnName">
          {{ item.btnName }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import TkiQrcode from "../20220810_qrcode/tki-qrcode/tki-qrcode.vue";
import Html2canvas from "./html2canvas/html2canvas.vue";
import { pathToBase64 } from "@/utils/image-tools.js";
export default {
  data() {
    return {
      userCardData: {},
      userAccountId: "",
      qrcodeUrl: "一个普通的二维码",
      title: "我的名片",
      bottomBtnData: [
        {
          type: "save",
          btnName: "保存"
        },
        {
          type: "WXSceneSession",
          btnName: "微信"
        },
        {
          type: "WXSceneTimeline",
          btnName: "朋友圈"
        },
        {
          type: "phone",
          btnName: "拨打电话"
        },
        {
          type: "savePhone",
          btnName: "保存到通讯录"
        }
      ],
      domId: "",
      qrRBase64: "",
      tkiQrcodeShow: true,
      saveType: ""
    };
  },
  components: {
    TkiQrcode,
    Html2canvas
  },
  onLoad(option) {
    this.getCreateGGQrcode();
  },

  methods: {
    //传入tki-qrcode值
    onStringify() {
      return this.qrcodeUrl;
    },
    //生成二维码后的回调函数，将二维码路径转为base64
    getQrRBase64(e) {
      //二维码路径转为base64
      pathToBase64(e)
        .then((res) => {
          this.qrRBase64 = res;
          this.tkiQrcodeShow = false;
        })
        .catch((err) => {});
    },
    //点击保存后domId改变，由html2canvas触发此方法进行保存操作
    renderFinish(filePath) {
      this.domId = "";
      this.filePath = filePath;
      if (this.saveType == "save") {
        uni.saveImageToPhotosAlbum({
          filePath: filePath,
          success: function () {
            uni.showToast({
              icon: "success",
              title: "保存成功",
              duration: 1500
            });
          }
        });
      } else if (type == "phone") {
        uni.makePhoneCall({
          phoneNumber: this.userCardData.mobilePhone
        });
      } else if (type == "savePhone") {
        uni.addPhoneContact({
          firstName: this.userCardData.userName,
          mobilePhoneNumber: this.userCardData.mobilePhone,
          success: function () {
            console.log("success");
            uni.showToast({
              title: "已保存到通讯录！",
              icon: "none"
            });
          },
          fail: function () {
            console.log("fail");
            uni.showToast({
              title: "保存到通讯录失败！",
              icon: "none"
            });
          }
        });
      } else {
        try {
          uni.share({
            provider: "weixin",
            scene: this.saveType,
            type: 2,
            imageUrl: filePath,
            success: (res) => {
              uni.showToast({
                title: "分享成功",
                icon: "none"
              });
            },
            fail: function (err) {
              console.log("err", err);
              let title = "分享遇到了一些问题";
              if (
                err.errMsg.indexOf("客户端未安装") > -1 ||
                err.errMsg.indexOf("微信未安装") > -1
              ) {
                title = "尚未安装微信，请安装微信";
              }
              uni.showToast({
                title: title,
                icon: "none"
              });
            }
          });
        } catch (error) {
          console.log("error", error);
          uni.showToast({
            title: "分享遇到了一些问题",
            icon: "none"
          });
        }
      }
      this.saveType = "";
    },
    //点击底部按钮
    createQRImg(type) {
      this.saveType = type;
      setTimeout(() => {
        this.domId = "#detailMiddle";
      }, 300);
    },
    //生成二维码
    async getCreateGGQrcode() {
      let timer = setTimeout(() => {
        this.$refs.qrcode._makeCode();
        clearTimeout(timer);
      }, 30);
    }
  }
};
</script>

<style lang="scss" scoped>
.qr-wrap {
  width: 100%;
  background: #fff;
  .detail {
    height: 100%;
    width: 100%;
    overflow: auto;
    padding-bottom: 200rpx;

    &__middle {
      padding: 0 116rpx;
      .oncLine {
        display: flex;
        line-height: 50rpx;
        padding: 12rpx 0;

        .title {
          min-width: 160rpx !important;
          color: #555555;
          font-size: 30rpx;
        }
        .lable {
          font-weight: bold;
          color: #222222;
          text-align: left;
          font-size: 30rpx;
        }
        .mobilePhone {
          color: #4986fb;
          text-decoration: underline;
        }
      }
    }
    &__qr {
      margin: 20rpx;
      padding: 0 30rpx;
      height: fit-content;
      background: #fff;
      padding-bottom: 100px;
      @include flex-box(column, center, center);
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

  .bottom-btn {
    background: #fff;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 20rpx;
    grid-column-gap: 20rpx;
    padding-bottom: 60rpx;
    .onceBtn {
      text-align: center;
      /deep/ .u-avatar {
        color: #ffffff !important;
      }
      .btnName {
        font-size: 28rpx;
        color: #555;
      }
    }
  }
  .other {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
</style>
