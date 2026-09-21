/**
 * Logic điều khiển toàn bộ trò chơi "Bé Vui Học"
 * Tương tác nhạy, mượt mà, hỗ trợ cả chuột máy tính và cảm ứng điện thoại/iPad
 */

class KidsGame {
    constructor() {
        this.stars = parseInt(localStorage.getItem('kids_game_stars') || '0', 10);
        this.currentScreen = 'menu';
        this.currentCategory = 'animals';
        this.flashcardIndex = 0;
        this.currentLanguage = 'vi-VN'; // Mặc định tiếng Việt

        // Trạng thái các minigame
        this.shadowRoundData = null;
        this.quizCurrentQuestion = null;
        this.memoryCards = [];
        this.memoryFlipped = [];
        this.memoryLock = false;

        this.initDOM();
        this.initEvents();
        this.initConfetti();
        this.updateStarDisplay();
    }

    initDOM() {
        this.starCountEl = document.getElementById('star-count');
        this.screens = {
            menu: document.getElementById('screen-menu'),
            flashcards: document.getElementById('screen-flashcards'),
            shadow: document.getElementById('screen-shadow'),
            quiz: document.getElementById('screen-quiz'),
            memory: document.getElementById('screen-memory')
        };
        this.modalStickers = document.getElementById('modal-stickers');
    }

    initEvents() {
        // Nút nhạc nền
        const btnBgm = document.getElementById('btn-bgm');
        if (btnBgm) {
            btnBgm.addEventListener('click', () => {
                const isPlaying = window.kidsAudio.toggleBGM();
                btnBgm.innerHTML = isPlaying ? '🎵' : '🔇';
                btnBgm.title = isPlaying ? 'Tắt nhạc' : 'Bật nhạc';
            });
        }

        // Nút âm thanh hiệu ứng
        const btnMute = document.getElementById('btn-sound');
        if (btnMute) {
            btnMute.addEventListener('click', () => {
                const isMuted = window.kidsAudio.toggleMute();
                btnMute.innerHTML = isMuted ? '🔈' : '🔊';
            });
        }

        // Nút bộ sưu tập nhãn dán
        const btnAlbum = document.getElementById('btn-stickers');
        if (btnAlbum) {
            btnAlbum.addEventListener('click', () => {
                window.kidsAudio.playPop();
                this.openStickerModal();
            });
        }

        const btnCloseSticker = document.getElementById('btn-close-sticker');
        if (btnCloseSticker) {
            btnCloseSticker.addEventListener('click', () => {
                window.kidsAudio.playPop();
                this.modalStickers.classList.remove('active');
            });
        }

        // Chuyển màn hình từ Menu chính
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const targetScreen = card.getAttribute('data-screen');
                window.kidsAudio.playPop();
                window.kidsAudio.startBGM(); // Tự động bật nhạc nhẹ sau lần tương tác đầu tiên
                this.showScreen(targetScreen);
            });
        });

        // Nút trở về Menu
        document.querySelectorAll('.btn-back-menu').forEach(btn => {
            btn.addEventListener('click', () => {
                window.kidsAudio.playPop();
                window.kidsSpeech.stopListening();
                this.showScreen('menu');
            });
        });

        // ================== SỰ KIỆN GÓC TỪ VỰNG ==================
        document.querySelectorAll('.cat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                window.kidsAudio.playPop();
                document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCategory = tab.getAttribute('data-cat');
                this.flashcardIndex = 0;
                this.renderFlashcard();
            });
        });

        // Bấm vào hình to để nghe phát âm & tiếng kêu
        const cardDisplay = document.getElementById('flashcard-display');
        if (cardDisplay) {
            cardDisplay.addEventListener('click', () => {
                this.pronounceCurrentCard();
            });
        }

        const btnPrevCard = document.getElementById('btn-prev-card');
        const btnNextCard = document.getElementById('btn-next-card');

        if (btnPrevCard) {
            btnPrevCard.addEventListener('click', () => {
                window.kidsAudio.playPop();
                const cat = KIDS_DATA.categories.find(c => c.id === this.currentCategory);
                this.flashcardIndex = (this.flashcardIndex - 1 + cat.items.length) % cat.items.length;
                this.renderFlashcard();
            });
        }

        if (btnNextCard) {
            btnNextCard.addEventListener('click', () => {
                window.kidsAudio.playPop();
                const cat = KIDS_DATA.categories.find(c => c.id === this.currentCategory);
                this.flashcardIndex = (this.flashcardIndex + 1) % cat.items.length;
                this.renderFlashcard();
            });
        }

        // Nút Micro Thần Kỳ
        const btnMagicMic = document.getElementById('btn-magic-mic');
        if (btnMagicMic) {
            btnMagicMic.addEventListener('click', () => {
                this.startMicrophoneChallenge();
            });
        }

        // Nút phát âm lại câu hỏi Quiz
        const btnQuizSpeak = document.getElementById('btn-quiz-speak');
        if (btnQuizSpeak) {
            btnQuizSpeak.addEventListener('click', () => {
                if (this.quizCurrentQuestion) {
                    window.kidsSpeech.speak(this.quizCurrentQuestion.question);
                }
            });
        }
    }

    // Chuyển đổi màn hình
    showScreen(screenName) {
        this.currentScreen = screenName;
        Object.keys(this.screens).forEach(key => {
            if (this.screens[key]) {
                this.screens[key].classList.toggle('active', key === screenName);
            }
        });

        if (screenName === 'flashcards') {
            this.renderFlashcard();
        } else if (screenName === 'shadow') {
            this.startShadowGame();
        } else if (screenName === 'quiz') {
            this.startQuizGame();
        } else if (screenName === 'memory') {
            this.startMemoryGame();
        }
    }

    // Thưởng sao cho bé
    addStars(count = 1) {
        this.stars += count;
        localStorage.setItem('kids_game_stars', this.stars);
        this.updateStarDisplay();
        window.kidsAudio.playSparkle();
        this.triggerConfetti();

        // Kiểm tra mở khóa Sticker mới
        KIDS_DATA.stickers.forEach(stk => {
            if (!stk.unlocked && this.stars >= stk.requireStars) {
                stk.unlocked = true;
                setTimeout(() => {
                    this.showStickerUnlockedNotification(stk);
                }, 700);
            }
        });
    }

    updateStarDisplay() {
        if (this.starCountEl) {
            this.starCountEl.textContent = this.stars;
        }
    }

    // =========================================================
    // 1. GÓC TỪ VỰNG & PHÁT ÂM (FLASHCARDS)
    // =========================================================
    renderFlashcard() {
        const cat = KIDS_DATA.categories.find(c => c.id === this.currentCategory);
        if (!cat || !cat.items.length) return;

        const item = cat.items[this.flashcardIndex];

        document.getElementById('flashcard-icon').textContent = item.icon;
        document.getElementById('flashcard-word-vi').textContent = item.name;
        document.getElementById('flashcard-word-en').textContent = item.nameEn;
        document.getElementById('flashcard-sound-tag').textContent = `Âm thanh: ${item.soundText}`;
        document.getElementById('mic-hint-text').textContent = 'Bấm Micro và đọc to tên bạn này nhé!';

        const micBtn = document.getElementById('btn-magic-mic');
        if (micBtn) micBtn.classList.remove('listening');

        // Tự động phát âm rõ ràng cho bé khi chuyển thẻ mới
        this.pronounceCurrentCard();
    }

    pronounceCurrentCard() {
        const cat = KIDS_DATA.categories.find(c => c.id === this.currentCategory);
        const item = cat.items[this.flashcardIndex];

        // Âm thanh mô phỏng
        window.kidsAudio.playItemSound(item.soundKey);

        // Giọng đọc chuẩn
        setTimeout(() => {
            window.kidsSpeech.speak(`${item.name}! ${item.soundText}`);
        }, 200);

        // Hiệu ứng nảy hình ảnh
        const display = document.getElementById('flashcard-display');
        display.style.transform = 'scale(1.15) rotate(3deg)';
        setTimeout(() => {
            display.style.transform = '';
        }, 300);
    }

    // Bé thử thách nói qua micro
    startMicrophoneChallenge() {
        const cat = KIDS_DATA.categories.find(c => c.id === this.currentCategory);
        const item = cat.items[this.flashcardIndex];
        const micBtn = document.getElementById('btn-magic-mic');
        const hintEl = document.getElementById('mic-hint-text');

        window.kidsAudio.playPop();

        window.kidsSpeech.listenToBaby(
            item.name,
            // Bé nói đúng từ
            (matchedText) => {
                hintEl.textContent = `🌟 Bé nói rất chuẩn: "${matchedText}"!`;
                hintEl.style.color = '#10AC84';
                micBtn.classList.remove('listening');

                window.kidsAudio.playTada();
                this.addStars(2); // Thưởng 2 sao khi bé chịu nói

                const randomPraise = KIDS_DATA.praisePhrases[Math.floor(Math.random() * KIDS_DATA.praisePhrases.length)];
                window.kidsSpeech.speak(`${randomPraise} ${item.name}!`);
            },
            // Bé nói chưa khớp (vẫn khích lệ)
            (heardText) => {
                hintEl.textContent = `Tai nghe được: "${heardText}". Bé thử đọc to lại nhé!`;
                hintEl.style.color = '#EE5253';
                micBtn.classList.remove('listening');

                window.kidsAudio.playGentleBoing();
                window.kidsSpeech.speak(`Bé đọc to lại cùng bạn nhé: ${item.name}!`);
            },
            // Thay đổi trạng thái Micro
            (status, extra) => {
                if (status === 'listening') {
                    micBtn.classList.add('listening');
                    hintEl.textContent = '🎙️ Đang lắng nghe giọng bé yêu... Hãy nói to nào!';
                    hintEl.style.color = '#0984E3';
                } else if (status === 'recording') {
                    micBtn.classList.add('listening');
                    hintEl.textContent = '🔴 Bé đang nói vào micro... (Ghi âm 3 giây)';
                    hintEl.style.color = '#E84118';
                } else if (status === 'playback') {
                    micBtn.classList.remove('listening');
                    hintEl.textContent = '🔊 Đang phát lại giọng đáng yêu của bé!';
                } else if (status === 'idle') {
                    micBtn.classList.remove('listening');
                } else if (status === 'permission_denied' || status === 'error') {
                    micBtn.classList.remove('listening');
                    hintEl.textContent = '👉 Hãy cho phép trình duyệt dùng Micro nhé ba mẹ!';
                }
            }
        );
    }

    // =========================================================
    // 2. MINIGAME: GHÉP BÓNG MA THUẬT (SHADOW MATCH)
    // =========================================================
    startShadowGame() {
        const shadowTargetArea = document.getElementById('shadow-targets');
        const shadowOptionsArea = document.getElementById('shadow-options');
        shadowTargetArea.innerHTML = '';
        shadowOptionsArea.innerHTML = '';

        // Chọn ngẫu nhiên 3 con vật hoặc đồ vật
        const allItems = [];
        KIDS_DATA.categories.forEach(c => allItems.push(...c.items));
        const shuffled = [...allItems].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        this.shadowRoundData = {
            items: selected,
            matchedCount: 0
        };

        // Giọng đọc hướng dẫn bé
        window.kidsSpeech.speak('Bé hãy ghép các bạn vào đúng bóng đen nhé!');

        // Vẽ 3 ô bóng
        selected.forEach(item => {
            const silhouetteBox = document.createElement('div');
            silhouetteBox.className = 'shadow-silhouette';
            silhouetteBox.id = `shadow-${item.id}`;
            silhouetteBox.setAttribute('data-id', item.id);

            const iconSpan = document.createElement('span');
            iconSpan.className = 'silhouette-icon';
            iconSpan.textContent = item.icon;

            silhouetteBox.appendChild(iconSpan);
            shadowTargetArea.appendChild(silhouetteBox);
        });

        // Vẽ các lựa chọn hình thật (đã xáo trộn thứ tự)
        const randomizedOptions = [...selected].sort(() => 0.5 - Math.random());
        randomizedOptions.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'shadow-option-btn';
            btn.textContent = item.icon;
            btn.setAttribute('data-id', item.id);

            btn.addEventListener('click', () => {
                this.handleShadowPick(item, btn);
            });

            shadowOptionsArea.appendChild(btn);
        });
    }

    handleShadowPick(item, btnElement) {
        const targetSilhouette = document.getElementById(`shadow-${item.id}`);

        if (targetSilhouette && !targetSilhouette.classList.contains('filled')) {
            // Đúng bóng!
            window.kidsAudio.playSuccess();
            targetSilhouette.classList.add('filled');
            btnElement.style.visibility = 'hidden';

            window.kidsSpeech.speak(`${item.name}!`);

            this.shadowRoundData.matchedCount++;

            // Hoàn thành cả 3 bóng
            if (this.shadowRoundData.matchedCount === 3) {
                setTimeout(() => {
                    window.kidsAudio.playTada();
                    this.addStars(2);
                    window.kidsSpeech.speak('Bé tìm bóng siêu quá! Tiếp tục nào!');
                    setTimeout(() => {
                        this.startShadowGame();
                    }, 1800);
                }, 500);
            }
        } else {
            window.kidsAudio.playGentleBoing();
        }
    }

    // =========================================================
    // 3. MINIGAME: BÉ NHANH TRÍ (QUIZ & PHÂN LOẠI)
    // =========================================================
    startQuizGame() {
        const questionTextEl = document.getElementById('quiz-question-text');
        const choicesGridEl = document.getElementById('quiz-choices-grid');
        choicesGridEl.innerHTML = '';

        // Ngân hàng câu đố trực quan cho bé 3 tuổi
        const questionBank = [
            {
                question: 'Đâu là quả Táo màu đỏ ngọt ngào?',
                correctId: 'apple',
                options: [
                    { id: 'apple', name: 'Quả Táo', icon: '🍎' },
                    { id: 'banana', name: 'Quả Chuối', icon: '🍌' },
                    { id: 'carrot', name: 'Củ Cà Rốt', icon: '🥕' },
                    { id: 'grape', name: 'Quả Nho', icon: '🍇' }
                ]
            },
            {
                question: 'Bạn nào biết bơi dưới nước "Cạp cạp"?',
                correctId: 'duck',
                options: [
                    { id: 'dog', name: 'Con Chó', icon: '🐶' },
                    { id: 'duck', name: 'Con Vịt', icon: '🦆' },
                    { id: 'cat', name: 'Con Mèo', icon: '🐱' },
                    { id: 'elephant', name: 'Con Voi', icon: '🐘' }
                ]
            },
            {
                question: 'Đâu là bạn Ô Tô bon bon trên đường?',
                correctId: 'car',
                options: [
                    { id: 'car', name: 'Ô Tô', icon: '🚗' },
                    { id: 'airplane', name: 'Máy Bay', icon: '✈️' },
                    { id: 'boat', name: 'Thuyền', icon: '⛵' },
                    { id: 'train', name: 'Tàu Hỏa', icon: '🚂' }
                ]
            },
            {
                question: 'Đâu là Ngôi Sao Vàng lấp lánh?',
                correctId: 'star_yellow',
                options: [
                    { id: 'circle_red', name: 'Hình Tròn Đỏ', icon: '🔴' },
                    { id: 'star_yellow', name: 'Ngôi Sao Vàng', icon: '⭐' },
                    { id: 'heart_pink', name: 'Trái Tim Hồng', icon: '💖' },
                    { id: 'square_blue', name: 'Hình Vuông Xanh', icon: '🟦' }
                ]
            },
            {
                question: 'Bạn nào thích ăn chuối và leo trèo khẹc khẹc?',
                correctId: 'monkey',
                options: [
                    { id: 'monkey', name: 'Con Khỉ', icon: '🐵' },
                    { id: 'cow', name: 'Bò Sữa', icon: '🐮' },
                    { id: 'pig', name: 'Con Lợn', icon: '🐷' },
                    { id: 'rabbit', name: 'Con Thỏ', icon: '🐰' }
                ]
            }
        ];

        const randomQ = questionBank[Math.floor(Math.random() * questionBank.length)];
        this.quizCurrentQuestion = randomQ;

        questionTextEl.textContent = randomQ.question;
        window.kidsSpeech.speak(randomQ.question);

        // Hiển thị 4 lựa chọn to rõ
        randomQ.options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'quiz-choice-card';

            const icon = document.createElement('div');
            icon.className = 'quiz-choice-icon';
            icon.textContent = opt.icon;

            const name = document.createElement('div');
            name.className = 'quiz-choice-name';
            name.textContent = opt.name;

            card.appendChild(icon);
            card.appendChild(name);

            card.addEventListener('click', () => {
                this.handleQuizAnswer(opt, randomQ.correctId, card);
            });

            choicesGridEl.appendChild(card);
        });
    }

    handleQuizAnswer(selectedOpt, correctId, cardEl) {
        if (selectedOpt.id === correctId) {
            // Đúng!
            window.kidsAudio.playSuccess();
            cardEl.style.borderColor = '#2ED573';
            cardEl.style.background = '#E8F8F0';

            this.addStars(1);
            const praise = KIDS_DATA.praisePhrases[Math.floor(Math.random() * KIDS_DATA.praisePhrases.length)];
            window.kidsSpeech.speak(`Chính xác! ${selectedOpt.name}! ${praise}`);

            setTimeout(() => {
                this.startQuizGame();
            }, 1800);
        } else {
            // Chưa đúng
            window.kidsAudio.playGentleBoing();
            cardEl.style.transform = 'translateX(-8px)';
            setTimeout(() => { cardEl.style.transform = 'translateX(8px)'; }, 100);
            setTimeout(() => { cardEl.style.transform = ''; }, 200);

            window.kidsSpeech.speak(`Đây là ${selectedOpt.name}. Bé thử tìm lại xem nào!`);
        }
    }

    // =========================================================
    // 4. MINIGAME: LẬT HÌNH TÌM CẶP (MEMORY MATCH - 4 CARDS)
    // =========================================================
    startMemoryGame() {
        const board = document.getElementById('memory-board');
        board.innerHTML = '';
        this.memoryFlipped = [];
        this.memoryLock = false;

        // Chọn 2 con vật đáng yêu tạo thành 4 thẻ (vừa vặn cho trẻ 3 tuổi)
        const animals = KIDS_DATA.categories[0].items;
        const shuffled = [...animals].sort(() => 0.5 - Math.random());
        const pair1 = shuffled[0];
        const pair2 = shuffled[1];

        const cardsData = [
            { id: 1, pairId: pair1.id, name: pair1.name, icon: pair1.icon },
            { id: 2, pairId: pair1.id, name: pair1.name, icon: pair1.icon },
            { id: 3, pairId: pair2.id, name: pair2.name, icon: pair2.icon },
            { id: 4, pairId: pair2.id, name: pair2.name, icon: pair2.icon }
        ].sort(() => 0.5 - Math.random());

        this.memoryCards = cardsData;

        window.kidsSpeech.speak('Bé hãy lật tìm 2 bạn giống hệt nhau nhé!');

        cardsData.forEach(cardItem => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.setAttribute('data-id', cardItem.id);

            const inner = document.createElement('div');
            inner.className = 'memory-card-inner';

            const back = document.createElement('div');
            back.className = 'memory-card-back';
            back.textContent = '❓';

            const front = document.createElement('div');
            front.className = 'memory-card-front';
            front.textContent = cardItem.icon;

            inner.appendChild(back);
            inner.appendChild(front);
            card.appendChild(inner);

            card.addEventListener('click', () => {
                this.handleMemoryCardFlip(card, cardItem);
            });

            board.appendChild(card);
        });
    }

    handleMemoryCardFlip(cardEl, cardItem) {
        if (this.memoryLock) return;
        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

        window.kidsAudio.playPop();
        cardEl.classList.add('flipped');
        this.memoryFlipped.push({ element: cardEl, item: cardItem });

        if (this.memoryFlipped.length === 2) {
            this.memoryLock = true;
            const [card1, card2] = this.memoryFlipped;

            if (card1.item.pairId === card2.item.pairId) {
                // Khớp cặp!
                setTimeout(() => {
                    window.kidsAudio.playSuccess();
                    card1.element.classList.add('matched');
                    card2.element.classList.add('matched');
                    this.memoryFlipped = [];
                    this.memoryLock = false;

                    window.kidsSpeech.speak(`Đôi bạn ${card1.item.name}!`);

                    // Kiểm tra xem đã hoàn thành cả bàn cờ chưa
                    const allMatched = document.querySelectorAll('.memory-card.matched').length;
                    if (allMatched === 4) {
                        setTimeout(() => {
                            window.kidsAudio.playTada();
                            this.addStars(2);
                            window.kidsSpeech.speak('Bé có trí nhớ thật tuyệt vời!');
                            setTimeout(() => {
                                this.startMemoryGame();
                            }, 2000);
                        }, 600);
                    }
                }, 400);
            } else {
                // Không khớp
                setTimeout(() => {
                    window.kidsAudio.playGentleBoing();
                    card1.element.classList.remove('flipped');
                    card2.element.classList.remove('flipped');
                    this.memoryFlipped = [];
                    this.memoryLock = false;
                }, 1000);
            }
        }
    }

    // =========================================================
    // HIỆU ỨNG PHÁO HOA CONFETTI & ALBUM STICKER
    // =========================================================
    initConfetti() {
        this.canvas = document.getElementById('confetti-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    triggerConfetti() {
        if (!this.canvas || !this.ctx) return;
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#FF9F43', '#9B5DE5'];

        for (let i = 0; i < 60; i++) {
            this.particles.push({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                size: Math.random() * 12 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 16,
                vy: (Math.random() - 0.7) * 18,
                gravity: 0.4,
                rotation: Math.random() * 360,
                vRot: (Math.random() - 0.5) * 10,
                alpha: 1
            });
        }

        if (!this.animatingConfetti) {
            this.animatingConfetti = true;
            this.renderConfettiFrame();
        }
    }

    renderConfettiFrame() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.rotation += p.vRot;
            p.alpha -= 0.015;

            this.ctx.save();
            this.ctx.globalAlpha = Math.max(0, p.alpha);
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();

            if (p.alpha <= 0 || p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.renderConfettiFrame());
        } else {
            this.animatingConfetti = false;
        }
    }

    openStickerModal() {
        const grid = document.getElementById('sticker-album-grid');
        grid.innerHTML = '';

        KIDS_DATA.stickers.forEach(stk => {
            const isUnlocked = stk.unlocked || this.stars >= (stk.requireStars || 0);
            const badge = document.createElement('div');
            badge.className = `sticker-badge ${isUnlocked ? 'unlocked' : 'locked'}`;

            badge.innerHTML = `
                <div class="sticker-icon">${stk.icon}</div>
                <div class="sticker-name">${stk.name}</div>
                <div style="font-size: 0.75rem; color: #888; margin-top: 4px;">
                    ${isUnlocked ? 'Đã nhận ⭐' : `Cần ${stk.requireStars} ⭐`}
                </div>
            `;
            grid.appendChild(badge);
        });

        this.modalStickers.classList.add('active');
    }

    showStickerUnlockedNotification(sticker) {
        window.kidsAudio.playTada();
        window.kidsSpeech.speak(`Hoan hô! Bé đã nhận được huy hiệu ${sticker.name}!`);
        this.triggerConfetti();
        this.openStickerModal();
    }
}

// Khởi chạy khi tài liệu HTML sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    window.game = new KidsGame();
});
