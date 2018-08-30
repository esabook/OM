//Config
const fs = require('fs'),
    express = require('express'),
    bodyParser = require('body-parser'),
    swaggerUI = require('swagger-ui-express'),
    swaggerJSDoc = require('swagger-jsdoc'),
    azureMobileApps = require('azure-mobile-apps'),

    lang = require('./app/utils/res'),
    respBuilder = require('./app/models/response')
    app = express(),
    mobile = azureMobileApps(), 

    // run on azure 
    process.env.EMULATED = !process.env.AZURE_STORAGE_ACCOUNT, 
    port = process.env.port || 443,
    apiRouter = require('./routes/root');
    
//Swagger configuration
var def = {
    info:{
        title:'Ticketing API',
        version:'1.0.0',
        description:'See here for other doc https://documenter.getpostman.com/view/2536520/ticketing/RW81tsCK'
    },
    basepath:'/'
};

var options = {
    customCss: '.swagger-ui .topbar {display: none }',
    explorer: true,
    swaggerDefinition: def,
    apis: ['./routes/*.js']
};
var swSpec = swaggerJSDoc(options)


//Routes
app.disable('x-powered-by')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(lang.stringRes().rootAPI, apiRouter);

app.use(lang.stringRes().helpPage, 
        swaggerUI.serve, swaggerUI.setup(swSpec));
        
app.get(def.basepath, function(req, res) {
        res.redirect(lang.stringRes().helpPage);
    });
app.use('*', (req, res) => {
    res.status(404);
    res.end(lang.stringRes().e40x)
    });

app.use((err, req, res, next)=>{
    res.status(500)
    res.send( new respBuilder(err.message, null, false))
})
// fs.readdirSync('./routes').forEach(function(file) {
//     if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
//         return;
//     var name = file.substr(0, file.indexOf('.'));
//     var r = require(`./routes/${name}`)(app, express);
//     app.use(`/api/${name}`, r);
// });

// mobile.api.import('./app/controller');
// app.use(mobile);





//run
app.listen(port, (err, req, res, next) => {
    if(err){
        return console.log(`${new Date().toISOString()} => Something bad happened`, err)
    }
    console.log(`${new Date().toISOString()} => Server is listening on ${port}`)

})
