const { fetchCommentsByArticleID, addCommentByArticleID } = require("../models/comments.model.js");

exports.getCommentsByArticleID = (req, res, next) => {

    const article_id = req.params.article_id

    fetchCommentsByArticleID(article_id)
    .then( comments => {
    res.status(200).send( { comments } );
    })
    .catch( err => { next(err) })
};

exports.postCommentByArticleID = (req, res, next) => {

    const article_id  = req.params.article_id
    const userName = req.body.username
    const commentBody = req.body.body

    if (userName === undefined) {
        return next({ status: 400, msg: "incomplete request, provide username" })
    }

    if(commentBody === undefined) {
        return next({ status: 400, msg: "incomplete request, please add a comment" }) 
    }

    addCommentByArticleID(commentBody, article_id, userName)
     .then( comment_added => {
      res.status(201).send({ comment_added });
     })
     .catch( err => next(err) ) 
};