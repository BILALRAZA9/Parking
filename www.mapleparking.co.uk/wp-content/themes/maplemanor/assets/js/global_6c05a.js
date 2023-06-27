function quoteFormVerify(feedback) {
	feedback = typeof feedback !== 'undefined' ? feedback : true;
	var $ = jQuery;
	var me = $('#home-quote');

	var start = Date.parse($('input[name="departure-date_submit"]').val() + " " + $('#depart-hours').find(":selected").val() + ":" + $('#depart-minutes').find(":selected").val());
	var end =   Date.parse($('input[name="return-date_submit"]').val() +  " " + $('#return-hours').find(":selected").val() + ":" + $('#return-minutes').find(":selected").val());

	if(start >= end) {
		if(feedback) alert("The return date and time is before the arrival date and time in your selection.");
		return false;
	}
	var okay = true;

	me.find('input[type="text"], select').each(function() {
		if ($(this).prop('required') == false)
		{
			return;
		}

		$(this).removeClass('booking-error');
		$(this).removeClass('booking-success');

		if(typeof $(this).val() == 'undefined' || !$(this).val() || $(this).val().length <= 0) {
			if(feedback) $(this).addClass('booking-error');
			okay = false;
		}
	});
	if(!okay) {
		if(feedback) alert("Please fill out all fields.");
	}
	return okay;
}

function activateDatePickers() {
	var $ = jQuery;

	$(".date-picker").pickadate({
		formatSubmit: 'yyyy-mm-dd',
		min: new Date(),
		max: new Date(2050,2,10)
	});

	$('.end-date-picker').change(function() {

	});
	$('.start-date-picker').change(function() {
		if($(this).val().length > 0) {
			$('.end-date-picker').pickadate('picker').set('min', $(this).val());
		} else {
			$('.end-date-picker').pickadate('picker').set('min', new Date());

		}
		var start = Date.parse($('input[name="departure-date_submit"]').val());
		var end =   Date.parse($('input[name="return-date_submit"]').val());
		if(start > end) {
			$('.end-date-picker').pickadate('picker').clear();
		}
	});

	$('.home-quote').submit(function(e) {
		var q = $("input[name='vouchercode']").val();
		var button = $(this).find('button[type="submit"]');
		var hasVoucher = false;
		var voucherSuccess = false;
		if(q.length) {
			button.prop('disabled', true);
			button.html("Submitting...");
			console.log("Has Voucher.");
			hasVoucher = true;
			$.ajax({
				url: ajax_object.ajaxurl,
				data: {
					action: "findDiscountCode",
					q: q,
					homepage: true,
				},
				success: function (r) {
					button.html('Submit');
					button.prop('disabled', false);
					if(r.success) {
						console.log("voucher success.");
						voucherSuccess = true;
					} else {
						alert(r.message);
						console.log("voucher fail.");
					}
				},
				dataType: 'json',
				async: false
			});
		} else {
			console.log("Has no voucher.");
		}
		if(hasVoucher && !voucherSuccess) {
			console.log("returning false.");
			return false;
		}
		console.log("returning verify.");
		return quoteFormVerify();
	});



	/*if($('.start-date-picker').val().length > 0) {
		$('.end-date-picker').pickadate('picker').set('min', $(this).val());
	} else {
		$('.end-date-picker').pickadate('picker').set('min', new Date());
	}
	if($('.end-date-picker').val().length > 0) {
		alert('test');
		$('.start-date-picker').pickadate('picker').set('max', $(this).val());
	}*/

	$('.time-picker').pickatime({
		formatSubmit: 'HH:i',
		interval: 5,
		clear: false
	});

	$('.hour-picker').pickatime({
		format: 'HH',
		interval: 60,
		//min: [1, 0],
		//max: [24, 0],
		formatSubmit: 'HH',
		clear: false
	});

	$('.minute-picker').pickatime({
		format: 'i',
		interval: 5,
		max: [0, 55],
		formatSubmit: 'i',
		clear: false
	});
};

jQuery(function($) {

	$('.logo-slider').slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		arrows: false
	});

    $('.meet-logo-slider').slick({
		infinite: true,
		slidesToShow: 6,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		arrows: false
	});

	$('.homepage-slider').slick({
		dots: true,
		autoplay: true,
		autoplaySpeed: 6000
	});

	activateDatePickers();
	$('#home-quote input, #home-quote select').change(function() {
		$(this).addClass('booking-success');
	});

	$('#home-quote').submit(function(e) {
		return quoteFormVerify();
	});
	$('.form-group .form-control').focus(function(){
		$(this).siblings('label.hide-show').fadeIn('300');
	});

	$('.form-group .form-control').blur(function(){
		var value = $(this).val();
		if (value.length == 0) {
			$(this).siblings('label.hide-show').fadeOut('300');
		};
	});

	$('[data-toggle="tooltip"]').tooltip();

	$('body').delegate('#btn-discount-add', 'click', function(e) {
		e.preventDefault();
		var me = $(this);
		me.html('Searching...<i class="fa fa-spinner fa-pulse"></i>');
		me.prop('disabled', true);
		var value = $('#discount-add').val();
		$('#discount-add').prop('disabled', true);
		$.get(
			ajax_object.ajaxurl,
			{
				action: "findDiscountCode",
				q: value,
			},
			function(r) {
				$('#discount-add').prop('disabled', false);
				$('#discount-add').val('');
				if(r.success) {
					$('#summary-panel').replaceWith(r.summary);
					$('#btn-discount-add').html('Applied');
					$('#btn-discount-add').prop('disabled', true);
				} else {
					alert(r.message);
					me.html('Apply');
					me.prop('disabled', false);
				}
			},
			'json'
		);
	});

});
