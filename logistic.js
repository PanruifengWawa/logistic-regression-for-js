var dataset = [];
var label = [];
var matched = 0;
var weights = [1.0, 1.0, 1.0];
function start() {
	train();
	test();
	var classes = [];
	var min = dataset[0][1];
	var max = dataset[0][1];

	for (var i = 0; i < dataset.length; i++) {
		if (classes[label[i]] == undefined) {
			classes[label[i]] = [];
		}
		classes[label[i]].push([dataset[i][1],dataset[i][2]]);	
		if (min > dataset[i][1]) {
			min = dataset[i][1];
		}
		if (max < dataset[i][1]) {
			max = dataset[i][1];
		}
	}
	var mySeries = [];
	for (var i = 0; i < classes.length; i++) {
		var oneSerie = {
			type: 'scatter',
			name: 'classes ' + i,
			data: classes[i],
			marker: {
                	radius: 3
            }
		}
		mySeries.push(oneSerie);
	}



	var line = {
            type: 'line',
            name: 'Regression Line',
            data: [[min, getY(min)], [max, getY(max)]],
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 0
                }
            },
    };
    mySeries.push(line);
	drawPoints(mySeries);
		
	
}

function train() {
	for (var i = 0; i <= 100; i++) {
		for (var j = 0; j < dataset.length; j++) {
			index = parseInt(Math.random()*dataset.length,10);
			result = 0;
			for (var z = 0; z < 3; z++) {
				result += dataset[index][z] * weights[z];
			}
			error = label[index] - sigmoid(result);

			for (var z = 0; z <3; z++) {
			
				weights[z] += 0.01*error*dataset[index][z];
			};
			
		}
	}
	console.log(weights);
}

function test() {
	for (var i = 0; i < dataset.length; i++) {
		result = 0;
		for (var z = 0; z < 3; z++) {
			result += dataset[i][z] * weights[z];
		}
		predict = 0;
		if (sigmoid(result) > 0.5) {
			predict = 1;
		}
		if (predict == label[i]) {
			matched++;
		}
	}
}


function getY(x) {
    return -(weights[0]+weights[1]*x)/weights[2]
}

function sigmoid(x) {
	return 1/(1+Math.exp(-x));
}

function loadData() {
	dataset = [];
	lastBelongs = [];

	var file = document.getElementById("dataset").files[0];
	var reader = new FileReader();  
    reader.onload = function() {  
        var content = this.result.split("\n");
        for (var i = 0; i < content.length; i++) {
        	if (content[i] == "") {
        		continue;
        	}
        	var oneRow = content[i].split(",");
        	dataset.push([1,Number(oneRow[0]),Number(oneRow[1])]);
        	label.push(Number(oneRow[2]));
        };
        
    };  
    reader.readAsText(file); 
}


function drawPoints(mySeries) {
	$(function () {
    	$('#container').highcharts({
        	
        	title: {
            	text: 'testNum: ' + dataset.length + ",matched:" + matched + ",ratio:" + matched/dataset.length
        	},
        	series: mySeries
   		});
	});

}