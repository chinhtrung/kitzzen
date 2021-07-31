const errorMessage = (err, path) => {
    console.log(`!!!!!!!!!! ERROR: ${err} OCCURED AT ${path}`);
}

const errorResponse = (req, res, err, path) => {
    errorMessage(err, path);
    req.flash("error", "error in errorHandler");
    res.redirect("/error");
}

module.exports = {
    errorMessage,
    errorResponse
}