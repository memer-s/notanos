"use strict"


class FILE {
   name: string;
   content: string;

   constructor(fileName: string, fileContents: string) {
      this.name = fileName;
      this.content = fileContents;
   }
}

class FOLDER {
   folderName: string;
   folders: Array<FOLDER>;
   files: Array<FILE>;

   constructor(folderName: string) {
      this.folderName = folderName;
      this.folders = [];
      this.files = [];
   }

}

// --------------------------------------------

// Terminal.
class Terminal {
   terminalHeight: number;
   terminalWidth: number;
   display: Array<Array<string>>;
   // The cursor is used as a representation for where the next character will be drawn.
   cursor: number;

   isTakingInput: boolean;
   currentCommand: string;

   disk: Array<FOLDER>
   path: string;
   currentFolder: FOLDER;

   constructor(height: number, length: number) {
      this.terminalHeight = height;
      this.terminalWidth = length;

      this.disk = [];
      this.initDisk();
      this.path = "DISK:/home/"
      this.currentFolder = this.getFolder();

      this.isTakingInput = false;
      this.currentCommand = "";

      this.display = [];
      this.initDisplay();

      this.clear();
      this.cursor = 0;
      this.render();
      this.cout('Welcome to ^REDmemersOS^red, quite possibly the worst """os""" ever to be built')

      this.newLine()
      this.nav()
   }

   handleCommand(command: string) {
      switch (command.split(" ")[0]) {
         case "ls":
            this.newLine();
            for (let i = 0; i < this.currentFolder.folders.length; i++) {
               this.cout("^CYA" + this.currentFolder.folders[i].folderName + "/^cya ");
            }
            for (let i = 0; i < this.currentFolder.files.length; i++) {
               this.cout("^GRE" + this.currentFolder.files[i].name + "^gre ")
            }
            this.newLine
            this.nav();
            break;

         case "cd":
            if (command.split(" ")[1] == "..") {
               let tempPath = this.path.split("/");
               tempPath.pop()
               tempPath.pop()
               this.path = tempPath.join("/") + "/"
               this.currentFolder = this.getFolder();
            }
            for (let i = 0; i < this.currentFolder.folders.length; i++) {
               console.log([this.currentFolder.folders[i].folderName, command.split(" ")[1]])
               if (this.currentFolder.folders[i].folderName == command.split(" ")[1]) {
                  this.path += command.split(" ")[1] + "/"
                  this.currentFolder = this.getFolder()
               }
            }
            this.nav()
            break;

         case "pwd":
            this.newLine();
            this.cout("  " + this.path)
            this.nav()
            break;

         case "cls":
            this.cursor = 0;
            this.clear();
            this.nav()
            break;

         case "mkdir":
            this.currentFolder.folders.push(new FOLDER(command.split(" ")[1]))
            this.nav()
            break;

         case "less":
            this.newLine()
            for (let i = 0; i < this.currentFolder.files.length; i++) {
               if (this.currentFolder.files[i].name === command.split(" ")[1]) {
                  this.cout(" | ^GRE" + this.currentFolder.files[i].name + " ^gre| ")
                  this.newLine()
                  this.cout(this.currentFolder.files[i].content);
               }
            }
            this.nav()
            break;

         default:
            this.newLine();
            this.cout("^CYAmemerOS: Command not found^cya ^RED" + command.split(" ")[0] + "^red ");
            this.nav()
            break;
      }
   }

   initDisk() {
      let diskFolder = new FOLDER("DISK:");
      let homeFolder = new FOLDER("home");

      homeFolder.files.push(
         new FILE("Hello_world.txt", "Hello World!")
      )

      diskFolder.folders.push(
         homeFolder
      )

      this.disk.push(diskFolder);
   }

   getFolder() {
      let tempFolder: FOLDER;
      tempFolder = this.disk[0];
      for (let i = 0; i < this.path.split("/").length; i++) {
         for (let j = 0; j < tempFolder.folders.length; j++) {
            if (tempFolder.folders[j].folderName === this.path.split("/")[i]) {
               tempFolder = tempFolder.folders[j];
            }
         }
      }
      return tempFolder;
   }

   // Terminal rendering.

   // Init display.
   initDisplay() {
      for (let i = 0; i < this.terminalHeight; i++) {
         let tempArr = new Array();
         for (let j = 0; j < this.terminalWidth; j++) {
            tempArr.push(' ');
         }
         this.display.push(tempArr)
      }

      window.addEventListener("keydown", (e) => {
         if (this.isTakingInput) {
            switch (e.key) {
               case "Backspace":
                  this.cursor = this.cursor - 1;
                  this.cout(" ")
                  this.currentCommand = this.currentCommand.slice(0, -1)
                  this.cursor = this.cursor - 1;
                  break;

               case "Enter":
                  console.log(e.key)
                  console.log(this.currentCommand)
                  this.handleCommand(this.currentCommand)
                  this.currentCommand = "";
                  break;

               default:
                  if (e.key.length == 1) {
                     this.cout(e.key)
                     this.currentCommand += e.key;
                  }
                  break;
            }
            e.preventDefault();

            this.render()
         }
      })
   }

   // Clear the terminal or fill terminal with spaces.
   clear() {
      for (let i = 0; i < this.terminalHeight; i++) {
         for (let j = 0; j < this.terminalWidth; j++) {
            this.display[i][j] = ' ';
         }
      }
   }

   // Push a string to terminal.
   cout(str: String) {
      let len = str.length;
      for (let i = 0; i < len; i++) {
         if (str[i] == '^') {
            let outText: string = str[i + 1] + str[i + 2] + str[i + 3] + str[i + 4];
            this.display[Math.floor(this.cursor / this.terminalWidth)][this.cursor % this.terminalWidth] = outText;
            i = i + 4;
         }
         else {
            this.display[Math.floor(this.cursor / this.terminalWidth)][this.cursor % this.terminalWidth] = str[i];
         }
         this.cursor = this.cursor + 1;
      }

      this.render();
   }

   // Get input from terminal.
   cin(str: String) {
      this.cout(str);
      this.isTakingInput = true;
   }

   newLine() {
      this.cursor = (this.cursor + this.terminalWidth) - this.cursor % this.terminalWidth
   }

   // this -> ~ $.
   nav() {
      this.newLine()
      if (this.path.slice(0, 10) === "DISK:/home") {
         this.cin(" ^GRE~" + this.path.slice(10) + "^gre ^CYA$^cya ")
      }
      else {
         this.cin(this.path + " ")
      }
   }

   // Render the terminal(display) in the DOM.
   render() {
      let html: string = "";
      for (let i = 0; i < this.terminalHeight; i++) {
         let row: string = "";
         for (let j = 0; j < this.terminalWidth; j++) {
            // Colors.
            if (this.display[i][j].length > 1) {

               switch (this.display[i][j][0] + this.display[i][j][1] + this.display[i][j][2]) {
                  case "RED":
                     row += '<pre class="red">'
                     break;

                  case "red":
                     row += '</pre>'
                     break;

                  case "CYA":
                     row += '<pre class="cya">'
                     break;

                  case "cya":
                     row += '</pre>'
                     break;

                  case "GRE":
                     row += '<pre class="gre">'
                     break;

                  case "gre":
                     row += '</pre>'
                     break;

               }

               row += this.display[i][j][3];
            }
            else {
               if ((i * this.terminalWidth) + j == this.cursor) {
                  row += '<pre class="cursor"> </pre>'
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
   }
}

let term = new Terminal(70, 240);
