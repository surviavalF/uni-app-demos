<template>
  <view class="breadcrumb-page" ref="scroll">
    <scroll-view scroll-x ref="scroll" scroll-left="1000" class="scroll">
      <view class="line">
        <view
          v-for="(item, index) in breadcrumbList"
          :key="index"
          class="item"
          :class="{ 'no-event': breadcrumbList.length - 1 === index }"
          @click="onChoose(index)"
        >
          {{ item.organName
          }}<u-icon class="icon" :name="breadcrumbList.length - 1 === index ? '' : 'arrow-right'" size="20" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    breadcrumbList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    onChoose(index) {
      this.$emit('onSelectBreadcrumb', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb-page {
  display: flex;
  overflow: auto;
  align-items: center;
  .scroll {
    padding: 30rpx 0;
    .line {
      display: flex;
      align-items: center;
      .item {
        font-weight: bold;
        height: 40rpx;
        line-height: 40rpx;
        flex-shrink: 0;
        color: $uni-text-color-desc;
        font-size: $uni-font-size-sm;
        .icon {
          margin: 0 10rpx;
        }
        &.no-event {
          pointer-events: none;
          color: $uni-text-color;
        }
      }
    }
  }
}
</style>
