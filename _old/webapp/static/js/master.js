$(document).ready(function(){

	function reloadPlayground() {
		$.ajax({
			url: "/api/playground",
			type: "GET",
			accepts: "application/json",
			dataType: "json",
			async : true,
			cache: false,
			timeout: 3000,
			success: function(data) {
				/* This function is called if the request is successful with the data as the parameter.
				   We can now call any javascript functions using this data. */
				$("#playground").html("The ajax request was succesful! Retrieved JSON: " + JSON.stringify(data) + "<br />");
			},
			error: function() {
				/* This function is called if the request fails for some reason (e.g. server goes down or user loses internet connectivity). 
				   You may use this to display an error to your users. */
				$("playground").html("The ajax request failed!<br />");
			}
		});
	}

	function reloadSchedule(year) {
		$.ajax({
			url: "/api/schedule/"+year,
			type: "GET",
			accepts: "application/json",
			dataType: "json",
			async : true,
			cache: false,
			timeout: 3000,
			success: function(data) {
				/* This function is called if the request is successful with the data as the parameter.
				   We can now call any javascript functions using this data. */
				$("#calendar").html("The ajax request was succesful! Retrieved JSON: " + JSON.stringify(data) + "<br />");
			},
			error: function() {
				/* This function is called if the request fails for some reason (e.g. server goes down or user loses internet connectivity). 
				   You may use this to display an error to your users. */
				$("#calendar").html("The ajax request failed!<br />");
			}
		});
	}

	function getCourse(courseid) {
		$.ajax({
			url: "/api/course/"+courseid,
			type: "GET",
			accepts: "application/json",
			dataType: "json",
			async : true,
			cache: false,
			timeout: 3000,
			success: function(data) {
				/* This function is called if the request is successful with the data as the parameter.
				   We can now call any javascript functions using this data. */
				$("#toolbar").html("The ajax request was succesful! Retrieved JSON: " + JSON.stringify(data) + "<br />");
			},
			error: function() {
				/* This function is called if the request fails for some reason (e.g. server goes down or user loses internet connectivity). 
				   You may use this to display an error to your users. */
				$("#toolbar").html("The ajax request failed!<br />");
			}
		});
	}

	function getCourses(year, term, search) {
		$.ajax({
			url: "/api/courses/?year="+encodeURIComponent(year)+"&term="+encodeURIComponent(term)+"&search="+encodeURIComponent(search),
			type: "GET",
			accepts: "application/json",
			dataType: "json",
			async : true,
			cache: false,
			timeout: 3000,
			success: function(data) {
				/* This function is called if the request is successful with the data as the parameter.
				   We can now call any javascript functions using this data. */
				$("#toolbar").html("The ajax request was succesful! Retrieved JSON: " + JSON.stringify(data) + "<br />");
			},
			error: function() {
				/* This function is called if the request fails for some reason (e.g. server goes down or user loses internet connectivity). 
				   You may use this to display an error to your users. */
				$("#toolbar").html("The ajax request failed!<br />");
			}
		});
	}

	function addToPlayground(courseid) {
		// TODO
	}

	function deleteFromPlayground(courseid) {
		// TODO
	}

	function addToSchedule(year, courseid) {
		// TODO
	}

	function deleteFromSchedule(year, courseid) {
		// TODO
	}

	//getCourses(2013, 0, "coll");
	//reloadPlayground();
	//reloadSchedule(2014);
	//getCourseInfo(22228);


	/**
	 * Search Form Triggers
	 */
	 $("#search form input[name=search]").focusin(function(e){
		$(this).val('');
		console.log("clicked in");
	});
	/*

	$("#search form input[name=search]").focusout(function(e){
		console.log("clicked out");
		$(this).css({"width" : "", "position" : ""});
	});

	$("#search form input[name=search]").keyup(function(e){
		
	});
	*/




});