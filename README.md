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


###### Example

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
We use `req` to require the app.

This would load the initial script in which we set configs
and start our app.

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

We use `def` to define modules.
Here we inject jquery, underscore and someText. If we look closer we can note that to load text, we simple add ! at the 
beginning of the dependency, no matter if is html, txt or whatever.

Notice too that we save our definition to a variable. The injector need that name to work, but you don't. So it is
the same if you name your module HDJHDFGHG or myModule.