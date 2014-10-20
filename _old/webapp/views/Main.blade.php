@extends('master')

@title('Rice Schedule Planner')

@section('content')
	<script type="text/javascript">
		jslib.require('org.riceapps.scheduleplanner.controllers.MainController');
	</script>
	<script type="text/javascript">
		$(document).ready(function(){
			var controller = new org.riceapps.scheduleplanner.controllers.MainController();
			controller.initialize();
		});
	</script>

	<div class="toolbar" id="toolbar">
		<div id="search" class="search">
			<input type="text" />
		</div>
		<div id="info"></div>
		<div id="trash"></div>
	</div>

	<div class="layout">
		<div class="column left">
			{{--<div class="search" id="search">
				<form rel="ajax">
					<input name="search" type="text" value="Find Courses..." />
				</form>
			</div>--}}
			<div id="playground">
			</div>
		</div>
		<div class="column middle">
			<div id="calendar"></div>
		</div>
	</div>
@endsection
