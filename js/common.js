jQuery(function($) {

	$('.rand').each(function(){
		var $divs = $(this).children('div');
		var arr = [];
		$divs.each(function(){
			arr.push($(this).detach());
		});
		arr.sort(function(a, b){
			return Math.random() - 0.5;
		});
		for (var index in arr) {
			$(this).append(arr[index]);
		}
	});

	//E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);
		var btnSubmit = th.find('button[type="submit"]');
		btnSubmit.attr("disabled", true);
		var url = window.location.href;
		var replUrl = url.replace('?', '&');
		$.ajax({
			type: "POST",
			url: "/mail.php", //Change
			data: th.serialize() +'&referer=' + replUrl
		}).done(function( data ) {
			// console.log( "success data:", data );
			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: (data == 'OK') ? '.thanks' : '.error',
						type: 'inline'
					}
				});
				if(data == 'OK'){
					th.trigger("reset");
				}
				btnSubmit.removeAttr("disabled");
			}, 1000);
		}).fail(function() {
			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: '.error',
						type: 'inline'
					}
				});
				btnSubmit.removeAttr("disabled");
			}, 1000);
		});
		return false;
	});

	$("section h2, .offer-head .descr, .offer-form,.car .benefit, .car .price, .car2 .price").animated("fadeInUp", "fadeInUp");
	$("h1, .subtitle, .maps .dealer:nth-child(odd) .dealer-info").animated("fadeInLeft", "fadeInLeft");
	$(".hero-form, .maps .dealer:nth-child(even) .dealer-info").animated("fadeInRight", "fadeInRight");

	$('.reviews__block').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		dots: true,
		arrows: false,
		adaptiveHeight: true,
		// centerMode: true,
		// variableWidth: true,
		responsive: [
		{
			breakpoint: 992,
			settings: {
				slidesToShow: 2,
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
			}
		},
		]
	});

	$('.reviews__item').animated('fadeInDown', 'fadeInDown');

	if ($(window).width() > 768) {
		$('.player').mb_YTPlayer();
	}
		
	$('a[href*=#].scroll').bind("click", function(e){
		var anchor = $(this);
		var id = anchor.attr('data');
		$('html, body').stop().animate({
			scrollTop: $(anchor.attr('href')).offset().top - 120
		}, 700);
		$(anchor.attr('href')).parent().addClass('active');
		$(anchor.attr('href')).children('h2').addClass('mypulse').removeClass('fadeInUp');
		setTimeout(function(){
			$(anchor.attr('href')).parent().removeClass('active');
			$(anchor.attr('href')).children('h2').removeClass('mypulse');
		}, 5000);
		e.preventDefault();
	});

	$('.disclamer_switch').click(function(){
		$('.disclamer').slideToggle({
			start: function(){
				$("html, body").animate({scrollTop: $("html, body").height()},"slow");
			}
		});
		return false;
	});

	$('.top').click(function() {
		$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
	});
	$(window).scroll(function() {
		if ($(this).scrollTop() > $(window).height()) {
			$('.top').addClass("active");
		} else {
			$('.top').removeClass("active");
		};
	});

	$('.modal-link').magnificPopup({
		type: 'inline',
		fixedContentPos: true,
		preloader: false,
	});

	$('a[href="#popup"]').on('click', function(){
		$('.overlay').show();
		$('.privacy-wrap').show();
		$('html').css({
			'margin-right': '17px',
			'overflow': 'hidden'
		});
		return false;
	});
	$('.overlay, .privacy-close').on('click', function(){
		$('.overlay').hide();
		$('.privacy-wrap').hide();
		$('html').removeAttr('style');
	});

	$('a[href="#credit"]').click(function(){
		var parent = $(this).parent().parent();
		var price = '';

		if(parent.hasClass('car2-bottom') && price != 'undefined') {
			price = parent.parent().find('.relevant-price').text();
		}
		else {
			price = parent.find('.relevant-price').text();
		}

		if ($(this).data('price')) {
			price = $(this).data('price');
		}

		var str = price.replace(/[^\d]/g, '');
		$('.contribution').find('.range').attr('max', str);
		$('.contribution').find('.range__interval-txt_max').text(str);
		try {
			input_range_init('.hyundai-form', '.contribution', 0, str, 10000);
		} catch (err) {};
		try {
			input_range_init('.hyundai-form', '.term', 0, 72, 1);
		} catch (err) {};
	});

	$('a[href="#cheaper"]').on('click', function(){
		var th = $(this);
		var parent = th.closest('.car');
		var model = parent.find('h2').text();
		$('#cheaper form .val-model, #credit form .val-model').val(model);
	});

	$('a[href="#callbackForm"]').on('click', function(){
		var title = $(this).data('title');
		if(title) 
			$('#callbackForm').find('h2').text(title);
		else
			$('#callbackForm').find('h2').text($(this).text());
	});

	// $('input[type="tel"]').mask('8 (999) 999-99-99');

	$('.lazyload').lazyload();



});