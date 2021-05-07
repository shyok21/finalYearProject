const auth = (userTypes) => {
    return ((req, res, next) => {
        const sess = req.session;
        console.log(userTypes + ' ' + sess.userType);
        if(userTypes.includes(sess.userType)) {
            
            next();
        }
        else {
            res.render("notification", {message: 'Unauthorised access', status: 'error', backLink: '/', backText: 'Back to home page'});
        }
    });
}

module.exports = auth;

