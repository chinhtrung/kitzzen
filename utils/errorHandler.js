const errorMessage = (err, path) => {
    console.log(`!!!!!!!!!! ERROR: ${err} OCCURS FROM EXECUTING ${path}`);
}

module.exports = {
    errorMessage
}