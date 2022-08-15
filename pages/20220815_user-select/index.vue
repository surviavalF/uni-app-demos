<template>
  <view class="page main">
    <u-navbar is-back title="组织架构人员选择器" />
    <view class="pageData">
      <u-form :model="DataForm" ref="uForm" class="container__item">
        <u-form-item label="人员">
          <UserSelector
            v-model="userSelect2"
            :checked="DataForm.userList2"
            :appId="value"
            @confirm="userCheck2"
            :chooseAdminOpen="false"
            :chooseOpen="false"
          />
          <u-icon name="arrow-right" class="icon" />
        </u-form-item>
      </u-form>
    </view>
  </view>
</template>

<script>
import UserSelector from "./org-user-select";
export default {
  onLoad() {},
  onShow() {},
  components: {
    UserSelector
  },
  data() {
    return {
      DataForm
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.main {
  background: #f6f6f6;
}
</style>
