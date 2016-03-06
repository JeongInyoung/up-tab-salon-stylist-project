/*! "Kalypto - Replace Radio/Checkbox Inputs" MIT license, LocalPCGuy, http://localpcguy.github.com/Kalypto */
/********************************
* Kalypto - Replace checkboxes and radio buttons
* Created & copyright (c)  by Mike Behnke
* v.0.2.2
* http://www.local-pc-guy.com
* Twitter: @LocalPCGuy
*
* Released under MIT License
*
* usage:
*        $("input[name=rDemo]").kalypto();
*        $("#checkboxDemo").kalypto();
* events: (bound on the input)
*        k_elbuilt: when an element is built
*        k_checked: when an element is checked
*        k_unchecked: when an element is checked
********************************/
; (function ($, undefined) {

	$.kalypto = function (element, options) {

		var plugin = this,

		$element = $(element),

		defaults = {
			toggleClass      : "k_toggle",
			checkedClass     : "checked",
			hideInputs       : false,
			copyInputClasses : true,
			dataLabel        : $element.data("label") || "",
			checkedEvent     : "k_checked",
			uncheckedEvent   : "k_unchecked",
			elBuiltEvent     : "k_elbuilt",
			customClasses    : ""
		},

		$customEl,

		buildCustomElement = function () {

			if ($element.next().hasClass(plugin.settings.toggleClass)) { return; }

			$element.after(function () {

				var classes = plugin.settings.toggleClass;

				if (plugin.settings.copyInputClasses) {
					var elClass = $element.attr("class") && $element.attr("type") === "checkbox";
					if(elClass){ classes += " " + elClass; }
				}

				if (plugin.settings.customClasses.length) {
					classes += " " + plugin.settings.customClasses;
				}

				if ( $element.is(":checked") ) {
					return '<a href="#" aria-hidden="true" class="' + classes + ' ' + plugin.settings.checkedClass + '">' + plugin.settings.dataLabel + '</a>';
				} else {
					return '<a href="#" aria-hidden="true" class="' + classes + '">' + plugin.settings.dataLabel + '</a>';
				}
			});

			if (plugin.settings.hideInputs) {
				$element.hide();
			}

			$customEl = $element.next();

			$element.trigger(plugin.settings.elBuiltEvent);

		},

		lastClickedEl,

		handleChange = function (e) {
			var $elementCollection = $element.attr("type") === "radio" ? $('input[type="' + $element.attr("type") + '"]') : $element,
				doTriggerAndChangeClasses = function() {
					if ($element.attr("type") === "radio") {
						$elementCollection.each(function (k, el) {
							var $el = $(el);
							$el.next().removeClass(plugin.settings.checkedClass);
							if (!$el.is(":checked") && plugin.lastClickedEl !== $el.next().get(0)) {
								// Should this only trigger on the radio button that was previously checked
								// Currently fires on all radio buttons BUT the one justed checked
								$el.trigger(plugin.settings.uncheckedEvent);
							}
						});
					}
					if ($element.is(":checked")) { $element.trigger(plugin.settings.checkedEvent); }
					else { $element.trigger(plugin.settings.uncheckedEvent); }
					$element.next().toggleClass(plugin.settings.checkedClass);
				};

			if (this.nodeName !== "INPUT") {
				e.preventDefault();
				plugin.lastClickedEl = this;
				$element.trigger('click');
			} else {
				setTimeout(doTriggerAndChangeClasses, 0);
			}

		},

		initEvents = function () {
			$element.on("change", handleChange);
			$element.next().on("click", handleChange);
		};

		// 플러그인 옵션 객체
		plugin.settings = {};

		// 플러그인 초기화 함수
		plugin.init = function () {
			// 플러그인 옵션 객체 = 기본 객체 < 사용자 옵션 객체 덮어쓰기
			plugin.settings = $.extend({}, defaults, options);
			buildCustomElement();
			initEvents();
		};

		// 플러그인 초기화 함수 실행
		plugin.init();

	};

	$.fn.kalypto = function (options) {
		return this.each(function () {
			if (undefined === $(this).data('kalypto')) {
				var plugin = new $.kalypto(this, options);
				$(this).data('kalypto', plugin);
			}
		});
	};

})(jQuery);
