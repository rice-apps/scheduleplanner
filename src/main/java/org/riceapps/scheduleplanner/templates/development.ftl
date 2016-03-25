<!DOCTYPE HTML>
<html>
  <head>
    <title>Rice Schedule Planner</title>
    <link rel="stylesheet" type="text/css" href="/frontend/org/riceapps/stylesheets/animation.min.css" />
    <link rel="stylesheet" type="text/css" href="/frontend/org/riceapps/stylesheets/view.css" />
    <link rel="icon" type="image/png" href="/favicon.png" media="all" />
    <script src="/closure-library/closure/goog/base.js" type="text/javascript"></script>
    <script src="/frontend/deps.js" type="text/javascript"></script>
    <script type="text/javascript">
      goog.require('org.riceapps.controllers.SchedulePlannerController');
    </script>
  </head>
  <body>
    <script type="text/javascript">
      var main = new org.riceapps.controllers.SchedulePlannerController();
      main.start();
    </script>
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-61282211-1', 'auto');
      <#if username??>
        ga('set', '&uid', '${username}');
      </#if>
      ga('send', 'pageview');
    </script>
  </body>
</html>
