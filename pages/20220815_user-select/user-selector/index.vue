<template>
  <view class="user-selector">
    <u-input :value="tips" disabled @click="onOpen" :class="inputOpen ? '' : 'btnCheck'" />
    <u-popup v-model="display" height="80%" @close="onClose" closeable>
      <view class="title">
        <text>{{ constant.PEOPLE_PICK }}</text>
      </view>
      <view class="search-bar">
        <u-search
          placeholder="姓名或手机号码"
          clearabled
          v-model="searchValue"
          @search="onSearch"
          @clear="onSearchClear"
        ></u-search>
      </view>
      <scroll-view scroll-y="true" class="scroll">
        <u-index-list :scrollTop="scrollTop" :sticky="false" :indexList="[]">
          <view v-for="(item, key) in dataList" :key="key">
            <u-index-anchor :index="key" use-slot>
              <text class="anchor-text">{{ key }}</text>
            </u-index-anchor>
            <uni-swipe-action>
              <uni-swipe-action-item
                :index="key + '-' + index"
                v-for="(cell, index) in item"
                :key="cell.accountId"
                disabled
              >
                <view class="list-cell" @click="onCheck(key, index, cell)">
                  <template v-if="cell.isMain">
                    <u-checkbox
                      :value="chooseAdminOpen ? true : !!cell.checked"
                      :disabled="chooseAdminOpen"
                      shape="circle"
                      wrap
                    >
                      <view class="avatar">
                        <u-avatar v-if="cell.userIcon" :src="cell.userIcon" size="mini"></u-avatar>
                        <u-avatar v-else :text="cell.userName" bg-color="#4986fb" size="mini"></u-avatar>
                      </view>
                      <view class="label">{{ cell.userName }} (主管理员)</view>
                    </u-checkbox>
                  </template>
                  <template v-else-if="cell.isSub">
                    <u-checkbox :value="!!cell.checked" :disabled="chooseOpen" shape="circle" wrap>
                      <view class="avatar">
                        <u-avatar v-if="cell.userIcon" :src="cell.userIcon" size="mini"></u-avatar>
                        <u-avatar v-else :text="cell.userName" bg-color="#4986fb" size="mini"></u-avatar>
                      </view>
                      <view class="label">{{ cell.userName }} (子管理员)</view>
                    </u-checkbox>
                  </template>
                  <template v-else>
                    <u-checkbox :value="!!cell.checked" shape="circle" wrap>
                      <view class="avatar">
                        <u-avatar v-if="cell.userIcon" :src="cell.userIcon" size="mini"></u-avatar>
                        <u-avatar v-else :text="cell.userName" bg-color="#4986fb" size="mini"></u-avatar>
                      </view>
                      <view class="label">{{ cell.userName }}</view>
                    </u-checkbox>
                  </template>
                </view>
              </uni-swipe-action-item>
            </uni-swipe-action>
          </view>
        </u-index-list>
      </scroll-view>
      <view class="pop-bottom">
        <view @click="checkedAll" v-if="limit > 1" class="check-all">
          {{ constant.CHECK_ALL }}
        </view>
        <u-button type="primary" ripple @click="onConfirm" :disabled="disabled"
          >{{ constant.CONFIRM }} <text v-if="showLimit">({{ checkedData.length }}/{{ limit }})</text></u-button
        >
      </view>
    </u-popup>
  </view>
</template>

<script>
import Emitter from '@/uview-ui/libs/util/emitter'
import { userMailList } from '@/api/dashboard'
import _ from 'lodash'
export default {
  mixins: [Emitter],

  props: {
    value: {
      //控制人员选择popup显隐
      type: Boolean,
      default: false
    },
    limit: {
      //最多选择人数
      type: Number,
      default: 99
    },
    checked: {
      //是否已经选择人员
      type: Array | String
    },
    appId: {
      //根据应用id来获取
      type: String,
      default: ''
    },
    chooseAdminOpen: {
      //主管理员子管理员是否默认选中 true为默认选中 false为默认未选中  当值为false时需要 chooseOpen也是false
      type: Boolean,
      default: true
    },
    chooseOpen: {
      //主管理员子管理员是否可选 true为不可选 false为可选
      type: Boolean,
      default: true
    },
    inputOpen: {
      //是否开启编辑
      type: Boolean,
      default: true
    },
    showLimit: {
      //是否显示已选择的人数
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      disabled: false,
      display: false,
      searchValue: '',
      checkAll: false,
      scrollTop: 0,
      dataList: {},
      originData: [],
      tips: '未选择',
      checkedData: []
    }
  },
  watch: {
    value(val) {
      this.display = val
      this.searchValue = ''

      if (val) this.computedData()
    },
    checked: {
      handler(val) {
        this.tips = this.checked && this.checked.length > 0 ? '已选择' : '未选择'
      },
      immediate: true
    },
    dataList: {
      deep: true,
      handler(val) {
        this.checkedData = _.flatten(Object.values(val)).filter(item => item.checked)
        this.disabled = this.checkedData.length > this.limit
      }
    }
  },

  methods: {
    checkedAll() {
      this.checkAll = !this.checkAll
      let data = _.flatten(Object.values(this.dataList)).map(item => {
        return {
          ...item,
          ...{ checked: this.checkAll }
        }
      })
      this.$nextTick(() => {
        this.dataList = _.groupBy(data, 'prefix')
      })
    },
    onCheck(key, index, e) {
      const { isMain, isSub, accountId } = e
      if (this.chooseAdminOpen && isMain) return
      if ((isMain && this.chooseOpen) || (isSub && this.chooseOpen)) {
        return
      }

      let { dataList } = this

      if (this.limit <= 1) {
        let data = _.flatten(Object.values(dataList)).map(item => {
          return {
            ...item,
            checked: item.accountId === accountId
          }
        })
        dataList = _.groupBy(data, 'prefix')
      } else {
        dataList[key][index].checked = !dataList[key][index].checked || false
      }

      this.dataList = _.cloneDeep(dataList)

      this.$forceUpdate()

      // if( this.limit <= 1) {
      //    this.dataList[key] = this.dataList[key].map(item,mIndex=> {
      //     mIndex !== index && (item.checked = false)
      //   })
      // }
    },
    onSearch(e) {
      let data = this.originData.filter(item => {
        if (item.userName.includes(e) || item.userMobilePhone.includes(e)) {
          return item
        }
        return
      })
      this.dataList = _.groupBy(data, 'prefix')
    },

    onSearchClear(e) {
      this.dataList = _.groupBy(this.originData, 'prefix')
    },

    async computedData(e = this.checked) {
      let { data } = await userMailList({ appId: this.appId })
      if (!_.isEmpty(e)) {
        data = data.map(item => {
          return {
            ...item,
            ...(e.includes(item.accountId) ? { checked: true } : '')
          }
        })
      }
      this.originData = data

      this.dataList = _.groupBy(data, 'prefix')
    },
    onOpen() {
      this.$emit('input', true)
    },
    onClose() {
      this.$emit('input', false)
    },
    onConfirm() {
      this.$emit('input', false)
      this.$emit('confirm', this.checkedData)
      this.dispatch('u-form-item', 'on-form-blur')
    }
  },

  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  }
}
</script>

<style lang="scss" scoped>
.user-selector {
  flex: 1;
  .btnCheck {
    display: none;
  }

  .search-bar {
    margin: 30rpx 0;
    padding: 0 20rpx;
  }
  .scroll {
    height: calc(70vh - 100rpx - 84px);
  }
  .pop-bottom {
    @include flex-box(row, space-between, center);
    padding: 20px 5%;
    .check-all {
      flex: 1;
      font-size: $uni-font-size-sm;
      color: $uni-color-primary;
    }
    .u-btn {
      flex: 1;
      margin: 0;
    }
  }
  &:last-child {
    margin-bottom: 300rpx;
  }

  .title {
    text-align: left;
    padding: 20rpx 20rpx;
    font-size: $uni-font-size-base;
    color: $uni-text-color;
    font-weight: bold;
  }
  .list-cell {
    @include flex-box(row, flex-start);
    width: 100%;
    padding: 40rpx 30rpx;
    overflow: hidden;
    font-size: $uni-font-size-sm;
    background-color: $uni-text-color-inverse;
    border-bottom: 1px solid $uni-bg-color-grey;

    /deep/ .u-checkbox {
      width: 100%;
      &__label {
        @include flex-box(row, flex-start);
        width: 100%;
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
  }
  /deep/ .u-avatar {
    margin: 0 30rpx;
  }
  .anchor-text {
    color: $uni-text-color-desc;
  }

  .bottom-bar {
    @include flex-box(row, space-between);
    position: fixed;
    height: 140rpx;
    width: 100%;
    bottom: 0;
    padding-left: 5%;
    padding-right: 5%;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    left: 0;
    z-index: 1;
    background: $uni-bg-color;
    box-shadow: 0px -1px 5px 0px rgba(0, 0, 0, 0.09);
    .bottom-button__confirm {
      padding: 0 30rpx;
    }
  }
}
</style>
