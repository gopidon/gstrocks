Package.describe({
  name: 'gopidon:meteor-file',
  summary: ' /* Fill me in! */ ',
  version: '1.0.0',
  git: ' /* Fill me in! */ '
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['ejson','underscore'],['client','server']);
  api.addFiles(['gopidon:meteor-file.js'],['client','server']);
  if (api.export) {
    api.export('MeteorFile');
  }
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('gopidon:meteor-file');
  api.addFiles('gopidon:meteor-file-tests.js');
});
