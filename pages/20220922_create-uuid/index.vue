<template>
  <view class="page main">
    <u-navbar is-back title="生成uuid" />
    <view class="pageData">
      <view class="top">
        生成uuid数量: <u-input type="number" v-model="uuidNumber"></u-input>
      </view>
      <view class="bottom" v-if="uuidList.length > 0">
        <view v-for="item in uuidList" :key="item">
          {{ item }}
        </view>
      </view>
      <view class="bottom-btn">
        <u-button type="primary" @click="uuid()"> 生成uuid </u-button>
        <u-button type="primary" @click="copyUrl()"> 复制uuid </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import Guid from "./guid";
export default {
  onLoad() {},
  onShow() {},
  data() {
    return {
      uuidList: [],
      uuidNumber: 1
    };
  },
  methods: {
    uuid() {
      this.uuidList = [];
      for (let index = 0; index < this.uuidNumber; index++) {
        this.uuidList.push(Guid());
      }
    },
    //复制id
    copyUrl() {
      let self = this;
      // #ifdef APP-PLUS
      uni.setClipboardData({
        data: self.uuidList,
        success: function () {
          console.log("success");
        }
      });
      return;
      //#endif
      this.copyTextToClipboard(self.uuidList);
    },

    fallbackCopyTextToClipboard() {
      // 1.创建一个可选中元素
      let textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      // 2.使用定位，阻止页面滚动
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      // 3.移除元素
      document.body.removeChild(textArea);
    },

    copyTextToClipboard(text) {
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        function () {
          console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  background: #f6f6f6;

  .pageData {
    height: 100%;
    .top {
      margin: 30rpx;
      display: flex;
      align-items: center;
      .u-input {
        background: #fff;
      }
    }
    .bottom {
      height: 70%;
      margin: 30rpx 30rpx;
      overflow: auto;
    }
    .bottom-btn {
      display: flex;
      .u-btn {
        margin: 10rpx;
      }
    }
  }
}
</style>
