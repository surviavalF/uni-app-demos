<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  }
};
</script>

<style lang="scss">
/* #ifdef H5 || APP-VUE */
@import "uview-ui/index.scss";

font-face {
  font-family: "Alibaba-PuHuiTi-R";
  src: url("static/fonts/Alibaba-PuHuiTi-Regular.woff2") format("woff2");
}

html,
body {
  font-family: Alibaba-PuHuiTi-R, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  user-select: none;
}

*,
*::before,
*::after {
  box-sizing: border-box !important;
}

/* #endif */
</style>
