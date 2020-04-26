function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last, deferTimer;
    return function() {
        var context = scope || this;
        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function() {
                last = now;
                fn.apply(context, args)
            }, threshhold)
        } else {
            last = now;
            fn.apply(context, args)
        }
    }
}

function input_range_getGradient(parent, item, color1, color2, percentage, el_style) {
    var gradient = "linear-gradient(to right, ";
    var breakPoint = percentage * 100;
    var attrValue = gradient + color1 + " 0%, " + color1 + " " + breakPoint + "%, " + color2 + " " + breakPoint + "%, " + color2 + " 100%)";
    var fieldSelector = parent + ' ' + item + ' .range';
    var styleValue = fieldSelector + '::-webkit-slider-runnable-track{\nbackground:' + attrValue + ';\n}\n' + fieldSelector + '::-moz-range-track{\nbackground:' + attrValue + ';\n}';
    styleValue += '\n' + fieldSelector + '::-ms-fill-upper{\nbackground:' + color2 + ';\n}\n' + fieldSelector + '::-ms-fill-lower{\nbackground:' + color1 + ';\n}';
    $(el_style).html(styleValue)
}

function input_range_updateval(parent, item, el_style) {
    var input = $(parent).find('' + item + ' .range');
    var value = input.val();
    var max = input.attr('max') * 1;
    var realMax = input.attr('data-realMax') * 1;
    var min = input.attr('min') * 1;
    value = value >= realMax ? realMax : value;
    var dist = value >= realMax ? realMax - min : realMax - min;
    var percentage = (value - min) / dist;
    var inputWidth = input.width();
    var thumbWidth = 21;
    var selectedColor = "#000";
    var nonSelectedColor = "#f4f4f4";
    input_range_getGradient(parent, item, selectedColor, nonSelectedColor, percentage, el_style);
    var offLeft = Math.floor(percentage * (inputWidth - thumbWidth) + thumbWidth / 2);
    input.next('.range__value-txt').html(value).css({
        'left': offLeft + 'px',
        'display': 'block'
    })
}

function input_range_init(parent, item, min, realMax, step) {
    var max = (step>1) ? (Math.floor(realMax/step)+1)*step : realMax;
    $(parent).find('' + item + ' .range').attr({
        'min' : min,
        'max' : max,
        'step' : step,
        'value' : max/2,
        'data-realMax' : realMax
    });
    var el = $(parent).find('' + item + '');
    var el_style = document.createElement('style');
    $(el_style).addClass('range-' + parent + '-' + item);
    el.append(el_style);
    el.find('.range').on("input change", function() {
        input_range_updateval(parent, item, el_style)
    });
    $(window).bind('resize', throttle(function() {
        input_range_updateval(parent, item, el_style)
    }, 200));
    input_range_updateval(parent, item, el_style)
}