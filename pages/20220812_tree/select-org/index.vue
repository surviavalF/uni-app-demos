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
    </u-popup>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    value: {
      //控制人员选择popup显隐
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.popupShow = val;

      if (val) {
      } else {
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
  onLoad() {},
  onShow() {},
  components: {},
  data() {
    return {
      popupShow: false, //弹窗显隐
      tips: "未选择"
    };
  },
  methods: {
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
</style>
