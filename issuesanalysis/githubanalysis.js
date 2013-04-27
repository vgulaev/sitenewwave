function getdata(){

	data_for_chart = [];
	data_for_chart.push(["Day", "Поступило задач", "Закрыто задач", "Задач открытых"]);

    $.ajax({
        type: "POST",
        url: "mongoquery.py",
        async: false,
        //traditional: true,
        data: {
            "queryname": "taskcreated"
        },
        success: function (html) {
            var objdata = JSON.parse(html);
			/*data_for_chart.push(["2011", 12]);
			data_for_chart.push(["2015", 15]);*/
			//data = [];
			for (var el in objdata.result){
				data_for_chart.push([objdata.result[el]._id.date_of_created, objdata.result[el].task_count, 0, 3]);
			}
        }
    });
	
    $.ajax({
        type: "POST",
        url: "mongoquery.py",
        async: false,
        //traditional: true,
        data: {
            "queryname": "taskclosed"
        },
        success: function (html) {
            var objdata = JSON.parse(html);
			for (var el in objdata.result){
				data_for_chart.push([objdata.result[el]._id.date_of_created, 0, objdata.result[el].task_count, 3]);
			}
        }
    });
	/*var data = [
          ['Year', 'Sales', 'Expenses'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ];*/
	return data_for_chart;
}

function drawChart() {
	var data = google.visualization.arrayToDataTable(getdata());

	var result = google.visualization.data.group(
		data,
		[0],
		[
        {'column': 1, 'aggregation': google.visualization.data.sum, 'type': 'number'},
		{'column': 2, 'aggregation': google.visualization.data.sum, 'type': 'number'},
        {'column': 3, 'aggregation': google.visualization.data.sum, 'type': 'number'}]
	);
	
    var options = {
		title: 'Анализ работы с задачами'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(result, options);
	
	var table = new google.visualization.Table(document.getElementById('table'));
	table.draw(result, null);	
}

function paintChart() {
}

$(document).ready(function () {
	paintChart();
});