const { fetchCommentsByArticleID } = require("../models/comments.model.js");

exports.getCommentsByArticleID = (req, res, next) => {

    const article_id = req.params.article_id

    fetchCommentsByArticleID(article_id)
    .then( comments => {
    res.status(200).send( { comments } );
    })
    .catch( err => { next(err) })
};