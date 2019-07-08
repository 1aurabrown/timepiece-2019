$(document).ready( function() {
    var clocks;
    var start = moment();
    var numClocks;
    var offset;
    var rows;
    var columns;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var radius;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      numClocks = 60;
      offset = getRandomInt(-29, 30);
      radius = 60;

      /**
       * Your drawings need to be inside this function otherwise they will be reset when
       * you resize the browser window and the canvas goes will be cleared.
       */
    }

    resizeCanvas();
    window.setInterval(function() {
      window.requestAnimationFrame(draw);
    }, 50)

    function draw() {
      var i;
      for (i = 0; i < numClocks; i++) {
        var offsetIndex = i + offset;
        var factor = ((numClocks / 16) + (60 - offsetIndex / 8)) / 60;
        drawClock(factor);
      };
    }

    function drawClock(factor) {
      drawFace(factor);
      drawNumbers();
      drawTime(factor);
    };
    function drawFace(factor) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = factor === 1.0 ? 'white' : '#5e54e2';
      ctx.fill();
      ctx.lineWidth = radius * 0.1;
      ctx.restore();
    };
    function drawNumbers() {
      ctx.save();
      ctx.fillStyle = 'black';
      ctx.font = radius * 0.15 + "px arial";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      var i;
      for (i = 0; i < 12; i++) {
        var num = i + 1;
        var ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
      };
      ctx.restore();
    };
    function drawTime(factor) {
      var adjustedNow, elapsed, hour, minute, second;
      elapsed = moment().diff(start);
      adjustedNow = moment(start).add(elapsed * factor, 'milliseconds');
      hour = adjustedNow.hours() % 12;
      minute = adjustedNow.minutes();
      second = adjustedNow.seconds();
      hour = hour * Math.PI / 6;
      drawHand(ctx, hour, radius * 0.5, radius * 0.07);
      minute = minute * Math.PI / 30;
      drawHand(ctx, minute, radius * 0.8, radius * 0.07);
      second = second * Math.PI / 30;
      drawHand(ctx, second, radius * 0.9, radius * 0.02);
    };
    function drawHand(ctx, pos, length, width) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.moveTo(0, 0);
      ctx.rotate(pos);
      ctx.lineTo(0, -length);
      ctx.stroke();
      ctx.rotate(-pos);
      ctx.restore();
    };
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    };
});
