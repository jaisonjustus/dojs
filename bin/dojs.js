var program = require('commander'),
  fs = require('fs'),
  path = require('path'),
  jade = require('jade'),
  Dojs = {},
  appStructure = {};

appStructure = {

  backbone : {
    parent : 'app',
    subfolers : {
      scripts : ['views', 'models', 'collections']
    }
  }

};

Dojs = {
  path : '',

  appType : 'backbone',

  initialize : function() {
    this.appType = 'backbone';
    this.path = process.cwd();
  },

  checkAppStructure : function()  {
    var appStruct = appStructure[this.appType.toLowerCase()],
      status = true;

    if(fs.existsSync(path.join(this.path, appStruct.parent))) {
      if(fs.existsSync(path.join(this.path, appStruct.parent, 'scripts')))  {
        for(var folder in appStruct.parent.scripts) {
          if(!fs.existsSync(path.join(this.path, appStruct.parent, 'scripts', folder))) {
            status = false;
            break;
          }
        }
      }else { status = false; }
    }else { status = false; }

    return status;
  },

  createDirectory : function(appType)  {
    var folders = [],
      docPath = path.join(this.path,'doc');

    fs.mkdirSync(docPath);
    folders = appStructure[this.appType].subfolers.scripts;

    for(var folder in folders)  {
      fs.mkdirSync(path.join(docPath, folders[folder]));
    } 
  },

  /**
   * Method to seek the model folder and extract the comment blocks from 
   * the javascript file.
   * @method _processModels
   * @access private
   */
  _processModels : function()  {
    var appStruct = appStructure[this.appType.toLowerCase()],
      filePath = path.join(this.path, appStruct.parent, 'scripts', 'models'),
      tempFileList = fs.readdirSync(filePath),
      fileList = {};  

    for (var i = 0; i < tempFileList.length; i++) {
      if(!tempFileList[i].match('~')) {

        var file = fs.readFileSync(path.join(filePath, tempFileList[i]))
          .toString()
          .replace(/\n|\t/g, '');

        blocks = file.match(/\/\*{2}(\s|\*|\w|[a-zA-Z0-9|\.|@])+\//g);    

        if(blocks != null && blocks.length > 0) {
          var commentObject = [];

          for(var j = 0; j< blocks.length; j++)  {
            commentObject.push(this._prepareCommentBlock(blocks[j]));
          }

          jadeFile = fs.readFileSync( path.join(this.path,'doc.jade'), 'utf8' )
          jadeFile = jade.compile(jadeFile)({ comments : commentObject });

          fs.writeFileSync( path.join(this.path, 'doc/models', tempFileList[i].replace('.js','') + '.html'), jadeFile );
        }
      }
    }
  },

  /**
   * Method to prepare the comment object from the comment block extracted
   * from the javascript files.
   * @method _prepareComemntBlock
   * @access private
   */ 
  _prepareCommentBlock : function(commentString)  {
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

  run : function()  {
    if(this.checkAppStructure())  {
      this.createDirectory();
      this._processModels();
    }else {
      console.log('no folder structure!!!');
    }
  }
};

program
  .version('0.0.1')
  .option('-g, --generate [value]', 'Generate JS Documentation')
  .parse(process.argv);

if(program.generate)  {
  Dojs.initialize(program.generate);
  Dojs.run();
};