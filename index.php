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
                url: 'underscore-min.js'
            }
        });
        $req([
           'underscore',
        ], function($, _) {
            console.log($, _);
        });
    </script>
</head>
<body>

</body>
</html>