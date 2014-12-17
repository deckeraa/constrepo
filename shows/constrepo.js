function( doc, req ) {
    var ddoc = this;
    var Mustache = require("lib/mustache");
    provides("html", function() {
        return Mustache.to_html(ddoc.templates.constrepo, {});
    });
}
