import { getChargeInfo } from '@/api/charge'
import { getEqStateByParkId, getEqUsingRate } from '@/api/equipments'
import { getUserList } from '@/api/userinfo'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getStatsByParkid } from '@/api/stats'
import { getIncomeInfo } from '@/api/income'
import { getConnectorStatusByStationId } from '@/api/station'

export const useScreenStore = defineStore('defSceenInfo', () => {
  //数据日期 （近7天 / 近30天）
  //0表示近7天，1表示近30天
  const days = ref(0)
  //delet
  const routes = useRoute()
  const detailDaysId = ref(0)
  const stationId = ref(0)
  const connectorStatus = ref({
    fastTotal: 0,
    slowTotal: 0
  })
  //delet
  const parkid = ref(routes.query.parkid)
  // const searchParkId = ref()
  const EqState = ref()
  const chargingOrderState = ref([])
  const userList = ref([])
  const chargingInfo = ref([])
  const eqUsingRate = ref(0.0)
  const today = ref('')
  const preOneWeek = ref('')
  const preSixMonth = ref('')
  const preOneMonth = ref('')
  const stats = ref()
  const incomeInfo = ref()
  const latestWeekInfo = ref({
    chargingRecordSum: 0, //充电次数
    electricitySum: 0, //充电量
    chargeHoursSum: 0, //充电时长
    chargingRecordCountArray: []
  })
  const latestMonthInfo = ref({
    chargingRecordSum: 0, //充电次数
    electricitySum: 0, //充电量
    chargeHoursSum: 0, //充电时长
    chargingRecordCountArray: []
  })

  const rate = computed(() => eqUsingRate.value / 100.0)

  const dateInit = () => {
    let date = new Date()
    today.value =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
      '-' +
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    let preweek = new Date()
    preweek.setDate(date.getDate() - 6)
    preOneWeek.value =
      preweek.getFullYear() +
      '-' +
      (preweek.getMonth() + 1 < 10 ? '0' + (preweek.getMonth() + 1) : preweek.getMonth() + 1) +
      '-' +
      (preweek.getDate() < 10 ? '0' + preweek.getDate() : preweek.getDate())
    let premonth = new Date()
    premonth.setMonth(date.getMonth() - 1)
    preOneMonth.value =
      premonth.getFullYear() +
      '-' +
      (premonth.getMonth() + 1 < 10 ? '0' + (premonth.getMonth() + 1) : premonth.getMonth() + 1) +
      '-' +
      (premonth.getDate() < 10 ? '0' + premonth.getDate() : premonth.getDate())
    let preHalfYear = new Date()
    preHalfYear.setMonth(date.getMonth() - 5)
    preHalfYear.setDate(1)
    preSixMonth.value =
      preHalfYear.getFullYear() +
      '-' +
      (preHalfYear.getMonth() + 1 < 10
        ? '0' + (preHalfYear.getMonth() + 1)
        : preHalfYear.getMonth() + 1) +
      '-' +
      (preHalfYear.getDate() < 10 ? '0' + preHalfYear.getDate() : preHalfYear.getDate())
  }

  async function refresh_stats(parkid) {
    try {
      dateInit()
      // console.log(today.value, preOneWeek.value, preOneMonth.value, preSixMonth.value)
      stats.value = (await getStatsByParkid(parkid, preSixMonth.value, today.value)).data.data
      let dateCountListLength = stats.value.dateCountList.length
      let i = 0
      for (i = 30; i >= 0 && i < dateCountListLength; i--) {
        if (i < 7) {
          latestWeekInfo.value.chargingRecordSum += parseInt(
            stats.value.dateCountList[dateCountListLength - i - 1].chargingRecordCount
          )
          latestWeekInfo.value.chargingRecordCountArray.push(
            stats.value.dateCountList[dateCountListLength - i - 1].chargingRecordCount
          )
          latestWeekInfo.value.chargeHoursSum += parseInt(
            stats.value.dateCountList[dateCountListLength - i - 1].chargeHours
          )
          latestWeekInfo.value.electricitySum +=
            stats.value.dateCountList[dateCountListLength - i - 1].electricityCount
        }
        latestMonthInfo.value.chargingRecordSum += parseInt(
          stats.value.dateCountList[dateCountListLength - i - 1].chargingRecordCount
        )
        latestMonthInfo.value.chargingRecordCountArray.push(
          stats.value.dateCountList[dateCountListLength - i - 1].chargingRecordCount
        )
        latestMonthInfo.value.chargeHoursSum += parseInt(
          stats.value.dateCountList[dateCountListLength - i - 1].chargeHours
        )
        latestMonthInfo.value.electricitySum +=
          stats.value.dateCountList[dateCountListLength - i - 1].electricityCount
      }
      // latestWeekInfo.value.chargingRecordCountArray =
      // latestWeekInfo.value.chargingRecordCountArray.reverse()
      // if (i < 30) for (; i < 30; i++) latestMonthInfo.value.chargingRecordCountArray.push(0)
      // latestMonthInfo.value.chargingRecordCountArray =
      // latestMonthInfo.value.chargingRecordCountArray.reverse()
    } catch (error) {
      alert('refresh_stats error')
      console.log(error)
    }
  }

  const refresh_userIncomeInfo = async (parkid) => {
    incomeInfo.value = (
      await getIncomeInfo(parkid, days.value == 0 ? preOneWeek.value : preOneMonth.value, today.value)
    ).data.data
  }

  async function refresh_crgOdrState() {
    // chargingOrderState.value = (
    //   await getChargeStats(parkid, days.value === 0 ? 7 : 30)
    // ).data.data.crecoredstats
  }
  async function refresh_eqState(parkid) {
    EqState.value = (await getEqStateByParkId(parkid)).data.data
  }

  async function refresh_userList() {
    userList.value = (
      await getUserList(days.value == 0 ? preOneWeek.value : preOneMonth.value, today.value)
    ).data.data
  }

  async function refresh_crgInfo(parkid) {
    chargingInfo.value = (await getChargeInfo(parkid)).data.data
  }

  const refresh_usingRate = async (parkid) => {
    const res = await getEqUsingRate(parkid)
    eqUsingRate.value = res.data.data
  }

  const refresh_ConnectorStatus = async () => {
    const res = (await getConnectorStatusByStationId(stationId.value)).data.data
    connectorStatus.value.slowTotal = res.slowTotal
    connectorStatus.value.fastTotal = res.fastTotal
  }

  return {
    //value
    days,
    today,
    stats,
    parkid,
    // searchParkId,
    stationId,
    routes,
    EqState,
    userList,
    preOneWeek,
    preOneMonth,
    preSixMonth,
    chargingInfo,
    detailDaysId,
    incomeInfo,
    connectorStatus,

    eqUsingRate,
    latestWeekInfo,
    latestMonthInfo,

    //function
    chargingOrderState,
    refresh_crgOdrState,
    refresh_eqState,
    refresh_userList,
    refresh_crgInfo,
    refresh_usingRate,
    refresh_userIncomeInfo,
    dateInit,
    refresh_stats,
    refresh_ConnectorStatus,

    rate
  }
})
