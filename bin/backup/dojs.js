/* Module dependcies. */
var program = require('commander'),
  fs = require('fs'),
  path = require('path'),
  jade = require('jade'),
  ProgressBar = require('progress');

/* Program variables. */
var Dojs = {}, 
  bar = '',
  folderStructure = {}
  appStructure = {};

/* Object to let the grabber to understand the folder structure built using
 yeoman. */ 
appStructure = {
  backbone : {
    parent : 'app',
    subfolers : {
      scripts : ['views', 'models', 'collections']
    }
  }
};

folderStructure = {
  backbone : ['models', 'collections', 'views']
}



/** 
 * Module to manage the dojs documentor functionality. The module help to generate documentation
 * for different javascript framework like backbonejs and angular js. also provide support for 
 * single javascript files. enhaced version to provide support of the markdown. currently the 
 * module support parsing throught the folder struture provide by the yeoman building library.
 * @module Dojs
 */
Dojs = {

  /* Variable to track the path of the project folder. */
  path : '',

  /* Default grabber project type its backbone js. */
  appType : 'backbone',

  /* Progress bar object. */
  progressBar : null,

  /**
   * Method to initialize the dojs library. 
   * @method initialize
   * @access public
   */
  initialize : function() {
    this.appType = 'backbone';
    this.path = process.cwd();
  },

  /**
   * Method to create the documentation folder in the project folder.
   * @method _createDirectory
   * @access private
   */
  _createDirectory : function(appType)  {
    var folders = [],
      docPath = path.join(this.path,'dojs');

    fs.mkdirSync(docPath);
    folders = appStructure[this.appType].subfolers.scripts;

    for(var folder in folders)  {
      fs.mkdirSync(path.join(docPath, folders[folder]));
    } 
  },

  /**
   * Method to seek the model folder and extract the comment blocks from 
   * the javascript file.
   * @method _processFiles
   * @access private
   * @param array fileList
   */
  _processFiles : function(fileList, folderName)  {
    var that = this;

    fileList.forEach(function(filenameWithPath) {
      var file = fs.readFileSync(filenameWithPath)
        .toString()
        .replace(/\n|\t/g, '');

      blocks = file.match(/\/\*{2}(\s|\*|\w|[a-zA-Z0-9|\.|@])+\//g);    

      if(blocks != null && blocks.length > 0) {
        var commentObject = [];

        for(var j = 0; j< blocks.length; j++)  {
          commentObject.push(that._prepareCommentBlock(blocks[j]));
        }

        jadeFile = fs.readFileSync( path.join(that.path,'doc.jade'), 'utf8' );
        jadeFile = jade.compile(jadeFile)({ comments : commentObject });

        fs.writeFileSync( path.join(that.path, 'dojs/' + folderName, path.basename(filenameWithPath).replace('.js','') + '.html'), jadeFile );
      }

      that.progressBar.tick();
    });
  },

  /**
   * Method to prepare the comment object from the comment block extracted
   * from the javascript files.
   * @method _prepareComemntBlock
   * @access private
   */ 
  _prepareCommentBlock : function(commentString)  {
    console.log(commentString);
    var commentBlockObj = {
      module : '',
      comment : '',
      method : '',
      access : '',
      param : [],
      return_ : ''
    };

    commentString = commentString.replace(/\/\*{2}\s\*/, '').replace(/\*\//, '');
    commentString = commentString.split('*');

    for(var i = 0; i < commentString.length; i++) {
      commentString[i] = commentString[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');

      if(commentString[i].match('@module'))  {
        commentBlockObj.module = commentString[i].replace('@module','').replace(/\s+/, '')
      }else if(commentString[i].match('@method')) {
        commentBlockObj.method = commentString[i].replace('@method','').replace(/\s+/, '');
      }else if(commentString[i].match('@access')) {
        commentBlockObj.access = commentString[i].replace('@access','').replace(/\s+/, '');
      }else {
        commentBlockObj.comment += ' ' + commentString[i];
      }
    }

    return commentBlockObj;
  },

  /**
   * Method to categorize the files to corresponding folders.
   * @method _categorizeFileToFolder
   * @access private
   */
  _categorizeFileToFolder : function(fileList)  {
    var categoryList = {
      count : 0
    };

    folderStructure[this.appType].forEach(function(folder)  {
      categoryList[folder] = [];
      fileList.forEach(function(file) {
        if(file.match(folder))  {
          categoryList[folder].push(file);
          categoryList.count += 1;
        }
      })
    });

    return categoryList;
  },

  /**
   * Method to walk through the directory structure.
   * @method _dirWalk
   * @access private
   */
  _dirWalk : function(directory, callback) {
    var fileList = [],
        that = this,
        fileFolderList = [];

    fileFolderList = fs.readdirSync(directory);
    console.log(fileFolderList);

    fileFolderList.forEach(function(fileFolder) {
      fileFolder = path.join(directory, fileFolder);
      if(fs.statSync(fileFolder).isDirectory())  {
        fileList = fileList.concat(that._dirWalk(fileFolder, function()  {}));
      }else {
        fileList.push(fileFolder)
      }
    });

    return fileList;
  },

  /**
   * Method to run the comment grabber.
   * @method run
   * @access public
   */
  run : function()  {
    var that = this,
        categoryList = {},
        fileCount = 0, 
        fileList = [];

    this._createDirectory();

    fileList = this._dirWalk(path.join(this.path, 'app/scripts'));

    if(fileList.length > 0) {

      categoryList = that._categorizeFileToFolder(fileList);
      console.log(categoryList);

      fileCount = categoryList.count;
      delete categoryList.count;

      that.progressBar = new ProgressBar('  Generating Document [:bar] :percent', {
          complete: '='
        , incomplete: ' '
        , width: 50
        , total: fileCount
      });

      fileList = [];

      for(var folder in categoryList) {
        //console.log(categoryList[folder]);
        //that._processFiles(categoryList[folder], folder);
      }
    }

    process.exit();
  }
};

program
  .version('0.0.1')
  .option('-g, --generate [value]', 'Generate JS Documentation')
  .parse(process.argv);

if(program.generate)  {
  console.log('\n DOJS Documentation Generate **')
  Dojs.initialize(program.generate);
  Dojs.run();
};

process.on('exit', function(){
  console.log('\n');
});