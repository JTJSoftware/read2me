/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
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
 * The Original Code is Jim Massey - Kiosk Project code.
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
 
#include <stdio.h>
#include <iostream>
#include <sstream>

using namespace std;

#include <stdlib.h>
#include <cstdlib>
#include <string.h>
#include <unistd.h>

extern "C"
{
#include "flite.h"
#include "cst_string.h"
#include "cst_regex.h"
#include "cst_val.h"
#include "cst_features.h"
#include "cst_item.h"
#include "cst_relation.h"
#include "cst_utterance.h"
#include "cst_wave.h"
#include "cst_track.h"

#include "cst_cart.h"
#include "cst_phoneset.h"
#include "cst_voice.h"
#include "cst_audio.h"

#include "cst_utt_utils.h"
#include "cst_lexicon.h"
#include "cst_synth.h"
#include "cst_units.h"
#include "cst_tokenstream.h"
#include "flite_version.h"
#include "voxdefs.h"
#include "usenglish.h"
#include "cmu_lex.h"
#include "cst_hrg.h"
#include "cst_diphone.h"
#include "stopSpeech.h"

}

#include "nsFlite.h"
#include "nsMemory.h"

#include "nsEmbedString.h"
#include "nsIClassInfoImpl.h"

extern "C"
{
    cst_lexicon cmu_lex;
    cst_lexicon *cmu_lex_init(void);
    cst_voice *REGISTER_VOX(const char *voxdir);
    cst_voice *UNREGISTER_VOX(cst_voice *vox);
    cst_voice *register_cmu_us_slt(const char *voxdir);
    cst_voice *unregister_cmu_us_slt(const char *voxdir);
    cst_voice *register_cmu_us_awb(const char *voxdir);
    cst_voice *unregister_cmu_us_awb(const char *voxdir);
    cst_voice *register_cmu_us_time_awb(const char *voxdir);
    cst_voice *unregister_cmu_us_time_awb(const char *voxdir);
    cst_voice *register_cmu_us_rms(const char *voxdir);
    cst_voice *unregister_cmu_us_rms(const char *voxdir);
    cst_voice *register_cmu_us_kal16(const char *voxdir);
    cst_voice *unregister_cmu_us_kal16(const char *voxdir);
    static void flite_voice_list_print(void);
    cst_val *flite_set_voice_list(void);
    int flite_pause_speech(int currentValue);
    int flite_stop_speech(int currentValue);
}


nsFliteImpl::nsFliteImpl()
{

}

nsFliteImpl::~nsFliteImpl()
{

}

NS_IMETHODIMP
nsFliteImpl::InitFlite()
{
    cst_voice *voice;
    voice = new_voice();
    const char *outtype;
    
    cst_voice *v;
    cst_voice *v1;

    //int fliteInt;
    //fliteInt = flite_init();
    //printf("flite init returned %d \n", fliteInt);
    
    printf("  version: %s-%s-%s %s \n",
	   FLITE_PROJECT_PREFIX,
	   FLITE_PROJECT_VERSION,
	   FLITE_PROJECT_STATE,
       FLITE_PROJECT_DATE);
    
    const char *text;
    text = "Hello from X Pee com eF light";
    
    v = register_cmu_us_slt("");
    v1 = register_cmu_us_awb("");

    cout<<"Text string is: "<<text<<"\n";

    flite_text_to_speech(text,v1,"play");
    flite_text_to_speech(text,v,"play");

    //v = REGISTER_VOX("");
    //v = register_cmu_us_kal("");
    flite_text_to_speech(text,v,"play");

    return NS_OK;
}


NS_IMETHODIMP
nsFliteImpl::SayThis(const char *tts_text)
{
    cst_voice *v;
    //v = REGISTER_VOX("awb");
    v = register_cmu_us_awb("");
    flite_text_to_speech(tts_text,v,"play");

    return NS_OK;

}

NS_IMETHODIMP
nsFliteImpl::SayThisVoice(const char *tts_text, const char *speaker)
{
    // Set flite voice
    cst_voice *v;
    const char *slt = "slt";
    const char *awb = "awb";
    const char *rms = "rms";
    const char *kal = "kal";

    //v = REGISTER_VOX(""); // Compiled in default voice cmu_us_kal
    v = register_cmu_us_kal16("");
    //printf("** The voice choice is: %s\n", speaker);

    if (*speaker == *awb) {
       v = register_cmu_us_awb("");
    }
    if (*speaker == *slt) {
        v = register_cmu_us_slt("");
    }
    if (*speaker == *rms) {
        v = register_cmu_us_rms("");
    }
    if (*speaker == *kal) {
        v = register_cmu_us_kal16("");
    }
    
    flite_text_to_speech(tts_text,v,"play");

    return NS_OK;

}

NS_IMETHODIMP
nsFliteImpl::SayFile(const char *tts_text)
{
    //setFliteVoice("");
    cst_voice *v;
    
    //v = REGISTER_VOX("cmu_us_kal16");
    v = register_cmu_us_slt("");
    flite_file_to_speech(tts_text,v,"play");

    return NS_OK;

}

NS_IMETHODIMP
nsFliteImpl::SayFileVoice(const char *tts_text, const char *speaker)
{
    //setFliteVoice("");
    cst_voice *v;
    const char *slt = "slt";
    const char *awb = "awb";
    const char *rms = "rms";

    //v = REGISTER_VOX(""); // Compiled in default voice cmu_us_kal
    v = register_cmu_us_kal16("");
    printf("** The voice choice is: %s\n", speaker);
    if (*speaker == *awb) {
       v = register_cmu_us_awb("");
    }
    if (*speaker == *slt) {
        v = register_cmu_us_slt("");
    }
    if (*speaker == *rms) {
        v = register_cmu_us_rms("");
    }
    
    flite_file_to_speech(tts_text,v,"play");

    return NS_OK;

}

NS_IMETHODIMP
nsFliteImpl::UnregisterVoice(const char *aPrefix)
{
    
    int speak = 3; //Set pause flag to unpause
    flite_pause_speech(speak);

    // Setting to stop speech
    const char *actionFlag = "stop";
    //printf("The current Voice is: %s\n", VOXHUMAN);

    if (*aPrefix == *actionFlag) {
        printf("** Stop Speaking Flag: %s ***\n", aPrefix);
        int speak = 2; // stop speaking
        flite_stop_speech(speak);
    } 

    unregister_cmu_us_slt("");
    unregister_cmu_us_kal16("");
    unregister_cmu_us_awb("");
    unregister_cmu_us_rms("");
    UNREGISTER_VOX;

    return NS_OK;
}

NS_IMETHODIMP
nsFliteImpl::AllowSpeech(const char *aPrefix)
{
    // Just to set the stopSpeaking flag to enable flite speaking.
    // Used in flite.c file_to_speech to break out of speaking a long file
    // when set to 'stop'.

    int speak = 1; // set allow speaking
    flite_stop_speech(speak);
    printf("Set Allow Speech flag\n");
    return NS_OK;
}

NS_IMETHODIMP
nsFliteImpl::UnPauseSpeech(const char *aPrefix)
{
    // Just to call flite_speech_pause() with value to 
    // enable/disable flite speech pause.
    // Used in flite.c flite_file_to_speech() to pause speaking a long file
    // when set to 'pause'.
 
    const char *actionFlagPause = "pause";
    const char *actionFlagUnPause = "speak";

    if (*aPrefix == *actionFlagUnPause) {
        flite_pause_speech(3); //unpause speech
        //printf("\n****\nSet unPause Speech Passed in aPrefix was: %s\n", aPrefix);
    }

    if (*aPrefix == *actionFlagPause) {
        flite_pause_speech(2); //pause speech
        //printf("\n****\nSet Pause Speech flag passed in value: %s\n", aPrefix);
    }

    return NS_OK;
}


NS_IMPL_ISUPPORTS1_CI(nsFliteImpl, nsIFlite)
