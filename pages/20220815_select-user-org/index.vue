<template>
  <view class="page main">
    <u-navbar is-back title="组织架构人员选择器" />
    <view class="pageData">
      <u-form :model="DataForm" ref="uForm" class="container__item">
        <u-form-item label="人员">
          <OrgUserSelect
            v-model="userSelect"
            :props="props"
            :max="max"
            :chooseAdminOpen="true"
            :chooseSubOpen="false"
            :checked="DataForm.userCheckedList"
            @confirm="confirms"
          />
          <u-icon name="arrow-right" class="icon" />
        </u-form-item>
      </u-form>
      <text> 已选人员id {{ DataForm.userCheckedList }} </text>
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
      max: 99
    };
  },
  methods: {
    //确定
    confirms(val) {
      console.log("val", val);
      this.DataForm.userCheckedList = val;
      this.userSelect = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
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
