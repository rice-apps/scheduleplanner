{{-- 
	Master Layout
	--}}

{{-- Load Scripts @script(URL::asset('js/master.js')) --}}


{{-- Load Styles @style(URL::asset('css/master.css')) --}}


{{-- Render Layout --}}
<div class="wrapper">
	@yield('content')
</div>
