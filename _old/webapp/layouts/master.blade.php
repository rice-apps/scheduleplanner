
@script(URL::asset('js/jquery.min.js'))
@script(URL::asset('jslib/master.js'))
@style(URL::asset('css/main.css'))
@style(URL::asset('css/scheduleplanner.css'))

<div class="wrapper">
	<div class="header">
		<ul>
			<li><a href="{{{ URL::to('/') }}}">Schedule Planner<div class="beta">BETA</div></a></li>
			<li><a href="http://www.students.rice.edu/students/Academic_Advising3.asp" target="_blank">Advising</a></li>
			<li><a href="http://courses.rice.edu/" target="_blank">Courses</a></li>
			<li><a href="{{{ URL::to('/instructions') }}}">Instructions</a></li>
			<li><a href="{{{ URL::to('/about') }}}">About</a></li>
			<li>
				@if($user !== null)
					<a href="{{{ URL::to('AuthController@logout') }}}"><span>{{{ $user->username }}}@rice.edu</span> (Logout)</a>
				@else
					<a href="{{{ URL::to('AuthController@login') }}}">Login</a>
				@endif
			</li>
		</ul>
		<div class="clear"></div>
	</div>

	<div class="content">
		@yield('content')
		<div class="clear"></div>
	</div>
	

	<div class="footer">
		&copy; 2014 <a href="http://www.riceapps.org/">Rice University Computer Science Club</a>
		<span style="float: right;">
			<a href="mailto:mschurr@rice.edu?subject=Schedule%20Planner%20Bug" >Report Bug</a>
		</span>
	</div>
</div>
