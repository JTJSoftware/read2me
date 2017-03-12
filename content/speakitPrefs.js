//Prefs settings for speakit
//Linspire - Jim Massey - MDG


function speakitPrefsStartup() {
//alert("Prefs Startup");
//speakitVoiceList();
//readVoiceList();
//setupScm();
  var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);

  try {
     document.getElementById("speakitBlocking").value = userPrefs.getBoolPref("speakit.Blocking");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitBlocking").value = userPrefs.getBoolPref("speakit.Blocking");
  }
  try {
    document.getElementById("speakitSelection").checked = userPrefs.getBoolPref("speakit.sayWhat");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitSelection").checked = userPrefs.getBoolPref("speakit.sayWhat");
  }
   try {
     document.getElementById("speakitShowBtn").checked = userPrefs.getBoolPref("speakit.showbtn");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitShowBtn").checked = userPrefs.getBoolPref("speakit.showbtn");
  }
  try {
     document.getElementById("speakitApp").value = userPrefs.getCharPref("speakit.appStartup");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitApp").value = userPrefs.getCharPref("speakit.appStartup");
  }
  try {
      document.getElementById("speakitAppArgs").value = userPrefs.getCharPref("speakit.appStartup.args");
  } catch (e) {
      missingPrefs();
      document.getElementById("speakitAppArgs").value = userPrefs.getCharPref("speakit.appStartup.args");
  }
  try {
     document.getElementById("speakitAppKillArgs").value = userPrefs.getCharPref("speakit.appKillall");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitAppKillArgs").value = userPrefs.getCharPref("speakit.appKillall");
  }

   try {
     document.getElementById("speakitSoundFixup").checked = userPrefs.getBoolPref("speakit.soundfixup");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitSoundFixup").checked = userPrefs.getBoolPref("speakit.soundfixup");
  }

  try {
     document.getElementById("speakitStoragePath").value = userPrefs.getCharPref("speakit.storagePath");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitStoaragePath").value = userPrefs.getCharPref("speakit.storagePath");
  }

  try {
     document.getElementById("speakitVoicelist").value = userPrefs.getCharPref("speakit.voicelist");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitVoicelist").value = userPrefs.getCharPref("speakit.voicelist");
  }

  try {
     document.getElementById("speakitVoicescript").value = userPrefs.getCharPref("speakit.voicescript");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitVoicescript").value = userPrefs.getCharPref("speakit.voicescript");
  }

  try {
     document.getElementById("speakitFilePath").value = userPrefs.getCharPref("speakit.filePath");
  } catch (e) {
     missingPrefs();
     document.getElementById("speakitFilePath").value = userPrefs.getCharPref("speakit.filePath");
  }

speakitVoiceList();
readVoiceList();
}

function savePrefsAndExit() {
 saveSpeakitPrefs();
 window.close();

}

function saveSpeakitPrefs() {
/*
 if (document.getElementById("speakitPrefsReset").checked = "true") {
      resetPrefs();
      return;
 }
*/

 var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);
 var temp;

 if( document.getElementById("speakitBlocking").value == "true") {
  userPrefs.setBoolPref("speakit.Blocking", true);
 } else {
     userPrefs.setBoolPref("speakit.Blocking", false);
 }

 try {
  temp = document.getElementById("speakitVoices").value;
  userPrefs.setCharPref("speakit.setupVoice", temp);
  //alert("Setting speakitVoice: " + temp);
 } catch (e) {
    alert("set Voice failed because: " + e);
 }

  temp = document.getElementById("speakitApp").value;
  userPrefs.setCharPref("speakit.appStartup", temp);

  temp = document.getElementById("speakitAppArgs").value;
  userPrefs.setCharPref("speakit.appStartup.args", temp);

  temp = document.getElementById("speakitAppKillArgs").value;
  userPrefs.setCharPref("speakit.appKillall", temp);

  temp = document.getElementById("speakitSelection").checked;
  userPrefs.setBoolPref("speakit.sayWhat", temp);

  temp = document.getElementById("speakitSoundFixup").checked;
  userPrefs.setBoolPref("speakit.soundfixup", temp);

  temp = document.getElementById("speakitStoragePath").value;
  userPrefs.setCharPref("speakit.storagePath", temp);

  temp = document.getElementById("speakitVoicelist").value;
  userPrefs.setCharPref("speakit.voicelist", temp);

  temp = document.getElementById("speakitFilePath").value;
  userPrefs.setCharPref("speakit.filePath", temp);

  temp = document.getElementById("speakitVoicescript").value;
  userPrefs.setCharPref("speakit.voicescript", temp);

  //window.close();
}

function resetPrefs() {
//defaults for lispire5.0(debian)
//alert("Reset Prefs");
 var hardDefaults = document.getElementById("speakitDefaults");
 var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);
   
  userPrefs.setBoolPref("speakit.Blocking", false);
  document.getElementById("speakitBlocking").value = "false";

  // hack to make this work with LIS-1.6 and firefox
  //the speakitShowBtn is only in the LIS prefs 
  try {
   userPrefs.setBoolPref("speakit.showbtn", true);
   document.getElementById("speakitShowBtn").checked = true;
   speakitButtonShow();
   //parent.window.opener.document.getElementById("speakit-menu").hidden ="false";
  } catch (e) {
      //alert("Setting speakit.showbtn failed because: " + e);
  }
  userPrefs.setCharPref("speakit.appStartup", "/usr/bin/audiowrapper");
  document.getElementById("speakitApp").value = userPrefs.getCharPref("speakit.appStartup");
  
  userPrefs.setCharPref("speakit.appStartup.args", "--oss-native /usr/bin/festival -b /var/tmp/read2me.scm");
  document.getElementById("speakitAppArgs").value = userPrefs.getCharPref("speakit.appStartup.args");
  
  userPrefs.setCharPref("speakit.appKillall", "/usr/bin/festival");
  document.getElementById("speakitAppKillArgs").value = userPrefs.getCharPref("speakit.appKillall");

  userPrefs.setBoolPref("speakit.sayWhat", false);
  document.getElementById("speakitSelection").checked = userPrefs.getBoolPref("speakit.sayWhat");

  userPrefs.setBoolPref("speakit.soundfixup", false);
  document.getElementById("speakitSoundFixup").checked = userPrefs.getBoolPref("speakit.soundfixup");
  
}


function speakitButtonShow() {
 try {
   var btnVisible = document.getElementById("speakitShowBtn").checked;
   var btnState = parent.window.opener.document.getElementById("speakit-menu");
   //if (!btnState.hidden) {
   if (btnVisible == true){
      //btnState.hidden="true";
      btnState.removeAttribute("hidden");
      //alert("Setting ShowBtn hidden=true");
   } else {
      btnState.hidden="true";
      //btnState.removeAttribute("hidden");
      //alert("Setting ShowBtn visible");
   }
 } catch (e) {     
         //alert("Setting ShowBtn failed because: " + e);
     
 }

}

function missingPrefs() {
//check and setup all prefs to default that are not set

//hidden prefs that are not set by default:
//userPrefs.getCharPref("speakit.setupVoice");
//userPrefs.getCharPref("speakit.setupVoice");

 try {
       var speakitStrings = document.getElementById("speakitStrings");
       //var speakitStrings = document.getElementById("speakitStrings").getString("startupProgram");
       //alert("setupScm got string bundle: " + temp); 
 } catch (e) {
       alert("setupScm Getting string failed because: " + e);
 }

  var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);

  var tmp;

  try {
     tmp = userPrefs.getBoolPref("speakit.Blocking");
  } catch (e) {
     userPrefs.setBoolPref("speakit.Blocking", false);
  }

  try {
    tmp = userPrefs.getBoolPref("speakit.sayWhat");
  } catch (e) {
     userPrefs.setBoolPref("speakit.sayWhat", false);
  }

  try {
     tmp = userPrefs.getBoolPref("speakit.showbtn");
  } catch (e) {
     userPrefs.setBoolPref("speakit.showbtn", true);
  }

  try {
     tmp = userPrefs.getCharPref("speakit.appStartup");
  } catch (e) {
     userPrefs.setCharPref("speakit.appStartup", "/usr/bin/audiowrapper");
  }

  try {
     tmp = userPrefs.getCharPref("speakit.appStartup.args");
  } catch (e) {
      userPrefs.setCharPref("speakit.appStartup.args", "--oss-native /usr/bin/festival -b /var/tmp/read2me.scm");
  }

  try {
     tmp = userPrefs.getCharPref("speakit.appKillall");
  } catch (e) {
     userPrefs.setCharPref("speakit.appKillall", "/usr/bin/festival");
  }

  try {
     tmp = userPrefs.getCharPref("speakit.filePath");
  } catch(e) {
     userPrefs.setCharPref("speakit.filePath", "/var/tmp/speakit.txt");
  }

  try {
     tmp = userPrefs.getCharPref("speakit.voicelist");
  } catch (e) {
     userPrefs.setCharPref("speakit.voicelist", "/var/tmp/voices-list.txt");
  }

  try {
     tmp = userPrefs.getCharPref("speakit.festivalpath");
  } catch (e) {
     userPrefs.setCharPref("speakit.festivalpath", "/usr/bin/festival");
  }

  try {
     tmp = userPrefs.getCharPref("speakit.voicescript");
  } catch (e) {
     userPrefs.setCharPref("speakit.voicescript", "/var/tmp/voice-list.scm");     
  }

  try {
     tmp = userPrefs.getBoolPref("speakit.soundfixup");
  } catch (e) {
     userPrefs.setBoolPref("speakit.soundfixup", false);
  }
 
  try {
     tmp = userPrefs.getCharPref("speakit.storagePath");
  } catch (e) {
     userPrefs.setCharPref("speakit.storagePath", "/var/tmp/");
  }

  try {
    tmp = userPrefs.getCharPref("speakit.setupScm");
  } catch (e) {
     userPrefs.setCharPref("speakit.setupScm", speakitStrings.getString("setupScript"));
  }

}

// *** default prefs for macOSX ***
function macOSPrefs() 
{
 var speakitStrings = document.getElementById("speakitStrings");
 var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);
 try{
     userPrefs.setCharPref("speakit.setupScm", speakitStrings.getString("setupScript"));
     userPrefs.setCharPref("speakit.storagePath", "/Users/");
     userPrefs.setBoolPref("speakit.soundfixup", false);
     userPrefs.setCharPref("speakit.voicescript", "/Users/voice-list.scm"); 
     userPrefs.setCharPref("speakit.festivalpath", "/usr/bin/say");
     userPrefs.setCharPref("speakit.voicelist", "/Users/voices-list.txt");
     userPrefs.setCharPref("speakit.filePath", "/Users/speakit.txt");
     userPrefs.setCharPref("speakit.appKillall", "say");
     userPrefs.setCharPref("speakit.appStartup.args", "-f");
     userPrefs.setCharPref("speakit.appStartup", "/usr/bin/say");
     userPrefs.setBoolPref("speakit.showbtn", true);
     userPrefs.setBoolPref("speakit.Blocking", false);
     determineFilepath();
     speakitPrefsStartup();
 } catch (e) {
      alert("macOSPrefs path is incorrect: " + e);
 }

}

function fedoraPrefs() 
{
 var speakitStrings = document.getElementById("speakitStrings");
 var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);
 try{
     userPrefs.setCharPref("speakit.setupScm", speakitStrings.getString("setupScript"));
     userPrefs.setCharPref("speakit.storagePath", "/var/tmp/");
     userPrefs.setBoolPref("speakit.soundfixup", false);
     userPrefs.setCharPref("speakit.voicescript", "/var/tmp/voice-list.scm"); 
     userPrefs.setCharPref("speakit.festivalpath", "/usr/bin/festival");
     userPrefs.setCharPref("speakit.voicelist", "/var/tmp/voices-list.txt");
     userPrefs.setCharPref("speakit.filePath", "/var/tmp/speakit.txt");
     userPrefs.setCharPref("speakit.appKillall", "festival");
     userPrefs.setCharPref("speakit.appStartup", "/usr/bin/festival");
     userPrefs.setBoolPref("speakit.showbtn", true);
     userPrefs.setBoolPref("speakit.Blocking", false);
     userPrefs.setCharPref("speakit.appStartup.args", "-b /var/tmp/read2me.scm");
     userPrefs.setCharPref("speakit.setupScm", "/var/tmp/read2me.scm");
     determineFilepath();
     speakitPrefsStartup();
 } catch (e) {
      alert("fedoraPrefs setup failed because: " + e);
 }

}

function linspirePrefs() 
{
alert("Linspire defaults");
 var speakitStrings = document.getElementById("speakitStrings");
 var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);
 try{
     userPrefs.setCharPref("speakit.setupScm", speakitStrings.getString("setupScript"));
     userPrefs.setCharPref("speakit.storagePath", "/var/tmp/");
     userPrefs.setBoolPref("speakit.soundfixup", false);
     userPrefs.setCharPref("speakit.voicescript", "/var/tmp/voice-list.scm"); 
     userPrefs.setCharPref("speakit.festivalpath", "/usr/bin/festival");
     userPrefs.setCharPref("speakit.voicelist", "/var/tmp/voices-list.txt");
     userPrefs.setCharPref("speakit.filePath", "/var/tmp/speakit.txt");
     userPrefs.setCharPref("speakit.appKillall", "/usr/bin/festival");
     userPrefs.setCharPref("speakit.appStartup", "/usr/bin/audiowrapper");
     userPrefs.setBoolPref("speakit.showbtn", true);
     userPrefs.setBoolPref("speakit.Blocking", false);
     userPrefs.setCharPref("speakit.appStartup.args", "--oss-native /usr/bin/festival -b /var/tmp/read2me.scm");
     userPrefs.setCharPref("speakit.setupScm", "/var/tmp/read2me.scm");
     determineFilepath();
     speakitPrefsStartup();
 } catch (e) {
      alert("Linspire Prefs setup failed because: " + e);
 }

}

function useFlite()
{
 var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);

     userPrefs.setCharPref("speakit.appStartup", "Flite");
     userPrefs.setCharPref("speakit.voicelist", "chrome://read2me/content/voices-list.txt");
     speakitPrefsStartup();

}


function kioskUseFlite()
{
var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
consoleService.logStringMessage("inside kioskUseFlite function");

try {
 var userPrefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefBranch);

     userPrefs.setCharPref("speakit.appStartup", "Flite");
     userPrefs.setCharPref("speakit.voicelist", "chrome://read2me/content/voices-list.txt");
     userPrefs.setCharPref("speakit.setupVoice", "slt");
     //speakitPrefsStartup();
     consoleService.logStringMessage("*** Loading kiosk speakit prefs\n");
 } catch (e) {
	consoleService.logStringMessage("kioskUseFlite setup failed because: " + e);
 }
     speakitPrefsStartup();

}


function showExpertExtras()
{
  document.getElementById("expertExtras").setAttribute("hidden", "false");
}
