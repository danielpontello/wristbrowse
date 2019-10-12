var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Keyboard = require('pebblejs-keyboard')

var htmlParser = require('browser/htmlparser')
var browserWindow = require('browser/browserwindow')

function navigateTo(url) {
    mainWindow = browserWindow.Show(url)

    ajax({ url: url },
        function (data) {
            htmlParser.CreateElements(data, mainWindow);
            loading = false;
        }
    );
}

var menu = new UI.Menu({
    sections: [{
        title: 'Main Menu',
        items: [{
            title: 'Homepage',
            subtitle: 'Default homepage (text.npr.org)'
        }, {
            title: 'Type URL',
            subtitle: 'Type an website address'
        }, {
            title: 'Dictate URL',
            subtitle: 'Dictate an website address'
        }, {
            title: 'Bookmarks',
            subtitle: 'Saved websites'
        }, {
            title: 'History',
            subtitle: 'Last visited websites'
        }]
    }, {
        title: 'Help',
        items: [{
            title: 'About',
            subtitle: 'About WristBrowse'
        }]
    }]
});

menu.on('select', function (e) {
    switch (e.item.title) {
        case "Homepage":
            navigateTo(url)
            break;

        case "Type URL":
            var keyboardWindow = new UI.Window();
            var myKeyboard = new Keyboard(keyboardWindow);

            myKeyboard.on('text', function (input) {
                navigateTo(input)
            });

            keyboardWindow.show()
            myKeyboard.show()
            break;

        case "About":
            var card = new UI.Card({
                title: 'WristBrowse',
                subtitle: 'A Tiny Web Browser',
                body: 'Visit the project webpage at http://github.com/danielpontello/WristBrowse'
            });
            card.show()
            break;
    }
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
});

menu.show()