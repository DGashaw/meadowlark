import express from 'express';
import handlebars from 'express-handlebars'
import path from 'path';
import getFortune from './lib/fortune.js';


const hbs = handlebars.create({defaultLayout: 'main'})
const app = express();

//setting up templating engines
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static(path.join(process.cwd(), 'public')));

//setting up the port for the application
app.set('port', process.env.PORT || 3000);

app.get('/', function(request, response) {
    //response.type('text/plain');
    //response.send('Welcome to Meadowlark Travel');
    response.render('home');
});

app.get('/about', function(request, response) {
    //response.type('text/plain');
    //response.send('About Meadowlark Travel');
    
    getFortune()
        .then(randomFortune => {
            response.render('about', {fortune: randomFortune});
        })
        .catch(error => {
            console.log(`Error: ${error.message}`);
            response.redirect('500');
        });

    
    
})
//custom 404 page
app.use(function(request, response){
    //response.type('text/plain');
    response.status(404);
    //response.send('404 - Not Found');
    response.render('404');

});

//custom 500 page
app.use(function(error, request, response, next) {
    console.log(error.stack);
    //response.type('text/plain');
    response.status(500);
    //response.send('500 - Server Error');
    response.render('500');

});

app.listen(app.get('port'), () => {
    console.log(`Express started on http://localhost:${app.get('port')} ; press Ctrl-C to terminate`)
});