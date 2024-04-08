//get DPI
let dpi = window.devicePixelRatio;
//get canvas
let canvas = document.getElementById("myCanvas");
//get context
let ctx = canvas.getContext("2d");
function fix_dpi() {
  //get CSS height
  //the + prefix casts it to an integer
  //the slice method gets rid of "px"
  let style_height = +getComputedStyle(canvas)
    .getPropertyValue("height")
    .slice(0, -2);
  //get CSS width
  let style_width = +getComputedStyle(canvas)
    .getPropertyValue("width")
    .slice(0, -2);
  //scale the canvas
  canvas.setAttribute("height", style_height * dpi);
  canvas.setAttribute("width", style_width * dpi);
}

// tooltip
const showTooltip = function (e) {
  console.log(e);
  let x = e.offsetX,
    y = e.offsetY;
  sectionTooltip.style.top = y + 20 + "px";
  sectionTooltip.style.left = x + 20 + "px";
};

// canvas.width = rect.width * devicePixelRatio;
// canvas.height = rect.height * devicePixelRatio;
// ctx.scale(devicePixelRatio / 2, devicePixelRatio / 2);
// canvas.style.width = rect.width + "px";
// canvas.style.height = rect.height + "px";

//get the canvas, canvas context, and dpi
let canvas = document.getElementById("myCanvas"),
  ctx = canvas.getContext("2d"),
  dpi = window.devicePixelRatio;
function fix_dpi() {
  //create a style object that returns width and height
  let style = {
    height() {
      return +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    },
    width() {
      return +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    },
  };
  //set the correct attributes for a crystal clear image!
  canvas.setAttribute("width", style.width() * dpi);
  canvas.setAttribute("height", style.height() * dpi);
}
function draw() {
  //call the dpi fix every time
  //canvas is redrawn
  fix_dpi();

  //draw stuff!
  ctx.strokeRect(30, 30, 100, 100);
  ctx.font = "30px Arial";
  ctx.fillText("Demo!", 35, 85);
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

document.addEventListener("resize", draw);
/*
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-50px";
  }
  prevScrollpos = currentScrollPos;
};
*/
