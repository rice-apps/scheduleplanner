@title('Schedule Planner [DEVELOPER BUILD]')

@script(URL::asset('closure-library/closure/goog/base.js'))
@script(URL::asset('frontend/deps.js'))

@style(URL::asset('frontend/org/riceapps/stylesheets/animation.min.css'))
@style(URL::asset('frontend/org/riceapps/stylesheets/view.css'))

@head
  <script type="text/javascript">
    goog.require('org.riceapps.controllers.SchedulePlannerController');
  </script>
@endhead

<script type="text/javascript">
  var main = new org.riceapps.controllers.SchedulePlannerController();
  main.start();
</script>

{{-- Google Analytics Code --}}
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-61282211-1', 'auto');

  @if (App::getRequest()->session->auth->loggedIn())
    ga('set', '&uid', '{{ App::getRequest()->session->auth->user->username() }}');
  @endif

  ga('send', 'pageview');
</script>
