const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express();

// setting view to ejs
app.set('view engine', 'ejs')

// passing any value from form to backend 
app.use(bodyParser.urlencoded({
    extended: true
}))

// static file from the public folder is available to use in the frontend
app.use(express.static("public"))

// connection to the mongo Url 
mongoose.connect("mongodb+srv://root:root@cluster0.kdlnd.mongodb.net/wikiDB?retryWrites=true&w=majority", { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log("Connected To DataBase")
    } else {
        console.log(err)
    }
})

// schema for mongo db (rules for the database)
const articleSchema = {
    title: String,
    content: String
}
// model creation
const Article = mongoose.model('Article', articleSchema)

// using app route
app.route('/articles')
    // get request for the all articles
    .get((req, res) => {
        Article.find({}, (err, result) => {
            if (!err) {

                res.send(result)
            } else {
                res.send(err)
            }
        })
    })
    // post request for creation of articles
    .post((req, res) => {
        console.log(req.body.title)
        console.log(req.body.content)

        const creation = new Article({
            title: req.body.title,
            content: req.body.content
        })
        creation.save((err) => {
            if (!err) {
                res.send("Successfully send to dataBase")
            } else {
                res.send(err)
            }
        })
    })
    //post deletion 
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                console.log("Deletion Completed ALL")
            } else {
                console.log(err)
            }
        })

    })



app.route('/articles/:articleTitle')
    .get((req, res) => {
        console.log(req.params.articleTitle)
        //find the article and send the response
        Article.findOne({ title: req.params.articleTitle }, (err, result) => {
            if (!err) {
                res.send(result)
            } else {
                console.log(err)
                res.send(err)
            }
        })
    })
    .put((req, res) => {
        console.log(req.params.articleTitle)
        Article.replaceOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (!err) {
                    console.log("updated successfully")
                    res.send("updated successfully")
                } else {
                    console.log(err)
                    res.send(err)
                }
            }
        )
    })
    .patch((req, res) => {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err) {
                    console.log("Patched successfully")
                    res.send("Patched successfully")
                } else {
                    console.log(err)
                    res.send(err)
                }
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                console.log("Deletion Completed " + req.params.articleTitle)
                res.send("Deletion Completed " + req.params.articleTitle)
            } else {
                console.log(err)
            }
        })
    });

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("server is running ")
})