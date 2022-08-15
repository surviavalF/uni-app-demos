<template>
  <view class="page main">
    <u-navbar is-back title="通讯录" />
    <view class="pageData">
      <auto-scroll scroll-y class="scroll">
        <u-cell-group v-if="organLsit.length != 0">
          <u-cell-item
            v-for="(item, index) in organLsit"
            :key="index"
            @click="toOrganizationPage(item)"
          >
            <view slot="title" class="organLsitTitle">
              <text class="organName">
                {{ item.organName }}
              </text>
              <text class="listAccountId">
                {{ " (" + item.listAccountId.length + "人)" }}
              </text>
            </view>
          </u-cell-item>
        </u-cell-group>
        <u-cell-group v-if="organUsersList.length != 0" class="usersList">
          <u-cell-item
            :arrow="true"
            v-for="(item, index) in organUsersList"
            :key="index"
            @click="onPreviewMember(item.accountId)"
          >
            <view slot="title" class="title">
              <view class="title_top">
                <view class="userName"> {{ item.userName }}</view>
                <view class="userPhone">{{ item.userMobile }}</view>
              </view>
              <view class="title_tag">
                <template v-if="!lodash.isEmpty(item.userRole)">
                  <u-tag
                    type="info"
                    size="mini"
                    bg-color="#fff"
                    border-color="#999999"
                    color="#999999"
                    v-for="(items, index) in item.userRole"
                    :key="index"
                  >
                    <text>{{ items.label }}</text>
                  </u-tag>
                </template>
              </view>
            </view>
            <view slot="icon" class="avatar">
              <image
                v-if="item.userIcon"
                :src="item.userIcon"
                class="image"
              ></image>
              <u-avatar
                v-else
                :text="item.userName"
                bg-color="#ff6a00"
                size="large"
                mode="circle"
              ></u-avatar>
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
  onShow() {
    this.getqueryOrganByCurrentUser();
  },
  components: {
    AutoScroll
  },
  data() {
    return {
      lodash: _,
      organLsit: [],
      organUsersList: [],
      data: {
        listSysOrgan: [
          {
            children: null,
            organId: "d5d4e21c83f7473a619bd2f93456a413",
            parentId: "-1",
            tenantId: "66570ff2da989de183dfcaf20c5e3fb3",
            organName: "乌拉企业1",
            parentIds: "EMPTY",
            organStatus: null,
            organType: "COMPANY",
            organLevel: 1,
            organSort: 0,
            deleted: false,
            createPerson: "00c05fdbd21f1555613b478bc706ac56",
            createDate: "2022-08-15 14:12:14",
            updatePerson: null,
            updateDate: null,
            listAccountId: ["8035cf9418680d5dd63d1dbf8bfc668a"]
          }
        ],
        organUsers: [
          {
            userOrganId: "d44a7662a5dc8fa2fb58a1cd583fb587",
            tenantId: "66570ff2da989de183dfcaf20c5e3fb3",
            accountId: "8035cf9418680d5dd63d1dbf8bfc668a",
            userIcon: "",
            organId: "d5d4e21c83f7473a619bd2f93456a413",
            userRole: null,
            isMemeber: true,
            dutyName: null,
            deleted: false,
            createPerson: "00c05fdbd21f1555613b478bc706ac56",
            createDate: "2022-08-15 14:12:14",
            updatePerson: null,
            updateDate: null,
            userName: "155张",
            userMobile: "15542419308"
          }
        ],
        mainUserId: "8035cf9418680d5dd63d1dbf8bfc668a",
        fzr: [],
        gly: [],
        fgld: [],
        gsgly: [],
        zyfzr: []
      }
    };
  },
  methods: {
    getqueryOrganByCurrentUser() {
      this.organLsit = this.data.listSysOrgan;
      this.organUsersList = this.data.organUsers;
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
        .listAccountId {
          color: #999999;
        }
      }
      .usersList {
        margin-top: 30rpx;
        /deep/.u-cell_title {
          width: 100% !important;
        }
        .title {
          display: flex;
          flex-direction: column;
          &_top {
            display: flex;
            .userName {
              font-weight: bold;
              padding-right: 30rpx;
              overflow: hidden;
              white-space: normal;
              word-wrap: break-word;
              word-break: break-all;
              text-overflow: ellipsis;
            }
            .userPhone {
              color: #4986fb;
            }
          }
          &_tag {
            display: flex;
            flex-wrap: wrap;
            max-height: 40rpx !important;
            overflow: hidden;
            .u-tag {
              margin-bottom: 10rpx;
              margin-right: 18rpx;
              flex-shrink: 0;
              border-radius: 20rpx;
            }
          }
        }
        .avatar {
          margin-right: 30rpx;
          /deep/ .u-avatar {
            color: #ffffff !important;
            width: 60rpx !important;
            height: 60rpx !important;
            flex: 0 0 60rpx !important;
          }
        }
        .image {
          width: 62rpx;
          height: 62rpx;
          text-align: center;
          border-radius: 40rpx;
          display: block;
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
