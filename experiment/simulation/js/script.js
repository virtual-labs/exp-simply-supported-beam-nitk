// Experiment parameters
const beamInfo = [
  {
    ISMB: 100,
    h: "100 mm",
    b: "75mm",
    t1: "4mm",
    t2: "7mm",
    Ixx: "257.5 cm<sup>4</sup>",
    Iyy: "40.8 cm<sup>4</sup>",
    Area: "14.6 cm<sup>2</sup>",
    A: 14.6e-4,
    I: 257.5e-8,
    path: "images/crossI.PNG",
  },
  {
    ISNT: 150,
    h: "150 mm",
    b: "150mm",
    t1: "10mm",
    t2: "10 mm",
    Ixx: "541.1 cm<sup>4</sup>",
    Iyy: "250.3 cm<sup>4</sup>",
    Area: "28.88 cm<sup>2</sup>",
    A: 28.88e-4,
    I: 541.1e-8,
    path: "images/crossT.PNG",
  },
  {
    ISMC: 100,
    h: "100 mm",
    b: "50mm",
    t1: "4.7mm",
    t2: "7.5 mm",
    Ixx: "186.7 cm<sup>4</sup>",
    Iyy: "25.9 cm<sup>4</sup>",
    Area: "11.7 cm<sup>2</sup>",
    A: 11.7e-4,
    I: 186.7e-8,
    path: "images/crossC.PNG",
  },
  {
    ISA: 100100,
    h: "100 mm",
    b: "100mm",
    t: "12mm",
    Ixx: "207 cm<sup>4</sup>",
    Iyy: "207 cm<sup>4</sup>",
    Area: "22.59 cm<sup>2</sup>",
    A: 22.59e-4,
    I: 207e-8,
    path: "images/crossL.PNG",
  },
  {
    SQUARE: "",
    h: "150 mm",
    b: "150mm",
    Ixx: "4218.75 cm<sup>4</sup>",
    Iyy: "4218.75 cm<sup>4</sup>",
    Area: "225 cm<sup>2</sup>",
    A: 225e-4,
    I: 4218.75e-8,
    path: "images/crossSqr.PNG",
  },
  {
    CIRCLE: "",
    D: "150 mm",
    Ixx: "2485.05  cm<sup>4</sup>",
    Iyy: "2485.05  cm<sup>4</sup>",
    Area: "176.72 cm<sup>2</sup>",
    A: 176.72e-4,
    I: 2485.05e-8,
    path: "images/crossCirc.PNG",
  },
  {
    A: 0.01,
    I: 0.01,
  },
];

// material Info
const matInfo = [
  {
    E: 200e9,
    rho: 7750,
  },
  {
    E: 70.33e9,
    rho: 2712,
  },
  {
    E: 111.006e9,
    rho: 8304,
  },
];

// simulation variables
let time = 0; //keeps track of the time of the animation
let beamlength = 1500; //Length of the beam inmm
let simTimeId; //for animation function
let pauseTime; //for running animation when simulation is paused
let rho = 7750; //Density in kg/m^3
let A = 14.6e-4; //Area in m^2
let massbeam = (rho * A * beamlength) / 1000; //Mass of the beam=volume * density
var E = 200e9; //Young's Modulus
var I = 257.5e-8; //Ixx value
let dampingratio = 0;
let endmass = 5;
var m = 0.4857 * massbeam + endmass;
var k = (48 * E * I) / Math.pow(beamlength / 1000, 3); //Stiffness value for a cantilever beam
// console.log(k);

let wn = Math.sqrt(k / m); //Natural Frequency
// console.log(wn);
let wd = wn * Math.sqrt(1 - dampingratio * dampingratio); //Damped natural frequency
let initdisp = 500; //Initial displacement given to the beam
let simstatus;

// canvas variables
// graphics
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// graph1
const graphCanvas1 = document.querySelector("#graphscreen1");
const graphctx1 = graphCanvas1.getContext("2d");

//  graph2
const graphCanvas2 = document.querySelector("#graphscreen2");
const graphctx2 = graphCanvas2.getContext("2d");

// fix scaling of canavs as per media
let mediaQuery1 = window.matchMedia("screen and (max-width: 540px)");
let mediaQuery2 = window.matchMedia("screen and (max-width: 704px)");
let mediaQuery3 = window.matchMedia("screen and (max-width: 820px)");
let mediaQuery4 = window.matchMedia("screen and (max-width: 1025px)");
let mediaQuery5 = window.matchMedia("screen and (max-width: 1250px)");
let mediaQuery6 = window.matchMedia("screen and (max-width: 1440px)");
let scaleX = 0.5;
let scaleY = 0.5;

// dom elements
const sectionImg = document.querySelector(".cross-img img");
const sectionTooltip = document.querySelector(".sec-tooltip");
const cirTooltip = document.querySelector(".cir-tooltip");
const materials = document.querySelector("#materials");
const sections = document.querySelector("#sections");
const otherSec = document.querySelector(".other-sec");

//Function to calculate the displacement
const actdisplace = function (t) {
  let value =
    Math.exp(-dampingratio * wn * t) *
    (initdisp * Math.cos(wd * t) +
      (dampingratio * wn * initdisp * Math.sin(wd * t)) / wd);
  return value;
};

//start of simulation here; starts the timer with increments of 0.01 seconds
function startsim() {
  simTimeId = setInterval("varupdate();time+=.01;", 10);
  // simstatus = 1;
}
// switches state of simulation between 0:Playing & 1:Paused
function simstate() {
  let imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename === "bluepausedull") {
    document.getElementById("playpausebutton").src =
      "./images/blueplaydull.svg";

    clearInterval(simTimeId);
    simstatus = 1;
    pauseTime = setInterval("varupdate();", "100");
    document.querySelector(".playPause").textContent = "Play";
  }
  if (imgfilename === "blueplaydull") {
    document.getElementById("playpausebutton").src =
      "./images/bluepausedull.svg";
    simstatus = 0;
    clearInterval(pauseTime);
    time = 0;
    simTimeId = setInterval("varupdate();time+=.01;", 10);
    document.querySelector(".playPause").textContent = "Pause";
  }
}

//Initialise system parameters here
function varinit() {
  varchange();
  //Variable slider and number input types
  $("#massSlider").slider("value", 25); // slider initialisation : jQuery widget
  $("#massSpinner").spinner("value", 25); // number initialisation : jQuery widget
  $("#lengthSlider").slider("value", 1000);
  $("#lengthSpinner").spinner("value", 1000);
  $("#dampSlider").slider("value", 0.05);
  $("#dampSpinner").spinner("value", 0.05);
  $("#CsArea").spinner("value", 0.01);
  $("#Ivalue").spinner("value", 0.01);
}
function varchange() {
  $("#massSlider").slider({ max: 200, min: 0, step: 0.5 });
  $("#massSpinner").spinner({ max: 200, min: 0, step: 0.5 });

  $("#massSlider").on("slide", function (e, ui) {
    $("#massSpinner").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#massSpinner").on("spin", function (e, ui) {
    $("#massSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#massSpinner").on("change", function () {
    varchange();
  });

  $("#lengthSlider").slider({ max: 2000, min: 200, step: 10 });
  $("#lengthSpinner").spinner({ max: 2000, min: 200, step: 10 });

  $("#lengthSlider").on("slide", function (e, ui) {
    $("#lengthSpinner").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#lengthSpinner").on("spin", function (e, ui) {
    $("#lengthSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#lengthSpinner").on("change", function () {
    varchange();
  });
  $("#lengthSpinner").on("touch-start", function () {
    varchange();
  });

  $("#dampSlider").slider({ max: 0.99, min: 0, step: 0.01 });
  $("#dampSpinner").spinner({ max: 0.99, min: 0, step: 0.01 });

  $("#dampSlider").on("slide", function (e, ui) {
    $("#dampSpinner").spinner("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#dampSpinner").on("spin", function (e, ui) {
    $("#dampSlider").slider("value", ui.value);
    time = 0;
    varupdate();
  });
  $("#dampSpinner").on("change", function () {
    varchange();
  });
  $("#CsArea").spinner({ max: 1, min: 0.01, step: 0.0001 });
  $("#Ivalue").spinner({ max: 1, min: 0.01, step: 0.0001 });
}
function varupdate() {
  $("#massSpinner").spinner("value", $("#massSlider").slider("value")); //updating slider location with change in spinner(debug)
  $("#lengthSpinner").spinner("value", $("#lengthSlider").slider("value"));
  $("#dampSpinner").spinner("value", $("#dampSlider").slider("value"));
  endmass = $("#massSpinner").spinner("value"); //Updating variables
  beamlength = $("#lengthSpinner").spinner("value");
  dampingratio = $("#dampSpinner").spinner("value");

  massbeam = (rho * A * beamlength) / 1000;
  m = 0.4857 * massbeam + endmass;
  k = (48 * E * I) / Math.pow(beamlength / 1000, 3);
  // console.log(massbeam);

  wn = Math.sqrt(k / m);
  let cc = 2 * Math.sqrt(k * m);
  let c = dampingratio * cc;
  wd = wn * Math.sqrt(1 - dampingratio * dampingratio);
  document.querySelector("#mass").innerHTML = m.toFixed(4) + "kg"; //Displaying values
  document.querySelector("#k").innerHTML = (k / 1000).toFixed(4) + "N/mm";
  document.querySelector("#c").innerHTML = c.toFixed(4) + "Ns/m";
  document.querySelector("#wd").innerHTML = wd.toFixed(4) + "rad/s";
  document.querySelector("#wn").innerHTML = wn.toFixed(4) + "rad/s";

  cirTooltip.innerHTML = `M = ${m.toFixed(4)} \n kg <br>  c = ${c.toFixed(
    4
  )}Ns/m \n<br> k = ${(k / 1000).toFixed(4)}N/mm
  `;
  //If simulation is running
  if (!simstatus) {
    //Disabling the slider,spinner and drop down menu
    $("#massSpinner").spinner("disable");
    $("#massSlider").slider("disable");
    $("#lengthSpinner").spinner("disable");
    $("#lengthSlider").slider("disable");
    $("#dampSpinner").spinner("disable");
    $("#dampSlider").slider("disable");
    $("#CsArea").spinner("enable");
    $("#Ivalue").spinner("enable");
    document.getElementById("sections").disabled = true;
    document.getElementById("materials").disabled = true;
  }
  //If simulation is stopped
  if (simstatus) {
    //Enabling the slider,spinner and drop down menu
    $("#massSpinner").spinner("enable");
    $("#massSlider").slider("enable");
    $("#lengthSpinner").spinner("enable");
    $("#lengthSlider").slider("enable");
    $("#dampSpinner").spinner("enable");
    $("#dampSlider").slider("enable");
    $("#CsArea").spinner("enable");
    $("#Ivalue").spinner("enable");
    document.getElementById("sections").disabled = false;
    document.getElementById("materials").disabled = false;
  }
  draw();
}

const setMediaQueries = function (ctx) {
  let originalX = 20;
  if (mediaQuery1.matches) {
    scaleX = 1.8;
    // originalX = 20;
    originalX = canvas.width / 4 - 10;
    scaleY = 0.9;
  } else if (mediaQuery2.matches) {
    scaleX = 1.2;
    // originalX = canvas.width / 4 - 10;
    scaleY = 0.9;
  } else if (mediaQuery3.matches) {
    scaleX = 1.3;
    originalX = canvas.width / 4 - 10;
    scaleY = 0.9;
  } else if (mediaQuery4.matches) {
    scaleX = 0.8;
    originalX = canvas.width / 4 - 10;
    scaleY = 0.7;
  }  else if (mediaQuery5.matches) {
    scaleX = 0.6;
    originalX = canvas.width / 4 - 10;
    scaleY = 0.7;
  }else if (mediaQuery6.matches) {
    scaleX = 0.425;
    originalX = canvas.width / 4 - 10;
    scaleY = 0.7;
  } else {
    // originalX = canvas.width / 4 - 20;
    scaleX = 0.3;
    scaleY = 0.5;
  }
  ctx.canvas.width = document.documentElement.clientWidth * scaleX;
  ctx.canvas.height = document.documentElement.clientHeight * scaleY;
  return originalX;
};

const draw = function () {
  let canvas = document.getElementById("canvas");
  let originalX = setMediaQueries(ctx);
  ctx.canvas.width = document.documentElement.clientWidth * scaleX;
  ctx.canvas.height = document.documentElement.clientHeight * scaleY;

  var ball = {
    xpos: beamlength / 5 / 2 + 50 + 25,
    ypos: 210 + actdisplace(time * 0.03) / 10,
    size: endmass === 0 ? 0 : 15 + endmass / 5,
    draw: function () {
      ctx.beginPath();
      ctx.arc(ball.xpos, ball.ypos, ball.size, 0, 2 * Math.PI, false);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "brown";
      ctx.stroke();
      ctx.fillStyle = "brown";
      ctx.fill();
    },
  };

  function beamdef(y) {
    ctx.beginPath();
    ctx.arc(25, 210, 10, (3 * Math.PI) / 2, Math.PI / 2, true);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      25 + beamlength / 5 + 100,
      210,
      10,
      (3 * Math.PI) / 2,
      Math.PI / 2,
      false
    );
    ctx.fillStyle = "blue";
    ctx.fill();

    for (var i = 0; i <= beamlength / 5 / 2 + 50; i++) {
      ctx.fillRect(
        i + 25,
        ((y * i) / Math.pow(beamlength / 5 + 100, 3)) *
          (3 * Math.pow(beamlength / 5 + 100, 2) - 4 * i * i) -
          10 +
          210,
        1,
        20
      );
    }
    ctx.save();
    ctx.translate(beamlength / 5 + 25 + 100, 0);
    ctx.scale(-1, 1);
    for (var i = 0; i <= beamlength / 5 / 2 + 50; i++) {
      ctx.fillRect(
        i,
        ((y * i) / Math.pow(beamlength / 5 + 100, 3)) *
          (3 * Math.pow(beamlength / 5 + 100, 2) - 4 * i * i) -
          10 +
          210,
        1,
        20
      );
    }
    ctx.restore();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.moveTo(25, 210);
    ctx.lineTo(15, 240);
    ctx.lineTo(35, 240);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.moveTo(25 + beamlength / 5 + 100, 210);
    ctx.lineTo(15 + beamlength / 5 + 100, 240);
    ctx.lineTo(35 + beamlength / 5 + 100, 240);
    ctx.fill();
    ctx.stroke();
  }
  ctx.clearRect(0, 0, 550, 400);
  beamdef(ball.ypos - 210);

  ball.draw();
  ball.draw();
  generateGraph();
};

function generateGraph() {
  // Graph 1
  let graph1X = setMediaQueries(graphctx1);
  graphctx1.canvas.width = document.documentElement.clientWidth * scaleX;
  graphctx1.canvas.height = document.documentElement.clientHeight * scaleY;
  graphctx1.clearRect(0, 0, graphCanvas1.width, graphCanvas1.height);
  graphctx1.font = "2rem Nunito sans MS";
  graphctx1.save();
  graphctx1.translate(0, 225);
  graphctx1.rotate(-Math.PI / 2);
  graphctx1.fillText("Displacement", 0, 15);
  graphctx1.restore();
  graphctx1.fillText("Time", 150, 350);
  graphctx1.beginPath();

  graphctx1.moveTo(20, 100);
  graphctx1.lineTo(20, 350);
  graphctx1.moveTo(20, 225);
  graphctx1.lineTo(graphCanvas1.width, 225);
  graphctx1.strokeStyle = "black";
  graphctx1.stroke();
  graphctx1.closePath();

  graphctx1.beginPath();
  graphctx1.moveTo(20, 225);
  let i = 0;
  graphctx1.strokeStyle = "green";
  graphctx1.lineWidth = 1;
  while (i < graphCanvas1.width) {
    graphctx1.lineTo(i + 20, 225 - (0.9 * actdisplace(0.00007 * i)) / 5);
    graphctx1.moveTo(i + 20, 225 - (0.9 * actdisplace(0.00007 * i)) / 5);
    i += 0.01;
  }
  graphctx1.stroke();

  // Graph 2
  let graph2X = setMediaQueries(graphctx2);
  graphctx2.canvas.width = document.documentElement.clientWidth * scaleX;
  graphctx2.canvas.height = document.documentElement.clientHeight * scaleY;
  graphctx2.clearRect(0, 0, graphCanvas2.width, graphCanvas2.height);
  graphctx2.font = "2rem Nunito sans MS";
  graphctx2.beginPath();
  graphctx2.strokeStyle = "black";
  graphctx2.moveTo(20, 330);
  graphctx2.lineTo(20, 135);
  graphctx2.moveTo(20, 330);
  graphctx2.lineTo(520, 330);
  graphctx2.stroke();
  graphctx2.save();
  graphctx2.translate(10, 345);
  graphctx2.rotate(-Math.PI / 2);
  graphctx2.fillText("Amplitude", 45, 5);
  graphctx2.restore();
  graphctx2.fillText("Frequency(rad/s)", 170, 350);
  graphctx2.strokeStyle = "#800080";
  graphctx2.lineWidth = 1;
  graphctx2.moveTo(350, 345);
  function amplitude(n) {
    return 20 / Math.sqrt(Math.pow(1 - n * n, 2) + Math.pow(2 * 0.05 * n, 2));
  }
  let j = 0;
  graphctx2.beginPath();
  while (j < 300) {
    graphctx2.lineTo(j + 50, 325 - 0.9 * amplitude(0.01 * j));
    graphctx2.moveTo(j + 50, 325 - 0.9 * amplitude(0.01 * j));
    j += 0.01;
  }
  graphctx2.stroke();
  graphctx2.beginPath();
  graphctx2.strokeStyle = "green";
  graphctx2.moveTo(150, 360);
  graphctx2.lineTo(150, 100);
  graphctx2.stroke();
  graphctx2.font = "2rem Nunito sans MS";
  graphctx2.fillText("\u03C9d= " + wd.toFixed(3) + "rad/s", 260, 300);
}

function plotgraph() {
  const graphDiv = document.querySelectorAll(".graph-div");
  console.log(graphDiv);
  graphDiv.forEach((graph) => {
    graph.classList.toggle("display-hide");
  });
  generateGraph();
  graphDiv[0].scrollIntoView({
    behavior: "smooth",
  });
}

window.addEventListener("load", varinit);

const selectSection = function () {
  otherSec.classList.remove("display-flex");
  otherSec.classList.add("display-hide");
  let value = sections.value;
  if (value != 6) {
    sectionImg.src = beamInfo[value].path;
    const infos = Object.entries(beamInfo[value]);
    sectionTooltip.innerHTML = "";
    for (const [key, value] of infos.slice(0, -3)) {
      const text = `${key}:${value}, `;
      sectionTooltip.insertAdjacentHTML("beforeend", text);
    }
    for (const [key, value] of infos) {
      if (key == "A") {
        A = value;
      }
      if (key == "I") {
        I = value;
      }
    }
    varupdate();
  } else {
    otherSec.classList.add("display-flex");
    otherSec.classList.remove("display-hide");
    sectionImg.src = "images/crossOth.PNG";
    A = 0.01;
    I = 0.01;
    sectionTooltip.innerHTML = "";
    sectionTooltip.innerHTML = `Area = ${A} m<sup>2</sup>, I = ${I} m<sup>4</sup>`;
    $("#CsArea").spinner({
      spin: function (event, ui) {
        A = ui.value;
        I = $("#Ivalue").spinner("value");
        sectionTooltip.innerHTML = `Area = ${A} m<sup>2</sup>, I = ${I} m<sup>4</sup>`;
      },
    });
    $("#Ivalue").spinner({
      spin: function (event, ui) {
        I = ui.value;
        A = $("#CsArea").spinner("value");
        sectionTooltip.innerHTML = `Area = ${A} m<sup>2</sup>, I = ${I} m<sup>4</sup>`;
      },
    });
  }
};

sections.addEventListener("change", selectSection);
const selectMaterial = function () {
  let value = materials.value;
  const infos = Object.entries(matInfo[value]);
  cirTooltip.innerHTML = "";
  for (const [key, value] of infos) {
    const text = `${key}:${value}, `;
    if (key == "E") {
      E = +value;
    }
    if (key == "rho") {
      rho = +value;
    }
    cirTooltip.insertAdjacentHTML("beforeend", text);
  }
  varupdate();
};
materials.addEventListener("change", selectMaterial);
