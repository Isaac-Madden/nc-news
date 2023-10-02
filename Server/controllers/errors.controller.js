exports.invalidPath = (req, res, next) => {
    res.status(404).send({ msg: "invalid path" });
};