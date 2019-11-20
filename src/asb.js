/*
    Data stores in the JSON format:
    localStorage.setItem(domain, data);
    data = {
        { "record01":
             { "property01": "value" },
             { "property02": "value" }.
             ...
        },
        { "record02":
             { "property01": "value" },
             { "property02": "value" },
             ...
        },
        ...
    };
    @domain - name of data table
    @record - unique name of record in the domain
    @property - unique name of property in each record
    @value - any value of property
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser globals
        root.asb = factory();
    }
}(this, function () {
    'use strict';
    if (typeof(Storage) === "undefined") {
        alert('Sorry! No Web Storage support...');
        return;
    }
    var util = {
        norm: function(value) {
            if (!value) return "";
            else return value;
        },
        quit: function(value) {
            if (!value) return;
            if (typeof value === 'object')
                for (var i = 0; i < value.length; i++)
                    if (value[i] === null || value[i] === undefined)
                        return;
        },
        prepare: function(value) {
            var nObj = {};
            if (typeof value === 'object')
                return JSON.stringify(value);
            else if (value !== '') {
                nObj[value] = "";
                return JSON.stringify(nObj);
            } else {
                return JSON.stringify(nObj);
            }
        },
    };
    var asb = {
        /*
            Clears whole local storage
         */
        clearStorage: function() {
            localStorage.clear();
        },
        /*
            Removes domain from local storage with key @name
         */
        delDomain: function (name) {
            util.quit(name);
            localStorage.removeItem(name);
        },
        /*
            Creates empty object in the local storage with key @name
         */
        addDomain: function(name) {
            util.quit(name);
            localStorage.setItem(name, JSON.stringify({}));
        },
        /*
            Creates new record in the @domain
         */
        addRecord: function(domain, record) {
            util.quit(domain, record);
            var data = asb.getData(domain);
            data[record] = {};
            asb.saveData(domain, data);
        },
        /*
            Creates new property in the record
         */
        addProperty: function(domain, record, property) {
            util.quit(domain, record, property);
            var data = asb.getData(domain);
            data[record][property] = "";
            asb.saveData(domain, data);
        },
        /*
            Gets domain by @name from the localStorage
         */
        getDomain: function(name) {
            util.quit(name);
            return localStorage.getItem(name);
        },
        /*
            Gets data from local storage as JSON object
         */
        getData: function(domain) {
            util.quit(domain);
            return JSON.parse(asb.getDomain(domain));
        },
        /*
            Saves data to the domain
         */
        // ToDo: maybe updateDomain method will be enough
        saveData: function(domain, data) {
            util.quit(domain, data);
            asb.updateDomain(domain, data);
        },
        /*
            Updates domain in the local storage
         */
        updateDomain: function(domain, data) {
            util.quit(domain, data);
            localStorage.setItem(domain, JSON.stringify(data));
        },
        /*
            Updates record in the domain
         */
        updateRecord: function(domain, record, property) {
            util.quit(domain, record, property);
            var data = asb.getData(domain);
            data[record] = property;
            asb.saveData(domain, data);
        },
        /*
            Updates property in the record
         */
        updateProperty: function(domain, record, property, value) {
            util.quit(domain, record, property, value);
            var data = asb.getData(domain);
            data[record][property] = value;
            asb.saveData(domain, data);
        },
        pushData: function(domain, record, property, value) {
            util.quit(domain, record, property, value);
            if (!localStorage.getItem(domain))
                asb.addDomain(domain);
            var data = asb.getData(domain);
            if (!data.hasOwnProperty(record))
                asb.addRecord(domain, record);
            data = asb.getData(domain);
            if (!data[record].hasOwnProperty(property))
                asb.addProperty(domain, record, property);

            data = asb.getData(domain);
            data[record][property] = value;
            asb.saveData(domain, data);
        },
        createDomain: function(model, recordPrefix) {
            util.quit(model);
            recordPrefix = recordPrefix || "001";
            var domain = Object.keys(model)[0],
                props = model[domain];
            asb.addDomain(domain);
            asb.addRecord(domain, recordPrefix);
            for (var i = 0; i < props.length; i++) {
                asb.addProperty(domain, recordPrefix, props[i]);
            }
        },
        count: function(domain) {
            util.quit(domain);
            var data = asb.getData(domain);
            return Object.keys(data).length;
        },
        findRecord: function(domain, record, type) {
            util.quit(domain, record);
            var data = asb.getData(domain),
                res = null;
            //var count = Object.keys(data).length;
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (prop === record)
                        res = data[prop];
                }
            }
            if (type == 'json')
                res = JSON.stringify(res);
            return res;
        },
        findRecordByProperty: function(domain, property, type) {
            util.quit(domain, property);
            var data = asb.getData(domain),
                result = {};
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var str = Object.keys(data[prop]).toString();
                    if (str.includes(property)) {
                        if (str.includes(",")) {
                            str = str.split(",");
                            for (var i = 0; i < str.length; i++) {
                                if (str[i].toLowerCase() === property.toLowerCase()) {
                                    result[prop] = data[prop];
                                }
                            }
                        } else {
                            if (str.toLowerCase() === property.toLowerCase()) {
                                //alert(Object.keys(data[prop]));
                                result[prop] = data[prop];
                            }
                        }
                    }
                }
            }
            if (type == 'json')
                result = JSON.stringify(result);
            return result;
        },
        delRecord: function(domain, record) {
            util.quit(domain, record);
            var data = asb.getData(domain);
            var res;
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (prop === record) {
                        res = delete data[prop];
                        if (res)
                            asb.saveData(domain, data);
                    }
                }
            }
            return res;
        },
        delRecordByProperty: function(domain, property) {
            util.quit(domain, property);
            var data = asb.getData(domain);
            var res;
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var str = Object.keys(data[prop]).toString();
                    if (str.toLowerCase() === property.toLowerCase()) {
                        res = delete data[prop];
                        if (res)
                            asb.saveData(domain, data);
                    }
                }
            }
            return res;
        },
        findProperty: function(domain, record, property, type) {
            util.quit(domain, record, property);
            var res = null,
                rec = asb.findRecord(domain, record);
            for (var prop in rec)
                if (rec.hasOwnProperty(prop))
                    if (prop === property)
                        res = rec[prop];
            if (type == "json") return JSON.stringify(res);
            else return res;
        },
        /*
            **********************************************
            Manipulations with Property Value as an Object
            **********************************************
        */
        addParameter: function(domain, record, property, param, value) {
            util.quit(domain, record, property, param, value);
            var data = asb.getData(domain);
            if (!data[record].hasOwnProperty(property))
                asb.addProperty(domain, record, property);
            data = asb.getData(domain);

            if (data[record][property] == "") {
                var prm =new Object();
                prm[param] = value;
                data[record][property] = prm;
            } else
                data[record][property][param] = value;

            //alert(JSON.stringify(data));
            asb.saveData(domain, data);
        },


        /*
            Finds in the @data property by @name and returns it's value as
            - default: an object
            - optional: by @type: "json"
         */
        propFind: function(data, name, type) {
            var res = null;
            if (data)
                res = Object.keys(data[name]);
            if (type == "json")
                res = JSON.stringify(res);
            return res;
        },
        /*
            Updates property with @name, by new @value
         */
        propUpdate: function(data, name, value) {
            var res = null;
            if (data)
                data[name] = value;
        },
        /*
            Deletes property by it's @name
         */
        propDelete: function(data, name) {
            var res;
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    if (prop === name) {
                        res = delete data[prop];
                        // if (res)
                        //     asb.saveData(domain, data);
                    }
                }
            }
            return res;
        },
        /*
            Finds a property by @name and compare it's value with @compareto value
         */
        propCompare: function(data, name, compareto) {
            var res = false;
            if (data)
                if (data[name] === compareto)
                    res = true;
            return res;
        }
    };
    return asb;
}));