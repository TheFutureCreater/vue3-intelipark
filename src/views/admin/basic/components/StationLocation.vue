<script setup>
const getLocationAndAdress = (info) => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: ` 获取到经纬度：${info.lng}, ${info.lat} <br /> 详细地址为：${info.address}`,
    type: 'info',
    plain: true
  })
}
</script>

<template>
  <div class="station-location">
    <LocationBox @get-location="getLocationAndAdress" />
  </div>
</template>

<style lang="scss" scoped>
.station-location {
  width: 100%;
  height: 100%;
}
</style>
