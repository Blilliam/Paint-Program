const canv = document.querySelector("canvas")
const color = document.querySelector("#colorPicker")
const sizeinput = document.querySelector("#size")
const ctx = canv.getContext("2d")
let mouseClick = false
let size = sizeinput.value

canv.width = window.innerWidth * 3/4
canv.height = window.innerHeight
const myImageData = ctx.getImageData(0, 0, canv.width, canv.height);
console.log(myImageData)

ctx.fillStyle = "white"
ctx.fillRect(0, 0, canv.width, canv.height)

function mouseDown(event){
    mouseClick = true
    pos.push([[event.clientX, event.clientY]])
    size = sizeinput.value
    console.log(size.value)
}

function mouseUp(event){
    mouseClick = false
}

document.addEventListener("mousemove", mouseMove)
document.addEventListener("mousedown", mouseDown)
document.addEventListener("mouseup", mouseUp)

let pos = []

function point(event){
    let laststroke = pos[pos.length - 1]
    let cord = laststroke[laststroke.length - 1]
    interp(cord, [event.clientX, event.clientY])
    laststroke.push([event.clientX, event.clientY])
}

function interp(pos1, pos2){
    let x1 = pos1[0]
    let y1 = pos1[1]
    let x2 = pos2[0]
    let y2 = pos2[1]
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function mouseMove(event) {
    let mouseX = event.clientX
    let mouseY = event.clientY
    ctx.strokeStyle = color.value
    ctx.lineWidth = size
    console.log(size)
    if (mouseClick){
        point(event)
    }
}