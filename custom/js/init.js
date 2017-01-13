/* eslint no-alert: 0 */

'use strict';
//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('MobileAngularUiExamples', [
    'ngRoute',
    'mobile-angular-ui',
    'ngSwiper',
    'infinite-scroll',
    'ngTouch'
   // 'ngAnimate'
    // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'.
    // This is intended to provide a flexible, integrated and and
    // easy to use alternative to other 3rd party libs like hammer.js, with the
    // final pourpose to integrate gestures into default ui interactions like
    // opening sidebars, turning switches on/off ..
    //'mobile-angular-ui.gestures'
],function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

});
//
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false'
// in order to avoid unwanted routing.
//
app.config(function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});
app.config(function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'home.html', reloadOnSearch: false});
    $routeProvider.when('/buy', {templateUrl: 'secKill/index.html', reloadOnSearch: false});
    $routeProvider.when('/orderPay', {templateUrl: 'secKill/orderPay.html', reloadOnSearch: false});
    $routeProvider.when('/buyGroup', {templateUrl: 'secKill/buyGroup.html', reloadOnSearch: false});
    $routeProvider.when('/groupA/:id', {templateUrl: 'secKill/groupItemA.html', reloadOnSearch: false});
    $routeProvider.when('/groupC/:id', {templateUrl:'secKill/groupItemC.html',reloadOnSearch: false});
    $routeProvider.when('/addInfo/:id', {templateUrl:'secKill/addInfo.html',reloadOnSearch: false});
    $routeProvider.when('/verify', {templateUrl:'secKill/verify.html',reloadOnSearch: false});

    $routeProvider.when('/newsList', {templateUrl:'news/index.html',reloadOnSearch: false});
    $routeProvider.when('/market', {templateUrl:'news/market.html',reloadOnSearch: false});
    $routeProvider.when('/evaluate', {templateUrl:'news/evaluate.html',reloadOnSearch: false});
    $routeProvider.when('/article/:id', {templateUrl:'news/article.html',reloadOnSearch: false});

    $routeProvider.when('/disAddInfo/:id', {templateUrl:'discount/addInfo.html',reloadOnSearch: false});
    $routeProvider.when('/groupB/:id', {templateUrl: 'discount/groupItemB.html', reloadOnSearch: false});
    $routeProvider.when('/discount', {templateUrl: 'discount/index.html', reloadOnSearch: false});
    $routeProvider.when('/onSell/:id', {templateUrl: 'discount/onSell.html', reloadOnSearch: false});
    $routeProvider.when('/disList', {templateUrl: 'discount/disList.html', reloadOnSearch: false});
    $routeProvider.when('/disAllCars', {templateUrl: 'discount/disCarModels.html', reloadOnSearch: false});
    $routeProvider.when('/carsParam/:id', {templateUrl: 'carsParam.html', reloadOnSearch: false});
    $routeProvider.when('/carCity', {templateUrl: 'city.html', reloadOnSearch: false});

    $routeProvider.when('/inquiry', {templateUrl: 'ls_inquiry/inquiry.html', reloadOnSearch: false});
    $routeProvider.when('/dataApplication/:id', {templateUrl: 'ls_carBuying/dataApplication.html', reloadOnSearch: false});
    $routeProvider.when('/buyingStage/:id', {templateUrl: 'ls_carBuying/buyingStage.html', reloadOnSearch: false});
    $routeProvider.when('/carBuying', {templateUrl: 'ls_carBuying/carBuying.html', reloadOnSearch: false});
    $routeProvider.when('/buyingCity', {templateUrl: 'ls_carBuying/city.html', reloadOnSearch: false});

    $routeProvider.when('/chooseCar', {templateUrl: 'ls_carModel/chooseCar.html', reloadOnSearch: false});
    $routeProvider.when('/condition', {templateUrl: 'ls_carModel/condition.html', reloadOnSearch: false});
    $routeProvider.when('/carDetails/:id', {templateUrl: 'ls_carModel/carDetails.html', reloadOnSearch: false});
    $routeProvider.when('/Consultation', {templateUrl: 'ls_WordOfMouth/Consultation.html', reloadOnSearch: false});
    $routeProvider.when('/models', {templateUrl: 'ls_carModel/models.html', reloadOnSearch: false});

    $routeProvider.when('/violationQuery', {templateUrl: 'violationquery.html', reloadOnSearch: false});
    $routeProvider.when('/OilCardRecharge', {templateUrl: 'OilCardRecharge.html', reloadOnSearch: false});
    $routeProvider.when('/FindParking', {templateUrl: 'FindParking.html', reloadOnSearch: false});


});
/**
 * 获取广告位数据
 */
app.factory('ad_banner',['$http','$q',function($http,$q){
    return{
        query:function(){
            var defer = $q.defer();  //声明延后执行
            var promise_ = defer.promise;
            $http({method:'GET',url:'/api/?ac=ad&op=get_ad'}).
                success(function(response, header, config, status){
                    defer.resolve(response.ad);  //声明执行成功
                }).
                error(function(response, header, config, status){
                    defer.reject();      //声明执行失败
                }
            );

            return promise_; //返回承诺，返回获取数据的API \';
        }
    }
}]);

/*------------------<runoob-hr></runoob-hr> */
app.directive('wlxHr', function () {
    return {
        restrict: "A",
        template: "<h1>自定义指令!</h1>"
    };
});

app.controller('MainController', function ($rootScope, $scope, SharedState) {
    $rootScope.ifCityBar = false;
    $rootScope.carBuyingCity=['52','北京'];
    $scope.swiped = function (direction) {
        alert('Swiped ' + direction);
    };

    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;
    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    });
    $rootScope.openCityBar = function(){
        $rootScope.ifCityBar = true;
    }
    /*$('.app-content').on('touchend',function(e){
        e.preventDefault();
    });*/

    $rootScope.goBack = function(){
        $rootScope.ifCityBar = false;
        history.go(-1);
    }
});

/*------------------ctrl.js*/
/**
 * Created by Administrator on 2016/11/7.
 */
app.controller('homeCtrl', function($rootScope, $scope , ad_banner,$window) {
    $rootScope.bottomBar = false;
    $scope.menuList = [
        {
            'img':'custom/img/h_icon1.png',
            'label':'口碑资讯',
            'link':'#/newsList',
            'show':'yes'
        },
        {
            'img':'custom/img/h_icon3.png',
            'label':'口碑车型',
            'link':'#/models',
            'show':'yes'
        },
        {
            'img':'custom/img/h_icon4.png',
            'label':'惠购车',
            'link':'#/discount',
            'show':'yes'
        },
        {
            'img':'custom/img/b_icon1.png',
            'label':'团购秒杀',
            'link':'#/buy',
            'show':'yes'
        }
        /*,
         {
         'img':'custom/img/h_icon2.png',
         'label':'口碑评论',
         'link':'javascript:;',
         'show':'no'
         }*/
    ];
    $scope.subMenuList = [
        {
            'img':'custom/img/b_icon2.png',
            'label':'实时询价',
            'link':'#/inquiry',
            'show':'yes'
        },
        {
            'img':'custom/img/b_icon3.png',
            'label':'购车分期',
            'link':'#/carBuying',
            'show':'yes'
        },
        {
            'img':'custom/img/b_icon4.png',
            'label':'违章查询',
            'link':'#/violationQuery',
            'show':'yes'
        },
        {
            'img':'custom/img/b_icon5.png',
            'label':'车险购买',
            'link':'javascript:alert("正在建设中");',
            'show':'yes'
        },
        {
            'img':'custom/img/b_icon6.png',
            'label':'油卡充值',
            'link':'#/OilCardRecharge',
            'show':'yes'
        },
        {
            'img':'custom/img/b_icon7.png',
            'label':'查找停车',
            'link':'#/FindParking',
            'show':'yes'
        },
        {
            'img':'custom/img/b_icon8.png',
            'label':'维修保养',
            'link':'javascript:alert("正在建设中");',
            'show':'no'
        }];
    $scope.olen = [];
    deviceDataToRow($scope.subMenuList,$scope.olen);
    /**
     * 首页 轮播数据
     * */
    var promise = ad_banner.query();  //同步调用，获取承诺接口
    promise.then(
        function(response){
            console_("homeCtrl ---- success");
            console_(response);
            $scope.banner_home1=response[1][1];
            $scope.banner_home2=response[1][2][0];
        },function(response){
            console_("homeCtrl ---- error");
            console_(response);
        }
    );
});
//惠购车页banner接口
app.controller('ceDiscount', function($rootScope, $scope ,$http,$swipe, ad_banner) {
    //获取惠购车banner信息
    var promise = ad_banner.query();  //同步调用，获取承诺接口
    promise.then(
        function(response){
            $scope.banner_home1=response[2][1];
        },function(response){
            console_("homeCtrl ---- error");
            console_(response);
        }
    );
    //获取最新发布信息
    $http({method:'GET',url:'/api/?ac=benefits&op=benefits_lists',params :{ 'order_type' : 'new'}}).
        success(function(response, header, config, status , $location){
            console_(response );
            $scope.discount_list = response.discount_list;
        }).
        error(function(response, header, config, status){
            console_("惠购车---- error");
        }
    );
    $scope.itemIndex = true;
    console.log($swipe);
    $scope.haha = function(){
        console.log(3);
    }
});
//惠购车页banner接口
app.controller('ceDiscountList', function($rootScope, $scope ,$http) {
    var order_type;
    var currentPage=0;
    var nextPage =1;
    $scope.discount_list = [];
    $scope.title = '最新发布';
    $scope.initList = function(_order_type){
        order_type = _order_type;
        $scope.ifPanel = false;
        switch (order_type){
            case 'all':
                break;
            case 'new':
                $scope.title = '最新发布';
                break;
            case 'difference':
                $scope.title = '降幅最高';
                break;
            case 'price':
                $scope.title = '价格最低';
                break;
        }
        currentPage=0;
        nextPage = 1;
        //获取最新发布信息
        $scope.discount_list = [];
        $scope.loadNewList();

    }

    $scope.loadNewList = function(){
        console.log('下一页');
        if(currentPage == nextPage){
            console.log('已是最后一页');
            return;
        }
        //获取最新发布信息
        $http({method:'GET',url:'/api/?ac=benefits&op=benefits_lists',params :{ 'order_type' :order_type,'p':nextPage}}).
            success(function(response){
                $scope.discount_list = $scope.discount_list.concat(response.discount_list);
                currentPage = response.multi.current;
                nextPage = response.multi.next;
            }).
            error(function(response, header, config, status){
                console_("惠购车---- error");
            }
        );
    }
});
//----------惠购车全部车型
app.controller('disAllCars', function($scope,$location,$http,$anchorScroll) {
    $http({method:'GET',url:'/api/?ac=benefits&op=all_car'}).
        success(function(response, header, config, status , $location){
            $scope.charSets = response.first_char;
            $scope.brand_type_lists = response.brand_type_lists;
            console_($scope.charSets);
        }).
        error(function(response, header, config, status){
            console_("惠购车---- error");
        }
    );


    $scope.modalShow = false;
    $scope.openModalPanel = function(brandId){
        $scope.currentBrandList = $scope.brand_type_lists[brandId];
        $scope.modalShow = true;
    }
    $scope.closeModalPanel = function(){
        $scope.modalShow = false;
    }
    $scope.stopClose = function(e){
        e.stopImmediatePropagation();
    }
    /*打开当前品牌类所有车型*/
    $scope.gotoModalDetail = function(id){
        //e.stopImmediatePropagation();
        console.log(id);
        window.location.href='#/onSell/'+id;
    }

    $scope.gotoLetter = function(letter){
        $anchorScroll.yOffset = 50;
        $location.hash(letter+'_link');
        $anchorScroll();
        $location.hash('');
    }



});
//惠购车详情页
app.controller('groupItemB', function($rootScope, $scope,$http , $routeParams) {
    var id = $routeParams.id;
    $http({method:'GET',url:'/api/?ac=benefits&op=benefits_details',params:{'id':id}}).
        success(function(response, header, config, status , $location){
            $scope.details_data = response.details;
        }).
        error(function(response, header, config, status){
            console_("BuyGroup-details ---- error");
        }
    );
    $scope.dis_id = id;
});
//惠购车降价页
app.controller('ceOnSell', function($rootScope, $scope,$http,$routeParams) {

    $http({method:'GET',url:'/api/?ac=benefits&op=benefits_lists',params :{ 'series_id' : $routeParams.id}}).
        success(function(response, header, config, status , $location){
            $scope.onSelllist = response.discount_list;
        }).
        error(function(response, header, config, status){
            console_("惠购车---- error");
        }
    );
});
//惠车购信息提交
app.controller('ceDisBuyInfoCtrl', function($rootScope, $scope,$http , $routeParams) {
    $http({method:'GET',url:'/api/?ac=benefits&op=benefits_details&color=1',params:{'id':$routeParams.id}}).
        success(function(response, header, config, status , $location){
            console_(response);
            $scope.details_data     = response.details;
            $scope.car_color        = response.details.in_color;
            $scope.car_inner_color  = response.details.out_color;

            /**
             * 初始化提交数据
             */
            $scope.submit_data = {
                car_color: "",
                car_color_name: "",
                car_in_color: "",
                car_in_color_name: "",
                name: "",
                mobile: "",
                //city: $scope.details_data.city.region_id,
                city: $rootScope.carBuyingCity[0],
                res_id: $scope.details_data.id,
                res_title: $scope.details_data.title,
                type: "2",
                type_name: "惠车购"
            };
        }).
        error(function(response, header, config , status){
            console_("BuyGroup-details ---- error");
        }
    );

    $scope.infoAdd = function(valid){
        if($scope.submit_data.name == ''){
            $scope.isPanel = true;
            $scope.ifName = true;
            return;
        }
        if($scope.submit_data.mobile == ''){
            $scope.isPanel = true;
            $scope.ifMobile = true;
            return;
        }
        if(!valid){
            return;
        }

        console.log($scope.submit_data);

        $http({method:'POST',url:'/api/?ac=order&op=submit_order',data:$scope.submit_data }).
            success(function(response, header, config, status , $location){
                console_( header );
                $scope.isPanel = true;
                switch(response.code){
                    case 0:
                        break;
                    case 1:
                        $scope.ifSubmit = true;
                        break;
                }
            }).
            error(function(response, header, config, status){

            }
        );

    };

    /*$scope.carColor = $scope.carTrim = 0;*/

    $scope.selectColor = function(index,color_obj){
        $scope.carColor = index;
        $scope.submit_data.car_color = color_obj.type_id;
        $scope.submit_data.car_color_name = color_obj.type_name;
    };

    $scope.selectTrim = function(index,color_obj){
        $scope.carTrim = index;
        $scope.submit_data.car_in_color = color_obj.type_id;
        $scope.submit_data.car_in_color_name = color_obj.type_name;
    };
});

//车型参数
app.controller('ceParam', function($rootScope, $scope,$http,$routeParams) {
    $scope.delData = function(index){
        $scope.carsList.splice(index,1);
        $scope.tWidth = $scope.carsList.length*100;
        $scope.t2Width = $scope.carsList.length*100+160;
    }
    $http({method:'GET',url:'/api/?ac=car&op=car_parameter_details',params :{ 'series_id' : $routeParams.id}}).
        success(function(response){
            console.log(response);
            $scope.carsList = response.carsList;
            $scope.paramList = response.paramList;
            $scope.tWidth = $scope.carsList.length*100;
            $scope.t2Width = $scope.carsList.length*100+160;
        }).
        error(function(response, header, config, status){
            console_("惠购车---- error");
        }
    );
    $('.param-2 .data-2').on('scroll',function(){
       $('.param-1 .data-1').scrollLeft($('.param-2 .data-2').scrollLeft());
    });
    $('.param-1 .data-1').on('scroll',function(){
        $('.param-2 .data-2').scrollLeft($('.param-1 .data-1').scrollLeft());
    });
});

//口碑资讯列表
app.controller('ceNewsList', function($rootScope, $scope,$http,ad_banner) {
    var promise = ad_banner.query();  //同步调用，获取承诺接口
    promise.then(
        function(response){
            $scope.banner_home1=response[5][1];
        },function(response){
            console_(response);
        }
    );

    $http({method:'GET',url:'/api/?ac=news&op=news_lists'}).
        success(function(response){
            $scope.newsList = response.news_list;
        }).
        error(function(response, header, config, status){
            console_("口碑资讯---- error");
        }
    );
});
//行情资讯列表
app.controller('ceMarketList', function($rootScope, $scope,$http) {
    var currentPage=0;
    var nextPage =1;
    $scope.newsList = [];
    $scope.loadNewList = function(){
        console.log('下一页');
        if(currentPage == nextPage){
            console.log('已是最后一页');
            return;
        }
        //获取最新发布信息
        $http({method:'GET',url:'/api/?ac=news&op=news_lists',params :{ 'type' : 1,'p':nextPage}}).
            success(function(response){
                $scope.newsList = $scope.newsList.concat(response.news_list);
                currentPage = response.multi.current;
                nextPage = response.multi.next;
                console.log(response);
            }).
            error(function(response, header, config, status){
                console_("口碑资讯---- error");
            }
        );
    }
});
//评测资讯列表
app.controller('ceEvaluate', function($rootScope, $scope,$http,ad_banner) {
    var currentPage=0;
    var nextPage =1;
    $scope.newsList = [];
    $scope.loadNewList = function(){
        console.log('下一页');
        if(currentPage == nextPage){
            console.log('已是最后一页');
            return;
        }
        //获取最新发布信息
        $http({method:'GET',url:'/api/?ac=news&op=news_lists',params :{ 'type' : 2,'p':nextPage}}).
            success(function(response){
                $scope.newsList = $scope.newsList.concat(response.news_list);
                currentPage = response.multi.current;
                nextPage = response.multi.next;
                console.log(response);
            }).
            error(function(response, header, config, status){
                console_("口碑资讯---- error");
            }
        );
    }
});
//文章详情
app.controller('ceArticle', function($rootScope, $scope,$http,$routeParams,$sce) {
    $http({method:'GET',url:'/api/?ac=news&op=news_details',params :{ 'id' : $routeParams.id}}).
        success(function(response){
            $scope.article = response.news_details[0];
            $scope.article.content = $sce.trustAsHtml($scope.article.content);
            $scope.article.addtime = $scope.article.addtime.substr(0,10);

            $scope.groupData = response.group;
            $scope.relatedData = response.news_related;
            console.log(response);
        }).
        error(function(response, header, config, status){
            console_("口碑资讯---- error");
        }
    );
});

//实时询价
app.controller('ceInquiry', function($rootScope, $scope,$http) {
    var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[6-8]{1})|145|147)+\d{8})$/;
    $scope.openCityBar = function(){
        $rootScope.ifCityBar = true;
    }
    $scope.searchCars = function(cars){
        $http({method:'GET',url:'/api/?ac=realtime&op=search_car',params :{ 'search' : $scope.searchKey}}).
            success(function(response){
                console.log(response);
                $scope.searchList = response.car;
            }).
            error(function(response, header, config, status){
                console_("惠购车---- error");
            }
        );
    }
    $scope.sureCars = function(cars){
        $scope.submit_data.res_id = cars.id;
        $scope.searchKey = cars.name;
        $scope.searchList = null;
    }

    //初始化提交数据
    $scope.submit_data = {
        name: "",
        mobile: "",
        city: "",
        res_id:"",
        type: "5",
        type_name: "实时询价"
    };
    $scope.submit_data.city = $rootScope.carBuyingCity[0];
    $scope.infoAdd = function(){
        if($scope.submit_data.res_id == ''){
            $scope.isPanel = true;
            $scope.ifWarning = true;
            $scope.warning = '请输入您感兴趣的车型';
            return;
        }
        if($scope.submit_data.name == ''){
            $scope.isPanel = true;
            $scope.ifWarning = true;
            $scope.warning = '请填写姓名';
            return;
        }
        if($scope.submit_data.mobile == ''){
            $scope.isPanel = true;
            $scope.ifWarning = true;
            $scope.warning = '请填写手机号';
            return;
        }
        if(!reg.test($scope.submit_data.mobile)){
            $scope.isPanel = true;
            $scope.ifWarning = true;
            $scope.warning = '请输入正确的手机号';
            return;
        }
        console.log($scope.submit_data);
        $http({method:'POST',url:'/api/?ac=order&op=submit_order',data:$scope.submit_data }).
            success(function(response, header, config, status , $location){
                console_( header );
                $scope.isPanel = true;
                switch(response.code){
                    case 0:
                        break;
                    case 1:
                        $scope.ifSubmit = true;
                        break;
                }
            }).
            error(function(response, header, config, status){

            }
        );

    };
});
app.directive('cityBar', function () {
    return {
        restrict: "E",
        template: "<div class='scrollable cityBar' ng-show='ifCityBar'>"+
        "<div class='scrollable-content ce-onSell'>"+
        "<div class='sec-til'>选择城市</div>"+
        "<div class='pro-sec' ng-repeat='item in area_data'>"+
        "<p class='pro-til'>{{item.name}}</p>"+
        "<div class='city-sec'>" +
        "<a class='city-til' ng-click='selectCity(item1)' ng-repeat='item1 in item.city'>{{item1.name}}</a>"+
        "</div>"+
        "</div>"+
        "</div>"+
        "</div>",
        controller:function($scope,$http,$rootScope){
            $http({method:'GET',url:'/api/?ac=index&op=get_city'}).
                success(function(response, header, config, status , $location){
                    console_("carBuying-city ---- success");
                    $scope.area_data  = response;
                }).
                error(function(response, header, config , status){
                    console_("carBuying-city ---- error");
                }
            );
            $scope.selectCity = function(city){
                console.log(city);
                $scope.city = [city.id,city.name];
                $rootScope.carBuyingCity = $scope.city;
                $rootScope.ifCityBar = false;
            }
        }
    };
});

/*-----------------kb.js*/
/**
 * Created by libo on 2016/12/02.
 */

/**
 * 团购秒杀 首页控制器
 * */
app.controller('ceBuyCtrl', function($rootScope, $scope , ad_banner ) {

    //团购秒杀 轮播数据
    var promise = ad_banner.query();  //同步调用，获取承诺接口
    promise.then(
        function(response){
            console_("ceBuyCtrl ---- success");
            console_(response);
            $scope.banner_home = response[3][1];
        },function(response){
            console_("ceBuyCtrl ---- error");
            console_(response);
        }
    );
});

/**
 * 团购活动 列表页控制器
 * */
app.controller('ctrlBuyGroup', function($rootScope, $scope, SharedState , $http , $window , $interval) {

    var currentPage=0;
    var nextPage =1;
    $scope.dataList = [];
    $scope.timer = [];
    $scope.loadData = function(){

        if(currentPage == nextPage){
            console.log('已是最后一页');
            return;
        }
        $scope.timer.forEach(function(a,b){
            $interval.cancel(a);
        });
        $http({method:'GET',url:'/api/?ac=groupbuy&op=groupbuy_lists',params:{'p':nextPage}}).
            success(function(response, header, config, status , $location){
                console_("ctrlBuyGroup ---- success");
                console_( response );
                $scope.dataList = $scope.dataList.concat(response.group_list);
                $scope.multi = response.multi;
                currentPage = response.multi.current;
                nextPage = response.multi.next;
                /**
                 * 处理团购倒计时逻辑
                 * @type {Array}
                 */
                $scope.countdown = [];
                for(var i in $scope.dataList ){
                    countdown($scope.dataList[i]['id'],$scope.dataList[i]['real_end_time']);
                }
            }).
            error(function(response, header, config, status){
                console_("ctrlBuyGroup ---- error");
            }
        );
    }
    $scope.details = function(id){
        $window.location.href = '/www/#/groupC/'+id;
    };

    function countdown(id,endtime){
        $scope.countdown[id] = '00天00时00分00秒';
        if(!id || !endtime) return;
        var now_time = parseInt((new Date()).getTime()/1000);
        var over_time = endtime - now_time;

        if(over_time >0){
            var h_y = over_time%86400;

            var D = parseInt(over_time/86400);
            var H = parseInt(h_y/3600);
            var M = parseInt(h_y%3600/60);
            var S = parseInt(h_y%3600%60);

            var timeup = function(){
                if(S>=1) S--;
                else
                {
                    S = 60;
                    S--;
                    if(M>=1) M--;
                    else
                    {
                        M = 60;
                        M--;
                        if(H>=1) H--;
                        else {
                            H = 24;
                            H--;
                            if (D >= 1) D--;
                            else
                            {
                                $interval.cancel($scope.timer[id]);
                                return;
                            }
                        }
                    }
                }

                if(D.toString().length == 1) D = '0'+D;
                if(H.toString().length == 1) H = '0'+H;
                if(M.toString().length == 1) M = '0'+M;
                if(S.toString().length == 1) S = '0'+S;

                $scope.countdown[id] = D+'天'+H+'时'+M+'分'+ S +'秒';
            };

            $scope.timer[id] = $interval(timeup, 1000);

        }
    }

});

/**
 * 团购活动 详情页控制器
 * */
app.controller('groupItemC', function($rootScope, $scope, SharedState , $http , $routeParams) {

    $http({method:'GET',url:'/api/?ac=groupbuy&op=groupbuy_details&id='+$routeParams.id}).
        success(function(response, header, config, status , $location){
            console_("BuyGroup-details ---- success");
            console_( response );
            $scope.details_data = response.group_details;
        }).
        error(function(response, header, config, status){
            console_("BuyGroup-details ---- error");
        }
    );

    $scope.group_id = $routeParams.id;
});

/**
 * 团购活动 提交信息页控制器
 * */
app.controller('groupBuyInfoCtrl', function($rootScope, $scope, SharedState , $http , $routeParams , $timeout ,$route) {

    $http({method:'GET',url:'/api/?ac=groupbuy&op=groupbuy_details&color=1&id='+$routeParams.id}).
        success(function(response, header, config, status , $location){
            console_("groupBuyInfoCtrl ---- success");
            console_( response );
            $scope.details_data     = response.group_details;
            $scope.car_color        = response.car_color;
            $scope.car_inner_color  = response.car_inner_color;

            /**
             * 初始化提交数据
             */
            $scope.submit_data = {
                car_color:"",
                car_color_name:"",
                car_in_color:"",
                car_in_color_name:"",
                name:"", mobile:"",
                //city:$scope.details_data.city.region_id,
                city: $rootScope.carBuyingCity[0],
                res_id:$scope.details_data.id,
                res_title:$scope.details_data.title ,
                type:"3",type_name:"团购活动"
            };
        }).
        error(function(response, header, config , status){
            console_("BuyGroup-details ---- error");
        }
    );


    $scope.infoAdd = function(valid){
        if(!valid){
            return;
        }

        console_($scope.submit_data);

        $http({method:'POST',url:'/api/?ac=order&op=submit_order',data:$scope.submit_data }).
            success(function(response, header, config, status , $location){
                console_( response );
                if(response.code == 1){
                    $scope.isPanel = true;

                    $timeout(function(){
                        $scope.isPanel = false;
                        $route.reload()
                    },3000);
                    $scope.close_result = function(){
                        $scope.isPanel = false;
                        $route.reload()
                    }
                }
            }).
            error(function(response, header, config, status){

            }
        );

    };

    $scope.carColor = $scope.carTrim = -1;

    $scope.selectColor = function(index,color_obj){
        $scope.carColor = index;
        $scope.submit_data.car_color = color_obj.type_id;
        $scope.submit_data.car_color_name = color_obj.type_name;
    };

    $scope.selectTrim = function(index,color_obj){
        $scope.carTrim = index;
        $scope.submit_data.car_in_color = color_obj.type_id;
        $scope.submit_data.car_in_color_name = color_obj.type_name;
    };
});

/**
 * 定金低限 列表页控制器
 * */
app.controller('ctrlOrderPay', function($rootScope, $scope, SharedState , $http , $window , $interval) {
    var currentPage=0;
    var nextPage =1;
    $scope.dataList = [];
    $scope.loadData = function(){
        console.log('下一页');
        if(currentPage == nextPage){
            console.log('已是最后一页');
            return;
        }
        $http({method:'GET',url:'/api/?ac=arrived&op=arrived_lists',params :{'p':nextPage}}).
            success(function(response, header, config, status , $location){
                console_("ctrlOrderPay ---- success");
                console_( response );
                $scope.dataList = $scope.dataList.concat(response.arrived_list);
                $scope.multi    = response.multi;
                currentPage = response.multi.current;
                nextPage = response.multi.next;
            }).
            error(function(response, header, config, status){
                console_("ctrlOrderPay ---- error");
            }
        );
    }

    $scope.details = function(id){
        $window.location.href = '/www/#/groupA/'+id;
    };
});

/**
 * 定金低限 详情页控制器
 * */
app.controller('groupItemA', function($rootScope, $scope, SharedState , $http , $routeParams , $interval) {
    $http({method:'GET',url:'/api/?ac=arrived&op=arrived_details&id='+$routeParams.id}).
        success(function(response, header, config, status , $location){
            console_("arrived-details ---- success");
            console_( response );
            $scope.details_data = response.arrived_details;

            $scope.countdown = [];
            countdown($scope.details_data.id,$scope.details_data.real_end_time);
        }).
        error(function(groupItemA, header, config, status){
            console_("arrived-details ---- error");
        }
    );

    $scope.infoAdd = function(valid){
        if(!valid){
            return;
        }

        $http({method:'POST',url:'/api/?ac=arrived&op=pay',data:{price:valid} }).
            success(function(response, header, config, status , $location){
                console_( response );
                window.location.href = response.url;
            }).
            error(function(response, header, config, status){

            }
        );

    };

    $scope.group_id = $routeParams.id;

    $scope.timer = [];
    function countdown(id,endtime){
        $scope.countdown[id] = '00天00时00分00秒';
        if(!id || !endtime) return;
        var now_time = parseInt((new Date()).getTime()/1000);
        var over_time = endtime - now_time;

        if(over_time >0){
            var h_y = over_time%86400;

            var D = parseInt(over_time/86400);
            var H = parseInt(h_y/3600);
            var M = parseInt(h_y%3600/60);
            var S = parseInt(h_y%3600%60);

            var timeup = function(){
                if(S>=1) S--;
                else
                {
                    S = 60;
                    S--;
                    if(M>=1) M--;
                    else
                    {
                        M = 60;
                        M--;
                        if(H>=1) H--;
                        else {
                            H = 24;
                            H--;
                            if (D >= 1) D--;
                            else
                            {
                                $interval.cancel($scope.timer[id]);
                                return;
                            }
                        }
                    }
                }

                if(D.toString().length == 1) D = '0'+D;
                if(H.toString().length == 1) H = '0'+H;
                if(M.toString().length == 1) M = '0'+M;
                if(S.toString().length == 1) S = '0'+S;

                $scope.countdown[id] = D+'天'+H+'时'+M+'分'+ S +'秒';
            };

            $scope.timer[id] = $interval(timeup, 1000);

        }
    }
});

/**
 * 定金低限 提交信息页控制器
 * */
app.controller('verifyCtrl', function($rootScope, $scope, SharedState , $http , $routeParams) {

});

/**
 * 购车分期 列表页控制器
 * */
app.controller('ctrlCarBuying', function($scope,$http , $window ) {
    var currentPage=0;
    var nextPage =1;
    $scope.dataList = [];

    $scope.loadData = function(){
        console.log('下一页');
        if(currentPage == nextPage){
            console.log('已是最后一页');
            return;
        }
        $http({method:'GET',url:'/api/?ac=carstaging&op=carstaging_lists',params:{'p':nextPage}}).
            success(function(response, header, config, status , $location){
                console_("ctrlCarBuying ---- success");
                console_( response );
                $scope.dataList = $scope.dataList.concat(response.carstaging_lists);
                $scope.multi    = response.multi;
                currentPage = response.multi.current;
                nextPage = response.multi.next;
            }).
            error(function(response, header, config, status){
                console_("ctrlCarBuying ---- error");
            }
        );
    }

    $scope.details = function(id){
        $window.location.href = '/www/#/buyingStage/'+id;
    };

});

/**
 * 购车分期 详情页控制器
 * */
app.controller('ctrlBuyingStage', function($rootScope, $scope, SharedState , $http , $routeParams,$sce) {

    $http({method:'GET',url:'/api/?ac=carstaging&op=carstaging_details&id='+$routeParams.id}).
        success(function(response, header, config, status , $location){
            console_("BuyGroup-details ---- success");
            console_( response );
            $scope.details_data = response.carstaging_details;
            $scope.details_data.stage_content = $sce.trustAsHtml($scope.details_data.stage_content);

        }).
        error(function(response, header, config, status){
            console_("BuyGroup-details ---- error");
        }
    );

    $scope.BuyingStage_id = $routeParams.id;
});

/**
 * 购车分期 提交信息页控制器
 * */
app.controller('ctrlBuyingInfo', function($rootScope, $scope, SharedState , $http , $routeParams , $window ,$timeout ,$route) {


    $http({method:'GET',url:'/api/?ac=carstaging&op=carstaging_details&id='+$routeParams.id}).
        success(function(response, header, config, status , $location){
            console_("ctrlBuyingInfo ---- success");
            console_( response );
            $scope.details_data     = response.carstaging_details;

            /**
             * 初始化提交数据
             */

            $scope.submit_data = {
                name:"",
                mobile:"",
                id_card:"",
                city:"",
                res_id: $scope.details_data.id,
                res_title:$scope.details_data.title ,
                type:"6",
                type_name:"购车分期"
            };
            $scope.submit_data.city = $rootScope.carBuyingCity[0];
        }).
        error(function(response, header, config , status){
            console_("BuyGroup-details ---- error");
        }
    );


    $scope.infoAdd = function(valid){
        if(!valid){
            return;
        }

        $http({method:'POST',url:'/api/?ac=order&op=submit_order',data:$scope.submit_data }).
            success(function(response, header, config, status , $location){
                console_( response );
                if(response.code == 1){
                    $scope.isPanel = true;

                    $timeout(function(){
                        $scope.isPanel = false;
                        $route.reload()
                    },3000);
                    $scope.close_result = function(){
                        $scope.isPanel = false;
                        $route.reload()
                    }
                }
            }).
            error(function(response, header, config, status){

            }
        );

    };

    $scope.toSelectCity = function(){
        $window.location.href = '/www/#/buyingCity/';
    };

});

/**
 * 购车分期 城市页控制器
 * */
app.controller('carBuying-city', function($rootScope, $scope, SharedState , $http , $window) {

    $http({method:'GET',url:'/api/?ac=index&op=get_city'}).
        success(function(response, header, config, status , $location){
            console_("carBuying-city ---- success");
            $scope.area_data     = response;

        }).
        error(function(response, header, config , status){
            console_("carBuying-city ---- error");
        }
    );

    $scope.selectCity = function(cityName){
        console.log(cityName);
        $scope.city = cityName.split(',');
        $rootScope.carBuyingCity = $scope.city;
        $window.location.href = 'javascript: history.go(-1);';
    }
});

/**
 * 违章查询
 * */
app.controller('ViolationQuery', function($rootScope, $scope, SharedState , $http , $window) {

//http://m.wz.qichecdn.com/h5/Violation/Inquery?platformid=Bx3uOicViHY&openid=1
    $scope.url = 'http://m.wz.qichecdn.com/h5/Violation/Inquery?platformid=Bx3uOicViHY&openid=1';
});

/**
 * 油卡充值
 * */
app.controller('OilCardRecharge', function($rootScope, $scope, SharedState , $http , $window) {

//http://web.yiqianlian.com/szsmgas/mobile?menu=gasrecharge#/gasrecharge

});

/**
 * 查找停车
 * */
app.controller('FindParking', function($rootScope, $scope, SharedState , $http , $window) {
//http://h5.scity.cn/partner/partner/etcp.html

});

function deviceDataToRow(data,toData){
    /*当数组长度不足时，补足4的倍数*/
    var mod = (data.length%4);
    if(mod != 0){
        for(var i = 0;i<(4-mod);i++){
            data.push({
                'img':'',
                'label':'',
                'link':'',
                'data':i
            });
        }
    }
    /*将一维数组处理成二维数组*/
    var len = Math.ceil(data.length/4);
    for(var j=0;j<data.length;j++){
        var len1 = Math.floor(j/4);
        if(toData[len1] == undefined){
            toData.push([]);
        }
        toData[len1].push(data[j]);
    }
}
/**
 * debug输出控制
 * @type {boolean}
 */
var console_switch = true;
function console_(data,notice){
    if(console_switch){
        if(notice)
            console.log(notice);
        console.log(data);
    }
}

/*------------------------zy.js*/
/**
 * 口碑车型 页控制器
 * */
app.controller('kbModelCrl', function($rootScope, $scope, SharedState , $http , ad_banner , $anchorScroll , $location) {

    $http({method:'GET',url:'/api/?ac=car&op=car_brand'}).
        success(function(response, header, config, status , $location){
            $scope.charSets = response.first_char;
            $scope.hot_brand1 = [];
            $scope.hot_brand2 = [];
            for(var i in response.hot_brand){
                if(i < 5){
                    $scope.hot_brand1[i] = response.hot_brand[i];
                }
                else{
                    $scope.hot_brand2[i-5] = response.hot_brand[i];
                }
            }
        }).
        error(function(response, header, config, status){
            console_("kbModelCrl ---- error");
        }
    );
    $http({method:'GET',url:'/api/?ac=car&op=all_car_brand_order'}).
        success(function(response, header, config, status , $location){
            $scope.brand_type_lists = response.brand_type_lists;
        }).
        error(function(response, header, config, status){
            console_("kbModelCrl ---- error");
        }
    );

    $scope.gotoCl2 = function(){
        window.location.href ="./#/condition";
    };

    var promise = ad_banner.query();  //同步调用，获取承诺接口
    promise.then(
        function(response){
            $scope.main_car=response[4][1];
        },function(response){
            console_("homeCtrl ---- error");
            console_(response);
        }
    );

    $scope.modalShow = false;
    $scope.openModalPanel = function(brandId){
        $scope.currentBrandList = $scope.brand_type_lists[brandId];
        $scope.modalShow = true;
    }
    $scope.closeModalPanel = function(){
        $scope.modalShow = false;
    }
    $scope.stopClose = function(e){
        e.stopImmediatePropagation();
    }
    /*打开当前品牌类所有车型*/
    $scope.gotoModalDetail = function(id){
        //e.stopImmediatePropagation();
        window.location.href='/www/#/carDetails/'+id;
    };

    $scope.gotoLetter = function(letter){
        $anchorScroll.yOffset = 50;
        $location.hash(letter+'_link');
        $anchorScroll();
        $location.hash('');
    }
});

/**
 * 口碑车型 车系详情页控制器
 * */
app.controller('kbSeriesCrl', function($rootScope, $scope, SharedState , $http , ad_banner , $anchorScroll , $location , $routeParams) {

    $http({method:'GET',url:'/api/?ac=car&op=car_detailed&series_id='+ $routeParams.id}).
        success(function(response, header, config, status , $location){
            $scope.series_data = response.series;
            $scope.car_data    = response.car;
            console_(response);
        }).
        error(function(response, header, config, status){
            console_("kbModelCrl ---- error");
        }
    );

    $scope.sel =  false;
    $scope.kk=false;

    $scope.showBox = function(){
        $scope.kk  = $scope.kk ? false :true ;
        $scope.sel =  $scope.kk;
    };
    $scope.showBox();
    $scope.gotoCarsParam = function(id){
        //e.stopImmediatePropagation();
        window.location.href='/www/#/carsParam/'+id;
    };

});

/**
 * 口碑车型 条件查询
 * */
app.controller('conditionCrl', function($rootScope, $scope, SharedState , $http , ad_banner , $anchorScroll , $location , $routeParams) {
    /**
     * 初始化提交数据
     */
    $scope.submit_data = {
        min_price:5,
        max_price:10,
        model:"",
        min_displacement:"",
        max_displacement:""
    };
    $scope.condition_show = 1;
    $scope.condition_result_show = 0;

    $http({method:'GET',url:'/api/?ac=car&op=get_condition'}).
        success(function(response, header, config, status , $location){
            console_(response);
            $scope.condition_data = response;
        }).
        error(function(response, header, config, status){

        }
    );

    $('.range-slider').jRange({
        from: 0,
        to: 101,
        step: 1,
        scale: [0,101],
        format: '%s',
        width: '90%',
        showLabels: false,
        isRange : false,
        onstatechange: function( arr) {
            var numArr = arr.split(',');
            var s = "";

            if(isNaN(numArr[0])) numArr[0] = 0;
            $('.moner_1').html(numArr[0]+'万');
            $scope.submit_data.min_price = numArr[0];

            if(parseInt(numArr[1])>100) {
                s='>';
                numArr[1] = 100;
            }
            if(isNaN(numArr[1])) numArr[1] = 100;
            $('.money_2').html(s+numArr[1]+'万');
            $scope.submit_data.max_price = numArr[1];

            //console_($scope.submit_data.min_price,'min_price'); console_($scope.submit_data.max_price,'max_price')
        }
    });

    $scope.gotoCl1 = function(){
        window.location.href ="./#/models";
    };
    $scope.select_this = -1;
    //选择排量
    $scope.selectCarDisplacement= function(max,min,index){
        $scope.submit_data.min_displacement = min;
        $scope.submit_data.max_displacement = max;
        $scope.select_this = index;
    };
    //选择车型
    $scope.selectCarModel= function(model_id,index){
        $scope.submit_data.model = model_id;
        $scope.select_this_model = index;
    };
    var conditionData;
    $scope.sel = 1;
    $scope.addInfo= function(){
        $http({method:'POST',url:'/api/?ac=car&op=car_condition',data:$scope.submit_data }).
            success(function(response, header, config, status){
                console_(response);
                conditionData = response;
                $scope.condition_show = 0;
                $scope.condition_result_show = 1;
                $scope.result_data = response.max_price;
            }).
            error(function(response, header, config, status){

            }
        );

    };

    $scope.setType = function(type){
        $scope.sel = type;
        if($scope.sel == 1){
            $scope.result_data = conditionData.max_price;
        }else{
            $scope.result_data = conditionData.min_price;
        }
    };

    $scope.reset= function(){
        $scope.submit_data = {
            min_price:5,
            max_price:10,
            model:"",
            min_displacement:"",
            max_displacement:""
        };
        $('.moner_1').html( $scope.submit_data.min_price+'万');
        $('.money_2').html( $scope.submit_data.max_price+'万');
        $('.countryBox>span').removeClass('bc_2');
    };

    $scope.gotoModalDetail = function(id){
        //e.stopImmediatePropagation();
        window.location.href='/www/#/carDetails/'+id;
    };
});

app.controller('ch1', function($rootScope, $scope) {

    $scope.setType = function(type){

        $scope.sel = type;

    }

    $scope.setType(1);

});
app.controller('bs1', function($rootScope, $scope) {

});
app.controller('da1', function($rootScope, $scope) {


    //资料申请
    $scope.application = function(type){
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;


        if(!$scope.name){
            alert("请输入用户名");
        }
        else if(!myreg.test($scope.mobile))
        {
            alert('请输入正确的手机号');
        }
        else if(!$scope.idNumber)
        {
            alert('请输入正确的身份证号');
        }
        else {
            alert('提交。')
        }

    }

});


