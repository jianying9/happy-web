define('home', ['require', 'yy/yy', 'yy/button', 'yy/list', 'yy/panel', 'weibo'], function(require) {
    var _yy = require('yy/yy');
    var self = {};
    var _event = _yy.getEvent();
    var _components = _yy.getComponents();
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        //获取panel list
        var panelList = thisModule.findByKey('panel-list');
        //获取导航
        var navList = thisModule.findByKey('nav-list');
        for (var id in navList.children) {
            _event.bind(navList.children[id], 'click', function(thisCom) {
                thisCom.selected();
                var key = thisCom.key;
                key = key.substring(0, (key.length - 6));
                var panelListItem = panelList.getItemByKey(key);
                if (panelListItem) {
                    panelListItem.selected();
                }
            });
        }
        //初始化图片列表
        var imageList = thisModule.findByKey('image-list');
        imageList.init({
            key: 'id',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                //计算显示的宽和高
                var displayWidth;
                var displayHeight;
                if (itemData.mWidth <= 440) {
                    displayWidth = itemData.mWidth;
                    displayHeight = itemData.mHeight;
                } else {
                    displayWidth = 440;
                    displayHeight = parseInt(itemData.mHeight * displayWidth / itemData.width);
                }
                var result = '<div class="image_title">' + itemData.title + '</div>'
                        + '<img class="image_wrap" style="width:' + displayWidth + 'px;height:' + displayHeight + 'px" src="' + itemData.mUrl + '" />'
                        + '<div class="image_tools skip">'
                        + '<div id="' + itemData.id + '-sina-publish" class="image_tool_item sina_publish button"></div>'
                        + '<div class="image_tool_item_title">分享到:</div>'
                        + '<div id="' + itemData.id + '-add-favorite" class="image_tool_item_title button hide">收藏</div>'
                        + '</div>';
                return result;
            },
            itemCompleted: function(itemCom) {
                var data = itemCom.getData();
                //分享按钮
                var sinalPublishId = data.id + '-sina-publish';
                var sinaPublishButton = itemCom.findChildByKey(sinalPublishId);
                _event.bind(sinaPublishButton, 'click', function(thisCom) {
                    window.open('http://service.weibo.com/share/share.php?title=' + encodeURIComponent(data.title) + '&url=' + encodeURIComponent("http://www.bigcodebang.com") + '&pic=' + encodeURIComponent(data.lUrl) + '&appkey=238808965&searchPic=false', '_blank', "crollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=no,location=no");
                });
                //收藏按钮
                var addFavoriteId = data.id + '-add-favorite';
                var addFavoriteButton = itemCom.findChildByKey(addFavoriteId);
                _event.bind(addFavoriteButton, 'click', function(thisCom) {
                    var data = thisCom.parent.getData();
                    _message.send({
                        act: 'ADD_FAVORITE_IMAGE',
                        imageId: data.id
                    });
                });
            }
        });
        var imageListHasNext = true;
        var imageListCanLoadNext = true;
        _message.listen(imageList, 'INQUIRE_IMAGE_PAGE', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                var list = msg.data.list;
                if (list.length > 0) {
                    var urlId;
                    var data;
                    for (var index = 0; index < list.length; index++) {
                        urlId = index % 4 + 1;
                        data = list[index];
                        data.lUrl = 'http://ww' + urlId + '.sinaimg.cn/large/' + data.fileName;
                        data.mUrl = 'http://ww' + urlId + '.sinaimg.cn/bmiddle/' + data.fileName;
                    }
                    imageList.loadData(list);
                    imageList.setPageIndex(msg.data.pageIndex);
                    imageList.setPageSize(msg.data.pageSize);
                    imageListCanLoadNext = true;
                } else {
                    imageListHasNext = false;
                }
            }
        });
        _message.listen(imageList, 'SINA_USER_LOGIN', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                _yy.setSession(msg.data);
                //显示登录后的导航
                navList.$this.addClass('login');
                //图片列表显示收藏按钮
                imageList.$this.addClass('has_login');
                //初始化我的收藏
                _message.send({act: 'INQUIRE_FAVORITE_IMAGE', pageIndex: 1, pageSize: 6});
            }
        });
        //初始化收藏列表
        var favoriteList = thisModule.findByKey('favorite-list');
        favoriteList.init({
            key: 'id',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                //计算显示的宽和高
                var displayWidth;
                var displayHeight;
                if (itemData.mWidth <= 440) {
                    displayWidth = itemData.mWidth;
                    displayHeight = itemData.mHeight;
                } else {
                    displayWidth = 440;
                    displayHeight = parseInt(itemData.mHeight * displayWidth / itemData.width);
                }
                var result = '<div class="image_title">' + itemData.title + '</div>'
                        + '<img class="image_wrap" style="width:' + displayWidth + 'px;height:' + displayHeight + 'px" src="' + itemData.mUrl + '" />'
                        + '<div class="image_tools skip">'
                        + '<div id="' + itemData.id + '-sina-publish" class="image_tool_item sina_publish button"></div>'
                        + '<div class="image_tool_item_title">分享到:</div>'
                        + '<div id="' + itemData.id + '-delete-favorite" class="image_tool_item_title button">删除</div>'
                        + '</div>';
                return result;
            },
            itemCompleted: function(itemCom) {
                var data = itemCom.getData();
                //分享按钮
                var sinalPublishId = data.id + '-sina-publish';
                var sinaPublishButton = itemCom.findChildByKey(sinalPublishId);
                _event.bind(sinaPublishButton, 'click', function(thisCom) {
                    window.open('http://service.weibo.com/share/share.php?title=' + encodeURIComponent(data.title) + '&url=' + encodeURIComponent("http://www.bigcodebang.com") + '&pic=' + encodeURIComponent(data.lUrl) + '&appkey=238808965&searchPic=false', '_blank', "crollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=no,location=no");
                });
                //删除按钮
                var deleteFavoriteId = data.id + '-delete-favorite';
                var deleteFavoriteButton = itemCom.findChildByKey(deleteFavoriteId);
                _event.bind(deleteFavoriteButton, 'click', function(thisCom) {
                    var data = thisCom.parent.getData();
                    _message.send({
                        act: 'DELETE_FAVORITE_IMAGE',
                        imageId: data.id
                    });
                    thisCom.parent.remove();
                });
            }
        });
        var favoriteListHasNext = true;
        var favoriteListCanLoadNext = true;
        _message.listen(favoriteList, 'INQUIRE_FAVORITE_IMAGE', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                var list = msg.data.list;
                if (list.length > 0) {
                    var urlId;
                    var data;
                    for (var index = 0; index < list.length; index++) {
                        urlId = index % 4 + 1;
                        data = list[index];
                        data.lUrl = 'http://ww' + urlId + '.sinaimg.cn/large/' + data.fileName;
                        data.mUrl = 'http://ww' + urlId + '.sinaimg.cn/bmiddle/' + data.fileName;
                    }
                    thisCom.loadData(list);
                    thisCom.setPageIndex(msg.data.pageIndex);
                    thisCom.setPageSize(msg.data.pageSize);
                    favoriteListCanLoadNext = true;
                } else {
                    favoriteListHasNext = false;
                }
            }
        });
        //增加收藏
        _message.listen(imageList, 'ADD_FAVORITE_IMAGE', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                var imageId = msg.data.imageId;
                var imageItem = imageList.getItemByKey(imageId);
                var addFavoriteId = msg.data.imageId + '-add-favorite';
                var addFavoriteButton = imageItem.findChildByKey(addFavoriteId);
                addFavoriteButton.setLabel('已收藏');
                //
                var data = imageItem.getData();
                favoriteList.addItemDataFirst(data);
            }
        });
        //初始化微博登陆按钮
        WB2.anyWhere(function(W) {
            W.widget.connectButton({
                id: "weibo-login",
                type: '3,2',
                callback: {
                    login: function(sinaUser) {
                        _message.send({
                            act: 'SINA_USER_LOGIN',
                            sinaId: sinaUser.id
                        });
                    },
                    logout: function() {
                        //显示登录后的导航
                        navList.$this.removeClass('login');
                    }
                }
            });
        });
        //鼠标滚动事件
        var root = _components.getRoot();
        root.$this.mousewheel(function(event, delta, deltaX, deltaY) {
            var scrollHeight = document.body.scrollHeight;
            var scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
            var clientHeight = document.body.clientHeight;
            var pencent = (scrollTop + clientHeight) / scrollHeight * 100;
            if (pencent >= 85) {
                //滚动接近底部
                //如果最新图片列表处于显示状态
                if (imageList.isVisible()) {
                    if (imageListHasNext && imageListCanLoadNext) {
                        imageListCanLoadNext = false;
                        var pageIndex = imageList.getPageIndex() + 1;
                        var pageSize = imageList.getPageSize();
                        _message.send({
                            act: 'INQUIRE_IMAGE_PAGE',
                            pageIndex: pageIndex,
                            pageSize: pageSize
                        });
                    }
                }
                //如果我的收藏列表处于显示状态
                if (favoriteList.isVisible()) {
                    if (favoriteListHasNext && favoriteListCanLoadNext) {
                        favoriteListCanLoadNext = false;
                        var pageIndex = favoriteList.getPageIndex() + 1;
                        var pageSize = favoriteList.getPageSize();
                        _message.send({
                            act: 'INQUIRE_FAVORITE_IMAGE',
                            pageIndex: pageIndex,
                            pageSize: pageSize
                        });
                    }
                }
            }
        });
        //渲染广告
        var tanx_s = document.createElement("script");
        tanx_s.type = "text/javascript";
        tanx_s.charset = "gbk";
        tanx_s.id = "tanx-s-mm_57496364_7184442_23826501";
        tanx_s.async = true;
        tanx_s.src = "http://p.tanx.com/ex?i=mm_57496364_7184442_23826501";
        var tanx_h = document.getElementsByTagName("head")[0];
        if (tanx_h) {
            tanx_h.insertBefore(tanx_s, tanx_h.firstChild);
        }
        //加载图片
        _message.send({act: 'INQUIRE_IMAGE_PAGE', pageIndex: 1, pageSize: 6});
    };
    return self;
});