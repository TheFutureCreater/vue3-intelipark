<template>
  <section class="cloud-bed">
    <div class="cloud-box" ref="cloudContent">
      <span
        v-for="(item, index) in dataList"
        :key="index"
        @click="getDataInfo(item)"
        :style="{ color: 'skyblue' }"
        ref="tagContent"
      >
        {{ item.name }}
      </span>
    </div>
  </section>
  <div></div>
</template>
<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
const timer = ref(50) // 球体转动速率
const radius = ref(0) // 词云球体面积大小
const dtr = ref(Math.PI / 180) //鼠标滑过球体转动速度
const active = ref(false) // 默认加载是否开启转动
const lasta = ref(0.2) // 上下转动
const lastb = ref(0.5) // 左右转动
const distr = ref(true)
const tspeed = ref(0) // 鼠标移动上去时球体转动
const mouseX = ref(0)
const mouseY = ref(0)
const tagAttrList = ref([])
const tagContent = ref([])
const cloudContent = ref()
const sinA = ref(0)
const cosA = ref(0)
const sinB = ref(0)
const cosB = ref(0)
const sinC = ref(0)
const cosC = ref(0)
const dataList = ref([
  {
    name: '沪AH7515',
    value: '1'
  },
  {
    name: '沪AGM7185',
    value: '8'
  },
  {
    name: '沪ATM9302',
    value: '9'
  },
  {
    name: '沪ADL4305',
    value: '3'
  },
  {
    name: '沪AFP5839',
    value: '6'
  },
  {
    name: '沪APL8431',
    value: '10'
  },
  {
    name: '沪AOL0923',
    value: '2'
  },
  {
    name: '沪ARN7915',
    value: '5'
  },
  {
    name: '沪ARN7915',
    value: '7'
  }
])
onMounted(() => {
  radius.value = cloudContent.value.offsetWidth / 2
  initWordCloud()
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

const initWordCloud = () => {
  // cloudContent.value = document.querySelector('.cloud-box')
  // tagContent.value = cloudContent.value.getElementsByTagName('span')
  for (let i = 0; i < tagContent.value.length; i++) {
    let tagObj = {}
    tagObj.offsetWidth = tagContent.value[i].offsetWidth
    tagObj.offsetHeight = tagContent.value[i].offsetHeight
    tagAttrList.value.push(tagObj)
  }
  sineCosine(0, 0, 0)
  positionAll()
  cloudContent.value.onmouseover = () => {
    active.value = false
  }
  cloudContent.value.onmouseout = () => {
    active.value = false
  }
  cloudContent.value.onmousemove = (ev) => {
    let oEvent = window.event || ev
    mouseX.value = oEvent.clientX - (cloudContent.value.offsetLeft + cloudContent.value.offsetWidth / 2)
    mouseY.value = oEvent.clientY - (cloudContent.value.offsetTop + cloudContent.value.offsetHeight / 2)
    mouseX.value /= 5
    mouseY.value /= 5
  }
  setInterval(update, timer)
}

const update = () => {
  let angleBasicA
  let angleBasicB
  if (active.value) {
    angleBasicA = (-Math.min(Math.max(-mouseY.value, -200), 200) / radius.value) * tspeed.value
    angleBasicB = (Math.min(Math.max(-mouseX.value, -200), 200) / radius.value) * tspeed.value
  } else {
    angleBasicA = lasta.value * 0.98
    angleBasicB = lastb.value * 0.98
  }
  //默认转动是后是否需要停下
  // lasta=a;
  // lastb=b;
  // if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01)
  // {
  // return;
  // }
  sineCosine(angleBasicA, angleBasicB, 0)
  tagAttrList.value.forEach((el) => {
    let rx1 = el.cx
    let ry1 = el.cy * cosA.value + el.cz * -sinA.value
    let rz1 = el.cy * sinA.value + el.cz * cosA.value
    let rx2 = rx1 * cosB.value + rz1 * sinB.value
    let ry2 = ry1
    let rz2 = rx1 * -sinB.value + rz1 * cosB.value
    let rx3 = rx2 * cosC.value + ry2 * -sinC.value
    let ry3 = rx2 * sinC.value + ry2 * cosC.value
    let rz3 = rz2
    el.cx = rx3
    el.cy = ry3
    el.cz = rz3
    let per = 350 / (350 + rz3)
    el.x = rx3 * per - 2
    el.y = ry3 * per
    el.scale = per
    el.alpha = per
    el.alpha = (el.alpha - 0.6) * (10 / 6)
  })
  // for (let j = 0; j < tagAttrList.value.length; j++) {
  //   let rx1 = tagAttrList.value[j].cx
  //   let ry1 = tagAttrList.value[j].cy * cosA.value + tagAttrList.value[j].cz * -sinA.value
  //   let rz1 = tagAttrList.value[j].cy * sinA.value + tagAttrList.value[j].cz * cosA.value
  //   let rx2 = rx1 * cosB.value + rz1 * sinB.value
  //   let ry2 = ry1
  //   let rz2 = rx1 * -sinB.value + rz1 * cosB.value
  //   let rx3 = rx2 * cosC.value + ry2 * -sinC.value
  //   let ry3 = rx2 * sinC.value + ry2 * cosC.value
  //   let rz3 = rz2
  //   tagAttrList.value[j].cx = rx3
  //   tagAttrList.value[j].cy = ry3
  //   tagAttrList.value[j].cz = rz3
  //   let per = 350 / (350 + rz3)
  //   tagAttrList.value[j].x = rx3 * per - 2
  //   tagAttrList.value[j].y = ry3 * per
  //   tagAttrList.value[j].scale = per
  //   tagAttrList.value[j].alpha = per
  //   tagAttrList.value[j].alpha = (tagAttrList.value[j].alpha - 0.6) * (10 / 6)
  // }
  doPosition()
  depthSort()
}
const getDataInfo = (item) => {
  console.log(item, 'item')
}

const doPosition = () => {
  let len = cloudContent.value.offsetWidth / 2
  let height = cloudContent.value.offsetHeight / 2

  // tagAttrList.value.forEach((el, i) => {
  //   tagContent.value[i].style.left = el.cx + len - el.offsetWidth / 2 + 'px'
  //   tagContent.value[i].style.top = el.cy + height - el.offsetHeight / 2 + 'px'
  //   //   tagContent[i].style.fontSize = Math.ceil(12 *   tagAttrList[i].scale/2) + 8 + 'px';
  //   //   tagContent[i].style.fontSize = Math.ceil((12 *   tagAttrList[i].scale) / 2) + 10 + 'px'
  //   tagContent.value[i].style.filter = 'alpha(opacity=' + 100 * el.alpha + ')'
  //   tagContent.value[i].style.opacity = el.alpha + 0.2
  // })
  for (let i = 0; i < tagAttrList.value.length; i++) {
    tagContent.value[i].style.left =
      tagAttrList.value[i].cx + len - tagAttrList.value[i].offsetWidth / 2 + 'px'
    tagContent.value[i].style.top =
      tagAttrList.value[i].cy + height - tagAttrList.value[i].offsetHeight / 2 + 'px'
    //   tagContent[i].style.fontSize = Math.ceil(12 *   tagAttrList[i].scale/2) + 8 + 'px';
    //   tagContent[i].style.fontSize = Math.ceil((12 *   tagAttrList[i].scale) / 2) + 10 + 'px'
    tagContent.value[i].style.filter = 'alpha(opacity=' + 100 * tagAttrList.value[i].alpha + ')'
    tagContent.value[i].style.opacity = tagAttrList.value[i].alpha + 0.2
  }
}

const depthSort = () => {
  let aTmp = []
  tagContent.value.forEach((el) => {
    aTmp.push(el)
  })
  // for (let i = 0; i < tagContent.value.length; i++) {
  //   aTmp.push(tagContent.value[i])
  // }
  aTmp.sort((item1, item2) => item2.cz - item1.cz)
  for (let i = 0; i < aTmp.length; i++) {
    aTmp[i].style.zIndex = i
  }
}

const positionAll = () => {
  let phi = 0
  let theta = 0
  let max = tagAttrList.value.length
  let aTmp = []
  let oFragment = document.createDocumentFragment()
  //随机排序
  for (let i = 0; i < tagContent.value.length; i++) {
    aTmp.push(tagContent[i])
  }
  aTmp.sort(() => {
    return Math.random() < 0.5 ? 1 : -1
  })
  for (let i = 0; i < aTmp.length; i++) {
    oFragment.appendChild(aTmp[i])
  }
  cloudContent.value.appendChild(oFragment)
  for (let i = 1; i < max + 1; i++) {
    if (distr.value) {
      phi = Math.acos(-1 + (2 * i - 1) / max)
      theta = Math.sqrt(max * Math.PI) * phi
    } else {
      phi = Math.random() * Math.PI
      theta = Math.random() * (2 * Math.PI)
    }
    //坐标变换
    tagAttrList.value[i - 1].cx = radius.value * Math.cos(theta) * Math.sin(phi)
    tagAttrList.value[i - 1].cy = radius.value * Math.sin(theta) * Math.sin(phi)
    tagAttrList.value[i - 1].cz = radius.value * Math.cos(phi)
    tagContent.value[i - 1].style.left =
      tagAttrList.value[i - 1].cx +
      cloudContent.value.offsetWidth / 2 -
      tagAttrList.value[i - 1].offsetWidth / 2 +
      'px'
    tagContent.value[i - 1].style.top =
      tagAttrList.value[i - 1].cy +
      cloudContent.value.offsetHeight / 2 -
      tagAttrList.value[i - 1].offsetHeight / 2 +
      'px'
  }
}

const sineCosine = (a, b, c) => {
  sinA.value = Math.sin(a * dtr.value)
  cosA.value = Math.cos(a * dtr.value)
  sinB.value = Math.sin(b * dtr.value)
  cosB.value = Math.cos(b * dtr.value)
  sinC.value = Math.sin(c * dtr.value)
  cosC.value = Math.cos(c * dtr.value)
}
</script>
<style scoped>
.cloud-bed {
  width: 100%;
  height: 100%;
  /* margin: auto; */
}
.cloud-box {
  position: relative;
  /* margin: 20px auto 0px; */
  width: 100%;
  height: 100%;
  background: #00000000;
}
.cloud-box span {
  position: absolute;
  padding: 3px 6px;
  top: 0px;
  font-weight: bold;
  text-decoration: none;
  left: 0px;
  cursor: pointer;
  /* background-image: linear-gradient(to bottom, red, #fff); */
  background-clip: text;
  color: transparent;
  width: 200px;
  height: 50px;
  /* border-radius: 50%; */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  /* line-height: 50px;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis; */
}
</style>
