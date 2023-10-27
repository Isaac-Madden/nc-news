const db = require("../../db/connection");

exports.fetchArticleByID = (article_id) => {

    const query = 
    `SELECT 
    articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, article_img_url, 
    COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id 
    ORDER BY articles.created_at DESC;`

    return db.query(query, [article_id])
    .then( data => {

        if (data.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "no article found" })
        }

        else return data.rows[0];
        
    })
};

exports.fetchAllArticles = (topicQuery, sortBy = "created_at", sortOrder = "desc") => {

    const validSorts = {
        article_id: "article_id",
        title: "title",
        topic: "topic",
        author: "author",
        body: "body",
        created_at: "created_at",
        votes: "votes",
        article_img_url: "article_img_url",
        comment_count: "comment_count"
    }
       
    const validOrders = {
        asc: "ASC",
        desc: "DESC",
    }

    if (validSorts.hasOwnProperty(sortBy) === false) { 
        return Promise.reject({ status: 400, msg: "invalid sort_by query" });
    }

    if (validOrders.hasOwnProperty(sortOrder) === false) {
        return Promise.reject({ status: 400, msg: "invalid sort_by order" });
    }

    let queryString =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id"

    if (topicQuery !== undefined ){

        queryString += " WHERE topic = $1 GROUP BY articles.article_id"

        if(sortBy !== undefined){ 
            queryString += ` ORDER BY ${sortBy} ${sortOrder}`
        }
        else{ 
            queryString += " ORDER BY articles.created_at DESC;" 
        }
        
        return db.query( queryString, [topicQuery] )
        .then( data => { 

            if (data.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no article matching that topic found" })
            }
            else return data.rows

        })
    }
    else {
        queryString += " GROUP BY articles.article_id"

        if(sortBy !== undefined){
            queryString += ` ORDER BY articles.${sortBy} ${sortOrder}`
        }
        else{
            queryString += " ORDER BY articles.created_at DESC;"
        }

        return db.query(queryString)
        .then( data => { return data.rows })
    }
};

exports.updateArticleByID = (article_id, inc_votes) => {

    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then(data => {

        if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "no article found" })
        }
        else return data.rows[0]

    })
};