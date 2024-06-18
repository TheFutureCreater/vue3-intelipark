<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const title = ref()
// const text = ref('hello world')
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  content: String
})

onMounted(() => {
  TitleInit()
})

function TitleInit() {
  let t = echarts.init(title.value)
  const title_option = {
    graphic: {
      elements: [
        {
          type: 'text',
          left: '24px',
          top: 'bottom',
          style: {
            text: 'Hello World',
            fontSize: 24,
            fontStyle: 'italic',
            fontWeight: 'normal',
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#000',
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 2000,
            loop: false,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                // Stop for a while.
                percent: 0.8,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 1,
                style: {
                  fill: 'white'
                }
              }
            ]
          }
        }
      ]
    }
  }
  title_option.graphic.elements[0].style.text = props.content
  t.setOption(title_option)
}
</script>

<template>
  <div class="title" ref="title">
    {{ content }}
    <!-- <slot name="content">标题(Title)</slot> -->
  </div>
</template>

<style lang="scss" scoped>
.title {
  width: 100%;
  height: 30px;
  background: url(/src/assets/screen/u51.svg) no-repeat 0px center;
  font-size: 24px;
  font-style: italic;
  text-indent: 1em;
  &::after {
    content: '';
    display: block;
    height: 2px;
    background-color: gray;
    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.3), #5555559a);
  }
}
</style>
