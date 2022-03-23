let canvas = document.getElementById('canvas')
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
let ctx = canvas.getContext('2d')
ctx.fillStyle = 'black'
ctx.strokeStyle = 'black'
ctx.lineWidth = 5
ctx.lineCap = 'round'

let painting = false
let last = null
let rubber = false

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

// 判断当前设备是否支持触屏事件
var isTouchDevice = 'ontouchstart' in document.documentElement

if (isTouchDevice) {
  // 移动端
  canvas.ontouchstart = (e) => {
    showDialogFn(e)
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    last = [x, y]
  }
  canvas.ontouchmove = (e) => {
    if (rubber) {
      ctx.strokeStyle = '#fff'
    }
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    drawLine(last[0], last[1], x, y)
    last = [x, y]
  }
  canvas.touchend = () => {
    canvas.ontouchmove = null
  }
} else {
  // PC端
  canvas.onmousedown = (e) => {
    showDialogFn(e)
    last = [e.clientX, e.clientY]
    canvas.onmousemove = (e) => {
      if (rubber) {
        ctx.strokeStyle = '#fff'
      }
      drawLine(last[0], last[1], e.clientX, e.clientY)
      last = [e.clientX, e.clientY]
    }
  }
  canvas.onmouseup = () => {
    canvas.onmousemove = null
  }
}

// 隐藏弹窗
const showDialogFn = function (e) {
  if (e.target != dialog || (e.target != dialog) != rubberFull) {
    dialog.style.opacity = 0
  }
}

let li = document.querySelectorAll('li:nth-child(-n+6)')
let rubberFull = document.querySelector('.icon-rubber-full')
let clear = document.querySelector('.icon-qingkong')
console.log(li)
// 更换画笔颜色
for (let i = 0; i < li.length; i++) {
  li[i].addEventListener('click', function () {
    ctx.strokeStyle = getComputedStyle(this).getPropertyValue(
      'background-color',
    )
    ctx.lineWidth = 5
    console.log('关闭橡皮擦')
    rubber = false
  })
}

// 开启橡皮擦
rubberFull.addEventListener('click', function (e) {
  e.stopPropagation()
  console.log('开启橡皮擦')
  ctx.lineWidth = 5
  rubber = true
})
let dialog = document.querySelector('.dialog')
// 显示隐藏弹窗
if (isTouchDevice) {
  rubberFull.addEventListener('touchstart', function (e) {
    e.stopPropagation()
    rubber = true
    dialog.style.opacity = 1
  })
} else {
  rubberFull.addEventListener('click', function (e) {
    e.stopPropagation()
    rubber = true
    dialog.style.opacity = 1
  })
}

// 切换橡皮擦大小
const dialogArr = [...dialog.children]
dialogArr.forEach((item, i) => {
  item.addEventListener('click', function (e) {
    e.stopPropagation()
    ctx.lineWidth = 4 + i * 6 - 2
    dialog.style.opacity = 0
  })
})

// 清空画布
clear.addEventListener('click', function () {
  console.log('清空画布')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()
})
