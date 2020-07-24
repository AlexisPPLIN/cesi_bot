const appRoot = require('app-root-path');
const env = require(appRoot+'/config.json');
const fs = require("fs");

module.exports = class Language {
    constructor() {
        this.default = "en";
        this.langArray = this.getLangArray(env.lang)
    }

    generateFileName(lang){
        return 'lang.'+lang+'.js';
    }

    getLangArray(lang){
        let file_name = appRoot+'/lang/'+this.generateFileName(lang);
        if(fs.existsSync(file_name)) return require(file_name)
        else require(appRoot+'/lang/'+this.generateFileName(this.default));
    }

    get(key){
        let value = this.langArray[key];
        if(value === undefined) return "Translation Error"
        else return value;
    }
}