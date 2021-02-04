const getProfessors = (req, res) => {
    const dept_id = req.query.dept_id;
    var qry = util.format("select prof_id, prof_name from department where prof_dept='%s'", dept_id);
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

module.exports = getProfessors;