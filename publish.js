const fs = require('fs')
const dest = '../wasserkonig-landing';
const src = './assets/images'
// File destination.txt will be created or overwritten by default.
const copyFile = (filename,dest) => {
    fs.copyFile(  filename, dest, (err) => {
        console.log(filename + ' > ' + dest);
    });
}
const copyDir = (dir) => {
    fs.readdir(dir, (err, files) => {
        files.forEach((file) => {
            fs.stat(dir + '/' + file, (err, stat) => {
                    if(stat.isDirectory()){
                        copyDir(dir + "/" + file);
                    } else {
                        copyFile(dir + "/" + file, dest + dir.replace("\.","") + "/" + file);
                    }
            });

        });
    });
}

copyDir('./css')
copyDir('./js')
copyDir(src)
copyFile('./index.html',dest + "/index.html")
