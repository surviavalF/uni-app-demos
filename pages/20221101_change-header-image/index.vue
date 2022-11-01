<template>
  <view class="page">
    <u-navbar is-back title="头像选择器" :custom-back="backToPage" />
    <view>
      <u-cell-item
        title="头像"
        class="profile-menu__image-item"
        @click="chooseAvatar(userIcon)"
      >
        <view class="avatar">
          <u-avatar v-if="!!userIcon" :src="userIcon" mode="circle"></u-avatar>
          <u-avatar
            v-else
            text="头"
            bg-color="#ff6a00"
            mode="circle"
          ></u-avatar>
        </view>
      </u-cell-item>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  onLoad() {},
  onShow() {
    this.userIcon = this.authUserIcon || "";
  },
  computed: {
    ...mapState("auth", {
      authUserIcon: (state) => state.userIcon || ""
    })
  },
  data() {
    return {
      userIcon: ""
    };
  },
  methods: {
    ...mapMutations({
      clear: "auth/clear"
    }),
    backToPage() {
      this.clear();
      uni.navigateBack();
    },
    chooseAvatar() {
      // 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
      uni.navigateTo({
        url: `/pages/20221101_change-header-image/avatar-cropper/preview`
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.profile-menu__image-item {
  .avatar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
