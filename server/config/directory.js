var path = require('path');
var rootPath = path.join(__dirname, '..', '..', '..')

const directory = {
    root: rootPath,
    distDir: rootPath + '/dist',
    assetsDir: rootPath + '/public'
};

export default directory;

