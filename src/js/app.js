var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var htmlParser = require('browser/htmlparser')
var browserWindow = require('browser/browserwindow')

mainWindow = browserWindow.Show()

// Get the raw HTML
ajax({ url: 'http://text.npr.org/' },
    function (data) {
        htmlParser.CreateElements(data, mainWindow);
        loading = false;
    }
);