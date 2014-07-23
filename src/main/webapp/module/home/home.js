define('home', ['require', 'yy/yy', 'yy/button', 'yy/list', 'weibo'], function(require) {
    var _yy = require('yy/yy');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        //初始化图片列表
        var imageList = thisModule.findByKey('image-list');
        var moreButton = thisModule.findByKey('more-button');
        _message.listen(imageList, 'ADD_FAVORITE_IMAGE', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                var imageId = msg.data.imageId;
                var imageItem = imageList.getItemByKey(imageId);
                var addFavoriteId = msg.data.imageId + '-add-favorite';
                var addFavoriteButton = imageItem.findChildByKey(addFavoriteId);
                addFavoriteButton.setLabel('已收藏');
            }
        });
        imageList.init({
            key: 'id',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var linkUrl = itemData.linkUrl;
                var index = linkUrl.indexOf('?');
                if (index > 0) {
                    linkUrl = linkUrl.substring(0, index) + '?from=www.bicdoebang.com';
                } else {
                    linkUrl = linkUrl + '?from=www.bicdoebang.com';
                }
                var result = '<div class="image_title">' + itemData.title + '</div>'
                        + '<a href="' + linkUrl + '" target="_blank" class="image_from">来源</a>'
                        + '<div class="image_wrap"><img alt="" src="' + itemData.mPicurl + '" /></div>'
                        + '<div class="image_tools skip">'
//                        + '<div class="image_tool_item button"><div>踩</div><div class="label">(' + itemData.voteDown + ')</div></div>'
//                        + '<div class="image_tool_item button"><div>顶</div><div class="label">(' + itemData.voteUp + ')</div></div>'
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
                    window.open('http://service.weibo.com/share/share.php?title=' + encodeURIComponent(data.title) + '&url=' + encodeURIComponent("http://www.bigcodebang.com") + '&pic=' + encodeURIComponent(data.picurl) + '&appkey=238808965&searchPic=false', '_blank', "crollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=no,location=no");
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
        _message.listen(imageList, 'INQUIRE_IMAGE_PAGE', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                imageList.loadData(msg.data.list);
                imageList.setPageIndex(msg.data.pageIndex);
                imageList.setPageSize(msg.data.pageSize);
                if (msg.data.length === 0) {
                    moreButton.hide();
                } else {
                    moreButton.show();
                }
            }
        });
        _message.listen(imageList, 'SINA_USER_LOGIN', function(thisCom, msg) {
            if (msg.state === 'SUCCESS') {
                _yy.setSession(msg.data);
                //显示登录后的导航
                //图片列表显示收藏按钮
                imageList.$this.addClass('has_login');
            }
        });
        //初始化更多按钮
        _event.bind(moreButton, 'click', function(thisCom) {
            var pageIndex = imageList.getPageIndex() + 1;
            var pageSize = imageList.getPageSize();
            _message.send({
                act: 'INQUIRE_IMAGE_PAGE',
                pageIndex: pageIndex,
                pageSize: pageSize
            });
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
                    }
                }
            });
        });
        //加载图片
        _message.send({act: 'INQUIRE_IMAGE_PAGE', pageIndex: 1, pageSize: 10});
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
    };
    return self;
});