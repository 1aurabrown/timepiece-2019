var columns;
var rows;
var ctx;
var numClocks;
var offset;
var canvas;
var start;
var clocks;
var radius;
var rateStep = -.001;
var unitDimension = 300;
var dpr;

$(document).ready( function() {
  start = moment();
  dpr = window.devicePixelRatio || 1;
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  ctx.webkitImageSmoothingEnabled = true;
  ctx.imageSmoothingEnabled = true;

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  resizeCanvas();
  window.setInterval(function() {
    window.requestAnimationFrame(draw);
  }, 50)

});


function resizeCanvas() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width;
  canvas.style.height = height;
  columns = Math.max(2, Math.ceil(width / unitDimension));
  rows = Math.max(2, Math.ceil((height / width) * columns));

  var newNumClocks = rows * columns
  if (numClocks != newNumClocks) {
    numClocks = newNumClocks;
    offset = parseInt(Math.floor(Math.random() * numClocks));
  }
  xTranslate = width / columns;
  yTranslate = height / rows;
  var smallerDimension = Math.min(xTranslate, yTranslate);
  radius = .8 * smallerDimension / 2;

  ctx.scale(dpr, dpr);

  /**
   * Your drawings need to be inside this function otherwise they will be reset when
   * you resize the browser window and the canvas goes will be cleared.
   */
}


function draw() {
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var i;
  for (i = 0; i < rows; i++) {
    for (j = 0; j < columns; j++) {
      ctx.save();
      ctx.translate(j * xTranslate + xTranslate/2, i * yTranslate + yTranslate/2);
      var clockIndex = parseInt(i * columns + j)
      var factor = 1 + ((clockIndex - offset) * rateStep);
      drawClock(factor);
      ctx.restore();
    }
  };
}

function drawClock(factor) {
  var invert = false;
  if (factor == 1) {
    // invert = true;
  }
  if (invert) {
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = '#ffffff';
  }
  drawFace(invert);
  // drawNumbers(invert);
  drawTime(factor, invert);
};
function drawFace(invert) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  if (invert) {
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
};
function drawNumbers() {
  var divisions = 60;
  for (var i = 0; i < 60; i++) {
    ctx.save();
    ctx.beginPath();
    var num = i + 1;
    var ang = num * (Math.PI * 2) / divisions;
    ctx.rotate(ang);
    ctx.moveTo(.9 * radius, 0);
    if (i % 5 == 0) {
      ctx.moveTo(.85 * radius, 0);
      ctx.lineTo(.95 * radius, 0);
    } else {
      ctx.lineWidth = .9;
      ctx.moveTo(.9 * radius, 0);
      ctx.lineTo(.95 * radius, 0);
    }
    ctx.stroke();
    ctx.restore();
  };
};
function drawTime(factor) {
  var adjustedNow, elapsed, hour, minute, second;
  elapsed = moment().diff(start);
  adjustedNow = moment(start).add(elapsed * factor, 'milliseconds');

  hour = adjustedNow.hours() % 12;
  minute = adjustedNow.minutes();
  second = adjustedNow.seconds();

  hour = hour * Math.PI / 6;
  minute = minute * Math.PI / 30;
  second = second * Math.PI / 30;

  drawHand(ctx, hour, radius * 0.5, 1.3);
  drawHand(ctx, minute, radius * 0.75, 1.1);
  drawHand(ctx, second, radius * 0.9, 1);
};
function drawHand(ctx, pos, length, width) {
  ctx.save();
  ctx.lineWidth = width
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.restore();
};
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
