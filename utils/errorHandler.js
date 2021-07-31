const errorMessage = (err, path) => {
    console.log(`!!!!!!!!!! ERROR: ${err} OCCURED AT ${path}`);
}

const errorResponse = (req, res, err, path) => {
    errorMessage(err, path);
    req.flash("error", "An error has occurred, please go back to the home page!");
    res.redirect("/error");
}

module.exports = {
    errorMessage,
    errorResponse
}