import './styles/app.scss';
import $ from 'jquery';

$('.next').on('click', function() {
	$('html, body').stop().animate({
		scrollTop: $('#about').offset().top - 50,
	}, 500);
});