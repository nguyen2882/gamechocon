/**
 * Module hỗ trợ Phát âm (Text-To-Speech) và Luyện nói cho bé (Speech Recognition / Voice Echo)
 * Tối ưu hóa cho ngữ điệu tiếng Việt thân thiện, chậm rãi cho bé 3 tuổi dễ nghe
 */

class KidsSpeech {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.selectedVoice = null;
        this.lang = 'vi-VN';
        this.recognition = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;

        this.initTTS();
        this.initSTT();
    }

    // Khởi tạo giọng đọc Text to Speech
    initTTS() {
        if (!this.synth) return;

        const updateVoices = () => {
            const voices = this.synth.getVoices();
            // Ưu tiên giọng tiếng Việt
            const viVoice = voices.find(v => v.lang.startsWith('vi') || v.lang.includes('VIE'));
            if (viVoice) {
                this.selectedVoice = viVoice;
            }
        };

        updateVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = updateVoices;
        }
    }

    setLanguage(langCode) {
        this.lang = langCode;
        if (this.synth) {
            const voices = this.synth.getVoices();
            const prefix = langCode.startsWith('vi') ? 'vi' : 'en';
            const matched = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
            if (matched) this.selectedVoice = matched;
        }
        if (this.recognition) {
            this.recognition.lang = langCode;
        }
    }

    // Phát âm từ hoặc câu nói
    speak(text, onEndCallback = null) {
        if (!this.synth) {
            if (onEndCallback) onEndCallback();
            return;
        }

        // Hủy các câu đọc dở trước đó
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.lang;
        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        }

        // Tốc độ 0.85 chậm rãi, cao độ 1.15 ấm áp tươi vui cho trẻ
        utterance.rate = 0.88;
        utterance.pitch = 1.18;

        utterance.onend = () => {
            if (onEndCallback) onEndCallback();
        };

        utterance.onerror = (e) => {
            console.warn('SpeechSynthesis error:', e);
            if (onEndCallback) onEndCallback();
        };

        this.synth.speak(utterance);
    }

    // Khởi tạo nhận diện giọng nói (Web Speech Recognition)
    initSTT() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
            try {
                this.recognition = new SpeechRec();
                this.recognition.continuous = false;
                this.recognition.interimResults = false;
                this.recognition.lang = this.lang;
                this.recognition.maxAlternatives = 3;
            } catch (err) {
                console.warn('SpeechRecognition initialization error:', err);
            }
        }
    }

    // Bé bấm micro để luyện phát âm
    listenToBaby(targetWord, onMatchCallback, onMismatchCallback, onStatusChange) {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRec) {
            // Thiết bị không hỗ trợ Speech Recognition -> Chuyển sang chế độ Ghi âm nhại giọng vui nhộn (Voice Echo)
            this.startEchoRecording(targetWord, onMatchCallback, onStatusChange);
            return;
        }

        if (!this.recognition) {
            this.initSTT();
        }

        this.recognition.lang = this.lang;

        if (onStatusChange) onStatusChange('listening');

        this.recognition.onresult = (event) => {
            let recognizedText = '';
            for (let i = 0; i < event.results[0].length; i++) {
                const alt = event.results[0][i].transcript.toLowerCase().trim();
                recognizedText = alt;
                // Kiểm tra từ khóa bé phát âm
                const cleanTarget = targetWord.toLowerCase().replace(/^(con|quả|củ|xe|hình|màu)\s+/, '').trim();
                const cleanTargetFull = targetWord.toLowerCase().trim();

                if (alt.includes(cleanTarget) || cleanTarget.includes(alt) || alt.includes(cleanTargetFull)) {
                    if (onStatusChange) onStatusChange('success');
                    if (onMatchCallback) onMatchCallback(recognizedText);
                    return;
                }
            }

            // Nếu bé nói nhưng chưa rõ
            if (onStatusChange) onStatusChange('mismatch');
            if (onMismatchCallback) onMismatchCallback(recognizedText);
        };

        this.recognition.onerror = (e) => {
            console.warn('Recognition error:', e);
            if (e.error === 'not-allowed' || e.error === 'no-speech') {
                if (onStatusChange) onStatusChange('error', e.error);
            } else {
                // Thử chế độ ghi âm phát lại
                this.startEchoRecording(targetWord, onMatchCallback, onStatusChange);
            }
        };

        this.recognition.onend = () => {
            if (onStatusChange) onStatusChange('idle');
        };

        try {
            this.recognition.start();
        } catch (e) {
            console.warn('Recognition start exception, retrying:', e);
            this.recognition.abort();
            setTimeout(() => {
                try { this.recognition.start(); } catch(err){}
            }, 300);
        }
    }

    // Chế độ Ghi âm và Phát lại giọng nói của bé (Cực kỳ thích thú cho trẻ 3 tuổi)
    startEchoRecording(targetWord, onDoneCallback, onStatusChange) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            if (onStatusChange) onStatusChange('unsupported');
            return;
        }

        if (onStatusChange) onStatusChange('recording');

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.audioChunks = [];
                this.mediaRecorder = new MediaRecorder(stream);
                
                this.mediaRecorder.ondataavailable = e => {
                    if (e.data.size > 0) this.audioChunks.push(e.data);
                };

                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);
                    
                    // Phát lại giọng của bé kèm lời khen
                    if (onStatusChange) onStatusChange('playback');
                    audio.play();
                    audio.onended = () => {
                        if (onStatusChange) onStatusChange('success');
                        if (onDoneCallback) onDoneCallback('Giọng bé rất đáng yêu!');
                    };

                    // Dừng các tracks micro để bảo mật
                    stream.getTracks().forEach(t => t.stop());
                };

                this.mediaRecorder.start();

                // Tự động dừng sau 3 giây phù hợp với từ ngắn của bé
                setTimeout(() => {
                    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                        this.mediaRecorder.stop();
                    }
                }, 2800);
            })
            .catch(err => {
                console.warn('Microphone permission denied:', err);
                if (onStatusChange) onStatusChange('permission_denied');
            });
    }

    stopListening() {
        if (this.recognition) {
            try { this.recognition.stop(); } catch(e){}
        }
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            try { this.mediaRecorder.stop(); } catch(e){}
        }
    }
}

window.kidsSpeech = new KidsSpeech();
