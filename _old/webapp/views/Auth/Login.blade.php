@extends('master')

{{--
	Login View
	--}}

@title('Login')

@section('content')
	<form action="{{ URL::to(array($this, 'loginAction')) }}" class="styled" method="POST">
		<table>
			@if(sizeof($errors) > 0)
			<tr>
				<td class="error">
					@foreach($errors as $error)
						{{{ $error }}}
					@endforeach
				</td>
			</tr>
			@endif
			<tr>
				<td class="label">Username</td>
			</tr>
			<tr>
				<td class="input"><input type="text" name="username" value="{{{ $username }}}" /></td>
			</tr>
			<tr>
				<td class="label">Password</td>
			</tr>
			<tr>
				<td class="input"><input type="password" name="password" value="" /></td>
			</tr>
			<tr>
				<td class="input">
					<label>
						<input type="checkbox" name="persistent"
							@if($persistent)
							  	checked="checked" 
							@endif
							/> 
						Remember Me
					</label>
				</td>
			</tr>
			<tr>
				<td class="input"><input type="submit" value="Log in" /></td>
			</tr>
		</table>
	</form>
@endsection