document.addEventListener("DOMContentLoaded", function() {
    var $$$ = function(name) { return document.querySelector(name) },
        $$ = function(name) { return document.querySelectorAll(name) };

    function maskphone(e) {
        // var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        // e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        var num = this.value.replace('+7', '').replace(/\D/g, '').split(/(?=.)/),
            i = num.length;
        if (0 <= i) num.unshift('+7');
        if (1 <= i) num.splice(1, 0, ' ');
        if (4 <= i) num.splice(5, 0, ' ');
        if (7 <= i) num.splice(9, 0, '-');
        if (9 <= i) num.splice(12, 0, '-');
        if (11 <= i) num.splice(15, num.length - 15);
        this.value = num.join('');
    };

    $$("input[type=tel]").forEach(function(element) {
        element.addEventListener('focus', maskphone);
        element.addEventListener('input', maskphone);
    });
});