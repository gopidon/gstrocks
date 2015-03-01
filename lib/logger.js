if(Meteor.isServer){
    logger = Meteor.npmRequire('winston');
    logger.remove(logger.transports.Console);
    logger.add(logger.transports.DailyRotateFile, { filename: process.env.UPLOAD_DIR+'/logs/logFile.log', level: 'error', datePattern: '.yyyy-MM-dd' });
}
