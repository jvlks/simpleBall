window.onload = function () {
    var drawing = document.getElementById("drawing");
    var display = document.getElementById("display");
    var start = document.getElementById("start");
    var stop = document.getElementById("stop");
    var timer = null;

    // 检测鼠标移动
    drawing.onmousemove = function (event) {
        var pos = getMousePos(event);
        display.innerHTML = "x:" + pos.x + "  y:" + pos.y;
    };

    var disY = 30,        // 小球的位置
        speed = 0,        // 小球的速度
        diffDis = 0.0001,      // 小球在30ms内移动的距离
        gravity = 9.8,    // 重力
        drag = 0,         // 空气阻力
        mass = 0.5,       // 0.5kg的小球
        t = 0.03,            // 时间
        direction = "down";   // 小球运动的方向

    draw();

    start.onclick = function () {
        clearInterval(timer);
        timer = setInterval(run, 30);
    };
    stop.onclick = function () {
        clearInterval(timer);
    };

    function getMousePos(event) {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

        return {x:event.clientX+scrollLeft, y:event.clientY+scrollTop};
    }

    function draw() {
        if (drawing.getContext) {
            var context = drawing.getContext("2d");
            context.clearRect(0, 0, getStyle(drawing, "width").slice(0, -2), getStyle(drawing, "height").slice(0, -2));;
            context.fillStyle = "red";
            context.beginPath();
            context.arc(180, disY, 20, 0, Math.PI*2);
            context.closePath();
            context.fill();
        }
    }

    function run() {
        // 1. 计算小球的速度
        drag = 6*Math.PI*1.8*Math.pow(10, -1)*0.02*speed;

        if (direction == "down") {
            speed = Math.sqrt(speed*speed+2*gravity*diffDis-2*drag*diffDis/mass);
        } else {
            var temp = speed*speed-2*gravity*diffDis-2*drag*diffDis/mass;
            temp<0? speed=0 : speed=Math.sqrt(temp);
            //speed = Math.sqrt(Math.round(speed*speed-2*gravity*diffDis-2*drag*diffDis/mass));
        }
        // 2. 计算小球的位移
        diffDis = speed * t * 10;

        console.log("direction: " + direction);

        if (speed == 0) {
            direction = "down";
            diffDis = 0.0001;
        }


        // 3. 碰撞检测
        if (disY+diffDis >= parseInt(getStyle(drawing, "height").slice(0, -2))) {
            disY = parseInt(getStyle(drawing, "height").slice(0, -2));
            direction = "up";
            if (speed < 1) {
                clearInterval(timer);
            }
        }

        if (direction == "down") {
            disY = disY + Math.ceil(diffDis);
        } else {
            disY = disY - Math.ceil(diffDis);
        }


        // 4. 画图
        draw();

        console.log("drag:" + drag);
        //console.log("gravity: " + gravity*mass);
        console.log("speed: " + speed);
        console.log("diffDis: " + diffDis);
        console.log("disY: " + disY);
    }

    function getStyle(obj, name) {
        if (getComputedStyle) {
            return getComputedStyle(obj, null)[name];
        } else {
            return obj.currentStyle[name];
        }
    }

}

