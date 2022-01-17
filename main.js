"use strict";
var FILE = /** @class */ (function () {
    function FILE(fileName, fileContents) {
        this.name = fileName;
        this.content = fileContents;
    }
    return FILE;
}());
var FOLDER = /** @class */ (function () {
    function FOLDER(folderName) {
        this.folderName = folderName;
        this.folders = [];
        this.files = [];
    }
    return FOLDER;
}());
// --------------------------------------------
// Terminal.
var Terminal = /** @class */ (function () {
    function Terminal(height, length) {
        this.terminalHeight = height;
        this.terminalWidth = length;
        this.disk = [];
        this.initDisk();
        this.path = "DISK:/home/";
        this.currentFolder = this.getFolder();
        this.isTakingInput = false;
        this.currentCommand = "";
        this.display = [];
        this.initDisplay();
        this.clear();
        this.cursor = 0;
        this.render();
        this.cout('Welcome to ^REDmemersOS^red, quite possibly the worst """os""" ever to be built');
        this.newLine();
        this.nav();
    }
    Terminal.prototype.handleCommand = function (command) {
        switch (command.split(" ")[0]) {
            case "ls":
                this.newLine();
                for (var i = 0; i < this.currentFolder.folders.length; i++) {
                    this.cout("^CYA" + this.currentFolder.folders[i].folderName + "/^cya ");
                }
                for (var i = 0; i < this.currentFolder.files.length; i++) {
                    this.cout("^GRE" + this.currentFolder.files[i].name + "^gre ");
                }
                this.newLine;
                this.nav();
                break;
            case "cd":
                if (command.split(" ")[1] == "..") {
                    var tempPath = this.path.split("/");
                    tempPath.pop();
                    tempPath.pop();
                    this.path = tempPath.join("/") + "/";
                    this.currentFolder = this.getFolder();
                }
                for (var i = 0; i < this.currentFolder.folders.length; i++) {
                    console.log([this.currentFolder.folders[i].folderName, command.split(" ")[1]]);
                    if (this.currentFolder.folders[i].folderName == command.split(" ")[1]) {
                        this.path += command.split(" ")[1] + "/";
                        this.currentFolder = this.getFolder();
                    }
                }
                this.nav();
                break;
            case "pwd":
                this.newLine();
                this.cout("  " + this.path);
                this.nav();
                break;
            case "cls":
                this.cursor = 0;
                this.clear();
                this.nav();
                break;
            case "mkdir":
                this.currentFolder.folders.push(new FOLDER(command.split(" ")[1]));
                this.nav();
                break;
            case "less":
                this.newLine();
                for (var i = 0; i < this.currentFolder.files.length; i++) {
                    if (this.currentFolder.files[i].name === command.split(" ")[1]) {
                        this.cout(" | ^GRE" + this.currentFolder.files[i].name + " ^gre| ");
                        this.newLine();
                        this.cout(this.currentFolder.files[i].content);
                    }
                }
                this.nav();
                break;
            default:
                this.newLine();
                this.cout("^CYAmemerOS: Command not found^cya ^RED" + command.split(" ")[0] + "^red ");
                this.nav();
                break;
        }
    };
    Terminal.prototype.initDisk = function () {
        var diskFolder = new FOLDER("DISK:");
        var homeFolder = new FOLDER("home");
        homeFolder.files.push(new FILE("Hello_world.txt", "Hello World!"));
        diskFolder.folders.push(homeFolder);
        this.disk.push(diskFolder);
    };
    Terminal.prototype.getFolder = function () {
        var tempFolder;
        tempFolder = this.disk[0];
        for (var i = 0; i < this.path.split("/").length; i++) {
            for (var j = 0; j < tempFolder.folders.length; j++) {
                if (tempFolder.folders[j].folderName === this.path.split("/")[i]) {
                    tempFolder = tempFolder.folders[j];
                }
            }
        }
        return tempFolder;
    };
    // Terminal rendering.
    // Init display.
    Terminal.prototype.initDisplay = function () {
        var _this = this;
        for (var i = 0; i < this.terminalHeight; i++) {
            var tempArr = new Array();
            for (var j = 0; j < this.terminalWidth; j++) {
                tempArr.push(' ');
            }
            this.display.push(tempArr);
        }
        window.addEventListener("keydown", function (e) {
            if (_this.isTakingInput) {
                switch (e.key) {
                    case "Backspace":
                        _this.cursor = _this.cursor - 1;
                        _this.cout(" ");
                        _this.currentCommand = _this.currentCommand.slice(0, -1);
                        _this.cursor = _this.cursor - 1;
                        break;
                    case "Enter":
                        console.log(e.key);
                        console.log(_this.currentCommand);
                        _this.handleCommand(_this.currentCommand);
                        _this.currentCommand = "";
                        break;
                    default:
                        if (e.key.length == 1) {
                            _this.cout(e.key);
                            _this.currentCommand += e.key;
                        }
                        break;
                }
                e.preventDefault();
                _this.render();
            }
        });
    };
    // Clear the terminal or fill terminal with spaces.
    Terminal.prototype.clear = function () {
        for (var i = 0; i < this.terminalHeight; i++) {
            for (var j = 0; j < this.terminalWidth; j++) {
                this.display[i][j] = ' ';
            }
        }
    };
    // Push a string to terminal.
    Terminal.prototype.cout = function (str) {
        var len = str.length;
        for (var i = 0; i < len; i++) {
            if (str[i] == '^') {
                var outText = str[i + 1] + str[i + 2] + str[i + 3] + str[i + 4];
                this.display[Math.floor(this.cursor / this.terminalWidth)][this.cursor % this.terminalWidth] = outText;
                i = i + 4;
            }
            else {
                this.display[Math.floor(this.cursor / this.terminalWidth)][this.cursor % this.terminalWidth] = str[i];
            }
            this.cursor = this.cursor + 1;
        }
        this.render();
    };
    // Get input from terminal.
    Terminal.prototype.cin = function (str) {
        this.cout(str);
        this.isTakingInput = true;
    };
    Terminal.prototype.newLine = function () {
        this.cursor = (this.cursor + this.terminalWidth) - this.cursor % this.terminalWidth;
    };
    // this -> ~ $.
    Terminal.prototype.nav = function () {
        this.newLine();
        if (this.path.slice(0, 10) === "DISK:/home") {
            this.cin(" ^GRE~" + this.path.slice(10) + "^gre ^CYA$^cya ");
        }
        else {
            this.cin(this.path + " ");
        }
    };
    // Render the terminal(display) in the DOM.
    Terminal.prototype.render = function () {
        var html = "";
        for (var i = 0; i < this.terminalHeight; i++) {
            var row = "";
            for (var j = 0; j < this.terminalWidth; j++) {
                // Colors.
                if (this.display[i][j].length > 1) {
                    switch (this.display[i][j][0] + this.display[i][j][1] + this.display[i][j][2]) {
                        case "RED":
                            row += '<pre class="red">';
                            break;
                        case "red":
                            row += '</pre>';
                            break;
                        case "CYA":
                            row += '<pre class="cya">';
                            break;
                        case "cya":
                            row += '</pre>';
                            break;
                        case "GRE":
                            row += '<pre class="gre">';
                            break;
                        case "gre":
                            row += '</pre>';
                            break;
                    }
                    row += this.display[i][j][3];
                }
                else {
                    if ((i * this.terminalWidth) + j == this.cursor) {
                        row += '<pre class="cursor"> </pre>';
                    }
                    else {
                        row += this.display[i][j];
                    }
                }
            }
            html += "<br>";
            html += row;
        }
        document.getElementById("terminal").innerHTML = html;
    };
    return Terminal;
}());
var term = new Terminal(70, 240);
