if(Meteor.isServer){
    logger = Meteor.npmRequire('winston');
    logger.remove(logger.transports.Console);
    logger.add(logger.transports.DailyRotateFile, { filename: process.env.UPLOAD_DIR+'/logs/logFile.log', level: 'error', datePattern: '.yyyy-MM-dd' });
    // level is weird. Setting level at error doesn't show info messages!
}
