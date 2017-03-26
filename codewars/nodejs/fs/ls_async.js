var fs = require('fs');
var path = require('path');

/**
 *
 * @param dirs 
 * @param callback
 */
function ls_async(dirs, callback) {
    var watch_dir = []; //存储以后的子目录
    var all_files = [];
    //dirs.forEach(function(path) {
    watch_dir.push(dirs[0]);
    //回调返回处理完的子目录和子目录下文件
    ana_dir(dirs[0], watch_dir, function(processed_dir, sub_files) {
        //处理完某个子目录
        console.log('%s 处理完成', processed_dir);
        watch_dir.splice(watch_dir.indexOf(processed_dir), 1);

        all_files = all_files.concat(sub_files);
        if(watch_dir.length === 0) {
            callback(all_files.length);
        }
    })
    //})
}

/**
 * @param callback
 */
function ana_dir(path, watchdir, callback) {
  
  fs.readdir(path, function(err, files) {
    var sub_path_files = [];
    
    ana_files(files, path,
        //有文件的时候调用 
        function(r) {
            if(r.isDir) {
                watchdir.push(r.file);
                //递归
                ana_dir(r.file, watchdir, callback);
            } 
            else {
                console.log('inspect file: %s', r.file);
                sub_path_files.push(r.file);
            }
        }, 
        //最终没有文件调用
        function() {
            callback(path, sub_path_files);
        })
    })
}

/**
 * @param file_path下的文件或目录
 * @param file_path
 * @param callback
 * @param all_done_callback 
 */
function ana_files(files, file_path, callback, all_done_callback) {
    var files_length = files.length;
    if(!files || files_length === 0) {
        all_done_callback();
        return;
    }
    files.forEach(function(v) {
        var full_file_path = path.join(file_path, v);

        fs.stat(full_file_path, function(err, stat) {
            var result = {
                file : full_file_path
            }
            result.isDir = stat.isDirectory();
            result.isFile = !result.isDir;
            callback(result);
            files_length--;
            if(files_length === 0) {
                all_done_callback()
            }
        })
    })
}

/**
 * main 
 */

var dirs = []
dirs.push(process.cwd());

ls_async(dirs, function(length){
    console.log("all done %d files in sum", length);
}) 

