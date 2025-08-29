const canv = document.querySelector("canvas")
const color = document.querySelector("#colorPicker")
const sizeinput = document.querySelector("#size")
const ctx = canv.getContext("2d")
const clearButton = document.querySelector("#clearScreen")
const eraser = document.querySelector("#eraser")
const paintCheck = document.querySelector("#paintCheck")
let mouseClick = false
let size = sizeinput.value

canv.width = window.innerWidth * 3/4
canv.height = window.innerHeight
const myImageData = ctx.getImageData(0, 0, canv.width, canv.height);
console.log(myImageData)

ctx.fillStyle = "white"
ctx.fillRect(0, 0, canv.width, canv.height)

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255, 255];
    }
    throw new Error('Bad Hex');
}


function mouseDown(event){
    if (!paintCheck.checked) {
        mouseClick = true
    pos.push([[event.clientX, event.clientY]])
    size = sizeinput.value
    } else {
        fillBucket(event.clientX, event.clientY, color.value)
    }
    
}

function getTargetColor(x, y, imgData) {
    const pixels = imgData.data
    const index = (y* imgData.width + x) * 4

    return [
        pixels[index],
        pixels[index + 1],
        pixels[index + 2],
        pixels[index + 3]
    ]
}

function colorsMatch(color1, color2) {
    let check = 0
    for (let i = 0; i < color1.length; i++) {
        if (color1[i] == color2[i]) {
            check ++
        }
    }
    return check == 4
}


function fillBucket(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canv.width, canv.height)
    const targetColor = getTargetColor(x, y, imageData)
    const rgbaFillColor =  hexToRgbA(fillColor)
    if (colorsMatch(targetColor, rgbaFillColor)) return 
    const stack = [[x, y]]
    while (stack.length > 0) {
        let [stackX, stackY] = stack.pop()
        const index = (stackY * imageData.width + stackX) * 4
        if (!colorsMatch(targetColor, getTargetColor(stackX, stackY, imageData))) continue
        imageData.data[index] = rgbaFillColor[0]
        imageData.data[index + 1] = rgbaFillColor[1]
        imageData.data[index + 2] = rgbaFillColor[2]
        imageData.data[index + 3] = rgbaFillColor[3]
        if (stackX - 1 >= 0) stack.push([stackX - 1, stackY])
        if (stackX + 1 <= canv.width) stack.push([stackX + 1, stackY])
        if (stackY - 1 >= 0) stack.push([stackX, stackY - 1])
        if (stackY + 1 <= canv.height) stack.push([stackX, stackY + 1])
    }
    ctx.putImageData(imageData, 0, 0)
}

function mouseUp(event){
    mouseClick = false
}

document.addEventListener("mousemove", mouseMove)
document.addEventListener("mousedown", mouseDown)
document.addEventListener("mouseup", mouseUp)
clearButton.addEventListener("click", e => {ctx.clearRect(0, 0, canv.width, canv.height)})

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
    if (eraser.checked == true) {
        ctx.strokeStyle = "white"
    } else {
        ctx.strokeStyle = color.value
    }
    ctx.lineWidth = size
    if (mouseClick){
        ctx.fillStyle = color.value
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, size/2, 0, Math.PI * 2, false)
        ctx.fill()
        point(event)
    }
}
