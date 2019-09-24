
const companies = {};

var val = require('./companies.json');
for (let i = 0; i < val.length; i++) {
    let c = val[i];
    companies[c.Code.toLowerCase()] = {code: c.Code, name: c.Name, exchange: c.Exchange, industry: c.IndustryName};
}
// free mem
delete val;


const CompanyHandler = {
    get: function(code) {
        console.log('check code ', code, companies[code]);
        if (code) {
            return companies[code.toLowerCase()];
        }
        return null;
    }
}

module.exports = CompanyHandler;