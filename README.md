# Basic Dependency Injector
Basic dependency injector is RequireJS-like tool, but lighter and faster. Build with simplicity in mind offers
a true Dependency injection pattern with no need extra <script> tags in the html.
The first version is aimed only to load JS but in a near future Basic Dependency Injector would be able to load HTML and
many more types.

It uses Basic dependency manager and basic deferred to work and it will be part of a front-end framework I'm developing.

### Installation
```sh
$ npm install basic-dependency-injector
```

### Typical use
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test Dependency injector</title>
    <script type="text/javascript" src="../basicDependencyInjector-browser.js"></script>
    <script type="text/javascript">
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
    </script>
</head>
<body>

</body>
</html>
```