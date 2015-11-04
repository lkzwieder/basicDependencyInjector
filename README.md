# Basic Dependency Injector
Basic dependency injector is RequireJS-like tool, but lighter and faster. Build with simplicity in mind offers
a true Dependency injection pattern with no need extra script tags in the html.
The first version is aimed only to load JS but in a near future Basic Dependency Injector would be able to load HTML and
many more types.

It uses Basic dependency manager and basic deferred to work and it will be part of a front-end framework I'm developing.

### Installation
```sh
$ npm install basic-dependency-injector
```

### Typical use
A script tag must be placed, this must contain data-main attribute and basic dependency injector will load that script 
for you. This main.js is your entry point.
In the loaded js, you can use $req to load anything you want. (Now only accepts js, so... anything... not ver accurate word
right now).
$req receive two params, an array of urls or names (if the last one is the case must be a setConfig call previously) and 
a callback. This callback would be executed right after the load scripts step and the params would be called in the 
same order of the dependencies array.


######Example

*index.html*
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Dependency injector</title>
</head>
<body>
    <script type="text/javascript" data-main="main.js" src="basicDependencyInjector-browser.js"></script>
</body>
</html>
```

What we do is set the initial script into data-main attribute.


*main.js*
```
req.setConfig({
   jquery: {
      url: 'jquery-2.1.4.min.js'
   },
   underscore: {
      url: 'underscore-min.js',
      deps: ['jquery']
   }
});
req([
   'app.js'
], function(App) {
   App();
});
```

This would load the initial script in which we set configs
and start our app. This script MUST be a req call.

*app.js
```
var Module = def([
   'underscore',
   'jquery',
   '!storeText.html'
], function($, _, someText) {
   console.log(someText, $, _);
});

```

This app module and all modules from this point are libraries or def calls.
Here we inject jquery, underscore and someText and we can work our module in an isolated environment. If we look closer
we can note that to load text, we simple add ! at the beginning of the dependency, no matter if is html, txt or whatever.

Notice too that we save our to a variable, you can pick the name you want but I prefer to declare a significant name like 
loginBox or something that can describe what is the module. The injector need that name to work, but you don't. So it is
the same if you name your module HDJHDFGHG or myModule.