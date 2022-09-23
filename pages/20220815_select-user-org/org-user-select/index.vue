<template>
  <view class="org-user-select">
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
        <scroll-view scroll-y class="container-list">
          <!-- 部门 -->
          <template v-show="!isEmpty(tree)">
            <view
              class="common"
              v-for="(item, index) in tree"
              :key="'tree_' + index"
            >
              <label @click="toChildren(item)" class="content branch">
                <view class="content-item">
                  {{ item[props.label] }}
                </view>
                <view class="right"><i class="iconfont icon-z043"></i></view>
              </label>
            </view>
          </template>

          <!-- 人员 -->
          <view class="userGroup" v-if="oldUserList && oldUserList.length > 0">
            <template>
              <view
                class="common"
                v-for="(userItem, userIndex) in oldUserList"
                :key="'user_' + userIndex"
              >
                <label @click="checkbox(userItem)" class="content">
                  <view
                    v-if="
                      (!chooseAdminOpen && userItem.isMain) ||
                      (!chooseSubOpen && userItem.isSub)
                    "
                    class="checkbox"
                  >
                    <view class="borderAdd"> </view>
                  </view>
                  <view v-else class="checkbox">
                    <i
                      v-if="
                        newCheckList.length > 0 &&
                        newCheckList.findIndex((e) => {
                          return userItem[props.userId] == e;
                        }) > -1
                      "
                      class="txt iconfont icon-selected"
                    />
                    <i
                      style="color: #b8b8b8"
                      v-else
                      class="txt iconfont icon-weixuanzhong1"
                    />
                  </view>
                  <view class="content-item">
                    <text v-if="userItem.isMain"
                      >{{ userItem.userName }} (主管理员)
                    </text>
                    <text v-else-if="userItem.isSub"
                      >{{ userItem.userName }} (子管理员)
                    </text>
                    <text v-else>
                      {{ userItem.userName }}
                    </text>
                  </view>
                </label>
              </view>
            </template>
          </view>

          <view v-else class="empty"> 当前层级下没有成员 </view>
        </scroll-view>
        <view class="btn box_sizing">
          <u-button type="primary" @click="backConfirm">
            <text v-if="showLimit">
              ({{
                max < 1 ? newCheckList.length : newCheckList.length + "/" + max
              }})
            </text>
            确认</u-button
          >
        </view>
      </view>
    </u-popup>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import treeDataList from "../data/treeData.js";
import userDataList from "../data/userData.js";
import _ from "lodash";
export default {
  props: {
    value: {
      //控制人员选择popup显隐
      type: Boolean,
      default: false
    },
    checked: {
      //是否已经选择人员
      type: Array
    },
    inputOpen: {
      //是否开启编辑
      type: Boolean,
      default: true
    },
    max: {
      //可选人数
      type: Number,
      default: -1
    },
    showLimit: {
      //是否显示已选择的人数
      type: Boolean,
      default: true
    },
    chooseAdminOpen: {
      //主管理员是否可选
      type: Boolean,
      default: true
    },
    chooseSubOpen: {
      //子管理员是否可选
      type: Boolean,
      default: true
    },
    returnData: {
      //返回数据为对象
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: "organName", //当前部门名字字段
          children: "children", //当前部门的子部门的数组字段名称
          checkDataId: "organId",
          userId: "accountId"
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
        this.oldUserList = [];
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
      oldUserList: [], //当前部门的人员列表
      newCheckList: [], //已选择的列表
      allUserList: [], //全部人员数据
      userNameList: ""
    };
  },
  methods: {
    //选择
    checkbox(item) {
      var that = this;
      if (!this.chooseAdminOpen && item.isMain) {
        return;
      }
      if (!this.chooseSubOpen && item.isSub) {
        return;
      }
      let findIdex = that.newCheckList.findIndex((e) => {
        return item[this.props.userId] == e;
      });
      if (findIdex > -1) {
        that.newCheckList.splice(findIdex, 1);
      } else {
        if (that.newCheckList.length == that.max && that.max > 0) {
          that.$refs.uToast.show({
            title: "已达可选人数上限"
          });
        } else {
          that.newCheckList.push(item[this.props.userId]);
        }
      }
    },
    //到下一级
    toChildren(item) {
      var that = this;
      let children = that.props.children;
      that.tree = item[children];
      that.oldUserList = item.userList;
      if (
        that.tree_stack[0][this.props.checkDataId] ==
        item[this.props.checkDataId]
      ) {
        console.log("");
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
        that.oldUserList = [];
        that.tree_stack.splice(1, max);
      } else {
        if (that.tree_stack.length - index > 2) {
          that.tree_stack.forEach((item, i) => {
            if (i > index) {
              that.tree_stack.splice(i, max);
            }
          });
        } else if (index == that.tree_stack.length - 1) {
          console.log("");
        } else {
          that.tree_stack.splice(that.tree_stack.length - 1, 1);
        }
        that.oldUserList = that.tree_stack[that.tree_stack.length - 1].userList;
        that.tree = item[that.props.children];
      }
      this.$forceUpdate();
    },
    //打开组件时数据处理
    async computedData(e = this.checked) {
      this.getAllUserList();
      this.tree = treeDataList;
      this.allData = treeDataList;
      this.newCheckList = _.cloneDeep(this.checked);
    },
    //获取无层级全部人员数据
    async getAllUserList() {
      this.allUserList = userDataList;
    },
    //打开弹窗
    onOpen() {
      this.$emit("input", true);
    },
    //关闭弹窗
    onClose() {
      this.$emit("input", false);
    },
    //点击确定
    backConfirm() {
      this.$emit("input", false);
      if (this.returnData) {
        let newList = [];
        this.newCheckList.forEach((eItem) => {
          this.allUserList.forEach((uItem) => {
            if (uItem.accountId == eItem) {
              newList.push(uItem);
            }
          });
        });
        this.$emit("confirm", newList);
      } else {
        this.$emit("confirm", this.newCheckList);
      }
    },
    async setUserNameList() {
      this.userNameList = "";
      if (this.allUserList.length == 0) {
        this.allUserList = userDataList;
      }

      this.checked.forEach((eItem) => {
        this.allUserList.forEach((uItem) => {
          console.log("eItem",eItem);
          console.log("uItem",uItem);
          if (uItem.accountId == eItem) {
            if (this.userNameList == "") {
              this.userNameList = uItem.userName;
            } else {
              this.userNameList = this.userNameList + "," + uItem.userName;
            }
          }
        });
      });
      console.log("this.userNameList", this.allUserList);
      console.log("this.userNameList", this.userNameList);
      this.tips = this.userNameList;
    }
  }
};
</script>
<style lang="scss" scoped>
@import url("./css/icon.css");
.flex_between_center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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

.checkBorder {
  border: 1px solid #ecdee4;
}

.poupIn {
  position: relative;
  height: 100%;
}

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
  }
}

.container-list {
  position: absolute;
  top: 180rpx;
  left: 0;
  width: 100%;
  height: 440px;

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

      .right {
        color: #babdc3;
        font-size: 32rpx;
      }
    }

    .branch {
      display: flex;
      justify-content: space-between;
    }
  }

  .userGroup {
    padding: 10rpx;
    background: #f7f7f7;
  }

  .empty {
    color: #999999;
    text-align: center;
    padding: 20rpx 0;
  }
}

.active {
  color: $uni-color-primary !important;
}

.none {
  color: #666666;
}

.icon-selected {
  color: $uni-color-primary !important;
  font-size: 34rpx !important;
}

.icons {
  color: $uni-color-primary !important;
  font-size: 34rpx !important;
}

.inline-item {
  display: inline-block;
}

.content-item {
  display: flex;
  position: relative;
  align-items: center;
}

.box_sizing {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.btn {
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

.borderAdd {
  border: 2rpx solid #eaeaea;
  border-radius: 25rpx;
  width: 36rpx;
  height: 36rpx;
  background-color: #eaeaea;
}
.org-user-select {
  flex: 1;
  .btnCheck {
    display: none;
  }
  /deep/ .u-input__textarea {
    min-height: auto !important;
  }
  margin-right: 30rpx;
}
</style>
