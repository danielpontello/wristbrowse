// HTML Parser
// This parses the HTML and puts the elements on an Window

var UI = require('ui');
var Vector2 = require('vector2');

var BrowserWindow = module.exports;

BrowserWindow.Show = function(url)
{        
    // Main Window
    var browserWindow = new UI.Window(
        {
            scrollable: true,
            color: 'white'
        }
    );

    // Title Bar
    var headerBg = new UI.Rect(
        {
            position: new Vector2(0, 0),
            size: new Vector2(144, 19),
            backgroundColor: '#AAFFFF'
        }
    );

    // Progress Bar
    var progressBar = new UI.Rect(
        {
            position: new Vector2(0, 0),
            size: new Vector2(31, 0),
            backgroundColor: '#00FF00'
        }
    );

    // Header Text
    var headerText = new UI.Text(
        {
            position: new Vector2(0, 0),
            size: new Vector2(144, 22),
            text: "http://text.npr.org/",
            font: "gothic-14",
            color: "black"
        }
    );

    // Spinner Indicator
    var spinner = new UI.Rect(
        {
            position: new Vector2(125, 0),
            size: new Vector2(19, 19),
            backgroundColor: '#FFFFFF'
        }
    );

    var spinnerText = new UI.Text(
        {
            position: new Vector2(125, 0),
            size: new Vector2(19, 19),
            text: "|",
            font: "gothic-14",
            color: "black",
            textAlign: "center"
        }
    );

    // Add everything to the main window
    browserWindow.add(headerBg)
    browserWindow.add(progressBar)
    browserWindow.add(headerText)
    browserWindow.add(spinner)
    browserWindow.add(spinnerText)


    // Spinner Logic
    var loading = true;
    var spinnerPos = 0;
    var spinnerChars = ["-", "\\", "|", "/"];

    setInterval(function () {
        spinnerPos += 1;

        if (spinnerPos == 4) {
            spinnerPos = 0;
        }

        if (loading) {
            spinnerText.text(spinnerChars[spinnerPos])
        }
        else {
            spinnerText.text("ok")
        }
    }, 500)

    // Window Background
    var mainBg = new UI.Rect(
        {
            position: new Vector2(0, 20),
            size: new Vector2(144, 800),
            backgroundColor: '#FFFFFF'
        }
    );

    browserWindow.add(mainBg)
    browserWindow.show()

    return browserWindow
}