$req.setConfig({
   jquery: {
      url: 'jquery-2.1.4.min.js'
   },
   underscore: {
      url: 'underscore-min.js',
      deps: ['jquery']
   }
});
$req([
   'underscore',
   'jquery'
], function(_, $) {
   console.log(_, $);
});