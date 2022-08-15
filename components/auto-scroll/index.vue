<template>
  <view class="uniareascroll" id="mysrcoll">
    <view class="scrollNav" id="scrollNav">
      <view
        class="windowTitle"
        :style="'height:' + CustomBar + 'px;background-color:' + backgroundColor + ';'"
        v-if="showNav"
      ></view>
      <view class="navData"><slot name="scrollTop"></slot></view>
    </view>
    <view class="scroll-container">
      <scroll-view
        id="uniareascrollscroll"
        class="scroll-view"
        :scroll-y="scrollY"
        :scroll-x="scrollX"
        :upper-threshold="upperThreshold"
        :lower-threshold="lowerThreshold"
        :scroll-top="scrollTop"
        :scroll-left="scrollLeft"
        :scroll-into-view="scrollIntoView"
        :scroll-with-animation="scrollWithAnimation"
        @scrolltoupper="scrolltoupper"
        @scrolltolower="scrolltolower"
        @scroll="scroll"
        :enable-back-to-top="enableBackToTop"
        :show-scrollbar="showScrollbar"
        :refresher-enabled="refresherEnabled"
        :refresher-threshold="refresherThreshold"
        @refresherpulling="refresherpulling"
        @refresherrefresh="refresherrefresh"
        @refresherrestore="refresherrestore"
        @refresherabort="refresherabort"
      >
        <slot></slot>
        <view class="loading" v-show="showLoad">
          <view class="loadtext" v-show="beginChange && list.length > 0"><slot name="loading">加载中...</slot></view>
          <view class="loadtext" v-show="(!beginChange && !listIsChange) || list.length < 1"
            ><slot name="loadend">已经到底了~</slot></view
          >
        </view>
      </scroll-view>
    </view>
    <view class="scrollBar"><slot name="scrollBar"></slot></view>
  </view>
</template>

<script>
/**
 * 自适应scroll-view来源于https://ext.dcloud.net.cn/plugin?id=4121
 * 原组件自适应的关键是纵向时开始height=0,若是横向时开始width=0，然后通过节点信息来决定宽度和高度，支持所有布局
 * 不过上面有个缺点就是因为要计算，所以明显加载延迟感觉！！！
 * 后来看https://ext.dcloud.net.cn/plugin?id=324学到更简单没延迟的自适应方案，新方案思路：
 * 1. 滚动scroll-view的父容器仍然是自适应外围空间，不过最后要加上相对定位！！！
 * 2. 滚动scroll-view要绝对定位，top和botto均为0，从而限制在父容器中，并且不影响父容器适应外围空间
 * 不用等渲染再计算尺寸，也不用担心外围空间变化时再重新计算
 * 最后想说，学会这种方法后，该组件封装就没什么意义了，因为封装不封装，滚动区域都很容易自适应，而且封装后scroll-into-view支持范围变小
 */

//以下函数来自于uView-UI2.0版，在此感谢
// 添加单位，如果有%，rpx，px,em,vw,vh,vmax,vmin等单位结尾或者值为auto，直接返回，否则加上px单位结尾
function padUnit(value = 'auto', unit = 'px') {
  value = String(value)
  // 用uView内置验证规则中的number判断是否为数值
  if (value == 0) return value //0不用再加单位
  return /^[\+-]?(\d+\.?\d*|\.\d+|\d\.\d+e\+\d+)$/.test(value) ? `${value}${unit}` : value
}
/**
 * 判断是否为空
 */
function empty(value) {
  switch (typeof value) {
    case 'undefined':
      return true
    case 'string':
      if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
      break
    case 'boolean':
      if (!value) return true
      break
    case 'number':
      if (value === 0 || isNaN(value)) return true
      break
    case 'object':
      if (value === null || value.length === 0) return true
      for (const i in value) {
        return false
      }
      return true
  }
  return false
}
export default {
  props: {
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    upperThreshold: {
      type: Number,
      default: 50
    },
    lowerThreshold: {
      type: Number,
      default: 50
    },
    scrollTop: {
      type: Number,
      default: 0
    },
    scrollLeft: {
      type: Number,
      default: 0
    },
    scrollIntoView: {
      type: String,
      default: ''
    },
    enableBackToTop: {
      type: Boolean,
      default: false
    },
    refresherEnabled: {
      type: Boolean,
      default: false
    },
    refresherThreshold: {
      type: Number,
      default: 45
    },
    scrollWithAnimation: {
      type: Boolean,
      default: false
    },
    showScrollbar: {
      type: Boolean,
      default: false
    },

    tabbar_h: {
      type: Number,
      default: 0
    },
    back: {
      type: Boolean,
      default: false
    },
    showNav: {
      type: Boolean,
      default: false
    },

    backgroundColor: {
      type: String,
      default: ''
    },
    showLoad: {
      //是否显示加载更多
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    loadTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      scorll: 1, //状态，暂时无用
      StatusBar: 0, //顶部系统栏高度一般小程序20px
      CustomBar: 0, //系统小程序退出按钮下位置
      Custom: {},
      showLoading: false,
      httpPage: 1, //用来发请求的page
      nowPage: 1, //未请求的页码
      pageChange: true, //判断页面是否有下页
      listIsChange: true, //内容是否改变
      beginChange: false //触发下拉请求
    }
  },
  methods: {
    getScroll() {
      uni.getSystemInfo({
        success: e => {
          // #ifndef MP
          this.StatusBar = e.statusBarHeight
          if (e.platform == 'android') {
            this.CustomBar = e.statusBarHeight + 50
          } else {
            this.CustomBar = e.statusBarHeight + 45
          }
          // #endif
          // #ifdef MP-WEIXIN
          this.StatusBar = e.statusBarHeight
          let custom = wx.getMenuButtonBoundingClientRect()
          this.Custom = custom
          this.CustomBar = custom.bottom + custom.top - e.statusBarHeight
          // #endif
          // #ifdef MP-ALIPAY
          this.StatusBar = e.statusBarHeight
          this.CustomBar = e.statusBarHeight + e.titleBarHeight
          // #endif
          //可用区域总高度
          this.scenH = e.windowHeight
          //可用区域总宽度
          this.scenW = e.windowWidth
        }
      })
    },
    scroll(e) {
      this.$emit('scroll', e)
    },
    scrolltoupper(e) {
      this.$emit('scrolltoupper', e)
    },
    scrolltolower(e) {
      if (this.showLoad) {
        this.beginChange = true
        setTimeout(() => {
          this.httpPage = this.nowPage + 1
          this.$emit('scrolltolower', { httpPage: this.httpPage, nowPage: this.nowPage, change: this.pageChange })
          this.pageChange = false
          this.listIsChange = false
        }, this.loadTime)
      } else this.$emit('scrolltolower', e)
    },
    refresherpulling(e) {
      //自定义下拉刷新控件被下拉
      this.$emit('refresherpulling', e)
    },
    refresherrefresh(e) {
      //自定义下拉刷新被触发
      this.$emit('refresherrefresh', e)
    },
    refresherrestore(e) {
      //自定义下拉刷新被复位
      this.$emit('refresherrestore', e)
    },
    refresherabort(e) {
      //自定义下拉刷新被中止
      this.$emit('refresherabort', e)
    }
  },
  watch: {
    list(newVal, oldVal) {
      this.beginChange = false //改变结束
      if (newVal.length > 0) {
        this.nowPage = this.httpPage
        this.pageChange = true
      } else {
        this.pageChange = false
      }
      if (newVal == oldVal) {
        //判断是否真的内容变化了
        this.listIsChange = false //内容没改变返回false
      } else {
        this.listIsChange = true
      }
      console.log('listNum', newVal, this.pageChange, this.nowPage)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getScroll()
    })
  }
}
</script>

<style lang="scss" scoped>
.uniareascroll {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  //scroll-view自适应核心就是容器相对定位适应外围容器，而滚动是绝对定位，通过top和bottom限定在容器中
  .scroll-container {
    width: 100%;
    flex: 1;
    position: relative;
    .scroll-view {
      position: absolute;
      top: 0;
      bottom: 0;
    }
    //scroll-view自适应核心就是容器相对定位适应外围容器，而滚动是绝对定位，通过top和bottom限定在容器中
    .loading {
      padding: 0.2em 0 0.5em 0;
      text-align: center;
    }
  }
}
</style>
