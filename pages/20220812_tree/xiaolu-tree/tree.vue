<template>
  <view>
    <view class="titles">
      <text>{{ title || '部门选择' }}</text>
    </view>
    <view class="header">
      <view class="title">
        <scroll-view scroll-x style="width: 100%; white-space: nowrap" :scroll-left="scrollLeft">
          <view v-for="(item, index) in tree_stack" class="inline-item" :key="index">
            <view class="inline-item" v-if="index == 0" @click="backTree(item, -1)">
              <text v-if="index == tree_stack.length - 1 && !isre" class="none">全部</text>
              <text v-else class="active">全部</text>
            </view>

            <view class="inline-item" @click="backTree(item, index)" v-if="index != 0">
              <i v-if="index != 0" class="iconfont icon-z043 iconclass" />
              <text v-if="index == tree_stack.length - 1" class="none inline-item">
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
    <view>
      <view class="container-list">
        <view class="common" v-for="(item, index) in tree" @click="toChildren(item)" :key="index">
          <label class="content">
            <view
              class="checkbox"
              v-if="
                isCheck &&
                props.multiple &&
                !(groupNoCheck && item.organType == 'TEAM') &&
                !(itselfNoCheck && item[checkDataId] == itselfID)
              "
              @click.stop="checkboxChange(item, index, item.bx, item.qx)"
            >
              <span
                v-if="
                  newCheckList.findIndex(e => {
                    return item[checkDataId] == e[checkDataId]
                  }) > -1 && !item.qx
                "
              >
                <i v-if="item.bx && props.multiple" class="iconfont icon-banxuanzhongshousuo1-shi icons" />
                <i v-else class="iconfont icon-xuanzhong txt icon-selected" />
              </span>
              <i v-else-if="props.multiple && item.qx" class="iconfont icon-xuanzhong txt icon-selected" />
              <i v-else-if="item.bx && props.multiple" class="iconfont icon-banxuanzhongshousuo1-shi icons" />
              <i style="color: #b8b8b8" v-else class="iconfont icon-weixuanzhong txt" />
            </view>
            <view
              class="checkbox"
              v-else-if="
                isCheck &&
                !props.multiple &&
                props.nodes &&
                item.user &&
                !(groupNoCheck && item.organType == 'TEAM') &&
                !(itselfNoCheck && item[checkDataId] == itselfID)
              "
              @click.stop="checkbox(item, index)"
            >
              <i
                v-if="newCheckList.length > 0 && item[checkDataId] == newCheckList[0][checkDataId]"
                class="txt iconfont icon-selected"
              />
              <i style="color: #b8b8b8" v-else class="txt iconfont icon-weixuanzhong1" />
            </view>
            <view
              class="checkbox"
              v-else-if="
                isCheck &&
                !props.multiple &&
                !props.nodes &&
                !(groupNoCheck && item.organType == 'TEAM') &&
                !(itselfNoCheck && item[checkDataId] == itselfID)
              "
              @click.stop="checkbox(item, index)"
            >
              <i
                v-if="newCheckList.length > 0 && item[checkDataId] == newCheckList[0][checkDataId]"
                class="txt iconfont icon-selected"
              />
              <i style="color: #b8b8b8" v-else class="txt iconfont icon-weixuanzhong1" />
            </view>

            <view class="checkbox" v-else>
              <view class="borderAdd"> </view>
            </view>

            <view v-if="item.user" @click.stop="checkboxChange(item, index, item.bx, item.qx)"
              ><slot v-bind:item="item"></slot
            ></view>
            <slot v-else v-bind:item="item"></slot>
            <view class="right"
              ><i
                v-if="!item.user && !lodash.isEmpty(item.children) && !(itselfNoCheck && item[checkDataId] == itselfID)"
                class="iconfont icon-z043"
              ></i
            ></view>
          </label>
        </view>
      </view>
    </view>
    <view class="btn box_sizing">
      <u-button type="primary" @click="backConfirm">确认</u-button>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'tree',
  props: {
    title: String,
    trees: {
      type: Array,
      default: () => {
        return []
      }
    },
    //是否开启选中
    isCheck: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    parent: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    max: {
      type: Number,
      default: () => {
        return '-1'
      }
    },
    checkList: {
      type: Array,
      default: () => []
    },
    parentList: {
      type: Array,
      default: () => []
    },
    searchIf: {
      type: Boolean,
      default: () => true
    },
    props: {
      type: Object,
      default: () => {
        return {
          label: 'organName',
          children: 'children',
          multiple: false,
          checkStrictly: false //不关联
        }
      }
    },
    groupNoCheck: {
      type: Boolean,
      default: () => false
    },
    itselfNoCheck: {
      type: Boolean,
      default: () => false
    },
    itselfID: {
      type: String,
      default: () => ''
    },
    checkDataId: {
      type: String,
      default: () => 'organId'
    },
    uncheckThe: {
      type: Boolean,
      default: () => false
    } //单选情况下是否可以取消勾选
  },
  data() {
    return {
      lodash: _,
      isre: false,
      tree: this.trees,
      newNum: 0,
      oldNum: 0,
      allData: this.trees,
      tree_stack: [1],
      parent_data: this.parentList || [], //选择父辈
      searchResult: [],
      tochild: false,
      newCheckList: this.checkList,
      scrollLeft: 999,
      nodePathArray: []
    }
  },

  mounted() {
    if (this.props.multiple && this.props.checkStrictly) {
      if (this.newCheckList.length != 0) {
        this.checkAllChoose()
        return
      }
      for (let i = 0; i < this.tree.length; i++) {
        this.$set(this.tree[i], 'bx', 0)
        this.$set(this.tree[i], 'qx', 0)
      }
    }
    if (!this.props.multiple && this.newCheckList.length > 0) {
      this.getNodeRoute(this.allData, this.newCheckList[0][this.checkDataId])
      let arr = this.nodePathArray.reverse()
      if (arr.length == 0) return
      this.tree_stack = this.tree_stack.concat(arr)
      this.tree = this.tree_stack[this.tree_stack.length - 1].children
    }
  },
  methods: {
    //多选
    async checkboxChange(item, index, bx, qx) {
      console.log(this.checkList)
      var that = this
      if (!this.props.multiple) return
      let findIdex = that.newCheckList.findIndex(e => {
        return item[this.checkDataId] == e[this.checkDataId]
      })
      if (findIdex > -1) {
        //反选
        if (that.props.checkStrictly) {
          //关联子级
          if (item.user) {
            //用户
            that.newCheckList.splice(findIdex, 1)
          } else {
            //非用户，取消所有下一级
            that.getIdBydelete(item.children)
          }
        } else {
          that.newCheckList.splice(findIdex, 1)
        }
      } else {
        //选中
        if (!item.user && that.props.checkStrictly) {
          //选中下一级
          if (qx || bx) {
            //取消下级
            await that.getIdBydelete(item.children)
            item.qx = 0
            item.bx = 0
          } else {
            item.qx = 1
            item.bx = 0
            await that.chooseChild(item.children, item[this.checkDataId])
          }
          that.$emit('sendValue', that.newCheckList)
          that.$forceUpdate()
          return
        }
        // if(item.user&&this.props.checkStrictly) this.getNodeRoute(this.allData,item.id);
        that.newCheckList.push({ ...item })
      }
      that.$emit('sendValue', that.newCheckList)
    },
    // 取消下一级的选中
    getIdBydelete(arr) {
      arr.forEach(e => {
        if (e.user) {
          for (var i = 0; i < this.newCheckList.length; i++) {
            if (e[this.checkDataId] == this.newCheckList[i][this.checkDataId]) {
              this.newCheckList.splice(i, 1)
              break
            }
          }
        }
        if (!e.user) {
          this.getIdBydelete(e.children)
        }
      })
    },
    //取消父级
    // deleteParent(id){
    // 	for(var i = 0; i<this.parent_data.length;i++){
    // 		if(id == this.parent_data[i].id) {
    // 			this.parent_data.splice(i,1)
    // 			break;
    // 		}
    // 	}
    // },

    // 关联下一级,选中
    chooseChild(arr, pid) {
      let that = this
      for (var i = 0, len = arr.length; i < len; i++) {
        let item = arr[i]
        if (item.user) {
          that.newCheckList.push({ ...item, tree_stackId: pid })
        }
        if (!item.user) {
          this.chooseChild(item.children, item[this.checkDataId])
        }
      }
    },

    // (tree为目标树，targetId为目标节点id)
    getNodeRoute(tree, targetId) {
      for (let index = 0; index < tree.length; index++) {
        if (tree[index].children) {
          let endRecursiveLoop = this.getNodeRoute(tree[index].children, targetId)
          if (endRecursiveLoop) {
            this.nodePathArray.push(tree[index])
            return true
          }
        }
        if (tree[index][this.checkDataId] === targetId) {
          return true
        }
      }
    },

    //单选
    checkbox(item, index) {
      var that = this
      if (!that.uncheckThe) {
        that.newCheckList = []
        that.newCheckList.push(that.tree[index])
      } else {
        if (that.newCheckList.length > 0 && that.newCheckList[0].organId == that.tree[index].organId) {
          that.newCheckList = []
        } else {
          that.newCheckList = []
          that.newCheckList.push(that.tree[index])
        }
      }
      that.$emit('sendValue', that.newCheckList)
    },
    //到下一级
    toChildren(item) {
      if (!(this.itselfNoCheck && item[this.checkDataId] == this.itselfID)) {
        console.log(this.tree_stack)
        if (item.user) return
        var that = this
        this.tochild = true
        let children = that.props.children
        if (!item.user && item[children] && item[children].length > 0) {
          that.tree = item[children]
          if (that.tree_stack[0][this.checkDataId] == item[this.checkDataId]) {
          } else {
            that.tree_stack.push(item)
          }
        }
        this.$nextTick(() => {
          this.scrollLeft += 200
        })
        if (this.props.checkStrictly) this.checkAllChoose()
        this.$forceUpdate()
      }
    },

    checkAllChoose() {
      let o = false,
        t = true
      this.tree.forEach((e, i) => {
        if (!e.user) {
          e.qx = o
          e.bx = o
          let num2 = this.computAllNumber(e.children)
          // console.log(this.newNum,this.oldNum)
          if (this.newNum != 0 && this.oldNum != 0) {
            if (this.newNum == this.oldNum) {
              e.qx = t
              e.bx = o
            } else {
              e.qx = o
              e.bx = t
            }
          }
          if (this.newNum != 0 && this.oldNum == 0) {
            this.$set(this.tree[i], 'bx', o)
            this.$set(this.tree[i], 'qx', o)
          }
          this.$forceUpdate()
          this.newNum = 0
          this.oldNum = 0
        }
      })
    },

    computAllNumber(arr) {
      for (let j = 0; j < arr.length; j++) {
        var e = arr[j]
        if (arr[j].user) {
          this.newNum++
        }
        this.checkSum(e[this.checkDataId])
        if (!e.user) {
          this.computAllNumber(e.children)
        }
      }
    },

    checkSum(id) {
      for (let i = 0; i < this.newCheckList.length; i++) {
        if (id == this.newCheckList[i][this.checkDataId]) {
          this.oldNum++
          break
        }
      }
    },

    //返回其它层
    backTree(item, index) {
      let that = this,
        max = 66666
      if (index == -1) {
        that.tree = that.allData
        that.tree_stack.splice(1, max)
        that.isre = false
      } else if (index == -2) {
        that.tree = that.searchResult
        that.tree_stack.splice(1, max)
      } else {
        if (that.tree_stack.length - index > 2) {
          that.tree_stack.forEach((item, i) => {
            if (i > index) {
              that.tree_stack.splice(i, max)
            }
          })
        } else if (index == that.tree_stack.length - 1) {
        } else {
          that.tree_stack.splice(that.tree_stack.length - 1, 1)
        }
        that.tree = item[that.props.children]
      }
      if (this.props.checkStrictly) this.checkAllChoose()
      this.$forceUpdate()
    },
    backConfirm() {
      this.$emit('sendValue', this.newCheckList, 'back')
    }
  }
}
</script>
<style lang="scss" scoped>
@import './css/style.scss';
@import url('./css/icon.css');
.btn {
  padding: 20px 5%;
}
</style>
