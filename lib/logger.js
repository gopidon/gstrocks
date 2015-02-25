if(Meteor.isServer){
    logger = Meteor.npmRequire('winston');
    logger.remove(logger.transports.Console);
    logger.add(logger.transports.DailyRotateFile, { filename: process.env.UPLOAD_DIR+'/logs/logFile.log', datePattern: '.yyyy-MM-dd' });
}
