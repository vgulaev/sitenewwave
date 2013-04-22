function getdata(){

	data_for_chart = [];

    $.ajax({
        type: "POST",
        url: "mongoquery.py",
        async: false,
        //traditional: true,
        data: {
            "queryname": "get_words_by_filter"
        },
        success: function (html) {
            var objdata = JSON.parse(html);
			data_for_chart.push(["Day", "Поступило задач"]);
			/*data_for_chart.push(["2011", 12]);
			data_for_chart.push(["2015", 15]);*/
			//data = [];
			for (var el in objdata.result){
				data_for_chart.push([objdata.result[el]._id.date_of_created, objdata.result[el].task_count]);
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

    var options = {
		title: 'Динамика задач'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function paintChart() {
}

$(document).ready(function () {
	paintChart();
});