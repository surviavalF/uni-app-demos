<template>
  <view class="page main">
    <u-navbar is-back title="树结构选择器" />
    <view class="data">
      checkList {{ checkList }}

      <view class="bottom-btn">
        <u-button type="primary" ripple freeze @click="toChoose">展开</u-button>
      </view>
    </view>

    <view>
      <u-popup v-model="display" height="80%" @close="onClose" closeable>
        <XiaoluTree
          v-slot:default="{ item }"
          :checkList="checkList"
          v-if="tree.length > 0"
          :max="max"
          :props="prop"
          @sendValue="confirms"
          :parent="true"
          :isCheck="true"
          :trees="tree"
          :groupNoCheck="groupNoCheck"
          :itselfNoCheck="itselfNoCheck"
          :itselfID="itselfID"
        >
          <!-- 内容插槽 -->
          <view>
            <view class="content-item">
              <view
                class="word"
                :class="{
                  forbidden:
                    (groupNoCheck && item.organType == 'TEAM') ||
                    (itselfNoCheck && item.organId == itselfID)
                }"
                >{{ item.organName }}</view
              >
            </view>
          </view>
        </XiaoluTree>
      </u-popup>
    </view>
  </view>
</template>

<script>
import treeDataList from "./data/treeData.js";
import XiaoluTree from "./xiaolu-tree/tree.vue";
export default {
  onLoad() {
    this.tree = treeDataList;
  },
  onShow() {},
  components: {
    XiaoluTree
  },
  data() {
    return {
      tree: [],
      checkList: [],
      prop: {
        label: "organName",
        children: "children",
        //单选模式(任意一项)
        multiple: false,
        nodes: false
        //多选模式（关联下级）
        // 	multiple:true,
        // 	checkStrictly:true
        //多选模式（选择任意一项）
        //   multiple:true
      },
      max: 5,
      display: false,
      oneFormDataID: -1,
      groupNoCheck: true, //班组不可选
      itselfNoCheck: true, //自己不可选
      itselfID: "" //自己的ID
    };
  },
  methods: {
    //确定
    confirms(val, back) {
      if (back) {
        console.log("val[0]", val[0]);
        this.checkList = val;
        this.onClose();
      }
    },
    toChoose() {
      this.display = true;
    },
    onClose() {
      this.display = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
}
</style>
