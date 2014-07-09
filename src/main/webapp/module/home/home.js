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
        var imageList = thisModule.findByKey('image-list');
        imageList.init({
            key: 'id',
            itemClazz: '',
            itemDataToHtml: function(itemData) {
                return '';
            },
            itemCompleted: function(itemCom) {
            }
        });
    };
    return self;
});