<template>
  <view class="page preview">
    <u-navbar
      is-back
      title="个人头像"
      :background="{ background: '#000000' }"
      back-icon-color="#fff"
      title-color="#fff"
      :back-text-style="{ color: '#ffffff' }"
    >
      <view slot="right" class="nav-right" @click="show = true">
        <u-icon name="more-dot-fill" size="45" color="#fff"></u-icon>
      </view>
    </u-navbar>
    <u-loading
      class="loading"
      v-if="loading"
      mode="flower"
      size="52"
    ></u-loading>
    <view><u-avatar :src="userIcon"></u-avatar></view>

    <u-action-sheet
      :list="list"
      v-model="show"
      @click="chooseAct"
    ></u-action-sheet>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      loading: false,
      show: false,
      list: [
        { text: "拍照" },
        { text: "从手机相册选择" },
        { text: "保存图片" }
      ],
      userIcon: ""
    };
  },
  onLoad(options) {
    this.userIcon = this.authUserIcon || "";
    // 监听从裁剪页发布的事件，获得裁剪结果
    uni.$on("uAvatarCropper", async (path) => {
      try {
        // this.loading = true
        // let { data } = await uploadImage(
        //   {
        //     oldUrl: this.userIcon
        //   },
        //   [{ uri: path }]
        // )
        // this.loading = false
        this.setUserIcon(path);
        this.userIcon = path;
      } catch (error) {
        this.loading = false;
      }
    });
  },
  computed: {
    ...mapState("auth", {
      authUserIcon: (state) => state.userIcon || ""
    })
  },
  methods: {
    ...mapMutations({
      setUserIcon: "auth/setUserIcon"
    }),
    chooseAct(index) {
      let sourceType = index == 0 ? ["camera"] : ["album"];
      if (index === 2) {
        uni.saveImageToPhotosAlbum({
          filePath: this.userIcon,
          success: function () {
            uni.showToast({
              title: "保存成功",
              icon: "none"
            });
          }
        });
      } else {
        uni.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType,
          success: ({ tempFilePaths, tempFiles }) => {
            uni.navigateTo({
              url: "./index",
              success(res) {
                res.eventChannel.emit("avatar_cropper_url", tempFilePaths[0]);
              }
            });
          },
          fail: (error) => {}
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
  .nav-right {
    padding-right: 30rpx;
  }
  .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }

  image {
    width: 100vw;
    display: block;
  }
  /deep/ .u-avatar {
    width: 100vw !important;
    height: 100vw !important;
    flex: 0 0 100% !important;
    background: #000 !important;
  }
}
</style>
