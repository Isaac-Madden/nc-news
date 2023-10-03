const { fetchArticleByID, fetchAllArticles } = require("../models/articles.model.js");

exports.getArticleByID = (req, res, next) => {

    const article_id = req.params.article_id;

    fetchArticleByID(article_id)
     .then( (article) => {
      res.status(200).send({ article })
     })
     .catch( (err) => { next(err) })

};

exports.getAllArticles = (req, res, next) => {

    fetchAllArticles()
    .then( articles => {
        res.status(200).send( {articles} )
    })
    .catch( (err) => { next(err) })
}