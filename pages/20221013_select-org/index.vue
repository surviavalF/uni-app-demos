<template>
  <view class="page main">
    <u-navbar is-back title="树结构选择器(新)" />
    <view class="pageData">
      <u-form :model="DataForm" ref="uForm" class="container__item">
        <u-form-item label="请选择">
          <SelectOrg v-model="selectOrg" @confirm="confirms" />
          <u-icon name="arrow-right" class="icon" />
        </u-form-item>
      </u-form>
      <text>
        已选部门{{ returnData ? "对象数组" : "id数组" }}
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
      returnData: false
    };
  },
  methods: {
    //确定
    confirms(val) {
      console.log("val", val);
      this.DataForm.userCheckedList = val;
      this.selectOrg = false;
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
