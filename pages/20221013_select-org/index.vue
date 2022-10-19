<template>
  <view class="page main">
    <u-navbar is-back title="树结构选择器(新)" />
    <view class="controlGroup">
      <p>
        是否开启输入框<u-switch v-model="inputOpen"></u-switch>
        <u-button v-if="!inputOpen" type="primary" @click="openSelectOrg">
          打开弹窗
        </u-button>
      </p>
      <p>
        <view>是否开启选择<u-switch v-model="openCheck"></u-switch></view>
        <view>是否是多选<u-switch v-model="multiple"></u-switch></view>
      </p>
      <p>
        多选情况下是否关联（父子关联关系）<u-switch
          v-model="checkStrictly"
        ></u-switch>
      </p>
      <p>
        单选情况下是否可以取消勾选<u-switch v-model="uncheckThe"></u-switch>
      </p>
      <p>某个节点是否可选<u-switch v-model="itSelfCheckOpen"></u-switch></p>
      <p v-if="!itSelfCheckOpen">
        节点id<u-input v-model="itselfID" :border="true"></u-input>
      </p>
    </view>
    <view class="pageData">
      <u-form :model="DataForm" ref="uForm" class="container__item">
        <u-form-item label="请选择">
          <SelectOrg
            v-model="selectOrg"
            :inputOpen="inputOpen"
            :openCheck="openCheck"
            :multiple="multiple"
            :checkStrictly="checkStrictly"
            :uncheckThe="uncheckThe"
            :itSelfCheckOpen="itSelfCheckOpen"
            :itselfID="itselfID"
            :props="props"
            :checked="DataForm.orgCheckedList"
            @confirm="confirms"
          />
          <u-icon name="arrow-right" class="icon" />
        </u-form-item>
      </u-form>
      <text>
        已选部门
        {{ DataForm.orgCheckedList }}
      </text>
    </view>
  </view>
</template>

<script>
import SelectOrg from "./select-org";
export default {
  onLoad() {},
  onShow() {},
  components: {
    SelectOrg
  },
  data() {
    return {
      DataForm: {
        orgCheckedList: []
      },
      selectOrg: false,
      inputOpen: true, //是否开启输入框
      openCheck: true, //是否开启选择
      multiple: true, //是否是多选
      checkStrictly: false, //多选情况下是否关联（父子关联关系）
      uncheckThe: false, //单选情况下是否可以取消勾选
      itSelfCheckOpen: true, //自己是否可选
      itselfID: "", //不可选节点的id
      props: {
        //主要字段名称
        dataName: "organName", //当前部门名字字段
        children: "children", //当前部门的子部门的数组字段名称
        dataId: "organId",
        parentId: "parentId", //父级节点id
        parentIds: "parentIds" //全部父级节点id Array
      }
    };
  },
  methods: {
    //确定
    confirms(val, type) {
      console.log("val", val);
      console.log("type", type);
      if (type == "finish") {
        this.DataForm.orgCheckedList = val;
        this.selectOrg = false;
      }
    },
    openSelectOrg() {
      this.selectOrg = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  overflow: auto;
  .controlGroup {
    padding: 30rpx;
    p {
      display: flex;
      align-items: center;
      padding: 10rpx 0;
      view {
        display: flex;
        align-items: center;
      }
      .u-btn {
        flex: 1;
      }
    }
  }
  .pageData {
    margin: 20rpx;
    padding: 20rpx;
    background: #fff;

    text {
      padding-top: 40rpx;
    }
  }
}
</style>
