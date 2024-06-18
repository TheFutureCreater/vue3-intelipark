<script setup>
import { ref, onMounted } from 'vue'
// import { getUserList } from '@/api/userinfo'
import { useScreenStore } from '@/stores'

const screenStore = useScreenStore()
const records = ref()
const record = ref([])
const cellWidth = ref(0)
const cellHeight = ref(0)
const cellSize = ref(0)
const cellCount = ref(10)
const radius = ref(0.0)
const theta = ref(0.0)
const selectedIndex = ref(0)
// const list = ref([])

onMounted(async () => {
  // console.log(record.value)
  dataInit()
  initShell()
  await refresh_list()
})

// watch(
//   () => rout,
//   () => refresh_list()
// )

const refresh_list = async () => {
  // console.log(daysStore.preOneWeek, daysStore.today)
  // const rs = await getUserList(
  //   daysStore.days == 0 ? daysStore.preOneWeek : daysStore.preOneMonth,
  //   daysStore.today
  // )
  await screenStore.refresh_userList()
  console.log(screenStore.userList)
  // console.log(rs.data.data)
  // list.value = rs.data.data.list
  selectedIndex.value = 0
  rotateShell()
}

const dataInit = () => {
  cellHeight.value = records.value.offsetHeight
  cellWidth.value = records.value.offsetWidth
  cellSize.value = cellHeight.value
  radius.value = Math.round(cellSize.value / 4 / Math.tan(Math.PI / cellCount.value))
  theta.value = 360 / cellCount.value
}

const rotateShell = () => {
  let angle = theta.value * selectedIndex.value * -1
  records.value.style.transform = 'translateZ(' + -radius.value + 'px) ' + 'rotateX(' + -angle + 'deg)'
  let cellIndex =
    selectedIndex.value < 0
      ? cellCount.value - ((selectedIndex.value * -1) % cellCount.value)
      : selectedIndex.value % cellCount.value
  record.value.forEach((element, index) => {
    if (cellIndex === index) {
      element.classList.add('selected')
    } else {
      element.classList.remove('selected')
    }
  })
}

const add = () => {
  selectedIndex.value++
  rotateShell()
  // initShell()
}
const sub = () => {
  selectedIndex.value--
  rotateShell()
}

const initShell = () => {
  record.value.forEach((el, i) => {
    let cellAngle = theta.value * i
    el.style.transform = 'rotateX(' + -cellAngle + 'deg) translateZ(' + radius.value + 'px)'
  })

  rotateShell()
}

const fontColor = (index) => {
  if (index <= 2) return 'red'
  else if (index <= 6) return 'blue'
  else return 'green'
}
</script>

<template>
  <div class="userList">
    <button class="add" @click="sub"></button>
    <button class="sub" @click="add"></button>
    <div class="column" style="overflow: hidden">
      <div class="records" ref="records">
        <div v-for="index in cellCount" class="record" ref="record" :key="index">
          <div v-if="index - 1 < screenStore.userList.length" class="cell">
            <span :style="{ color: fontColor(index - 1) }">TOP{{ index }}</span>
            <hr />
            用户名：{{ screenStore.userList[index - 1].username }}
            <br />
            <font v-if="screenStore.userList[index - 1].vip === 0">普通用户</font>
            <!-- {{ screenStore.userList[index - 1].vip }} -->
            <font v-else style="color: gold">VIP用户</font>
            <br />
            车牌号：{{ screenStore.userList[index - 1].licencePlate }}
            <br />
            消费：{{ screenStore.userList[index - 1].costSum }}
          </div>
          <div v-else>
            <div class="none">虚位以待</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.userList {
  .add {
    right: 10%;
    top: 50%;
    position: absolute;
    z-index: 10;
    width: 40px;
    height: 40px;
    transform: translate(0, -100%);
    border-radius: 12px;
    border: 0;
    // background-color: #ffffff5f;
    background: #ffffff5f no-repeat center url(/src/assets/screen/up_arrowhead.svg);
    // background: #ffffff5f no-repeat center url(/src/assets/screen/up_arrowhead.svg);
    transition: 0.3s;
    &:hover {
      background-color: #ffffff8f;
    }
  }
  .sub {
    position: absolute;
    z-index: 10;
    right: 10%;
    top: 50%;
    width: 40px;
    height: 40px;
    transform: translate(0, 100%);
    border-radius: 12px;
    border: 0;
    // background-color: #ffffff5f;
    background: #ffffff5f no-repeat center url(/src/assets/screen/down_arrowhead.svg);
    transition: 0.3s;
    &:hover {
      background-color: #ffffff8f;
    }
  }
  pointer-events: all;
  position: relative;
  width: 100%;
  height: 100%;
  // bottom: 5%;
  // background: linear-gradient(#043753, rgba(0, 0, 0, 0));
  // left: 50%;
  // transform: translate(-50%, 0);
  .column {
    flex-direction: column;
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 300px;

    .records {
      position: absolute;
      width: 80%;
      // left: 0;
      height: 100%;
      border-radius: 24px;
      transform-style: preserve-3d;
      transition: 1s;
      .record {
        position: absolute;
        width: 80%;
        height: 160px;
        left: 10%;
        top: 40%;
        // right: inherit;
        transform: translate(0, -50%);
        background-color: #76b3d6;
        border: 2px solid white;
        border-radius: 12px;
        opacity: 0.7;
        .cell {
          font-size: large;
          color: #fff;
          text-align: center;
          font-weight: 400;
          span {
            display: block;
            width: 100%;
            text-align: center;
            font-size: 24px;
          }
        }
        .none {
          color: white;
          font-weight: 700;
          font-size: 24px;
          text-align: center;
          justify-content: center;
          margin-top: 10%;
        }
      }
      .selected {
        border-color: gold;
        opacity: 1;
      }
    }
  }
}
</style>
