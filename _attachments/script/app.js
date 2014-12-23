// Modified from default app.js generated by couchapp,
// which is credit to 
//      Apache 2.0 J Chris Anderson 2011
// - Decker
$(function() {   
    // friendly helper http://tinyurl.com/6aow6yn
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var path = unescape(document.location.pathname).split('/'),
        design = path[3],
        db = $.couch.db(path[1]);
    var wordlist = {};

    function drawItems() {
        db.view(design + "/recent-items", {
            descending : "true",
            limit : 50,
            update_seq : true,
            success : function(data) {
                setupChanges(data.update_seq);
                var them = $.mustache($("#recent-messages").html(), {
                    items : data.rows.map(function(r) {return r.value;})
                });
                $("#content").html(them);
            }
        });
    };

    function handleWordList() {
        db.openDoc("software_wordlist", {
            success : function(data) {
                setupChanges(data.update_seq);

                wordlist = data;

                var rand_elem = function( arr ) {
                    var index = Math.floor( Math.random()*arr.length % arr.length );
                    return arr[index];
                }
                // changes a word to uppercase
                var up = function( str ) {
                    if( str ) {
                        return str[0].toUpperCase() + str.substr(1);
                    }
                }

                // pick a name
                var adj = up( rand_elem(data.adjectives) );
                var subj = up( rand_elem(data["subjects"]) );

                var template_data = {
                    "name": adj + " " + subj + "&#0153;",
                    "tasks": []
                };

                // generate the features
                for( var i = 0; i < 3; i++ ) {
                    var verb = up( rand_elem( data.verbs ) );
                    var dir_obj = rand_elem( data["direct-objects"] );
                    var ind_obj = rand_elem( data["indirect-objects"] );
                    template_data.tasks.push({"task": verb + " " + dir_obj + " using " + ind_obj + "."});
                }

                $("#word_list").html(
                    $.mustache($("#name-and-task").html(), template_data)
                );
            }
        });
    };
    drawItems();
    handleWordList();
    var changesRunning = false;
    function setupChanges(since) {
        if (!changesRunning) {
            var changeHandler = db.changes(since);
            changesRunning = true;
            changeHandler.onChange(drawItems);
        }
    }
    $.couchProfile.templates.profileReady = $("#view-wordlist").html();
    $("#account").couchLogin({
        loggedIn : function(r) {
            console.log("logged in ", r);
            $("#profile").couchProfile(r, {
                profileReady : function(profile) {

                    var obj_to_table = function ( obj ) {
                        var html = "";
                        html += "<table id='table_id' class='display'>";
                        html += "<thead><th>Category</th><th>Words</th></thead>";
                        html += "<tbody>"
                        var keys = Object.keys(obj)
                        for(var i in keys ){
                            var key = keys[i];
                            if( key != '_id' && key != '_rev' ) {
                                html+="<tr><th>" + key + "</th></tr>";
                                for( var j in obj[key] ) {
                                    html+="<tr><th></th><td>" + obj[key][j] + "</td></tr>";
                                }
                            }
                        }
                        html+="</tbody>";
                        html+="</table>";
                        return html;
                    }

                    var html = obj_to_table( wordlist );
/* mustache template system
                    var table_html = $.mustache($("#wordlist-table").html(), wordlist)*/
                    $("#wordlist-customization-area").html( html );
                    $("#wordlist-customization-area>table").editableTableWidget();
                    $("#wordlist-customization-area>table td").on('change', function (evt, newValue) {
                        console.log("changed");
                        db.saveDoc( 
                            {"_id": r.userCtx.name +"_wordlist", "text": "foo"}, 
                            {success: function(data) { console.log("saved: ",data); }}
                    );
                    });
        },
        loggedOut : function() {
            console.log("logged out");
            $("#profile").html('<p>Please log in to see your profile.</p>');
        }
            });
            }});
});
            
