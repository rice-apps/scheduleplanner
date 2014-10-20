@title('Schedule Planner [DEVELOPER VERSION]')

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
