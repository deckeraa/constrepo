// Apache 2.0 J Chris Anderson 2011
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
    $.couchProfile.templates.profileReady = $("#new-message").html();
    $("#account").couchLogin({
        loggedIn : function(r) {
            $("#profile").couchProfile(r, {
                profileReady : function(profile) {
                    $("#create-message").submit(function(e){
                        e.preventDefault();
                        var form = this, doc = $(form).serializeObject();
                        doc.created_at = new Date();
                        doc.profile = profile;
                        db.saveDoc(doc, {success : function() {form.reset();}});
                        return false;
                    }).find("input").focus();
                }
            });
        },
        loggedOut : function() {
            $("#profile").html('<p>Please log in to see your profile.</p>');
        }
    });
 });
