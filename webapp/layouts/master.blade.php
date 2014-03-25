
@script(URL::asset('js/main.js'))
@style(URL::asset('css/main.css'))

<div class="wrapper">
	@if($user !== null)
		Welcome, {{{ $user->username }}} 
		 (<a href="{{{ URL::to('AuthController@logout') }}}">logout</a>).
	@else
		You are not logged in (<a href="{{{ URL::to('AuthController@login') }}}">login</a>).
	@endif

	@yield('content')
</div>
