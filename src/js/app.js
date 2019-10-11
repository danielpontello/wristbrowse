var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

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

// String.contains implementation from MDN
if (!String.prototype.contains) {
    String.prototype.contains = function() {'use strict';
      return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

// Get the raw HTML
ajax({ url: 'http://text.npr.org/' },
    function (data) {
        CreateElements(data, browserWindow);
        loading = false;
    }
);

function CreateElements(htmlContent, pbWindow) {
    var startX = 2;
    var startY = 22;
    var startColor = 'black'
    var startStyle = 'gothic-14'

    var currentX = startX;
    var currentY = startY;
    var currentColor = startColor;
    var currentStyle = startStyle;
    var ignore = false;
    var listItem = false;
    var prefix = "";

    // 
    htmlContent = htmlContent.trim().split("\n").map(function(s){ return s.trim(); }).join("");
    remainingContent = htmlContent;

    const re = /<[^>]*>/;

    while(remainingContent.length > 0)
    {        
        // match tag
        var match = remainingContent.match(re)[0];
        var tagLength = match.length

        // if we are on a tag
        if(remainingContent[0] == "<")
        {
            console.log("Tag: " + match);

            // START TAGS ============================================

            ignore = false;
            
            if (match.contains("<p")) {
                currentX = 2;
            }

            if (match.contains("<li")) {
                prefix = "• "
                currentX = 6;
            }

            if (match.contains("<a")) {
                currentColor = 'blue';
            }

            if (match.contains("<h1") || match.contains("<h2") || match.contains("<h3")) {
                currentX = 2;
                currentStyle = "gothic-18-bold";
            }

            if (match.contains("<head") || match.contains("<script") || match.contains("<title")) {
                ignore = true;
            }

            // =======================================================

            // END TAGS ==============================================

            if (match.contains("</p")) {
                currentY += 20;
            }

            if (match.contains("</li")) {
                prefix = ""
                currentY += 20;
            }

            if (match.contains("</a")) {
                currentColor = startColor;
            }

            if (match.contains("</h1") || match.contains("</h2") || match.contains("</h3")) {
                currentStyle = startStyle;
                currentY += 26;
            }

            if (match.contains("</head")) {
                ignore = false;
            }

            if (match.contains("</script") || match.contains("</img"))
            {
                console.log("deignoring script tag");
                // ignore = false;
            }
            
            // remove it from the html, we already parsed it
            remainingContent = remainingContent.substring(tagLength);
        } else {
            // else, it's just text
            var nextTagPos = remainingContent.indexOf(match);
            var text = remainingContent.substring(0, nextTagPos);
            console.log("Text: " + text);

            if(ignore === false) {
                var newText = new UI.Text(
                    {
                        position: new Vector2(currentX, currentY),
                        size: new Vector2(500, 168),
                        text: prefix + text,
                        font: currentStyle,
                        color: currentColor,
                        textAlign: "left",
                        textOverflow: "fill"
                    }
                );
                currentX += (text.length * 6) + 2
                browserWindow.add(newText);
            }

            remainingContent = remainingContent.substring(nextTagPos);
        }
        console.log(remainingContent)
    }
    console.log("Parsing complete.")

}
browserWindow.show();