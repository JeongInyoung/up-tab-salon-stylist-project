// 토글 메뉴 플러그인
(function toggleShow() {

	// 토글 메뉴 버튼
	var toggleBtn = [
			$('.store-search-set li .toggle'),
			$('.designer-search-set li .toggle'),
			$('.hair-style-set li .btn-down'),
		],
	// 토글 패널
		togglePanel = [
			$('.store-search-set li ul'),
			$('.designer-search-set li ul'),
			$('.hair-style-set li .panel'),
		];

	// 토글 패널 제어 : 'active' Class명으로 패널 스타일 구현
	for (var i = 0; i <= toggleBtn.length-1; i++) {
		toggleBtn[i].click(function(e) {
			e.preventDefault();
			if(!$(this).parent().hasClass('active')) {
				for (var e = 0; e <= toggleBtn.length-1; e++) {
					toggleBtn[e].removeClass('active');
					togglePanel[e].filter(':visible').slideToggle();
				}
				$(this).addClass('active').next().stop().slideToggle();
			} else {
				$(this).removeClass('active');
				$(this).next().stop().slideToggle();
			}
			return;
		});
	};

})();