<template>
  <view class="page organization-page" :class="{ 'safe-area': !setting }">
    <u-navbar is-back title="通讯录" :custom-back="finde">
      <view slot="right" class="navbar-right-box">
        <template
          v-if="isAllowAccess('A012') || isMenuAllowAccess('A012', parentId)"
        >
          <!-- <text @click="setting = 'true'" v-if="setting != 'true'">管理</text>
          <text @click="setting = ''" v-else-if="setting === 'true'">取消</text> -->
        </template>
        <text @click="show = true" v-else>更多</text>
      </view>
    </u-navbar>
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
                <u-tag
                  type="info"
                  mode="dark"
                  bg-color="#e6e5ea"
                  color="#6b6b6b"
                >
                  <text>{{ item.organType | filterOrganType }}</text>
                </u-tag>
                <span class="organ">
                  {{
                    item.organName + " (" + item.listAccountId.length + "人)"
                  }}
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
              @click="onPreviewMember(item.accountId)"
            >
              <view slot="title" class="title">
                <view class="title_top">
                  <view class="userName u-line-1"> {{ item.userName }}</view>
                  <view class="userPhone">{{ item.userMobile }}</view>
                </view>
                <view class="title_tag">
                  <u-tag
                    v-if="item.accountId == mainUserId"
                    type="info"
                    size="mini"
                    bg-color="#fff"
                    border-color="#999999"
                    color="#999999"
                  >
                    <text>主管理员</text>
                  </u-tag>
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
              @click="onPreviewMember(item.accountId)"
            >
              <view slot="title" class="title">
                <view class="title_top">
                  <view class="userName"> {{ item.userName }}</view>
                  <view class="userPhone">{{ item.userMobile }}</view>
                </view>
                <view class="title_tag">
                  <u-tag
                    v-if="item.accountId == mainUserId"
                    type="info"
                    size="mini"
                    bg-color="#fff"
                    border-color="#999999"
                    color="#999999"
                  >
                    <text>主管理员</text>
                  </u-tag>
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
          <u-empty text="当前部门下无此人员" mode="search" v-else> </u-empty>
        </template>
      </scroll-view>
    </view>

    <u-action-sheet
      :list="list"
      v-model="show"
      @click="showExit = true"
      safe-area-inset-bottom
    ></u-action-sheet>
    <view style="height: 0"> </view>
    <u-toast ref="uToast" />
    <u-modal
      v-model="showExit"
      content="确定退出该企业？"
      :show-cancel-button="true"
      @confirm="onExit"
      mask-close-able
    ></u-modal>
  </view>
</template>

<script>
import breadcrumb from "./common/breadcrumb";
import _ from "lodash";
export default {
  // data() {
  //   return {
  //     showExit: false,
  //     loading: false,
  //     lodash: _,
  //     list: [
  //       {
  //         text: '退出该企业',
  //         color: '#ff0000',
  //         fontSize: 28
  //       }
  //     ],
  //     parentId: '', //部门ID
  //     show: false,
  //     setting: '',
  //     groupList: [],
  //     organUsersList: [],
  //     breadcrumbList: [{ organName: '', organId: '' }],

  //     userSelect3: false,
  //     userList3: [],
  //     value: null,
  //     organType: '',
  //     goInStateId: '', //点击部门进入的ID
  //     goInPrStateId: '', //点击部门进入的全部父ID

  //     keyword: '', //关键字
  //     showSecrch: false, //关键字
  //     secrchOrganUsersList: [],
  //     mainUserId: ''
  //   }
  // },
  // created() {
  //   this.breadcrumbList[0].organName = this.current.companyName
  // },
  components: {
    breadcrumb,
  },
  // filters: {
  //   filterOrganType(val) {
  //     switch (val) {
  //       case 'COMPANY':
  //         return '公司'
  //         break
  //       case 'DEPT':
  //         return '部门'
  //         break
  //       case 'TEAM':
  //         return '班组'
  //         break
  //       default:
  //         return ''
  //         break
  //     }
  //   }
  // },
  // computed: {
  //   ...mapState('auth', {
  //     userInfo: state => state.userData || {}
  //   }),
  //   ...mapGetters({
  //     isAllowAccess: 'auth/isAllowAccess',
  //     isMenuAllowAccess: 'auth/isMenuAllowAccess',
  //     current: 'auth/currentCompany'
  //   })
  // },
  // onBackPress({ from }) {
  //   if (from === 'navigateBack') {
  //     return false
  //   }
  //   this.backToPrePage()
  //   return true
  // },
  // onLoad(options) {
  //   let { setting, breadcrumb, organId, banzu, goInStateId, goInPrStateId } = options
  //   this.goInStateId = goInStateId || ''
  //   this.goInPrStateId = goInPrStateId || ''
  //   this.setting = setting || ''
  //   this.parentId = organId || ''
  //   breadcrumb && this.$set(this, 'breadcrumbList', JSON.parse(breadcrumb))
  //   this.organType = banzu || ''
  // },
  // onShow() {
  //   this.getSysOrganChilds()
  // },
  // watch: {
  //   keyword(newVal, oldVal) {
  //     if (newVal == '') {
  //       this.showSecrch = false
  //     }
  //   }
  // },
  // methods: {
  //   ...mapActions({
  //     getCompanyList: 'auth/getCompanyList'
  //   }),
  //   //查询
  //   searchData(val) {
  //     if (val == 'search') {
  //       this.showSecrch = true
  //       this.secrchOrganUsersList = []
  //       this.organUsersList.forEach(item => {
  //         if (item.userName.indexOf(this.keyword) > -1) {
  //           this.secrchOrganUsersList.push(item)
  //         }
  //       })
  //     } else {
  //       this.showSecrch = false
  //       this.secrchOrganUsersList = []
  //     }
  //   },
  //   backToPrePage() {
  //     // if (this.breadcrumbList.length == 1) {
  //     //   uni.switchTab({ url: '../index' })
  //     //   return
  //     // }
  //     uni.navigateBack({
  //       delta: 1
  //     })
  //   },
  //   async userCheck3(e) {
  //     this.userList3 = e.map(item => item.accountId)
  //     let { data } = await sysOrganOperationBatc({
  //       organId: this.parentId,
  //       accountIds: this.userList3
  //     })
  //     this.getSysOrganChilds()
  //   },
  //   checkPeople() {
  //     this.$refs.userSelector.onOpen()
  //   },
  //   async getSysOrganChilds() {
  //     this.loading = true
  //     if (!this.parentId) {
  //       let { data } = await sysOrganChilds({
  //         parentId: this.parentId
  //       })
  //       this.parentId = data.listSysOrgan[0].organId
  //       this.mainUserId = data.mainUserId
  //       this.getSysOrganChilds2()
  //     } else {
  //       this.getSysOrganChilds2()
  //     }
  //   },
  //   async getSysOrganChilds2() {
  //     let { data } = await sysOrganChilds({
  //       parentId: this.parentId
  //     })
  //     this.groupList = data.listSysOrgan
  //     this.organUsersList = data.organUsers
  //     this.userList3 = data.organUsers.filter(subitem => subitem.isMemeber).map(item => item.accountId)
  //     if (this.goInStateId && this.goInStateId != 'undefined' && this.goInStateId != '') {
  //       this.getOrgin()
  //     } else {
  //       this.loading = false
  //     }
  //   },

  //   //外部点击部门进入组织架构
  //   async getOrgin() {
  //     var _this = this
  //     setData()
  //     function setData() {
  //       console.log('goInStateId', _this.goInStateId)
  //       console.log('goInPrStateId', _this.goInPrStateId)
  //       console.log('parentId', _this.parentId)
  //       var duplicateId = ''
  //       _this.groupList.forEach(item => {
  //         if (_this.goInPrStateId.indexOf(item.organId) != -1) {
  //           duplicateId = item.organId
  //           _this.breadcrumbList = _this.breadcrumbList.concat(item)
  //           _this.breadcrumbList = _this.breadcrumbListUniq()
  //           return
  //         } else if (item.organId == _this.goInStateId) {
  //           _this.breadcrumbList = _this.breadcrumbList.concat(item)
  //           _this.breadcrumbList = _this.breadcrumbListUniq()
  //           return
  //         }
  //       })
  //       if (duplicateId != '') {
  //         sysOrganChilds({
  //           parentId: duplicateId
  //         })
  //           .then(res => {
  //             _this.groupList = res.data.listSysOrgan
  //             setData()
  //           })
  //           .catch(() => {
  //             _this.loading = false
  //           })
  //       } else {
  //         duplicateId = _this.goInStateId
  //         sysOrganChilds({
  //           parentId: duplicateId
  //         })
  //           .then(res => {
  //             _this.parentId = duplicateId
  //             _this.groupList = res.data.listSysOrgan
  //             _this.organUsersList = res.data.organUsers
  //             _this.userList3 = res.data.organUsers.filter(subitem => subitem.isMemeber).map(item => item.accountId)
  //             _this.loading = false
  //           })
  //           .catch(() => {
  //             _this.loading = false
  //           })
  //       }
  //     }
  //   },
  //   //面包屑去重
  //   breadcrumbListUniq() {
  //     var _this = this
  //     var uniques = []
  //     var stringify = {}
  //     for (var i = 0; i < _this.breadcrumbList.length; i++) {
  //       var keys = Object.keys(_this.breadcrumbList[i])
  //       keys.sort(function (a, b) {
  //         return Number(a) - Number(b)
  //       })
  //       var str = ''
  //       for (var j = 0; j < keys.length; j++) {
  //         str += JSON.stringify(keys[j])
  //         str += JSON.stringify(_this.breadcrumbList[i][keys[j]])
  //       }
  //       if (!stringify.hasOwnProperty(str)) {
  //         uniques.push(_this.breadcrumbList[i])
  //         stringify[str] = true
  //       }
  //     }
  //     uniques = uniques
  //     return uniques
  //   },

  //   async onExit() {
  //     await logOffUser({
  //       userAccountId: this.userInfo.userAccountId,
  //       otherCompanyId: uni.getStorageSync('currentCompany')
  //     })
  //     await this.getCompanyList()
  //     this.$refs.uToast.show({
  //       title: '退出成功',
  //       type: 'success',
  //       callback: () => {
  //         uni.reLaunch({ url: '/pages/home/index?current=3' })
  //       }
  //     })
  //   },
  //   async toSubPage(value) {
  //     let datas
  //     let { data } = await sysOrganDetail({
  //       organId: this.parentId
  //     })
  //     datas = data
  //     uni.navigateTo({
  //       url:
  //         './setting-department?state=' +
  //         value +
  //         '&parenttype=' +
  //         encodeURIComponent(JSON.stringify(datas)) +
  //         '&banzu=' +
  //         this.organType
  //     })
  //   },
  //   onSelectBreadcrumb(index) {
  //     if (!index) {
  //       uni.reLaunch({ url: '/pages/home/index?current=3' })
  //       return
  //     }
  //     console.log('his.breadcrumbList', this.breadcrumbList)
  //     let breadcrumb = this.breadcrumbList.slice(0, index + 1)
  //     console.log('breadcrumb', breadcrumb)
  //     let { organId } = this.breadcrumbList[index]
  //     uni.navigateTo({
  //       url: `./index?organId=${organId}&setting=${this.setting}&breadcrumb=${encodeURIComponent(
  //         JSON.stringify(breadcrumb)
  //       )}`
  //     })
  //   },
  //   openGroup(data) {
  //     let breadcrumb = this.breadcrumbList.concat(data)
  //     uni.navigateTo({
  //       url: `./index?organId=${data.organId}&setting=${this.setting}&breadcrumb=${encodeURIComponent(
  //         JSON.stringify(breadcrumb)
  //       )}&banzu=${data.organType}`
  //     })
  //   },
  //   toInviteMemberPage() {},
  //   toSettingPage() {
  //     uni.navigateTo({
  //       url: `./index?organId=${this.parentId}&setting=true&breadcrumb=${encodeURIComponent(
  //         JSON.stringify(this.breadcrumbList)
  //       )}&banzu=${this.organType}`
  //     })
  //   },
  //   finde() {
  //     uni.reLaunch({ url: '/pages/home/index?current=3' })
  //     return
  //     let pages = getCurrentPages() // 当前页面
  //     let beforePage = pages[pages.length - 2] // 上一页
  //     uni.navigateBack({
  //       delta: 1,
  //       success: () => {
  //         beforePage._vnode.componentOptions.children[0].componentOptions.children[0].componentInstance.getqueryOrganByCurrentUser()
  //         beforePage._vnode.componentOptions.children[0].componentOptions.children[0].componentInstance.getCompanyInfo()
  //       }
  //     })
  //   },

  //   onPreviewMember(id) {
  //     uni.navigateTo({
  //       url: `/pages/common/preview/member-preview?accountId=${id}&organId=${this.parentId}`
  //     })
  //   }
  // }
}
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
  &.safe-area {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  .navbar-right-box {
    padding-right: 20rpx;
    display: flex;
    align-items: center;
    text {
      margin-right: 20rpx;
    }
    .u-icon {
      margin-left: 20rpx;
    }
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
        color: #ff6a00;
        background: #fff;
        border: 1rpx solid #ff6a00;
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
      .u-tag {
        margin-right: 20rpx;
        flex-shrink: 0;
      }
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
