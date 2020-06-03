var engine = new function() {
    let funcs = [];

    this.push = function() {
        if (arguments.length === 1 && arguments[0] && arguments[0].name)
            funcs[arguments[0].name] = arguments[0];
        console.log(arguments);
    };

    this.run = function(name) {
        console.log(name);
        console.log(name in funcs);
        if (name && name in funcs) 
            return funcs[name]();
        // console.log(arguments);
    };
};

export {engine};