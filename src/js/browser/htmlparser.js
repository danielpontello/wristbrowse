// HTML Parser
// This parses the HTML and puts the elements on an Window

var UI = require('ui');
var Vector2 = require('vector2');
var Keyboard = require('pebblejs-keyboard');

var HTMLParser = module.exports;

HTMLParser.CreateElements = function (htmlContent, pbWindow) {
    // String.contains implementation from MDN
    if (!String.prototype.contains) {
        String.prototype.contains = function () {
            'use strict';
            return String.prototype.indexOf.apply(this, arguments) !== -1;
        };
    }

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

    // Remove whitespace and newlines from the HTML
    htmlContent = htmlContent.trim().split("\n").map(function (s) { return s.trim(); }).join("");
    remainingContent = htmlContent;

    const re = /<[^>]*>/;

    while (remainingContent.length > 0) {
        // Match tag
        var match = remainingContent.match(re)[0];
        var tagLength = match.length

        // If we are on a tag
        if (remainingContent[0] == "<") {
            console.log("Tag: " + match);

            // Parse start tags
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

            // Parse end tags

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

            if (match.contains("</script") || match.contains("</img")) {
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

            // if the tag has a visual representation, create it
            if (ignore === false) {
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
                pbWindow.add(newText);
            }

            remainingContent = remainingContent.substring(nextTagPos);
        }
        console.log(remainingContent)
    }
    console.log("Parsing complete")
}