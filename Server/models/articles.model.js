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

exports.fetchAllArticles = (topicQuery) => {

    if (topicQuery === undefined ){

        const queryString = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, 
        COUNT(comments.article_id) AS comment_count
        FROM articles
        LEFT JOIN comments
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    
        return db.query(queryString)
        .then( data => { return data.rows })
    }

    else{

        let queryString = 
        `SELECT 
        articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
        COUNT(comments.article_id) AS comment_count 
        FROM articles LEFT JOIN comments 
        ON comments.article_id = articles.article_id
        WHERE topic = $1 
        GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;`
    
        return db.query( queryString, [topicQuery] )
        .then( data => { 

            if (data.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no article matching that topic found" })
            }
            
            else return data.rows
            
        })

    }
}

exports.updateArticleByID = (article_id, inc_votes) => {

    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then(data => {

        if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "no article found" })
        }
        else return data.rows[0]

    })
};