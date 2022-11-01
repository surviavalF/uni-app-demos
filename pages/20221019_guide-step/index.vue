<template>
  <view class="page main">
    <u-navbar is-back title="引导遮罩" />
    <view class="pageData">
      <scroll-view
        scroll-y="true"
        class="scroll"
        @scroll="scrollEvent"
        :scroll-top="scrollTop"
      >
        <view class="class1">第1个</view>
        <view class="class2">第2个</view>
        <view class="class3">第3个</view>
        <view class="class4">第4个</view>
        <view class="class41">第41个</view>
        <view class="class42">第42个</view>
        <view class="class43">第43个</view>
        <view class="class5">第5个</view>
        <view class="bottom-btn">
          <u-button type="primary" @click="openGuide"> 打开遮罩 </u-button>
        </view>
      </scroll-view>
    </view>
    <view class="class6">第6个</view>
    <GuideStep
      ref="refGuideStep"
      :step="step"
      :scrollTop="scrollTop"
      :scrollHeight="scrollHeight"
      :boxHeight="boxHeight"
      @nextStep="clickNext"
      @changeScrollTop="changeScrollTop"
    ></GuideStep>
  </view>
</template>

<script>
import GuideStep from "./guideStep/guideStep.vue";
export default {
  onLoad() {
    let query = uni.createSelectorQuery().in(this.$root);
    let timer = setTimeout(() => {
      query.select(".pageData").boundingClientRect();
      query.selectViewport().scrollOffset();
      var _this = this;
      query.exec(function (res) {
        _this.boxHeight = res[0].height;
      });
      clearTimeout(timer);
    }, 10);
  },
  onShow() {},
  components: {
    GuideStep
  },
  data() {
    return {
      scrollTop: 0,
      scrollHeight: 0,
      boxHeight: 0,
      step: {
        name: "contacts",
        showStep: false,
        guideList: [
          {
            el: ".class1",
            tips: "第1个",
            style: "border-radius: 8rpx;margin: 0;",
            unSetWidth: true //不重新调整dom展示宽度
          },
          {
            el: ".class2",
            tips: "第2个",
            style: "border-radius: 8rpx;margin: 0;"
          },
          {
            el: ".class3",
            tips: "第3个",
            style: "border-radius: 8rpx;margin: 0;",
            unSetLeft: true //不设置左侧宽度
          },
          {
            el: ".class4",
            tips: "第4个",
            style: "border-radius: 8rpx;margin: 0;"
          },
          {
            el: ".class6",
            tips: "第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个第6个",
            style: "border-radius: 8rpx;margin: 0",
            needScroll: "unScroll", //不需要滚动条滚动
            needTop: true
          },
          {
            el: ".class41",
            tips: "第41个",
            style: "border-radius: 8rpx;margin: 0;"
          },
          {
            el: ".class42",
            tips: "第42个",
            style: "border-radius: 8rpx;margin: 0;"
          },
          {
            el: ".class43",
            tips: "第43个",
            style: "border-radius: 8rpx;margin: 0;"
          },
          {
            el: ".class5",
            tips: "第5个",
            style: "border-radius: 8rpx;margin: 0",
            nextText: "完成",
            showSkip: "unShow", //是否显示跳过
            finish: true, //是否结束
            needTop: true //文案是否在上方向展示
          }
        ]
      }
    };
  },
  methods: {
    openGuide() {
      this.$refs.refGuideStep.openStep();
    },
    closeGuide() {},
    clickNext(e) {
      // console.log("e", e);
      if (e.finish || e == "skip") {
        this.scrollTop = 0;
      }
    },
    scrollEvent(e) {
      console.log("e.detail.scrollTop", e.detail.scrollTop);
      this.scrollHeight = e.detail.scrollHeight;
      this.scrollTop = e.detail.scrollTop;
    },
    changeScrollTop(e) {
      this.scrollTop = e;
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  .pageData {
    flex: 1;
    overflow: hidden;
    .scroll {
      height: 100%;
      border: 1rpx solid #000;
    }

    .class1 {
      background: burlywood;
    }
    .class2 {
      height: 300rpx;
      width: 300rpx;
      background: wheat;
      margin: 100rpx;
    }
    .class3 {
      background: rebeccapurple;
      width: 60rpx;
    }
    .class4 {
      background: chartreuse;
      height: 100rpx;
      width: 100rpx;
      margin: 1000rpx 50rpx;
    }
    .class41 {
      background: chartreuse;
      height: 100rpx;
      width: 200rpx;
      margin: 1000rpx 50rpx;
    }
    .class42 {
      background: chartreuse;
      height: 100rpx;
      width: 300rpx;
      margin: 1000rpx 50rpx;
    }
    .class43 {
      background: chartreuse;
      height: 100rpx;
      width: 400rpx;
      margin: 1000rpx 50rpx;
    }
  }
}
</style>
