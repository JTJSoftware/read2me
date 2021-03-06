/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Jim Massey - Kiosk Project code .
 *
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// *** starts or stops a defined process using passed in variables ***
// *** Two arguments are required - block and proc                 ***
// *** - proc is the full path to program to start                 ***
// *** - block is a boolean for process blocking or not and a      ***
// *** false or null value indicates no blocking - any assignment  ***
// *** will make blockingBool evaluate to true.                    ***
// *** Any number of args may be passed that makes sense

var speachStarted = 0;
// Threaded global interfaces
// var background = Components.classes["@mozilla.org/thread-manager;1"].getService(Components.interfaces.nsIThreadManager);
var background = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(1);
//var background = Components.classes["@mozilla.org/thread-manager;1"].getService().currentThread;
 var main = Components.classes["@mozilla.org/thread-manager;1"].getService().mainThread;
var flite = Components.classes["@mozilla.org/Flite;1"].createInstance(Components.interfaces.nsIFlite);

function init_process(block, proc) {
  var blockingBool;
  var procArgs = new Array();
  var progObj = new Object();
  var procToStart;

  var fileConstruct = Components.Constructor("@mozilla.org/file/local;1", "nsILocalFile");
  var filePath = new fileConstruct();

  var processIface = Components.classes["@mozilla.org/process/util;1"].createInstance();
  processIface = processIface.QueryInterface(Components.interfaces.nsIProcess);

  var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);

 if(arguments[0] == "speakit") {
  var tempFile = arguments[1];
  try {
     arguments[0] = userPrefs.getBoolPref("speakit.Blocking");
     //alert("YES speakit.Blocking pref found: " + arguments[0]);
  } catch (e) {
     //alert("No speakit.Blocking pref found: " + e);
     userPrefs.setBoolPref("speakit.Blocking", false);
     arguments[0] = null;
  }

  try {
      // If pref is set to Flite then start thread and return
     arguments[1] = userPrefs.getCharPref("speakit.appStartup");
     if (arguments[1] == "Flite") {
         var speaker = "awb";
         var voiceWanted = userPrefs.getCharPref("speakit.setupVoice");
         //if (voiceWanted == "cmu_us_awb_arctic_hts") speaker = "awb";
         //if (voiceWanted == "cmu_us_slt_arctic_hts") speaker = "slt";
         speaker = voiceWanted;
	 startFlite(tempFile, speaker); // start thread in this context
         //startSpeakBox will start thread in seperate window
         //startSpeakBox(tempFile);
	 dump("flite tempFile was: " + tempFile + "\n");
         return;
     }
     //alert("YES speakit.appStartup pref found: " + arguments[1]);
  } catch (e) {
     alert("No speakit.appStartup pref found: " + e);
     //userPrefs.setCharPref("speakit.appStartup", "/usr/bin/audiowrapper");
     arguments[1] = userPrefs.getCharPref("speakit.appStartup");
  }

  try {
     var tempArgString = userPrefs.getCharPref("speakit.appStartup.args");
     var tempString = tempArgString.split(/\s/);
     var tempCount = arguments.length;
     //alert("Speakit App Args: " + tempString.length + " :: " + tempString[1]);
     
     for(var i = 0; i < tempString.length; i++) {
         arguments[tempCount] = tempString[i];
         //alert("Assinging argument from prefs: " + tempCount + arguments[tempCount]);
         tempCount++;
     }
     arguments[tempCount] = tempFile; 
     //alert("Assinging argument filePath: " + tempCount + arguments[tempCount]);
     arguments.length = tempCount + 1;
  } catch (e) {
      //alert("No speakit.appStartup.args pref found: " + e);
      userPrefs.setCharPref("speakit.appStartup.args", "--oss-native /usr/bin/festival --tts");
     
  }
 }


  // ** Start loop at 2 since we just used the elements 0 and 1
  // ** and assign to procArgs array starting at element 0
  blockingBool = arguments[0];
  procToStart = arguments[1];
  for(var i = 2; i < arguments.length; i++) {
   procArgs[i - 2] = arguments[i];
   //alert("Assigning: " + (i - 2) + " :: " + procArgs[i - 2]);
  }

  filePath.initWithPath(procToStart);
  processIface.init(filePath);
  try { 
     progObj.value = 19;
     processIface.run( blockingBool, procArgs, procArgs.length, progObj);
     //alert("Just sent appStartup string " + procArgs.length);
  } catch (e) {
     alert("FAILURE OF RUN :: " + e + "\n");
  }
}

function kill_process(proc, arg) {

  var blockingBool;
  var procArgs = new Array();
  var progObj = new Object();
  var procToKill = proc;
  procArgs[0] = arg;

  var fileConstruct = Components.Constructor("@mozilla.org/file/local;1", "nsILocalFile");
  var filePath = new fileConstruct();

  var processIface = Components.classes["@mozilla.org/process/util;1"].createInstance();
  processIface = processIface.QueryInterface(Components.interfaces.nsIProcess);

  var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);

  try {
     document.getElementById("pauseSpeech").setAttribute("checked", "false");
  } catch (e) {
      // dump("Un-checking the pauseSpeech menuitem failed/n");
  }

  if (userPrefs.getCharPref("speakit.appStartup") == "Flite") {
      var stop = "stop";
      if (speachStarted == 1) {
	  //speachStarted = 1;
	  flite.unregisterVoice(stop);
	  //background.shutdown();
	  //background = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(1);
	  dump("Background thread shutDown: \n");
      }
    return;
  }

  try {
     procArgs[0] = userPrefs.getCharPref("speakit.appKillall");
  } catch (e) {
     //alert("No speakit.appKillall pref found: " + e);
     userPrefs.setCharPref("speakit.appKillall", "/usr/bin/festival");
     procArgs[0] = userPrefs.getCharPref("speakit.appKillall");
  }


  try {
     filePath.initWithPath(procToKill);
     processIface.init(filePath);
     processIface.run( false, procArgs, procArgs.length, progObj);
  } catch (e) {
     //alert("Failure of KILL : " + e );
  }
}

function pauseSpeechFlite()
{

    // Toggle the speak pause flags and call unPauseSpeech to 
    // pass valuse to flite.
    var isChecked = document.getElementById("pauseSpeech");
    var pause = "pause";
    var speak = "speak";
     
    //alert("FlitePause cheked state is: " + isChecked.getAttribute("speechPaused"));

    if (isChecked.getAttribute("speechPaused") == "pause") {
	 isChecked.setAttribute("checked", "false");
	 isChecked.setAttribute("speechPaused", "speak");
         flite.unPauseSpeech(speak);
         return;
    } else {
          isChecked.setAttribute("checked", "true");
          isChecked.setAttribute("speechPaused", "pause");
          flite.unPauseSpeech(pause);
	  return;
    }

}

function startFlite(speakFile, voice)
{

    //dump("Background thread hasPendingEvents: " + background.hasPendingEvents() +  "\n");
    /*
    dump("Inside startFlite: " + window.opener + "\n");
    for each(var item in document.Node) {
	dump("ParentIten: " + item + "\n");
    }
    */
    //alert("startFlite currentThread: " + background.hasPendingEvents());
    if (speachStarted == 1) {
	dump("** startFlite already speaking ** \n");
        return;
    }

   speachStarted = 1;
   flite.allowSpeech("speak");
   var type = "file";
   //background.dispatch(new workingThread(1, speakFile, voice, type), background.DISPATCH_NORMAL);
   background.dispatch(new workingThread(1, speakFile, voice, type), background.DISPATCH_NORMAL);
   //var speakThis = background.newThread();
   //speakThis.dispatch(new workingThread(1,speakFile, voice, type),Components.interfaces.DISPATCH_NORMAL);
   //background.processNextEvent(1);

    return;
}

function startSayThisFlite(speakFile, voice)
{

    try {
	var parentWin = window.opener.speachStarted;
        speachStarted = parentWin;
        background = window.opener.background;
        dump("Inside startSayThisFlite: " + parentWin + "\n");
    } catch (e) {
        dump("startSayThisFlite NO ParentWindow\n"); 
    }
    for each(var item in window.opener.nodeName) {
	dump("ParentIten: " + item + "\n");
    }

    if (speachStarted == 1) {
	dump("** startFlite already speaking ** \n");
        return;
    }

    //var background = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(1);

   speachStarted = 1;
   flite.allowSpeech("speak");
   var type = "text";
   try{
       var parentWin = window.opener;
   parentWin.background.dispatch(new sayThisThread(1,speakFile, voice, type), background.DISPATCH_NORMAL);
   dump("setup Parent background thread\n"); 
   } catch (e) {
   background.dispatch(new workingThread(1,speakFile, voice, type), background.DISPATCH_NORMAL);
   }
   //background.newThread().dispatch(new workingThread(1,speakFile, voice, type),Components.interfaces.nsIThread.DISPATCH_NORMAL);

    return;
}

var workingThread = function(threadID, speakFile, voice, type) {
  this.threadID = threadID;
  this.speakFile = speakFile;
  this.voice = voice;
  this.type = type;
  this.result = 0;
};

workingThread.prototype = {
  run: function() {
    try {
      // This is where the working thread does its processing work.
	//dump("workingThread enter speakit file: "+ this.speakFile + "\n");
	//flite.sayFile(this.speakFile);
        if (this.type == "text") {
	    //dump("*** SayThis\n");
            flite.sayThisVoice(this.speakFile, this.voice);
	} else {
	    //dump("*** SayFile\n");
	    flite.sayFileVoice(this.speakFile, this.voice);
	}
      // When it's done, call back to the main thread to let it know
      // we're finished.
      main.dispatch(new mainThread(this.threadID, this.result),
        background.DISPATCH_NORMAL);
    } catch(err) {
      Components.utils.reportError(err);
    }
   },

   sayTextVoice: function() {
     	flite.sayThisVoice(this.speakFile, this.voice);
        main.dispatch(new mainThread(this.threadID, this.result),
              background.DISPATCH_NORMAL);
   },
  
  QueryInterface: function(iid) {
    if (iid.equals(Components.interfaces.nsIRunnable) ||
        iid.equals(Components.interfaces.nsISupports)) {
            return this;
    }
    throw Components.results.NS_ERROR_NO_INTERFACE;
    }
};

var sayThisThread = function(threadID, speakFile, voice) {
  this.threadID = threadID;
  this.speakFile = speakFile;
  this.voice = voice;
  this.result = 0;
};

sayThisThread.prototype = {
  run: function() {
    try {
      // This is where the working thread does its processing work.
	//dump("sayThisThread enter speakit string: "+ this.speakFile + "\n");
	//dump("** sayThisThread enter speakit string **\n");
	//flite.sayFile(this.speakFile);
        //var flite = Components.classes["@mozilla.org/Flite;1"].createInstance(Components.interfaces.nsIFlite);
	flite.sayThisVoice(this.speakFile, this.voice);
      
      // When it's done, call back to the main thread to let it know
      // we're finished.
      main.dispatch(new mainThread(this.threadID, this.result),
        background.DISPATCH_NORMAL);
    } catch(err) {
      window.opener.Components.utils.reportError(err);
    }
  },
  
  QueryInterface: function(iid) {
    if (iid.equals(Components.interfaces.nsIRunnable) ||
        iid.equals(Components.interfaces.nsISupports)) {
            return this;
    }
    throw Components.results.NS_ERROR_NO_INTERFACE;
    }
};


var mainThread = function(threadID, result) {
  this.threadID = threadID;
  this.result = result;
};

mainThread.prototype = {
  run: function() {
    try {
      // This is where we react to the completion of the working thread.
      //alert('startProc Thread ' + this.threadID + ' finished with result: ' + this.result);
      dump('\n****startProc Thread ' + this.threadID + ' finished with result: ' + this.result + "\n\n");
      flite.allowSpeech("speak");
      speachStarted = 0;
      dump(speachStarted + " Past setting allowSpeech in mainThread\n\n");
      //background.shutdown(); // boom crash
    } catch(err) {
      Components.utils.reportError(err);
    }
  },
  
  QueryInterface: function(iid) {
    if (iid.equals(Components.interfaces.nsIRunnable) ||
        iid.equals(Components.interfaces.nsISupports)) {
            return this;
    }
    throw Components.results.NS_ERROR_NO_INTERFACE;
  }
};

function startSpeakBox(tempFile)
{
    window.open("chrome://read2me/content/speakBox.xul");
    dump("Opening speakbox window\n");
}