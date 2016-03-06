(function($){
	$.fn.popupLayer = function(className, closeBtn){
		var _this = this,
			$doc = $(document),
			// __popupLayer 객체
			__popupLayer = {
				target: null,
				targetClassName: null,
				name: null,
				init: function($this, _name) {
					var _this = this;
					_this.name = _name;
					_this.targetClassName = $this.data('target');
					_this.target = $(_this.targetClassName);
					$this.on('click', _this.open.bind(_this));
					_this.target.on('click', _this.close.bind(_this));
					_this.escCancel();
				},
				open: function(evt) {
					var _this = this;
					evt.preventDefault();
					_this.target.addClass(_this.name);
				},
				close: function(evt) {
					var _this = this;
					var $this = $(evt.target);
					var _closeClassName = closeBtn ? closeBtn : '.close';
					if( $this.is(_closeClassName) || $this.is(_closeClassName + ' span') || $this.is(_this.targetClassName) ) {
						event.preventDefault();
						_this.target.removeClass(_this.name);
					}
				},
				escCancel: function(){
					var _this = this;
					$doc.keyup(function(evt){
						if(evt.which == '27'){ // 27 => ESC 키
							_this.target.removeClass(_this.name);
						}
					});
				}
			};

		return $.each(_this, function(index, item) {
			var $this = _this.eq(index); // jQuery 순환객체
			__popupLayer.init($this, (className ? className : 'is-visible'));
		});
	};
}(window.jQuery));