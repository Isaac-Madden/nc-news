exports.PSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
     res.status(400).send({ msg: "bad request" });
    }
    if (err.code === "23503") {
        res.status(404).send({ msg: "not found" });
    }
    next(err)
};

exports.customErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
     res.status(err.status).send({ msg: err.msg });
    }
    next(err)
};

exports.invalidPath = (req, res, next) => {
    res.status(404).send({ msg: "invalid path" });
};
