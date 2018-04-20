;(function(){
	'use strick';

	const handHour = document.querySelector('.hour-hand');
	const handMin = document.querySelector('.min-hand');
	const handSecond = document.querySelector('.second-hand');
	
	function setTime() {

		const now = new Date();
	
		const H = now.getHours(),
			  M = now.getMinutes(),
			  S = now.getSeconds();

		const secDegrees = (( S / 60 ) * 360) + 90;
		handSecond.style.transform = `rotate(${secDegrees}deg)`;

		const minDegrees = (( M / 60 ) * 360) + 90;
		handMin.style.transform = `rotate(${minDegrees}deg)`;
		
		const hourDegrees = (( H / 12 ) * 360) + 90;
		handHour.style.transform = `rotate(${hourDegrees}deg)`;

		[handHour, handMin, handSecond].forEach(el => el.style.transition = (S === 0) ? 'none' : null );
		// console.log(h);
		// console.log(m);
		// console.log(secDegrees);
	}

	setInterval( setTime, 1000);

	// setTime();

}());
