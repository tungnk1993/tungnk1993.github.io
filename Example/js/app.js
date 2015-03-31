$(document).ready(function(){
	var days;
	
	$("#calendar-container").rangeCalendar({
		theme: "full-green-theme",
		startDate: moment(),
		endDate: moment().add(12, 'months'),
		minRangeWidth: 2,
		changeRangeCallback: function (el, cont, dateProp) {
			days = moment().range(moment(cont.start), moment(cont.end));
			/* Iterator example
			days.by('days', function(m) {
				console.log(m);
			});
			*/
		}
	});

	Date.prototype.addDays = function(days) {
	    var d = new Date(this.valueOf())
	    d.setDate(d.getDate() + days);
	    return d;
	}

	function getDates(startDate, endDate) {
		var dates = new Array();
		var current = startDate;
		while (current <= endDate) {
			dates.push(new Date(current));
			current = current.addDays(1);
		}
		return dates;
	}
	/*
	$('.time-container').prepend(RangeBar({
		allowDelete: true,
		min: moment().startOf('day').format('LLLL'),
		max: moment().startOf('day').add(1, 'day').format('LLLL'),
		valueFormat: function(ts) {
			return moment(ts).format('LLLL');
		},
		valueParse: function(date) {
			return moment(date).valueOf();
		},
		values: [
			[
				moment().startOf('day').format('LLLL'),
				moment().startOf('day').add(1, 'hours').format('LLLL')
			],
		],
		label: function(a){return JSON.stringify(a)},
		snap: 1000 * 60 * 15,
		minSize: 1000 * 60 * 60,
		bgLabels: 4,
		indicator: function(bar, indicator, recalc) {
			if(recalc) setInterval(recalc, 500);
			return moment().hours(Math.floor(24 * Math.random())).format('LLLL');
		}
	})
	.on('changing', function(ev, ranges, changed) {
		console.log(changed);
		$('pre.changing').html(JSON.stringify(ranges,null,2));
	})
	.on('change', function(ev, ranges, changed) {
		console.log(changed);
		$('pre.changing').after($('<pre>').html('changed'+JSON.stringify(ranges,null,2)));
	}).$el);
	*/
	 $(".elessar-ui").each(function() {
        var newRange = new RangeBar({
            allowDelete: true,
            min: moment().startOf("day").format("LLLL"),
            max: moment().startOf("day").add(1, "day").format("LLLL"),
            valueFormat: function(ts) {
                return moment(ts).format("h:mm a");
            },
            valueParse: function(date) {
                return moment(date).valueOf();
            },
            htmlLabel: true,
            label: function(a) {
				// the duration moment part in the middle still doesn't work
                return '<span class="range-start"><b>Start Time: </b> ' + a[0] + '</span><span class="range-end"><b>End Time: </b><span>' + a[1] + '</span>';
            },
					  values: [
				[
				  moment().startOf('day').format('LLLL'),
				  moment().startOf('day').add(5, 'hours').format('LLLL')
				],
				[
				  moment().startOf('day').add(5, 'hours').format('LLLL'),
				  moment().startOf('day').add(9, 'hours').format('LLLL')
				]
			  ],
            snap: 1000 * 60 * 15,
            minSize: 1000 * 60 * 30,
            bgLabels: 4,
            rangeClass: "bg-primary"
        });

        // attach a rangebar to each div.elessar-ui (each of which has a unique id) 
        $(this).prepend(newRange.$el)
            .on("changing", function(ev, val, range) {
				// show and hide label based on width during changing
                var rangeWidth = $(range).width();
                console.log(rangeWidth);
                if (rangeWidth < 175) {
                    $(range).find(".elessar-barlabel").css("visibility", "hidden");
                } else {
                    $(range).find(".elessar-barlabel").css("visibility", "visible");
                }
                if (rangeWidth < 40) {
                    $(range).find(".open-range-options").css("visibility", "hidden");
                } else {
                    $(range).find(".open-range-options").css("visibility", "visible");
                }
				$(range).css( "background", "#38597E" );
            })
            .on("change", function(ev, val, range) {
                // show and hide label based on width after change
				var rangeWidth = $(range).width();
                console.log(rangeWidth);
                if (rangeWidth < 175) {
                    $(range).find(".elessar-barlabel").css("visibility", "hidden");
                } else {
                    $(range).find(".elessar-barlabel").css("visibility", "visible");
                }
                if (rangeWidth < 40) {
                    $(range).find(".open-range-options").css("visibility", "hidden");
                } else {
                    $(range).find(".open-range-options").css("visibility", "visible");
                }
				$(range).css( "background", "#4D7AAC" );
				// open range options popup
                $(".open-range-options").click(function(newRange, range) {
                    var optionsPop = $(this).offset();
                    openRangeOptions(optionsPop.top, optionsPop.left, newRange, newRange);
                });
                $(".close-range-options").click(function() {
                    // save settings and close
					$(".range-options").hide();
                });
                $(".delete-range").click(function() {
					// delete this particular range (still trying to figure this one out)
                    $(range).removeRange();
                    $(".range-options").hide();

                });
            });

    });
    $(".clear-schedule").click(function() {
        alert("Not working yet");
    });

    function openRangeOptions(top, left, newRange, range) {
    $(".range-options").show()
        .css({
            top: top + "px",
            left: left + 40 + "px"
        });
	}
});

