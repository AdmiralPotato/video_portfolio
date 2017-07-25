const fs = require('fs');
const target = './dist/404.html';
if(fs.existsSync(target)){
	fs.unlinkSync(target)
}
fs.renameSync('./dist/404/index.html', target);
fs.rmdirSync('./dist/404/');
