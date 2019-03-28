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
        addDomain: function(name) {
            util.quit(name);
            localStorage.setItem(name, JSON.stringify({}));
        },
        addRecord: function(domain, record) {
            util.quit(domain, record);
            var data = asb.getData(domain);
            data[record] = {};
            asb.saveData(domain, data);
        },
        addProperty: function(domain, record, property) {
            util.quit(domain, record, property);
            var data = asb.getData(domain);
            data[record][property] = {};
            asb.saveData(domain, data);
        },
        getDomain: function(name) {
            util.quit(name);
            return localStorage.getItem(name);
        },
        getData: function(domain) {
            util.quit(domain);
            return JSON.parse(asb.getDomain(domain));
        },
        saveData: function(domain, data) {
            util.quit(domain, data);
            asb.updateDomain(domain, data);
        },
        updateDomain: function(domain, data) {
            util.quit(domain, data);
            localStorage.setItem(domain, JSON.stringify(data));
        },
        updateRecord: function(domain, record, property) {
            util.quit(domain, record);
            property = util.norm(property);
            property = util.prepare(property);
            var data = asb.getData(domain);
            data[record] = property;
            asb.saveData(domain, data);
        },
        updateProperty: function(domain, record, property, value) {
            util.quit(domain, record, property);
            value = util.norm(value);
            value = util.prepare(value);
            var data = asb.getData(domain);
            data[record][property] = value;
            asb.saveData(domain, data);
        },
    };
    return asb;
}));