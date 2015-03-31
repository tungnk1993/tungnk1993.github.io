$(function() {
	var startDatepicker;
	var endDatepicker;
	var startDate, endDate;
	var highlight = [];
	var mode;
	
	var weekday = ["SUN", "MON", "TUE", "WED" , "THU", "FRI", "SAT"];
	var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	function init() 
	{
		mode = "sixty";
		startDatepicker = $(" #startDate" ).datepicker({
			dateFormat: 'dd-mm-yy',
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			onSelect: function(dateText, inst) 
			{
				//startDate = $(this).datepciker('getdate');
				startDate = new Date(Date.parse($(this).datepicker('getDate')));
			}
		});
		
		endDatepicker = $(" #endDate" ).datepicker({
			dateFormat: 'dd-mm-yy',
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			onSelect: function(dateText, inst) 
			{
				//endDate = new Date(dateText);
				endDate = new Date(Date.parse($(this).datepicker('getDate')));
				if (endDate < startDate) endDate = startDate;
			}
		});
		
		// init day of the week
		
		for (var i = 0; i <= 6; i++)
		{
			//console.log($("#"+i)[0]);
			$("#"+i)[0].checked = true;
		}
	}
	
	init();
	
	$("#sixty").click(function () 
	{
		console.log("MODE = SIXTY");
		mode = "sixty";
		$("#timepicker").show();
		$("#daily").prop('checked',false);
	});
	
	$("#daily").click(function ()
	{
		console.log("MODE = DAILY");
		mode = "daily";
		$("#timepicker").hide();
		$("#sixty").prop('checked',false);
	});
	
	$( "#update" ).click(function() {
		console.log("Update button clicked");
		
		// get info about range of date
		startDate = new Date(Date.parse($("#startDate").datepicker('getDate')));
		endDate = new Date(Date.parse($("#endDate").datepicker('getDate')));
		if (endDate < startDate) endDate = startDate;
		
		console.log(startDate);
		console.log(endDate);
		
		// get info about day of the week
		var displayDay = [true, true, true, true, true, true, true];
		
		for (var i = 0; i <= 6; i++)
		{
			displayDay[i] = $("#" + i)[0].checked;
		}
		
		console.log(displayDay);
		
		if (mode == "sixty")
		{
			// get info about range of time
			
			var startTime = $( "#from" ).val();
			var endTime = $("#to").val();
			startTime = Number(startTime);
			endTime = Number(endTime);
			
			if (endTime < startTime) endTime = startTime;
			
			console.log(startTime," -> ", endTime);
			
			// draw table
			
			// 1. clear old table
			$("#grid").html("");
			// 2. draw new table
			var row = 0, col = 0;
			
			while (startDate <= endDate)
			{
				var curDate = startDate;
				var day = curDate.getDay();
				if (displayDay[day] == true)
				{
					// valid day to display
					col = 0;
					row++;
					console.log("ROW = " + row);
					
					// add new row
					var tr = $("<tr></tr>");
					
					// add date
					var getday = curDate.getDate();
					var getmonth = curDate.getMonth()+1;
					
					col++;
					var date = "<td r = '"+row+"' c = '"+col+"' class = ' info date'>" + weekday[day] + " " + getday+"/"+getmonth+"</td>";
					console.log(date);
					
					tr.append(date);
					// add time
					
					for (var i = startTime; i <= endTime; i++)
					{
						col++;
						var x = i.toString();
						if (i < 10) x = "0" + x;
						
						var tempDate = curDate;
						curDate.setHours(i);
						var uniqueID = curDate.getTime();
						
						var td = "<td time = '"+uniqueID+"' r = '"+row+"' c = '"+col+"' class = 'time'>" + x +":00 </td>";
						console.log(td);
						tr.append(td);
					}
					
					$("#grid").append(tr);
					
				}
				
				var nextDate = startDate.setDate(startDate.getDate()+1);
				startDate = new Date(nextDate);
				startDate.setHours(0);
			}
			
			console.log(row,col);
			
			var down = false;
			var highlight = {};
			var color = 0;
			// mousedown
			$(".time").mousedown(function (){
				down = true;
				var id = $(this).attr("time");
				if (id in highlight)
				{
					color = 0; 
					$(this).removeClass("success");
					delete highlight[id];
				}
				else 
				{
					color = 1;
					$(this).addClass("success");
					highlight[id] = { row: Number($(this).attr("r")), col: Number($(this).attr("c"))};
				}
			});
			
			// mouseover
			$(".time").mouseover(function (){
				if (down == true)
				{
					var id = $(this).attr("time");
					
					if (id in highlight)
					{
						if (color == 0)
						{
							$(this).removeClass("success");
							delete highlight[id];
						}
					}
					else
					{
						if (color == 1)
						{
							$(this).addClass("success");
							highlight[id] = { row: Number($(this).attr("r")), col: Number($(this).attr("c"))};
						}
					}
				}
				else
				{
					var id = $(this).attr("time");
					if (id in highlight) ; 
					else $(this).addClass("success");
				}
			});
			
			// mouseout
			$(".time").mouseout(function (){
				if (down == false)
				{
					var id = $(this).attr("time");
					
					if (id in highlight) ;
					else $(this).removeClass("success");
				}
			});
			// mouse up
			$(".time").mouseup(function (){
				down = false;
				
				// update text area
				
				var text = "";
				for (var x in highlight)
				{
					var temp = new Date(Number(x));
					
					var y = highlight[x];
					var add = "DATE : " + temp.getDate() + "/" + (Number(temp.getMonth())+1).toString() + " TIME " + temp.getHours() +" ROW = " + y.row + " COL = " + y.col + "\n";
					text += add;
				}
				
				$("#highlight").val(text);
			});
			
			//click
			$(".date").click(function () {
				var currentRow = $(this).attr("r");
				
				var allHighlighted = true;
				
				for (var i = 2; i <= col; i++)
				{
					var id = $("td[r = "+currentRow+"][c = "+i+"]").attr("time");
					
					if (id in highlight) ; 
					else allHighlighted = false;
				}
				
				if (allHighlighted == true)
				{
					for (var i = 2; i <= col; i++)
					{
						var id = $("td[r = "+currentRow+"][c = "+i+"]").attr("time");
						
						delete highlight[id];
						$("td[r = "+currentRow+"][c = "+i+"]").removeClass("success");
					}
				}
				else
				{
					for (var i = 2; i <= col; i++)
					{
						var id = $("td[r = "+currentRow+"][c = "+i+"]").attr("time");
						
						if (id in highlight);
						else 
						{
							$("td[r = "+currentRow+"][c = "+i+"]").addClass("success");
							highlight[id] = { row: currentRow, col: i};
						}
					}
				}
				
			});
			
		}
		
		if (mode == "daily")
		{
			var row = 0,col = 0;
			// clear table
			$("#grid").html("");
			
			// draw day of the week
			row++; col = 0;
			var tr = $("<tr></tr>");
			
			for (var i = 0; i <= 6; i++)
			{
				col++;
				var text = weekday[i];
				var td = "<td r = "+row+" c = "+col+" class = 'info date'>"+text+"</td>";
				tr.append(td);
			}
			$("#grid").append(tr);
			// loop through each date
			
			tr = $("<tr></tr>");
			
			row++; col = 0; startDay = 0;
			while (startDate <= endDate)
			{
				//console.log(startDate,endDate, startDate == endDate);
				col++;
				var curDate = startDate;
				
				var day = curDate.getDay();
				
				while (startDay < day)
				{
					var blank = "<td class = 'time'>&nbsp;</td>";
					tr.append(blank);
					startDay++;
					col++;
				}
				
				var showDate = curDate.getDate();
				var showMonth = monthArray[curDate.getMonth()];
				var id = curDate.getTime();
				var td = "<td r = "+row+" c = "+col+" time = "+id+" class = 'time'>"+showDate+" "+showMonth+"</td>";
				startDay++;
				tr.append(td);
				
				if (day == 6)
				{
					$("#grid").append(tr);
					tr = $("<tr></tr>");
					row++;
					col = 0;
					startDay = 0;
				}
				else
				{
					var tempDate = new Date();
					tempDate.setDate(curDate.getDate()+1);
					
					if (tempDate.getDate() == 1 )
					{
						$("#grid").append(tr);
						tr = $("<tr></tr>");
						row++;
						col = 0;
						startDay = 0;
					}
					else if (curDate.getTime() == endDate.getTime())
					{
						$("#grid").append(tr);
					}
				}
				
				
				
				
				var nextDate = startDate.setDate(startDate.getDate()+1);
				startDate = new Date(nextDate);
			}
			
			col = 7;
			console.log("ROW = " + row + " COL = " + col);
			
			var down = false;
			var highlight = {};
			var color = 0;
			// mousedown
			$(".time").mousedown(function (){
				down = true;
				var id = $(this).attr("time");
				
				if (id in highlight)
				{
					color = 0; 
					$(this).removeClass("success");
					delete highlight[id];
				}
				else 
				{
					color = 1;
					$(this).addClass("success");
					highlight[id] = { row: Number($(this).attr("r")), col: Number($(this).attr("c"))};
				}
			});
			
			// mouseover
			$(".time").mouseover(function (){
				if (down == true)
				{
					var id = $(this).attr("time");
					
					if (id in highlight)
					{
						if (color == 0)
						{
							$(this).removeClass("success");
							delete highlight[id];
						}
					}
					else
					{
						if (color == 1)
						{
							$(this).addClass("success");
							highlight[id] = { row: Number($(this).attr("r")), col: Number($(this).attr("c"))};
						}
					}
				}
				else
				{
					var id = $(this).attr("time");
					if (id in highlight) ; 
					else $(this).addClass("success");
				}
			});
			
			// mouseout
			$(".time").mouseout(function (){
				if (down == false)
				{
					var id = $(this).attr("time");
					
					if (id in highlight) ;
					else $(this).removeClass("success");
				}
			});
			// mouse up
			$(".time").mouseup(function (){
				down = false;
				
				// update text area
				
				var text = "";
				for (var x in highlight)
				{
					var temp = new Date(Number(x));
					
					var y = highlight[x];
					var add = "DATE : " + temp.getDate() + "/" + (Number(temp.getMonth())+1).toString() + " TIME " + temp.getHours() +" ROW = " + y.row + " COL = " + y.col + "\n";
					text += add;
				}
				
				$("#highlight").val(text);
			});
			
			//click
			$(".date").click(function () {
				var currentCol = $(this).attr("c");
				
				var allHighlighted = true;
				
				for (var i = 2; i <= row; i++)
				{
					var id = $("td[r = "+i+"][c = "+currentCol+"]").attr("time");
					
					if (id in highlight) ; 
					else allHighlighted = false;
				}
				
				if (allHighlighted == true)
				{
					for (var i = 2; i <= row; i++)
					{
						var id = $("td[r = "+i+"][c = "+currentCol+"]").attr("time");
						
						delete highlight[id];
						$("td[r = "+currentRow+"][c = "+i+"]").removeClass("success");
					}
				}
				else
				{
					for (var i = 2; i <= row; i++)
					{
						var id = $("td[r = "+i+"][c = "+currentCol+"]").attr("time");
						
						if (id in highlight);
						else 
						{
							$("td[r = "+i+"][c = "+currentCol+"]").addClass("success");
							highlight[id] = { row: i, col: currentCol};
						}
					}
				}
				
			});
		}
	});
	
	
});

function green(r,c) {
	$("td[r = "+r+"][c = "+c+"]").addClass("success");
}