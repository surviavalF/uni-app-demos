<template>
  <view class="content">
    <!-- html -->
    <html2canvas ref="html2canvas" :domId="domId" @renderFinish="renderFinish">
      <view id="detailMiddle"> 这dom里放你想要的东西 </view>
    </html2canvas>
    <view @click="createImg()">生成图片</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      domId: "",
    };
  },
  methods: {
    //点击保存按钮
    createImg() {
      this.domId = "#detailMiddle";
    },
    /**
     * 渲染完毕接收图片
     * @param {String} filePath
     */
    renderFinish(filePath) {
      this.domId = ""; //因为该组件是由domId的值变化而触发的，所以清空domId可以多次生成图片
      this.filePath = filePath;
      console.log("filePath", filePath);
      uni.saveImageToPhotosAlbum({
        filePath: filePath,
        success: function () {
          uni.showToast({ icon: "success", title: "保存成功", duration: 1500 });
        },
      });
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
