console.log("hi");
const fs = require('fs');
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
var studentList;
function myFunction(){	
		// Use fs.readFile() method to read the file 
		fs.readFile('/home/roopkatha/FinalYearProject/finalYearProject-main/tempDatabase/Student.txt', 'utf8', function(err, data){ 
			// Display the file content 
    		if(err)
    			return console.log(err);
  			//console.log(data);
  			var stringData = data.toString();
  			studentList = stringData.split("\n");
  			console.log(studentList);
  			//var myJsonString = JSON.stringify(studentList);
  			//console.log(myJsonString);
        	console.log("Server Created!");
        	console.log("https://localhost:" + port + "/");
    		
  			var html = "<table border='1|1'>";
			for (var i = 0; i < studentList.length; i++) {
		    	html+="<tr>";
    			html+="<td>"+studentList[i]+"</td>";    
		    	html+="</tr>";
			}
			html+="</table>";
			document.getElementById("box").innerHTML = html;
		});
	}