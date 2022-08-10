export function scanCode(url) {
  uni.scanCode({
    success: res => {
      let { result } = res
      console.log("result", result);
    }
  })
}