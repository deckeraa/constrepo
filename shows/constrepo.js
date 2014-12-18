function( doc, req ) {
    var ddoc = this;
    var Mustache = require("lib/mustache");

    // users can add their own word list document and point to that
    // otherwise, use the word list given in the design doc
    var word_list = doc;
    if( !doc || doc.type != "word_list" ) {
        word_list = ddoc.software_buzzwords;
    }

    var rand_elem = function( arr ) {
        var index = Math.floor( Math.random()*arr.length % arr.length );
        return arr[index];
    }
    var name = rand_elem( word_list.verbs );
    var data = {"name": name, "verbs": word_list.verbs};

    provides("html", function() {
        return Mustache.to_html(ddoc.templates.constrepo, data);
    });
}
