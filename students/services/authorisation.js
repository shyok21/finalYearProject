const auth = (userTypes) => {
    return ((req, res, next) => {
        const sess = req.session;
        console.log(userTypes + ' ' + sess.userType);
        if(userTypes.includes(sess.userType)) {
            
            next();
        }
        else {
            res.redirect("/");
        }
    });
}

module.exports = auth;

