define('home', ['require', 'yy/yy', 'yy/button', 'yy/list', 'weibo'], function(require) {
    var _yy = require('yy/yy');
    var self = {};
    var _event = _yy.getEvent();
    var _message = _yy.getMessage();
    self.init = function(thisModule) {
        //初始化图片列表
        var imageList = thisModule.findByKey('image-list');
        var moreButton = thisModule.findByKey('more-button');
        imageList.init({
            key: 'id',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                var result = '<div class="image_title">' + itemData.title + '</div>'
                    + '<div class="image_wrap"><img alt="" src="' + itemData.mPicurl + '" /></div>'
                    + '<div class="image_tools">'
                    + '<div class="image_tool_item button"><div>踩</div><div class="label">(' + itemData.voteDown + ')</div></div>'
                    + '<div class="image_tool_item button"><div>顶</div><div class="label">(' + itemData.voteUp + ')</div></div>'
                    + '</div>';
                return result;
            },
            itemCompleted: function(itemCom) {
            }
        });
        _message.listen(imageList, 'INQUIRE_IMAGE_PAGE', function(thisCom, msg) {
            if(msg.state === 'SUCCESS') {
                imageList.loadData(msg.data.list);
                imageList.setPageIndex(msg.data.pageIndex);
                imageList.setPageSize(msg.data.pageSize);
                if(msg.data.length === 0) {
                    moreButton.hide();
                } else {
                    moreButton.show();
                }
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
        var weiboLoginButton = thisModule.findByKey('weibo-login');
        _event.bind(weiboLoginButton, 'click', function(thisCom) {
            WB2.login(function() {
                alert('111');
            });
        });
        //加载图片
        _message.send({act: 'INQUIRE_IMAGE_PAGE', pageIndex: 1, pageSize: 10});
    };
    return self;
});