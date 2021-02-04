const bcrypt = require('bcrypt');
const saltRounds = 10;

const encrypt = (password) => {
    const hashedPassword = bcrypt.hashSync(password,saltRounds);
    return hashedPassword;
}

const compare = (password, hash) => {
    const result = bcrypt.compareSync(password, hash);
    console.log(result);
    return result;
}

module.exports = {
    encrypt,
    compare
};