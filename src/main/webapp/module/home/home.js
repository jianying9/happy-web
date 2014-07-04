define(function(require) {
    var _yy = require('yy/yy');
    var _index = _yy.getIndex();
    require('yy/panel');
    require('yy/button');
    require('yy/list');
    var _module = require('yy/module');
    var self = {};
    var _event = _yy.getEvent();
    self.init = function(thisModule) {
        var panelList = thisModule.findByKey('panel-list');
        panelList.init({
            key: 'moduleId',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                return '';
            }
        });
        //
        var navigationList = thisModule.findByKey('navigation-list');
        navigationList.init({
            key: 'moduleId',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                return itemData.navigation;
            },
            itemCompleted: function(itemCom) {
                _event.bind(itemCom, 'click', function(thisCom) {
                    thisCom.selected();
                    //
                    var panelItem = panelList.getItemByKey(thisCom.key);
                    if (!panelItem) {
                        panelItem = panelList.addItemData({moduleId: thisCom.key});
                    }
                    var zIndex = _index.nextZIndex();
                    panelItem.$this.css({zIndex: zIndex});
                    _module.loadModule(itemCom.key, function() {
                    }, panelItem);
                });
            }
        });
        navigationList.loadData([
            {navigation: '客服帐号', moduleId: 'reception-manage'},
            {navigation: '公告管理', moduleId: 'bulletin-manage'},
            {navigation: '游戏管理', moduleId: 'game-manage'}
        ]);
        navigationList.firstChild.$this.click();
    };
    return self;
});