
/*
* FS CRUD operations to file
*/

// Dependencies
const path = require('path');
const fs = require('fs');
const Utils = require('./../../utils');

const FsHelper = {
    baseDir : path.join(__dirname, '/../../../.data'),
    create : (dir, file, data, callback) => {
        fs.open(`${FsHelper.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
            if(!err && fileDescriptor){
                // Convert data to string
                let stringData = JSON.stringify(data);
                // Write to file and close it
                fs.writeFile(fileDescriptor, stringData, (err) => {
                    if(!err){
                        fs.close(fileDescriptor, (err) => {
                            if(!err){
                                callback(false); // false error is actually no error...a good thing
                            } else {
                                callback('Error while closing file');
                            }
                        });
                    } else {
                        callback('Error writing to new file');
                    }
                });
            } else {
                callback('Could not create new file, it may already exist');
            }
        });
     },
     read : (dir, file, callback) => {
         //console.log("PATH", `${FsHelper.baseDir}/${dir}/${file}.json`);
        fs.readFile(`${FsHelper.baseDir}/${dir}/${file}.json`, 'utf-8', (err, data) => {
            if(!err && data){
                callback(false, Utils.JSONHelper.convertToObject(data));
            } else {
                callback(err, data);
            }
        })
    },
    update : (dir, file, data, callback) => {
        // Open the file for writing
        fs.open(`${FsHelper.baseDir}/${dir}/${file}.json`, 'r+',(err, fileDescriptor) => {
            if(!err && fileDescriptor){
                // Convert data to string
                let stringData = JSON.stringify(data);
                // Truncate the file
                fs.truncate(fileDescriptor, (err) => {
                    if(!err){
                        // Write to fike and close it
                        fs.writeFile(fileDescriptor, stringData, (err) => {
                            if(!err){
                                fs.close(fileDescriptor, (err) => {
                                    if(!err){
                                        callback(false);
                                    } else {
                                        callback('Error while closing file');
                                    }
                                })
                            } else {
                                callback('Error writing to existing file')
                            }
                        })
                    } else {
                        callback('Error truncating file')
                    }
                })

            } else {
                callback('Could not open the file for updating, it may not exist yet');
            }
        })
    },
    delete : (dir, file, callback) => {
        // Unlink/remove the file
        fs.unlink(`${FsHelper.baseDir}/${dir}/${file}.json`, (err) => {
            if(!err){
                callback(false);
            } else {
                callback('Error deleting file')
            }
        });
    },
    // List all the files within the specified dir minus the file extension
    list : (dir, callback) => {
        fs.readdir(`${FsHelper.baseDir}/${dir}`, (err, data) => {
            if(!err && data && data.length > 0){
                callback(false, Utils.ArrayHelper.spliceStringFromElements(data, '.json'));
            } else {
                callback(err, data)
            }
        });
    }
}

module.exports = FsHelper;