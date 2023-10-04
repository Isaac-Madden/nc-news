const { fetchArticleByID, fetchAllArticles, updateArticleByID } = require("../models/articles.model.js");

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

exports.patchArticleByID = (req, res, next) => {

    const article_id = req.params.article_id
    const inc_votes = req.body.inc_votes
   
    if (inc_votes === undefined) {
        return next({ status: 400, msg: "no votes submitted" })
    }

    updateArticleByID(article_id, inc_votes)
    .then( article => {
        res.status(202).send({ article })
    })
    .catch( err => next(err) )
};