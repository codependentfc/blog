var shot = require("shot");
var server = require("../handler");
var assert = require("assert");
var model = require('../model');
var request;

describe("Main page (reading view)", function () {

    request = {
        method: "GET",
        url: "/"
    };
    it("should respond with an OK status code", function (done) {

        shot.inject(server, request, function (res) {
            assert.equal(res.statusCode, 200);
            done();
        });
    });
    
    it("should show a list of blog entry titles", function (done) {

        shot.inject(server, request, function (res) {
            console.log(res.payload);
            assert.notEqual(res.payload.search(/entries/), -1);
            done();
        });
    });
    
    //TODO currently depends on db size being >= 5. also, not most recent
    it("should show excerpts of the 5 most recent blog posts", function (done) {

        shot.inject(server, request, function (res) {
            assert.equal(res.payload.match(/panel-heading/).length, 5);
            done();
        });
    });     
});

describe('Edit Page', function(){
    
     it("should respond with an OK status code", function (done) {

        request = {
            method: "GET",
            url: "/edit"
        };

        shot.inject(server, request, function (res) {
            assert.equal(res.statusCode, 200);
            done();
        });

    }); 
    
    it("should show a text editor for writing your blog post", function (done) {

        request = {
            method: "GET",
            url: "/edit"
        };

        shot.inject(server, request, function (res) {
            // test looking for at least one'input' field
            assert.notEqual(res.payload.search(/<input/), -1);
            done();
        });

    }); 
    
    it("should select a post from list in edit page for editing", function (done) {

        request = {
            method: "GET",
            url: "/edit/<blog_post_id_number>"
        };

        shot.inject(server, request, function (res) {
            assert.equal(res.payload, "");
            done();
        });

    });
    
    it("should add new blog post", function (done) {

        request = {
            method: "POST",
            url: "/edit",
            header: {'Content-Type' : 'application/x-www-form-urlencoded'},
            payload: "author=test&title=test&text=test&Submit=Submit"
        };

        shot.inject(server, request, function (res) {
            assert.notEqual(res.payload.search('New post added'), -1);
            // Clean up db
            model.delTestPosts();
            done();
        });


    });
    
    it("should delete selected blog post", function (done) {
        request = {
            method: "DELETE",
            url: "/edit/<blog_post_id_number>"
        };

        shot.inject(server, request, function (res) {
            assert.equal(res.payload, "");
            done();
        });

    });
    
 
    it("should update selected blog post", function (done) {

        request = {
            method: "PUT",
            url: "/edit/<blog_post_id_number>"
        };

        shot.inject(server, request, function (res) {
            assert.equal(res.payload, "");
            done();
        });

    });

});

describe('Individual Post Page', function(){
    
    it("should retrieve a and display single blog post", function (done) {

        request = {
            method: "GET",
            url: "/blog/<blog_post_id_number>"
        };

        shot.inject(server, request, function (res) {
            assert.equal(res.payload, "");
            done();
        });

    });
    
});


