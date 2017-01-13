(function(window, angular, undefined) {

    'use strict';

    angular.module('ngSwiper', [])
        .directive('ngSwiperContainer', SwiperContainer)
        .directive('ngSwiperSlide', SwiperSlide);

    function createUUID() {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    /* @ngInject */
    function SwiperContainer($log) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                slidesPerView: '=',
                spaceBetween: '=',
                paginationClickable: '=',
                showNavButtons: '=',
                showPagination: '=',
                loop: '=',
                autoplay: '=',
                speed: '=',
                loopedSlides: '=',
                initialSlide: '=',
                containerCls: '@',
                paginationCls: '@',
                slideCls: '@',
                direction: '@'
            },
            controller: function($scope, $element) {

                this.buildSwiper = function() {

                    var slidesPerView = $scope.slidesPerView || 1;
                    var slidesPerColumn = $scope.slidesPerColumn || 1;
                    var paginationClickable = $scope.paginationClickable || true;
                    var spaceBetween = $scope.spaceBetween || 0;
                    var direction = $scope.direction || 'horizontal';
                    var showNavButtons = $scope.showNavButtons || false;
                    var showPagination = $scope.showPagination || false;
                    var loop = $scope.loop || false;
                    var autoplay = $scope.autoplay || false;
                    var speed = $scope.speed || 350;
                    var loopedSlides = $scope.loopedSlides || null;
                    var initialSlide = $scope.initialSlide || 0;

                    var params = {
                        slidesPerView: 'auto',
                        slidesPerColumn: 1,
                        paginationClickable: false,
                        spaceBetween: 0,
                        direction: 'horizontal',
                        loop: loop,
                        loopedSlides: loopedSlides,
                        initialSlide: 0,
                        speed: speed,
                        autoplay: autoplay,
                        autoplayDisableOnInteraction: false
                    };

                    if (showPagination === true) {
                        params.pagination = '#paginator-' + $scope.swiper_uuid;
                    }

                    if (showNavButtons === true) {
                        params.nextButton = '#nextButton-' + $scope.swiper_uuid;
                        params.prevButton = '#prevButton-' + $scope.swiper_uuid;
                    }

                    var containerCls = $scope.containerCls || '';

                    var swiper = new Swiper($element[0].firstChild, params);
                };
            },

            link: function(scope, element, attrs) {

                var uuid = createUUID();

                scope.swiper_uuid = uuid;

                var paginatorId = "paginator-" + uuid;
                var prevButtonId = "prevButton-" + uuid;
                var nextButtonId = "nextButton-" + uuid;

                angular.element(element[0].querySelector('.swiper-pagination'))
                    .attr('id', paginatorId);

                angular.element(element[0].querySelector('.swiper-button-next'))
                    .attr('id', nextButtonId);

                angular.element(element[0].querySelector('.swiper-button-prev'))
                    .attr('id', prevButtonId);
            },

            template: '<div class="swiper-container {{containerCls}}"><div class="swiper-wrapper" ng-transclude></div><div class="swiper-pagination"></div><div class="swiper-button-next" ng-show="showNavButtons"><i class="fa fa-chevron-right"></i></div><div class="swiper-button-prev" ng-show="showNavButtons"><i class="fa fa-chevron-left"></i></div></div>'
        }
    }

    /* @ngInject */
    function SwiperSlide($timeout) {
        return {
            restrict: 'E',
            require: '^ngSwiperContainer',
            transclude: true,
            template: '<div ng-transclude></div>',
            replace: true,
            link: function(scope, element, attrs, containerController) {
                if (scope.$last === true) {
                    $timeout(function() {
                        containerController.buildSwiper();
                    }, 0);
                }
            }
        }
    }

})(window, angular, undefined);
