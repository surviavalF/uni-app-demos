<template>
  <view class="org-select">
    <u-input
      maxlength="99999999"
      type="textarea"
      :value="tips"
      disabled
      @click="onOpen"
      :class="inputOpen ? '' : 'btnCheck'"
    />
    <u-popup v-model="popupShow" height="80%" @close="onClose" closeable>
      <view class="poupIn">
        <view class="header">
          <view class="titleText">
            <text> 人员选择 </text>
          </view>
          <view class="title">
            <!-- 顶部面包屑 -->
            <scroll-view
              scroll-x
              style="width: 100%; white-space: nowrap"
              :scroll-left="scrollLeft"
            >
              <view
                v-for="(item, index) in tree_stack"
                class="inline-item"
                :key="'tree_stack_' + index"
              >
                <view
                  class="inline-item"
                  v-if="index == 0"
                  @click="backTree(item, -1)"
                >
                  <text v-if="index == tree_stack.length - 1" class="none"
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
                    {{ item[props.dataName] }}
                  </text>
                  <text v-else class="active">
                    {{ item[props.dataName] }}
                  </text>
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
        <scroll-view scroll-y class="container-list">
          <view
            class="common"
            v-for="(item, index) in tree"
            @click="toChildren(item)"
            :key="'tree_' + index"
          >
            <label class="content">
              <view class="left">
                <template>
                  <view class="checkbox"> </view>
                </template>
                <view class="content-item">
                  {{ item[props.dataName] }}
                </view>
              </view>
              <view class="right"
                ><i
                  v-if="
                    !item.user &&
                    !isEmpty(item.children) &&
                    !(!itSelfCheckOpen && item[checkDataId] == itselfID)
                  "
                  class="iconfont icon-z043"
                ></i
              ></view>
            </label>
          </view>
        </scroll-view>

        <view class="box_sizing">
          <u-button type="primary" @click="backConfirm"> 确认</u-button>
        </view>
      </view>
    </u-popup>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import _ from "lodash";
import treeDataList from "../data/treeData.js";
export default {
  props: {
    value: {
      //控制人员选择popup显隐
      type: Boolean,
      default: false
    },
    checked: {
      //是已经选择的部门
      type: Array
    },
    inputOpen: {
      //是否开启输入框
      type: Boolean,
      default: true
    },
    itSelfCheckOpen: {
      //自己是否可选
      type: Boolean,
      default: () => true
    },
    props: {
      type: Object,
      default: () => {
        return {
          dataName: "organName", //当前部门名字字段
          children: "children", //当前部门的子部门的数组字段名称
          dataId: "organId"
        };
      }
    }
  },
  watch: {
    value(val) {
      this.popupShow = val;

      if (val) {
        this.computedData();
      } else {
        this.tree_stack = [1];
      }
    },
    checked: {
      handler(val) {
        const self = this;
        if (!_.isEmpty(self.checked)) {
          self.setUserNameList();
        } else {
          self.tips = "未选择";
        }
      },
      deep: true,
      imediate: true
    }
  },
  onLoad() {},
  onShow() {},
  components: {},
  data() {
    return {
      isEmpty: _.isEmpty,
      popupShow: false, //弹窗显隐
      tips: "未选择",

      tree_stack: [1],
      scrollLeft: 999,
      tree: [],
      allData: [], //记录原始数据
      newCheckList: [] //已选择的列表
    };
  },
  methods: {
    //打开组件时数据处理
    async computedData() {
      this.tree = treeDataList;
      this.allData = treeDataList;
      this.newCheckList = _.cloneDeep(this.checked);
    },
    //到下一级
    toChildren(item) {
      var that = this;
      let children = that.props.children;
      that.tree = item[children];
      if (that.tree_stack[0][this.props.dataId] == item[this.props.dataId]) {
        console.log("？");
      } else {
        that.tree_stack.push(item);
      }
      this.$nextTick(() => {
        this.scrollLeft += 200;
      });
      this.$forceUpdate();
    },
    //返回其它层级
    backTree(item, index) {
      let that = this,
        max = 66666;
      if (index == -1) {
        that.tree = that.allData;
        that.tree_stack.splice(1, max);
      } else {
        if (that.tree_stack.length - index > 2) {
          that.tree_stack.forEach((item, i) => {
            if (i > index) {
              that.tree_stack.splice(i, max);
            }
          });
        } else if (index == that.tree_stack.length - 1) {
          console.log("点击的是已在层级");
        } else {
          that.tree_stack.splice(that.tree_stack.length - 1, 1);
        }
        that.tree = item[that.props.children];
      }
      this.$forceUpdate();
    },
    //点击确定
    backConfirm() {
      this.$emit("input", false);
      // if (this.returnData) {
      //   let newList = [];
      //   this.newCheckList.forEach((eItem) => {
      //     this.allUserList.forEach((uItem) => {
      //       if (uItem.accountId == eItem) {
      //         newList.push(uItem);
      //       }
      //     });
      //   });
      //   this.$emit("confirm", newList);
      // } else {
      //   this.$emit("confirm", this.newCheckList);
      // }
    },
    //打开弹窗
    onOpen() {
      this.$emit("input", true);
    },
    //关闭弹窗
    onClose() {
      this.$emit("input", false);
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("./css/icon.css");
.org-select {
  flex: 1;
  margin-right: 30rpx;
  .btnCheck {
    display: none;
  }
  /deep/ .u-input__textarea {
    min-height: auto !important;
  }
  .poupIn {
    position: relative;
    height: 100%;
    .header {
      width: 100%;
      top: 0;
      left: 0;
      position: absolute;
      background-color: #fff;
      z-index: 3;

      .titleText {
        text-align: left;
        padding: 20rpx 20rpx;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
        font-weight: bold;
        z-index: 20;
      }

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
        .inline-item {
          display: inline-block;
        }
        .active {
          color: $uni-color-primary !important;
        }
      }
    }

    .container-list {
      position: absolute;
      top: 200rpx;
      left: 0;
      width: 100%;
      height: 75%;
      .common {
        background-color: #fff;
        border-bottom: 1px solid $uni-bg-color-grey;
        padding: 20rpx 30rpx;

        .content {
          display: flex;
          align-items: center;
          min-height: 60rpx;
          width: 100%;
          position: relative;
          font-size: 32rpx;
          justify-content: space-between;
          .left {
            display: flex;
            align-items: center;
            position: relative;
            .checkbox {
              position: relative;
              height: 36rpx;
              margin-left: 10rpx;
              margin-right: 0px;
              width: 36rpx;

              .color {
                color: $uni-color-primary;
                background-color: $uni-color-primary;
              }

              .txt {
                font-size: 34rpx;
                line-height: 44rpx;
                width: 100%;
                height: 100%;
                display: flex;
              }
            }

            .content-item {
              display: flex;
              position: relative;
              align-items: center;
              overflow: hidden;
              white-space: normal;
              word-wrap: break-word;
              word-break: break-all;
              text-overflow: ellipsis;
            }
          }

          .right {
            color: #babdc3;
            font-size: 32rpx;
          }
        }
      }
    }

    .box_sizing {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      left: 0;
      padding-top: 20rpx;
      padding-left: 20rpx;
      padding-right: 20rpx;
      padding-bottom: 20rpx;
      background-color: #fff;
      width: 100%;

      z-index: 4;
      .sureBtn {
        color: #fff;
      }
    }
  }
}
</style>
