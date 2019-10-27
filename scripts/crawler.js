// const fetch = require("node-fetch");
const request = require('request');
const fs = require('fs');

function _fetchCompanies(page, pageSize) {
    console.log('fetch companies page = ' + page + ' pageSize = ' + pageSize);
    let url = 'https://finance.vietstock.vn/data/corporateaz',   
        data = `catID=0&industryID=0&page=${page}&pageSize=${pageSize}&type=0&code=&businessTypeID=0&orderBy=Code&orderDir=ASC`,
        config = {
            url: url,
            method: 'post',
            body: data,
            headers: {
                'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Referrer': 'https://finance.vietstock.vn/doanh-nghiep-a-z?page=3',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
            },
            credentials: 'include'
        };
    return new Promise(resolve => {
        request(config, (err, resp, body) => {
            resolve(JSON.parse(body));
        })

    }); 
               
}

function fetchCompanies() {
    let page = 1,
        pageSize = 50,
        result = [];

    
    return new Promise(resolve => {
        let callback = companies => {
            if (companies && companies.length > 0) {
                console.log('fetched ' + companies.length + '. Continue');
                result = result.concat(companies);
                page = page + 1;
                _fetchCompanies(page, pageSize).then(callback);
            }
            else {
                resolve(result);
            }
        };

        _fetchCompanies(page, pageSize)
            .then(callback);        
    })
    
}

fetchCompanies().then(companies => {
    console.log('total companies = ', companies.length);
    fs.writeFile('../core/server/data/crawled/companies.json', JSON.stringify(companies), err => {
        if (err) throw err;
    });
})