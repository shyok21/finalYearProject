const getDepartments = (req, res) => {
    const fac_id = req.query.fac_id;
    var qry = util.format("select dept_id, dept_name from department where fac_id='%s'", fac_id);
    return con.query(qry, (err, result, fields) => {
        if(err) {
            console.log(err);
            return null;
        }
        else {
            return result;    
        }
    });
};

module.exports = getDepartments;