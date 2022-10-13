<template>
  <view class="page main">
    <u-navbar is-back title="组织架构人员选择器" />
    <view class="controlGroup">
      <p>
        是否开启输入框<u-switch v-model="inputOpen"></u-switch>
        <u-button v-if="!inputOpen" type="primary" @click="openOrgUserSelect">
          打开弹窗
        </u-button>
      </p>
      <p>
        <view>主管理员是否可选<u-switch v-model="chooseAdmin"></u-switch></view>
        <view>子管理员是否可选<u-switch v-model="chooseSub"></u-switch></view>
      </p>
      <p>
        可选人数<u-input type="number" v-model="max" :border="true"></u-input>
      </p>
      <p>是否显示已选择的人数<u-switch v-model="showLimit"></u-switch></p>
      <p>返回数据为对象<u-switch v-model="returnData"></u-switch></p>
      <p>根节点人员是否可选<u-switch v-model="rootNodeOpen"></u-switch></p>
    </view>
    <view class="pageData">
      <u-form :model="DataForm" ref="uForm" class="container__item">
        <u-form-item label="人员">
          <OrgUserSelect
            v-model="userSelect"
            :props="props"
            :max="max"
            :inputOpen="inputOpen"
            :chooseAdminOpen="chooseAdmin"
            :chooseSubOpen="chooseSub"
            :showLimit="showLimit"
            :returnData="returnData"
            :rootNodeOpen="rootNodeOpen"
            :checked="DataForm.userCheckedList"
            @confirm="confirms"
          />
          <u-icon name="arrow-right" class="icon" />
        </u-form-item>
      </u-form>
      <text>
        已选人员{{ returnData ? "对象数组" : "id数组" }}
        {{ DataForm.userCheckedList }}
      </text>
    </view>
  </view>
</template>

<script>
import OrgUserSelect from "./org-user-select";
export default {
  onLoad() {},
  onShow() {},
  components: {
    OrgUserSelect
  },
  data() {
    return {
      DataForm: {
        userCheckedList: []
      },
      userSelect: false,
      props: {
        label: "organName", //当前部门名字的字段名称
        children: "children", //当前部门的子部门的字段名称
        checkDataId: "organId", //部门的唯一标识的字段名称
        userId: "accountId" //人员唯一标识的字段名称
      },
      max: 99,
      chooseAdmin: true, //主管理员是否可选
      chooseSub: false, //子管理员是否可选
      inputOpen: true, //是否开启编辑
      showLimit: true, //是否开启编辑
      returnData: false, //返回数据为对象
      rootNodeOpen: true //根节点人员是否可选
    };
  },
  methods: {
    //确定
    confirms(val) {
      console.log("val", val);
      this.DataForm.userCheckedList = val;
      this.userSelect = false;
    },
    openOrgUserSelect() {
      this.userSelect = true;
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
