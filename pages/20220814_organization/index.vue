<template>
  <view class="page main">
    <u-navbar is-back title="组织架构组件" />
    <view class="pageData">
      <view class="controlGroup"> </view>
      <auto-scroll scroll-y class="scroll">
        <u-cell-group v-if="organLsit.length != 0">
          <u-cell-item @click="toOrganizationPage()">
            <view slot="title" class="organLsitTitle">
              <text class="organName"> 进入根节点 </text>
            </view>
          </u-cell-item>

          <u-cell-item
            v-for="(item, index) in organLsit"
            :key="index"
            @click="toOrganizationPage(item)"
          >
            <view slot="title" class="organLsitTitle">
              <text class="organName"> 进入 {{ item.organName }} </text>
            </view>
          </u-cell-item>
        </u-cell-group>
      </auto-scroll>
    </view>
  </view>
</template>

<script>
import AutoScroll from "@/components/auto-scroll/index";
import _ from "lodash";
export default {
  onLoad() {},
  onShow() {},
  components: {
    AutoScroll
  },
  data() {
    return {
      lodash: _,
      organLsit: [
        {
          organId: "0-1",
          parentId: "0",
          organName: "部门0-1",
          parentIds: ["0"]
        },
        {
          organId: "0-2-2",
          parentId: "0-2",
          organName: "部门0-2-2",
          parentIds: ["0", "0-2"]
        }
      ]
    };
  },
  methods: {
    //跳转通讯录内部
    toOrganizationPage(item) {
      if (_.isEmpty(item)) {
        uni.navigateTo({
          url: "/pages/20220814_organization/organization/index"
        });
      } else {
        uni.navigateTo({
          url:
            "/pages/20220814_organization/organization/index?goInStateId=" +
            item.organId +
            "&goInPrStateId=" +
            item.parentIds
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  width: 100%;
  background: $uni-bg-color-grey;
  overflow: auto;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  .controlGroup {
    margin-bottom: 30rpx;
  }
  .pageData {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .pageData_top {
      margin-bottom: 20rpx;
      .cover {
        position: relative;
        height: 180rpx;
        background-color: $uni-bg-color;
        @include flex-box(row, space-between);
        padding: 0 30rpx;

        .content {
          flex: 1;
          .username {
            display: flex;
            width: 60vw;
            align-content: baseline;
            font-size: $uni-font-size-base;
            font-weight: bold;
            margin-bottom: 30rpx;
            text {
              padding-right: 20rpx;
            }
          }
          .company {
            .tags {
              display: flex;
              .u-tag {
                display: flex;
                align-items: center;
                border-radius: 100rpx;
                font-size: 26rpx;
                padding: 6rpx 10rpx;
                &:first-child {
                  margin-right: 30rpx;
                }
              }
            }
          }
        }
        .avatar {
          @include flex-box(column, center, center);

          max-width: 130rpx;
          max-height: 130rpx;

          margin-right: 30rpx;
          color: $uni-text-color-inverse;
          font-size: 80rpx;
          /deep/ .u-avatar {
            box-shadow: 0px 10px 10px 0px rgba(255, 106, 0, 0.2);
            font-weight: bold;
            color: #ffffff !important;
          }
        }
        .text-btn {
          padding: 0 10rpx;
          font-size: $uni-font-size-sm;
          color: $uni-color-primary;
        }
      }
      .actions_wrap {
        background-color: $uni-bg-color;
        width: 100%;
        height: 180rpx;
        padding: 20rpx 0;
        .content {
          padding: 10rpx 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-row-gap: 40rpx;
          .item {
            display: flex;
            justify-content: center;
            /deep/ .u-icon__img {
              padding-bottom: 15rpx;
            }
            /deep/ .u-icon__label {
              font-size: $uni-font-size-sm !important;
              margin: 0 !important;
              color: $uni-text-color !important;
            }
            &.hidden {
              display: none;
            }
            .icon {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }
        }
      }
    }
    .scroll {
      flex: 1;
      height: 0;
      padding-bottom: 20rpx;
      .organLsitTitle {
        font-size: 32rpx;
        .organName {
          color: #222222;
          font-weight: bold;
          margin-right: 10rpx;
        }
      }

      /deep/.u-cell-box {
        padding: 0 30rpx;
        .u-cell-item-box {
          border-radius: 24rpx !important;
          box-shadow: $uni-black-box-shadow;
        }
        .u-icon__icon {
          color: #666666 !important;
        }
      }
    }
  }
}
</style>
