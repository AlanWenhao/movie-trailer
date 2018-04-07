module.exports = `
    <!DOCTYPE html>
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
            <script src="https://cdn.bootcss.com/jquery/3.2.0/jquery.min.js"></script>
            <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col-md-8">
                        <h1>Hi <%= you  %></h1>
                        <p>This is <%= me  %></p>
                    </div>
                    <div class="col-md-4">
                        <p>This is a dynamic ejs page</p>
                    </div>
                </div>
            </div>
            
        </body>
    </html>
`
