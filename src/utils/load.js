// 本函数用于地图api的调用
function loadJs(src) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    document.body.appendChild(script)

    script.onload = () => {
      resolve()
    }
    script.onerror = () => {
      reject()
    }
  })
}

export default loadJs
