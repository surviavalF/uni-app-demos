<template>
  <view class="page main">
    <u-navbar is-back title="组织架构人员选择器" />
    <view class="pageData">
      <u-form :model="DataForm" ref="uForm" class="container__item">
        <u-form-item label="人员">
          <OrgUserSelect v-model="userSelect" />
          <u-icon name="arrow-right" class="icon" />
        </u-form-item>
      </u-form>
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
        userList: []
      },
      userSelect: false
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
