$(document).ready(function() {
	
	init();
	formredirect();
	joinbutton();
	loginbutton();
});

function init()
{
	$("#form-signin").hide();
}

function joinbutton()
{
	$("#Join").click(function() {
		$("#form-signup").show();
		$("#form-signin").hide();
		
	});
}

function loginbutton()
{
	$("#Login").click(function() {
		$("#form-signin").show();
		$("#form-signup").hide();
		
	});
}

function formredirect()
{
	$("form").submit(function()
	{
		//alert("SUBMIT");
		window.location.assign("Create.html");
		return false;
	});
}
