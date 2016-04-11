import express                   from 'express';
import bodyParser                from 'body-parser';
import React                     from 'react';
import { renderToString }        from 'react-dom/server'
import { RoutingContext, match } from 'react-router';
import createLocation            from 'history/lib/createLocation';
import routes                    from 'routes';
import { Provider }              from 'react-redux';
import * as reducers             from 'reducers';
import promiseMiddleware         from 'lib/promiseMiddleware';
import { createStore,
         combineReducers,
         applyMiddleware }       from 'redux';
import path                      from 'path';
import fs                        from 'fs';
import Immutable                 from 'immutable';

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('./webpack.dev').default(app);
}

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var TODO_FILE = path.join(__dirname, 'todo.json');
app.get('/api/todo/list', function(req, res) {
  fs.readFile(TODO_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/todo/create', function(req, res) {
  fs.readFile(TODO_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    if(req.body.text.trim()) {
      var newComment = {
        id: Date.now(),
        text: req.body.text,
      };
      comments.push(newComment);
    }
    fs.writeFile(TODO_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      switch (req.accepts('html', 'json')) {
        case 'json':
          res.json(comments);
          break;
        default:
          res.redirect('/')
      }
    });
  });
});

app.post('/api/todo/update', function(req, res) {
  fs.readFile(TODO_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    if(req.body.text.trim()) {
      for(var i = 0; i < comments.length; ++i) {
        if (comments[i].id == req.body.id) {
          comments[i].text = req.body.text;
        }
      }
    }
    fs.writeFile(TODO_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      switch (req.accepts('html', 'json')) {
        case 'json':
          res.json(comments);
          break;
        default:
          res.redirect('/')
      }
    });
  });
});

app.post('/api/todo/delete', function(req, res) {
  fs.readFile(TODO_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    var index = -1;
    for (var i = 0; i < comments.length; ++i) {
      if (comments[i].id == req.body.id) {
        index = i;
      }
    }
    if (index != -1) {
      comments.splice(index, 1);
    }
    fs.writeFile(TODO_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      switch (req.accepts('html', 'json')) {
        case 'json':
          res.json(comments);
          break;
        default:
          res.redirect('/')
      }
    });
  });
});


app.use( (req, res) => {
  fs.readFile(TODO_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const initialState = {todos: JSON.parse(data)};
    const location = createLocation(req.url);
    const reducer  = combineReducers(reducers);
    const store   = applyMiddleware(promiseMiddleware)(createStore)(reducer, initialState);

    match({ routes, location }, (err, redirectLocation, renderProps) => {
      if(err) {
        console.error(err);
        return res.status(500).end('Internal server error');
      }

      if(!renderProps)
        return res.status(404).end('Not found');

      const InitialView = (
        <Provider store={store}>
          <RoutingContext {...renderProps} />
        </Provider>
      );

      const componentHTML = renderToString(InitialView);

      const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Redux Demo</title>

          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          </script>
        </head>
        <body>
          <div id="react-view">${componentHTML}</div>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>
      `;

      res.end(HTML);
    });
  });
});

export default app;
