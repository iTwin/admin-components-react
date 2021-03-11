var mv = require("mv");

// After build, rename index.html to signin-oidc.html,
// This is not supported out of the box by CRA, and we need
// to have a specific name for the redirect url because
// of the way the file are served by storybook
// (signin - oidc / would not serve index.html)
mv("./build/index.html", "./build/signin-oidc.html", function(err) {});
