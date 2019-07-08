var columns;
var rows;
var ctx;
var numClocks;
var offset;
var canvas;
var start = moment();;
var dpr;

var rateStep;
var unitDimension;
var radius;

var renderTicks;
var renderDetailedTicks;

var renderMinuteHand;
var renderHourHand;

var invertActual;

const twoPi = Math.PI * 2;

$(document).ready( function() {
  parseParams();

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

function parseParams() {
  var params = $.deparam(window.location.search.split('?')[1] || '')
  /*    PARAMETERS
      rate              multiplier representing discrepancy between the rate of each clock
      dimension         target pixel dimension of each unit in the clock grid
      radius            clock face size in relation to grid unit dimension
                        (value of 1 means clock face perimeters will touch each other)
      invertActual      highlight the clock which shows the actual time
      ticks             render lines representing numbers around the perimeter of the clock
      detailed Ticks    false: renders only hours, true: renders minutes and hours
      allHands          false: renders only second hand, true: renders second, minute and hour hands
  */
  rateStep = -.00001 * params.rate || 1
  unitDimension = params.dimension || 300;
  radiusMultiplier = params.radius || .85;
  invertActual = params.invertActual == 1 || params.invertActual == 'true' || false;
  renderTicks = params.ticks == 1 || params.ticks == 'true' || false;
  renderDetailedTicks = params.detailedTicks == 1 || params.detailedTicks == 'true' || false;
  renderAllHands = params.allHands == 1 || params.allHands == 'true' || false;
}

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
  radius = radiusMultiplier * smallerDimension / 2;

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
  if (invertActual && (factor == 1)) {
    invert = true;
  }
  if (invert) {
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = '#ffffff';
  }
  drawFace(invert);
  if (renderTicks) {
    drawTicks(invert)
  }
  drawTime(factor, invert);
};
function drawFace(invert) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, twoPi);
  if (invert) {
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
};
function drawTicks() {
  if (renderDetailedTicks) {
    var divisions = 60;
    for (var i = 0; i < divisions; i++) {
      ctx.save();
      ctx.beginPath();
      var num = i + 1;
      var ang = num * twoPi / divisions;
      ctx.rotate(ang);
      if (i % 5 == 0) {
        drawHourTick();
      } else {
        drawMinuteTick();
      }
      ctx.stroke();
      ctx.restore();
    }
  } else {
    var divisions = 12;
    for (var i = 0; i < divisions; i++) {
      ctx.save();
      ctx.beginPath();
      var num = i + 1;
      var ang = num * twoPi / divisions;
      ctx.rotate(ang);
      drawHourTick();
      ctx.stroke();
      ctx.restore();
    }
  }
}
function drawHourTick() {
  ctx.moveTo(.85 * radius, 0);
  ctx.lineTo(.95 * radius, 0);
}
function drawMinuteTick() {
  ctx.lineWidth = .9;
  ctx.moveTo(.9 * radius, 0);
  ctx.lineTo(.95 * radius, 0);
}
function drawTime(factor) {
  var adjustedNow, elapsed, hour, minute, second;
  elapsed = moment().diff(start);
  adjustedNow = moment(start).add(elapsed * factor, 'milliseconds');

  second = adjustedNow.seconds() * twoPi / 60;
  drawHand(ctx, second, radius * 0.9, 1);


  if (renderAllHands) {
    hour = adjustedNow.hours() % 12 * twoPi / 12;
    drawHand(ctx, hour, radius * 0.5, 1.3);

    minute = adjustedNow.minutes() * twoPi / 60;
    drawHand(ctx, minute, radius * 0.75, 1.1);
  }
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
