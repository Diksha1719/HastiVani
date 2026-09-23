import React from 'react';
import { Webcam } from '../components/Webcam';
import { RecognitionPanel } from '../components/RecognitionPanel';
import { SpeechControls } from '../components/SpeechControls';
import { RecognitionHistory } from '../components/RecognitionHistory';
import { GestureGuide } from '../components/GestureGuide';
import { SentenceBuilder } from '../components/SentenceBuilder';
import { useWebcam } from '../hooks/useWebcam';
import { useRecognition } from '../hooks/useRecognition';

export const Translate: React.FC = () => {
  const {
    currentGesture,
    translationText,
    confidence,
    activeMode,
    isBackendOffline,
    modelStatus,
    detectedFingers,
    history,
    speechSettings,
    setSpeechSettings,
    processLandmarks,
    speakText,
    stopSpeech,
    clearHistory,
    // Sentence Builder State & Actions
    sentenceTokens,
    composedSentence,
    sentenceAlternatives,
    sentenceSettings,
    setSentenceSettings,
    dwellGesture,
    dwellProgress,
    addWordToken,
    removeWordToken,
    removeLastToken,
    clearSentence,
    speakSentence,
    loadSamplePhrase,
  } = useRecognition();

  const {
    videoRef,
    canvasRef,
    cameraState,
    errorMessage,
    handDetected,
    handedness,
    landmarkCount,
    startCamera,
    stopCamera,
  } = useWebcam(processLandmarks);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Indian Sign Language Recognition
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Perform hand gestures in front of the camera for real-time translation into text & speech.
          </p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Webcam Panel (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          <Webcam
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraState={cameraState}
            errorMessage={errorMessage}
            handDetected={handDetected}
            handedness={handedness}
            landmarkCount={landmarkCount}
            confidence={confidence}
            currentGesture={currentGesture}
            detectedFingers={detectedFingers}
            onStartCamera={startCamera}
            onStopCamera={stopCamera}
          />

          {/* Continuous Whole Sentence Builder */}
          <SentenceBuilder
            tokens={sentenceTokens}
            composedSentence={composedSentence}
            alternatives={sentenceAlternatives}
            currentGesture={currentGesture}
            dwellGesture={dwellGesture}
            dwellProgress={dwellProgress}
            sentenceSettings={sentenceSettings}
            setSentenceSettings={setSentenceSettings}
            onAddWord={addWordToken}
            onRemoveWord={removeWordToken}
            onBackspace={removeLastToken}
            onClear={clearSentence}
            onSpeak={speakSentence}
            onLoadSample={loadSamplePhrase}
          />

          {/* Supported Gestures Quick Ref */}
          <GestureGuide />
        </div>

        {/* Right Side: Recognition Panel & Speech Controls (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recognition Results Display */}
          <RecognitionPanel
            currentGesture={currentGesture}
            translationText={translationText}
            confidence={confidence}
            activeMode={activeMode}
            isBackendOffline={isBackendOffline}
            modelStatus={modelStatus}
            cameraActive={cameraState === 'active'}
          />

          {/* Text to Speech Controls */}
          <SpeechControls
            currentGesture={currentGesture}
            translationText={translationText}
            speechSettings={speechSettings}
            setSpeechSettings={setSpeechSettings}
            onSpeak={speakText}
            onStop={stopSpeech}
          />
        </div>
      </div>

      {/* Bottom Section: Recognition History */}
      <div className="pt-4">
        <RecognitionHistory
          history={history}
          onClearHistory={clearHistory}
          onSpeak={speakText}
        />
      </div>
    </div>
  );
};
