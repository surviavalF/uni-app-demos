<template>
  <view class="page organization-page">
    <u-navbar is-back title="通讯录" :custom-back="finde"> </u-navbar>
    <view class="controlGroup">
      是否点击返回直接返回上一页<u-switch v-model="backcontrol"></u-switch>
    </view>
    <view v-if="loading" class="loading">
      <u-loading size="42" mode="flower"></u-loading>
    </view>
    <view v-else class="organization-page__container">
      <scroll-view scroll-y class="scroll">
        <view class="search-bar">
          <breadcrumb
            :breadcrumbList="breadcrumbList"
            @onSelectBreadcrumb="onSelectBreadcrumb"
          />
          <view class="search">
            <u-search
              placeholder="请输入查询内容"
              action-text="查询"
              v-model="keyword"
              @clear="searchData('clear')"
              @search="searchData('search')"
            ></u-search>
          </view>
        </view>
        <template v-if="!showSecrch">
          <u-cell-group
            v-if="groupList.length != 0"
            class="organization-page__group"
          >
            <u-cell-item
              v-for="(item, index) in groupList"
              :key="index"
              @click="openGroup(item)"
            >
              <view slot="title" class="title">
                <span class="organ">
                  {{ item.organName }}
                </span>
              </view>
            </u-cell-item>
          </u-cell-group>
          <u-cell-group
            v-if="organUsersList.length != 0"
            class="organization-page__member"
          >
            <u-cell-item
              :arrow="true"
              v-for="(item, index) in organUsersList"
              :key="index"
            >
              <view slot="title" class="title">
                <view class="title_top">
                  <view class="userName u-line-1"> {{ item.userName }}</view>
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
                  bg-color="#4986fb"
                  size="large"
                  mode="circle"
                ></u-avatar>
              </view>
            </u-cell-item>
          </u-cell-group>
        </template>
        <template v-else>
          <u-cell-group
            v-if="secrchOrganUsersList.length != 0"
            class="organization-page__member"
          >
            <u-cell-item
              :arrow="true"
              v-for="(item, index) in secrchOrganUsersList"
              :key="index"
            >
              <view slot="title" class="title">
                <view class="title_top">
                  <view class="userName"> {{ item.userName }}</view>
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
                  bg-color="#4986fb"
                  size="large"
                  mode="circle"
                ></u-avatar>
              </view>
            </u-cell-item>
          </u-cell-group>
          <u-empty text="当前部门下无此人员" mode="search" v-else> </u-empty>
        </template>
      </scroll-view>
    </view>

    <view style="height: 0"> </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import breadcrumb from "./common/breadcrumb";
import _ from "lodash";
export default {
  data() {
    return {
      loading: false,
      backcontrol: false, //是否直接返回上一页
      lodash: _,

      parentId: "", //父节点的部门ID
      groupList: [], //部门数组
      organUsersList: [], //人员数组
      breadcrumbList: [{ organName: "", organId: "" }],

      goInStateId: "", //点击部门进入的ID
      goInPrStateId: "", //点击部门进入的全部父ID

      keyword: "", //关键字
      showSecrch: false, //是否显示查询结果
      secrchOrganUsersList: [] //查询结果数据
    };
  },
  created() {
    this.breadcrumbList[0].organName = "根节点0";
  },
  components: {
    breadcrumb
  },
  onBackPress({ from }) {
    if (from === "navigateBack") {
      return false;
    }
    this.backToPrePage();
    return true;
  },
  onLoad(options) {
    let { breadcrumb, organId, goInStateId, goInPrStateId } = options;
    this.goInStateId = goInStateId || "";
    this.goInPrStateId = goInPrStateId || "";
    this.parentId = organId || "";
    breadcrumb && this.$set(this, "breadcrumbList", JSON.parse(breadcrumb));
  },
  onShow() {
    this.getSysOrganChilds();
  },
  watch: {
    keyword(newVal, oldVal) {
      if (newVal == "") {
        this.showSecrch = false;
      }
    }
  },
  methods: {
    //搜索查询
    searchData(val) {
      if (val == "search") {
        this.showSecrch = true;
        this.secrchOrganUsersList = [];
        this.organUsersList.forEach((item) => {
          if (item.userName.indexOf(this.keyword) > -1) {
            this.secrchOrganUsersList.push(item);
          }
        });
      } else {
        this.showSecrch = false;
        this.secrchOrganUsersList = [];
      }
    },
    backToPrePage() {
      if (this.breadcrumbList.length == 1) {
        uni.switchTab({ url: "../index" });
        return;
      }
      uni.navigateBack({
        delta: 1
      });
    },

    async getSysOrganChilds() {
      this.loading = true;
      if (!this.parentId) {
        //没有parentId证明是从根点来的
        this.parentId = "0";
        this.getSysOrganChilds2();
      } else {
        this.getSysOrganChilds2();
      }
    },
    async getSysOrganChilds2() {
      this.groupList = [
        {
          organId: this.parentId + "-1",
          parentId: this.parentId,
          organName: `部门${this.parentId + "-1"}`
        },
        {
          organId: this.parentId + "-2",
          parentId: this.parentId,
          organName: `部门${this.parentId + "-2"}`
        }
      ];
      this.organUsersList = [
        {
          userName: `部门${this.parentId}的成员`
        }
      ];
      if (
        this.goInStateId &&
        this.goInStateId != "undefined" &&
        this.goInStateId != ""
      ) {
        this.getOrgin();
      } else {
        this.loading = false;
      }
    },

    //外部点击部门进入组织架构
    async getOrgin() {
      var _this = this;
      setData();
      function setData() {
        console.log("goInStateId", _this.goInStateId);
        console.log("goInPrStateId", _this.goInPrStateId);
        console.log("parentId", _this.parentId);
        var duplicateId = "";
        _this.groupList.forEach((item) => {
          if (_this.goInPrStateId.indexOf(item.organId) != -1) {
            duplicateId = item.organId;
            _this.breadcrumbList = _this.breadcrumbList.concat(item);
            _this.breadcrumbList = _this.breadcrumbListUniq();
            return;
          } else if (item.organId == _this.goInStateId) {
            _this.breadcrumbList = _this.breadcrumbList.concat(item);
            _this.breadcrumbList = _this.breadcrumbListUniq();
            return;
          }
        });
        if (duplicateId != "") {
          _this.groupList = [
            {
              organId: duplicateId + "-1",
              parentId: duplicateId,
              organName: `部门${duplicateId + "-1"}`
            },
            {
              organId: duplicateId + "-2",
              parentId: duplicateId,
              organName: `部门${duplicateId + "-2"}`
            }
          ];
          setData();
        } else {
          duplicateId = _this.goInStateId;
          _this.parentId = duplicateId;
          _this.groupList = [
            {
              organId: duplicateId + "-1",
              parentId: duplicateId,
              organName: `部门${duplicateId + "-1"}`
            },
            {
              organId: duplicateId + "-2",
              parentId: duplicateId,
              organName: `部门${duplicateId + "-2"}`
            }
          ];
          _this.organUsersList = [
            {
              userName: `部门${duplicateId}的成员`
            }
          ];
          _this.loading = false;
        }
      }
    },
    //面包屑去重
    breadcrumbListUniq() {
      var _this = this;
      var uniques = [];
      var stringify = {};
      for (var i = 0; i < _this.breadcrumbList.length; i++) {
        var keys = Object.keys(_this.breadcrumbList[i]);
        keys.sort(function (a, b) {
          return Number(a) - Number(b);
        });
        var str = "";
        for (var j = 0; j < keys.length; j++) {
          str += JSON.stringify(keys[j]);
          str += JSON.stringify(_this.breadcrumbList[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
          uniques.push(_this.breadcrumbList[i]);
          stringify[str] = true;
        }
      }
      uniques = uniques;
      return uniques;
    },

    onSelectBreadcrumb(index) {
      if (!index) {
        uni.reLaunch({ url: "/pages/20220814_organization/index" });
        return;
      }
      console.log("his.breadcrumbList", this.breadcrumbList);
      let breadcrumb = this.breadcrumbList.slice(0, index + 1);
      console.log("breadcrumb", breadcrumb);
      let { organId } = this.breadcrumbList[index];
      uni.navigateTo({
        url: `./index?organId=${organId}&breadcrumb=${encodeURIComponent(
          JSON.stringify(breadcrumb)
        )}`
      });
    },
    openGroup(data) {
      let breadcrumb = this.breadcrumbList.concat(data);
      uni.navigateTo({
        url: `./index?organId=${data.organId}&breadcrumb=${encodeURIComponent(
          JSON.stringify(breadcrumb)
        )}`
      });
    },

    finde() {
      if (this.backcontrol) {
        uni.reLaunch({ url: "/pages/20220814_organization/index" });
      } else {
        let pages = getCurrentPages(); // 当前页面
        let beforePage = pages[pages.length - 2]; // 上一页
        uni.navigateBack({
          delta: 1,
          success: () => {
            beforePage._vnode.componentOptions.children[0].componentOptions.children[0].componentInstance.getqueryOrganByCurrentUser();
            beforePage._vnode.componentOptions.children[0].componentOptions.children[0].componentInstance.getCompanyInfo();
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.organization-page {
  background: $uni-bg-color-grey;
  width: 100%;
  display: flex;
  flex-direction: column;
  .loading {
    width: 100%;
    text-align: center;
    height: 80vh;
    line-height: 80vh;
  }

  .search-bar {
    padding: 30rpx 20rpx 0;
    .search {
      /deep/.u-content {
        height: 90rpx !important;
        background-color: #fff !important;
        box-shadow: $uni-black-box-shadow;
        .u-input {
          background-color: #fff !important;
        }
        .u-icon__icon {
          font-size: 40rpx !important;
          color: #dddddd !important;
        }
      }
      /deep/.u-action {
        color: #4986fb;
        background: #fff;
        border: 1rpx solid #4986fb;
        padding: 6rpx;
        border-radius: 40rpx;
        height: 70rpx !important;
        width: 110rpx !important;
        line-height: 55rpx;
      }
    }
  }
  .u-empty {
    height: 50%;
  }
  &__container {
    flex: 1;
    overflow: hidden;
    .scroll {
      height: 100%;
    }
  }
  &__group {
    margin-top: 20rpx;
    .title {
      display: flex;
      align-items: center;
    }
  }
  &__member {
    margin-top: 20rpx;
    /deep/.u-cell_title {
      width: 100% !important;
    }
    /deep/.u-cell-item-box {
      .u-icon__icon {
        color: #666666 !important;
      }
      .u-icon {
        margin-left: 8rpx !important;
      }
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
      }
    }
    .avatar {
      margin-right: 30rpx;
      /deep/ .u-avatar {
        color: #ffffff !important;
        width: 80rpx !important;
        height: 80rpx !important;
        flex: 0 0 80rpx !important;
      }
    }
    .image {
      width: 82rpx;
      height: 82rpx;
      text-align: center;
      border-radius: 60rpx;
      display: block;
    }
  }
  &__invite-member {
    background: #fff;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid $uni-border-color;
    align-items: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .set-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 20rpx;
    }
    .btn {
      color: $uni-color-primary;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      height: 55px;
      & ~ .btn {
        text {
          border-left: 1px solid $uni-border-color;
        }
      }
      text {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }
    }
  }
}
</style>
