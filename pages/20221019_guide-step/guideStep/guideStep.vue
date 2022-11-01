<template>
  <view class="guide" v-if="showGuide">
    <view :style="guideStyle" class="guide-box">
      <view class="tips guide-step-tips" :style="tipPosition">
        <view class="broder">
          <view class="text">{{ guideInfo.tips }}</view>
        </view>
      </view>
      <view class="arrow" :style="arrowTop">
        <view class="circle" :style="circleTop"> </view>
        <view class="broder" :style="broderTop"> </view>
      </view>
    </view>
    <!-- 遮罩层，防止点击 -->
    <view class="v-model"> </view>
    <view class="tool-btn">
      <view class="next" @click="next">{{ nextText }}</view>
      <view v-if="showSkip" class="skip" @click="skip">跳过</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "xky-guideStep",
  props: {
    step: {
      type: Object,
      default: () => {
        return {};
      }
    },
    scrollTop: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    scrollHeight: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    boxHeight: {
      type: Number,
      default: () => {
        return 0;
      }
    }
  },
  data() {
    return {
      stepName: "step", //该提示步骤的名称，用于不在重复展示
      guideList: [],
      index: 0, // 当前展示的索引
      showGuide: false, // 是否显示引导
      guideStyle: "", // 默认样式
      arrowTop: "", //步骤提示定位
      circleTop: "", //步骤提示内圆的定位
      broderTop: "", //步骤提示外圆的定位
      tipPosition: "", //步骤提示的定位
      systemInfo: "", //屏幕宽度高度等信息
      tipWidth: 200, //步骤提示默认的宽度
      nextText: "下一步", //下一步文案
      showSkip: true, //跳过按钮是否显示
      lastScrollTop: 0
    };
  },
  computed: {
    guideInfo() {
      return this.guideList[this.index];
    }
  },
  mounted() {
    this.guideList = this.step.guideList;
    this.stepName = this.step.name;
    let systemInfo = uni.getSystemInfoSync();
    this.systemInfo = systemInfo;
    this.index = 0;
    this.getDomInfo();
  },
  methods: {
    // 获取dom信息
    getDomInfo() {
      if (!this.guideInfo) {
        return;
      }
      const { el } = this.guideInfo;
      const query = uni.createSelectorQuery().in(this.$root);
      setTimeout(() => {
        query.select(el).boundingClientRect();
        query.selectViewport().scrollOffset();
        var _this = this;
        query.exec(function (res) {
          let data = res[0]; // #the-id节点的上边界坐标
          console.log("data", data);
          _this.viewTips(data);
        });
      }, 10);
    },
    // 展示新手提示
    viewTips(data) {
      if (data) {
        // 如果dom宽度大于或者等于窗口宽度,需要重新调整dom展示宽度
        let newWidth = this.systemInfo.windowWidth;
        if (!this.guideInfo.unSetWidth) {
          newWidth = this.systemInfo.windowWidth - 20;
        }
        if (data.width >= newWidth) {
          data.width = newWidth;
        }

        let left = 0;
        console.log("data.left", data.left);
        console.log(
          "!(this.guideInfo.unSetLeft || this.guideInfo.unSetWidth)",
          !(this.guideInfo.unSetLeft || this.guideInfo.unSetWidth)
        );
        if (!(this.guideInfo.unSetLeft || this.guideInfo.unSetWidth)) {
          // 如果距离左边为0,自动增加一点左边距
          if (data.left < 10) {
            data.left = 10;
          }
          let domRW = this.systemInfo.windowWidth - data.left;
          // 如果dom距离右边没有tips的宽度大的话,就要让tips向左便宜
          if (domRW < this.tipWidth) {
            left = domRW - this.tipWidth - 70;
          }
        }

        // 设置三角形高度
        let arrowTop = data.height;
        this.arrowTop = "top:" + arrowTop + "px;";
        // 设置提示框定位
        this.tipPosition = "top:" + (arrowTop + 40) + "px;left:" + left + "px;";

        if (this.guideInfo.needTop) {
          const query = uni.createSelectorQuery().in(this.$root);

          query.select(".guide-step-tips").boundingClientRect();
          query.selectViewport().scrollOffset();
          var self = this;
          query.exec(function (res) {
            let tipsData = res[0]; // #the-id节点的上边界坐标
            self.tipPosition =
              "top:" + (-tipsData.height - 38) + "px;left:" + left + "px;";
          });
          this.arrowTop = "top:-40px;";
          this.circleTop = "top:30px;";
          this.broderTop = "top:28px;";
        } else {
          this.circleTop = "top:-4px;";
          this.broderTop = "top:-6px;";
        }

        //下一步的文案
        if (this.guideInfo.nextText) {
          this.nextText = this.guideInfo.nextText;
        } else {
          this.nextText = "下一步";
        }
        //关闭遮罩
        if (this.guideInfo.showSkip == "unShow") {
          this.showSkip = false;
        } else {
          this.showSkip = true;
        }

        // 页面是否向下滚动判断
        let dataScrollTop = 0;
        if (this.guideInfo.needScroll !== "unScroll") {
          if (this.scrollTop != 0) {
            if (data.top < 0) {
              dataScrollTop = 0;
            } else {
              dataScrollTop =
                data.top + this.scrollTop - this.systemInfo.windowHeight / 4;
            }
          } else if (data.top > this.systemInfo.windowHeight / 2) {
            dataScrollTop =
              data.top + this.scrollTop - this.systemInfo.windowHeight / 4;
          }

          this.$emit("changeScrollTop", dataScrollTop);
        }

        // 重新设置guideList的值
        let obj = Object.assign(this.guideInfo, data);
        const index = this.index;
        this.guideList.splice(index, 1, obj);
        this.guideStyle = this.getStyle(dataScrollTop);
      } else {
        this.index += 1;
        this.getDomInfo();
      }
    },
    // 获取步骤提示的主要样式
    getStyle(dataScrollTop) {
      const { width, height, left, top, style, bottom } = this.guideInfo;
      let newstyle = "width:" + width + "px;";
      newstyle += "height:" + height + "px;";
      newstyle += "left:" + left + "px;";
      let dataTop = top;
      if (this.guideInfo.needScroll !== "unScroll") {
        if (top < 0) {
          dataTop = top + this.scrollTop || 0;
        } else if (
          dataScrollTop > this.scrollHeight - this.boxHeight &&
          this.lastScrollTop != 0
        ) {
          if (this.lastScrollTop < this.scrollHeight * 2) {
            this.getDomInfo();
          }
        } else if (top > this.systemInfo.windowHeight / 2) {
          dataTop = this.systemInfo.windowHeight / 4;
        }
        this.lastScrollTop = dataScrollTop;
      }
      newstyle += "top:" + dataTop + "px;";
      newstyle +=
        "box-shadow: rgb(33 33 33 / 80%) 0px 0px 0px 0px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px;";
      newstyle += style;
      return newstyle;
    },

    // 跳过新手提示
    skip() {
      this.showGuide = false;
      this.$emit("nextStep", "skip");
    },
    // 下一步
    next() {
      if (this.index === this.guideList.length - 1) {
        this.index += 1;
        this.showGuide = false;
      } else {
        this.index += 1;
        this.getDomInfo();
      }
      this.$emit(
        "nextStep",
        this.step.guideList[this.index - 1 < 0 ? 0 : this.index - 1]
      );
    },
    //打开遮罩
    openStep() {
      let systemInfo = uni.getSystemInfoSync();
      this.systemInfo = systemInfo;
      this.index = 0;
      this.getDomInfo();
      this.showGuide = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.v-model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
.tool-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 65%;
  left: calc(50% - 110rpx);
  z-index: 10001;
  .next {
    padding: 14rpx 60rpx;
    font-size: 32rpx;
    color: #ffffff;
    border: 2rpx solid #fff;
    text-align: center;
    border-radius: 60rpx;
    line-height: 48rpx;
  }
  .skip {
    margin-top: 32rpx;
    color: #ffffff;
    font-size: 32rpx;
  }
}
.guide {
  z-index: 1001;
  .guide-box {
    position: absolute;
    z-index: 10001;
    transition: all 0.2s;

    .arrow {
      height: 80rpx;
      width: 1rpx;
      position: absolute;
      top: 144rpx;
      left: 51%;
      border: 1px dashed #a4c3fd;
      .circle {
        display: block;
        height: 32rpx;
        width: 32rpx;
        background: #4986fb;
        border-radius: 32rpx;
        position: absolute;
        top: -16rpx;
        left: -16rpx;
      }
      .broder {
        display: block;
        height: 40rpx;
        width: 40rpx;
        background: rgba($color: #4986fb, $alpha: 0.5);
        border-radius: 40rpx;
        position: absolute;
        top: -20rpx;
        left: -20rpx;
      }
    }
    .tips {
      width: 500rpx;
      box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.1);
      color: #000;
      position: absolute;
      top: 152rpx;
      left: -50%;
      padding: 10rpx;
      font-size: 28rpx;
      border-radius: 18rpx;
      border: 1px dashed #fff;
      .broder {
        border-radius: 18rpx;
        background: #fff;
        padding: 15rpx 20rpx;
      }
    }
  }
}
</style>
