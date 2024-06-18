// 通过插件的方式把components中的所组件都进行全局化注册
import PageContainer from './PageContainer/index.vue'
import BoxContainer from './BoxContainer/index.vue'
import BoxItem from './BoxItem/index.vue'
import DialogBox from './DialogBox/index.vue'
import StateIcon from './StateIcon/index.vue'
import LocationBox from './LocationBox/index.vue'

export const componentPlugin = {
  install(app) {
    // app.component('组件名字'，组件配置对象)
    app.component('PageContainer', PageContainer)
    app.component('BoxContainer', BoxContainer)
    app.component('BoxItem', BoxItem)
    app.component('DialogBox', DialogBox)
    app.component('StateIcon', StateIcon)
    app.component('LocationBox', LocationBox)
  }
}
