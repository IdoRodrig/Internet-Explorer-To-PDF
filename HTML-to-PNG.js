var fs = require('fs');
var webpage = require('webpage');
var system = require('system');

var inputFolder = system.args[1]; // Input folder containing HTML files
var parentFolder = getParentFolder(inputFolder);
var outputFolder = parentFolder + "/output";

// Create the output folder if it doesn't exist
if (!fs.isDirectory(outputFolder)) {
    fs.makeDirectory(outputFolder);
}


function getParentFolder(filePath) {
    var separatorIndex = filePath.lastIndexOf('/');
    if (separatorIndex === -1) {
        separatorIndex = filePath.lastIndexOf('\\'); // Check for backslash as well
    }
    if (separatorIndex !== -1) {
        return filePath.substring(0, separatorIndex);
    }
    return filePath; // If no separator found, return the original path
}


// Function to convert HTML file to PNG
function convertToPNG(htmlFile) {
    var page = webpage.create();

    page.viewportSize = { width: 1920, height: 1080 };

    page.open(htmlFile, function(status) {
        if (status === 'success') {
            var fileName = fs.absolute(htmlFile).split('/').pop().split('.')[0];
            var outputPath = htmlFile.replace('input', 'output').replace('.html', '.png');

            var height = page.evaluate(function() {
                return document.body.scrollHeight;
            });

            page.clipRect = { top: 0, left: 0, width: 1920, height: height };
            page.render(outputPath);
        } else {
            console.error('Failed to load', htmlFile);
        }
        page.close();

        filesProcessed--;

        // Check if all files have been processed
        if (filesProcessed === 0) {
            phantom.exit();
        }
    });
}

// Process each HTML file in the input folder

var filesProcessed = 0;
fs.list(inputFolder).forEach(function(file) {
    if (file.match(/\.html?$/)) {
	filesProcessed++;
	console.log(file);
        convertToPNG(file);

    }
});
