/**
 * Created by gopi on 1/31/15.
 */
ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.remove({
    service: 'google'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '649520418508806',
    secret: 'd86f18c1db6eddee3ebaaeadd50b8988'
});

ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: '720784993110-23jf7sdp44ochfc6lbjh9i575d0183ov.apps.googleusercontent.com',
    secret: 'fEkA9xcUnl2ZN8EmuiIoe38x'
});