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
            <text> 树结构选择器 </text>
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
                  <!-- 单选框 -->
                  <view
                    v-if="!multiple"
                    @click.stop="checkbox(item, index)"
                    class="checkbox"
                  >
                    <template
                      v-if="
                        !(!itSelfCheckOpen && item[props.dataId] == itselfID) &&
                        openCheck
                      "
                    >
                      <i
                        v-if="
                          newCheckList.length > 0 &&
                          newCheckList.findIndex((e) => {
                            return item[props.dataId] == e[props.dataId];
                          }) > -1
                        "
                        class="txt iconfont icon-selected"
                      />
                      <i
                        style="color: #b8b8b8"
                        v-else
                        class="txt iconfont icon-weixuanzhong1"
                      />
                    </template>
                    <template v-else>
                      <i
                        v-if="
                          newCheckList.length > 0 &&
                          newCheckList.findIndex((e) => {
                            return item[props.dataId] == e[props.dataId];
                          }) > -1
                        "
                        style="color: #b8b8b8"
                        class="txt iconfont icon-xuanzhong4"
                      />
                      <i
                        v-else
                        style="color: #b8b8b8"
                        class="txt iconfont icon-xingzhuang6kaobei3-copy-copy"
                      />
                    </template>
                  </view>
                  <!-- 多选框 -->
                  <view
                    v-if="multiple"
                    @click.stop="checkMultipleBox(item, index)"
                    class="checkbox"
                  >
                    <template
                      v-if="
                        !(!itSelfCheckOpen && item[props.dataId] == itselfID) &&
                        openCheck
                      "
                    >
                      <i
                        v-if="judgeChildren(item) == 'notAll'"
                        class="iconfont icon-banxuanzhongshousuo1-shi txt icons"
                      />
                      <i
                        v-else-if="
                          newCheckList.length > 0 &&
                          newCheckList.findIndex((e) => {
                            return item[props.dataId] == e[props.dataId];
                          }) > -1
                        "
                        class="iconfont icon-xuanzhong txt icon-selected"
                      />
                      <i
                        style="color: #b8b8b8"
                        v-else
                        class="txt iconfont icon-weixuanzhong"
                      />
                    </template>
                    <template v-else>
                      <i
                        v-if="judgeChildren(item) == 'notAll'"
                        style="color: #b8b8b8"
                        class="txt iconfont icon-banxuanzhongshousuo1-shi"
                      />
                      <i
                        v-else-if="
                          newCheckList.length > 0 &&
                          newCheckList.findIndex((e) => {
                            return item[props.dataId] == e[props.dataId];
                          }) > -1
                        "
                        style="color: #b8b8b8"
                        class="txt iconfont icon-xuanzhong"
                      />
                      <view v-else class="squareIcon" />
                    </template>
                  </view>
                </template>
                <view class="content-item">
                  {{ item[props.dataName] }}
                </view>
              </view>
              <view class="right"
                ><i
                  v-if="
                    !isEmpty(item.children) &&
                    !(!itSelfCheckOpen && item[props.dataId] == itselfID)
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
      default: () => false
    },
    multiple: {
      //是否是多选
      type: Boolean,
      default: () => {
        return false;
      }
    },
    checkStrictly: {
      //多选情况下是否关联（父子关联关系）
      type: Boolean,
      default: () => {
        return false;
      }
    },
    checked: {
      //是已经选择的部门
      type: Array,
      default: () => []
    },
    inputOpen: {
      //是否开启输入框
      type: Boolean,
      default: () => true
    },
    itSelfCheckOpen: {
      //自己是否可选
      type: Boolean,
      default: () => true
    },
    itselfID: {
      //不可选节点的id
      type: String,
      default: () => ""
    },
    uncheckThe: {
      //单选情况下是否可以取消勾选
      type: Boolean,
      default: () => false
    },
    openCheck: {
      //开启选择
      type: Boolean,
      default: () => true
    },
    props: {
      type: Object,
      default: () => {
        return {
          dataName: "organName", //当前部门名字字段
          children: "children", //当前部门的子部门的数组字段名称
          dataId: "organId",
          parentId: "parentId", //父级节点id
          parentIds: "parentIds" //全部父级节点id Array
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
          self.setOrgNameList();
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
      if (!this.multiple) {
        this.checkStrictly = false;
      }

      this.tree = treeDataList;
      this.allData = treeDataList;
      this.newCheckList = _.cloneDeep(this.checked);
    },
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓单选操作↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓//
    checkbox(item, index) {
      let self = this;
      if (!self.uncheckThe) {
        self.newCheckList = [];
        self.newCheckList.push(self.tree[index]);
      } else {
        if (
          self.newCheckList.length > 0 &&
          self.newCheckList[0].organId == self.tree[index].organId
        ) {
          self.newCheckList = [];
        } else {
          self.newCheckList = [];
          self.newCheckList.push(self.tree[index]);
        }
      }
      self.$emit("confirm", self.newCheckList, "change");
    },
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑单选操作↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑//
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓多选操作↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓//
    async checkMultipleBox(item, index) {
      let self = this;
      //查看当前点击的节点是否被选中过
      let findIdex = self.newCheckList.findIndex((e) => {
        return item[self.props.dataId] == e[self.props.dataId];
      });
      if (findIdex > -1) {
        //取消选中 当前点击的节点
        self.newCheckList.splice(findIdex, 1);
        //判断是否有父子关联关系
        if (self.checkStrictly) {
          await self.deleteChild(item[self.props.children]);
          if (item[self.props.parentId] != -1) {
            self.deleteParent(item);
          }
          self.$emit("confirm", self.newCheckList, "change");
          self.$forceUpdate();
          return;
        }
      } else {
        //选中 当前点击的节点
        self.newCheckList.push({ ...item });
        //判断是否有父子关联关系
        if (self.checkStrictly) {
          await self.chooseChild(item[self.props.children]);
          if (item[self.props.parentId] != -1) {
            self.chooseParent(item);
          }
          self.$emit("confirm", self.newCheckList, "change");
          self.$forceUpdate();
          return;
        }
      }
      self.$emit("confirm", self.newCheckList, "change");
    },
    // 选中下一级
    chooseChild(arr) {
      let self = this;
      if (arr && arr.length > 0) {
        arr.forEach((item) => {
          let findIdex = self.newCheckList.findIndex((e) => {
            return item[self.props.dataId] == e[self.props.dataId];
          });
          if (findIdex == -1) {
            self.newCheckList.push({ ...item });
          }
          if (
            item[self.props.children] &&
            item[self.props.children].length > 0
          ) {
            self.chooseChild(item[self.props.children]);
          }
        });
      }
    },
    // 取消选中的下一级
    deleteChild(arr) {
      let self = this;
      if (arr && arr.length > 0) {
        arr.forEach((e) => {
          for (var i = 0; i < self.newCheckList.length; i++) {
            if (
              e[self.props.dataId] == self.newCheckList[i][self.props.dataId]
            ) {
              self.newCheckList.splice(i, 1);
              break;
            }
          }
          self.deleteChild(e[self.props.children]);
        });
      }
    },
    //选中父级
    chooseParent(item) {
      var self = this;
      setData(this.allData);
      function setData(oItem) {
        //如果节点的parentId是-1证明的顶级节点，直接进下一次递归
        if (oItem[self.props.parentId] == -1) {
          setData(oItem[self.props.children]);
        } else {
          oItem.forEach((tItem) => {
            //检查当前节点（tItem）的id是否在点击节点（item）的parentIds数组里
            let duplicateIndex = item[self.props.parentIds].indexOf(
              tItem[self.props.dataId]
            );
            if (duplicateIndex != -1) {
              //检查当前节点（tItem）是否被选中过
              let findIdex = self.newCheckList.findIndex((e) => {
                return tItem[self.props.dataId] == e[self.props.dataId];
              });
              //如果当前节点（tItem）没被选中过，并且他的只有一个子节点，或者当前节点（tItem）的子节点已经全被勾选，就选中该节点
              if (
                (findIdex == -1 &&
                  tItem[self.props.children] &&
                  tItem[self.props.children].length == 1) ||
                self.judgeChildren(tItem) == "all"
              ) {
                self.newCheckList.push({ ...tItem });
              }
              setData(tItem[self.props.children]);
            } else {
              self.$forceUpdate();
            }
          });
        }
      }
    },
    //取消选中的父级
    deleteParent(item) {
      let self = this;
      item[self.props.parentIds].forEach((oItem) => {
        let findIdex = self.newCheckList.findIndex((e) => {
          return oItem == e[self.props.dataId];
        });
        //如果已选中的列表中有当前节点的父级就删除这个父级节点
        if (findIdex > -1) {
          self.newCheckList.splice(findIdex, 1);
        }
      });
    },
    //判断当前节点的子集是否全选
    judgeChildren(item) {
      if (!this.checkStrictly) {
        return "none";
      }
      let self = this;
      let stack = [];
      let arr = [];
      stack = _.cloneDeep(item.children);
      if (!stack) {
        return "all";
      }
      //广度遍历
      while (stack.length) {
        let oItem = stack.shift();
        let children = oItem.children;
        arr.push(oItem);
        if (children) {
          for (let i = 0; i < children.length; i++) {
            stack.push(children[i]);
          }
        }
      }
      let childrenLength = arr.length;
      let index = 0;
      arr.forEach((oItem) => {
        let findIdex = self.newCheckList.findIndex((e) => {
          return oItem[self.props.dataId] == e[self.props.dataId];
        });
        if (findIdex != -1) {
          index++;
        }
      });
      if (childrenLength == index) {
        //当前节点的子集是全被选中的
        console.log("all");
        return "all";
      } else if (childrenLength > index && index != 0) {
        //当前节点的子集是部分被选中
        console.log("notAll");
        return "notAll";
      } else {
        //当前节点的子集全没有被选中
        console.log("none");
        return "none";
      }
    },
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑多选操作↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑//
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓顶部面包屑操作↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓//
    //到下一级
    toChildren(item) {
      let self = this;
      let children = self.props.children;
      self.tree = item[children];
      if (self.tree_stack[0][self.props.dataId] == item[self.props.dataId]) {
        console.log("？");
      } else {
        self.tree_stack.push(item);
      }
      self.$nextTick(() => {
        self.scrollLeft += 200;
      });
      self.$forceUpdate();
    },
    //返回其它层级
    backTree(item, index) {
      let self = this,
        max = 66666;
      if (index == -1) {
        self.tree = self.allData;
        self.tree_stack.splice(1, max);
      } else {
        if (self.tree_stack.length - index > 2) {
          self.tree_stack.forEach((item, i) => {
            if (i > index) {
              self.tree_stack.splice(i, max);
            }
          });
        } else if (index == self.tree_stack.length - 1) {
          console.log("点击的是已在层级");
        } else {
          self.tree_stack.splice(self.tree_stack.length - 1, 1);
        }
        self.tree = item[self.props.children];
      }
      this.$forceUpdate();
    },
    //↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑顶部面包屑操作↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑//
    //点击确定
    backConfirm() {
      this.$emit("input", false);
      this.$emit("confirm", this.newCheckList, "finish");
    },
    //输入框内容返显
    setOrgNameList() {
      let orgNameList = "";
      this.checked.forEach((eItem) => {
        console.log("eItem", eItem);
        if (orgNameList == "") {
          orgNameList = eItem[this.props.dataName];
        } else {
          orgNameList = orgNameList + "," + eItem[this.props.dataName];
        }
      });
      console.log("orgNameList", orgNameList);
      this.tips = orgNameList;
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

              .icon-selected {
                color: $uni-color-primary !important;
                font-size: 34rpx !important;
              }

              .icons {
                color: $uni-color-primary !important;
                font-size: 34rpx !important;
              }

              .txt {
                font-size: 34rpx;
                line-height: 44rpx;
                width: 100%;
                height: 100%;
                display: flex;
              }
              .squareIcon {
                border-radius: 6rpx;
                width: 34rpx;
                height: 34rpx;
                background-color: #b8b8b8;
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
