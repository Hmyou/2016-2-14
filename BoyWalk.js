function BoyWalk() {

    var container = $("#content");
    // 页面可视区域
    var visualWidth = container.width();
    var visualHeight = container.height();

    // 获取数据
    var getValue = function(className) {
        var $elem = $('' + className + '');
        // 走路的路线坐标
        return {
            height: $elem.height(),
            top: $elem.position().top
        };
    };
    // 路的Y轴
    var pathY = function() {
        var data = getValue('.path');
        return data.top + data.height / 2;
    }();
    var $me = $("#me");
    var meWidth = $me.width();
    var meHeight = $me.height();
    // 修正小男孩的正确位置
    $me.css({
        top: pathY - meHeight + 25
    });
    var $you = $("#you");
    var youWidth = $you.width();
    var youHeight = $you.height();
    // 修正小男孩的正确位置
    $you.css({
        top: pathY - meHeight + 25,
        left: visualWidth * 0.7 + 125
    });


    // 恢复走路
    function restoreWalk() {
        $me.removeClass('pauseWalk');
    }

    // css3的动作变化
    function slowWalk() {
        $me.addClass('slowWalk');
    }

    // 用transition做运动
    function stratRun(options, runTime) {
        var dfdPlay = $.Deferred();
        // 恢复走路
        restoreWalk();
        // 运动的属性
        $me.animate(
            options,
            runTime,
            'linear',
            function() {
                dfdPlay.resolve(); // 动画完成
            });
        return dfdPlay;
    }

    // 开始走路
    function walkRun(time, dist, disY) {
        time = time || 3000;
        // 脚动作
        slowWalk();
        // 开始走路
        var d1 = stratRun({
            'left': dist + 'px',
            'top': disY ? disY : undefined
        }, time);
        return d1;
    }

    // 计算移动距离
    function calculateDist(direction, proportion) {
        return (direction == "x" ?
            visualWidth : visualHeight) * proportion;
    }

    return {
        // 开始走路
        walkTo: function(time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },
        // 停止走路
        stopWalk: function() {
            pauseWalk();
        },
        // 转身动作
        rotate: function(callback) {
            restoreWalk();
            $me.addClass('boy-rotate');
            // 监听转身完毕
            if (callback) {
                $me.on(animationEnd, function() {
                    callback();
                    $(this).off();
                })
            }
        }
    }
}