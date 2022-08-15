<template>
  <view class="org-user-select">
    <u-input
      :value="tips"
      disabled
      @click="onOpen"
      :class="inputOpen ? '' : 'btnCheck'"
    />
    <u-popup v-model="popupShow" height="80%" @close="onClose" closeable>
      <view class="poupIn">
        <view class="titles">
          <text> 人员选择 </text>
        </view>
        <view class="header">
          <view class="title">
            <scroll-view
              scroll-x
              style="width: 100%; white-space: nowrap"
              :scroll-left="scrollLeft"
            >
              <view
                v-for="(item, index) in tree_stack"
                class="inline-item"
                :key="index"
              >
                <view
                  class="inline-item"
                  v-if="index == 0"
                  @click="backTree(item, -1)"
                >
                  <text
                    v-if="index == tree_stack.length - 1 && !isre"
                    class="none"
                    >全部</text
                  >
                  <text v-else class="active">全部</text>
                </view>

                <view
                  class="inline-item"
                  @click="backTree(item, index)"
                  v-if="index != 0"
                >
                  <i v-if="index != 0" class="iconfont icon-z043 iconclass" />
                  <text
                    v-if="index == tree_stack.length - 1"
                    class="none inline-item"
                  >
                    {{ item[props.label] }}
                  </text>
                  <text v-else class="active">
                    {{ item[props.label] }}
                  </text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import treeDataList from "./treeData.js";
export default {
  props: {
    value: {
      //控制人员选择popup显隐
      type: Boolean,
      default: false
    },
    inputOpen: {
      //是否开启编辑
      type: Boolean,
      default: true
    }
  },
  watch: {
    value(val) {
      this.popupShow = val;
    }
  },
  components: {},
  data() {
    return {
      popupShow: true,
      tips: "未选择",

      isre: false,
      tree_stack: [1],
      scrollLeft: 999
    };
  },
  methods: {
    onOpen() {
      this.$emit("input", true);
    },
    onClose() {
      this.$emit("input", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.org-user-select {
  flex: 1;
  .btnCheck {
    display: none;
  }
  .poupIn {
    .header {
      width: 100%;
      position: fixed;
      background-color: #fff;
      z-index: 9999;

      .title {
        height: 90rpx;
        padding: 0 32rpx;
        line-height: 90rpx;
        font-size: 30rpx;
        background-color: #f7f7f7;
        color: #606064;

        .iconclass {
          display: inline-block;
          margin: 0 12rpx;
          color: #d0d4db;
          font-size: 28rpx;
        }
      }
    }
  }
}
</style>
