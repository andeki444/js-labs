const createTamagotchi = function() {
    let hunger = 100;      // сытость 0-100
    let happiness = 100;   // счастье 0-100  
    let energy = 100;      // энергия 0-100
    let actionQueue = [];   // очередь действий
    let isActionRunning = false;  // флаг выполнения действия
    let decayInterval = null;  // таймер угасания
    
    // настройки
    let gameSettings = {
        decaySpeed: 5,      // скорость угасания в секундах
        decayStep: 5,       // шаг угасания
        actionTime: 2000    // длительность действия в мс
    };
    let callbacks = {
        onStatsUpdate: null,
        onMessage: null,
        onShake: null,
        onImageChange: null
    };
    
    // вспомогательные функции
    
    function clamp(value) {
        if (value < 0) return 0;
        if (value > 100) return 100;
        return value;
    }
    
    function updateUI() {
        if (callbacks.onStatsUpdate) {
            callbacks.onStatsUpdate({
                hunger: Math.floor(hunger),
                happiness: Math.floor(happiness),
                energy: Math.floor(energy),
                queueLength: actionQueue.length
            });
        }
        
        updatePetImage();
    }
    
    function updatePetImage() {
        if (!callbacks.onImageChange) return;

        if (hunger <= 0 || happiness <= 0 || energy <= 0) {
            callbacks.onImageChange('dead');  // мёртвый питомец
        } else if (hunger < 30) {
            callbacks.onImageChange('hungry');  // голодный
        } else if (happiness < 30) {
            callbacks.onImageChange('sad');  // грустный
        } else if (energy < 30) {
            callbacks.onImageChange('tired');  // уставший
        } else {
            callbacks.onImageChange('normal');  // нормальное состояние
        }
    }
    
    function checkGameOver() {
        if (hunger <= 0 || happiness <= 0 || energy <= 0) {
            if (callbacks.onMessage) {
                callbacks.onMessage('💔 Игра окончена! Питомец покинул вас.', 'error');
            }
            updatePetImage();
            resetGame();
            return true;
        }
        return false;
    }
    
    // очередность действий:
    
    function addToQueue(actionFunction) {
        if (actionQueue.length >= 3) {
            if (callbacks.onMessage) {
                callbacks.onMessage('⚠️ Слишком много действий! Подождите.', 'error');
            }
            return false;
        }
        
        actionQueue.push(actionFunction);
        updateUI();
        processQueue();
        return true;
    }
    
    function processQueue() {
        if (isActionRunning || actionQueue.length === 0) {
            return;
        }
        
        isActionRunning = true;
        const nextAction = actionQueue.shift();
        updateUI();
        
        // промис и цепочка асинхронных действий
        nextAction()
            .then(function() {
                // Успешное выполнение
                if (callbacks.onMessage) {
                    callbacks.onMessage('✅ Действие выполнено!', 'success');
                }
                updatePetImage(); 
            })
            .catch(function(error) {
                if (callbacks.onMessage) {
                    callbacks.onMessage(error.message || '❌ Действие не удалось!', 'error');
                }
                if (callbacks.onShake) {
                    callbacks.onShake(); 
                }
            })
            .finally(function() {
                isActionRunning = false;
                processQueue();
            });
    }
    
    // асинхронные действия:

    function createDelayedAction(changeFunction, errorMessage) {
        return new Promise(function(resolve, reject) {
            const testStats = changeFunction({
                hunger: hunger,
                happiness: happiness,
                energy: energy
            });
            
            if (testStats.hunger > 100 || testStats.happiness > 100 || testStats.energy > 100) {
                reject(new Error(errorMessage));
                return;
            }

            setTimeout(function() {
                const newStats = changeFunction({
                    hunger: hunger,
                    happiness: happiness,
                    energy: energy
                });
                
                hunger = clamp(newStats.hunger);
                happiness = clamp(newStats.happiness);
                energy = clamp(newStats.energy);
                
                updateUI();
                checkGameOver();
                resolve();
            }, gameSettings.actionTime);
        });
    }
    
    // публичные методы:
    
    function init(gameCallbacks) {
        callbacks = gameCallbacks;
        startDecayTimer();
        updateUI();
        updatePetImage();
    }
    
    function feed() {
        return addToQueue(function() {
            return createDelayedAction(
                function(stats) {
                    return {
                        hunger: stats.hunger + 15,
                        happiness: stats.happiness,
                        energy: stats.energy
                    };
                },
                '🍖 Питомец сыт! Не может есть больше.'
            );
        });
    }
    
    function play() {
        return addToQueue(function() {
            return createDelayedAction(
                function(stats) {
                    return {
                        hunger: stats.hunger,
                        happiness: stats.happiness + 20,
                        energy: stats.energy - 10
                    };
                },
                '😊 Питомец слишком счастлив! Не может играть.'
            );
        });
    }

    function sleep() {
        return addToQueue(function() {
            return new Promise(function(resolve, reject) {
                if (energy >= 100) {
                    reject(new Error('😴 Энергия полна! Питомец не хочет спать.'));
                    return;
                }
                setTimeout(function() {
                    energy = 100;
                    updateUI();
                    checkGameOver();
                    resolve();
                }, gameSettings.actionTime);
            });
        });
    }
    
    // промис - дрессировка:
    function train() {
        return addToQueue(function() {
            const feedPromise = createDelayedAction(
                function(stats) {
                    return {
                        hunger: stats.hunger + 10,
                        happiness: stats.happiness,
                        energy: stats.energy
                    };
                },
                '🍖 Не может есть!'
            );
            
            const playPromise = createDelayedAction(
                function(stats) {
                    return {
                        hunger: stats.hunger,
                        happiness: stats.happiness + 15,
                        energy: stats.energy - 5
                    };
                },
                '😊 Не может играть!'
            );
            
            // если reject, то promise.all - reject
            return Promise.all([feedPromise, playPromise]);
        });
    }
    
    // инициализация сброса:

    function resetGame() {
        if (decayInterval) {
            clearInterval(decayInterval);
        }
        
        hunger = 100;
        happiness = 100;
        energy = 100;
        actionQueue = [];
        isActionRunning = false;
        
        updateUI();
        startDecayTimer();
        
        if (callbacks.onMessage) {
            callbacks.onMessage('🔄 Игра перезапущена!', 'success');
        }
    }
    
    // обновление настроек
    function updateSettings(newSettings) {
        gameSettings = {
            decaySpeed: newSettings.decaySpeed || gameSettings.decaySpeed,
            decayStep: newSettings.decayStep || gameSettings.decayStep,
            actionTime: newSettings.actionTime || gameSettings.actionTime
        };
        
        // перезапуск с новыми настройками
        if (decayInterval) {
            clearInterval(decayInterval);
            startDecayTimer();
        }
    }
    
    // текущие настройки
    function getSettings() {
        return {
            decaySpeed: gameSettings.decaySpeed,
            decayStep: gameSettings.decayStep,
            actionTime: gameSettings.actionTime
        };
    }
    
    // текущие показатели
    function getStats() {
        return {
            hunger: hunger,
            happiness: happiness,
            energy: energy
        };
    }
    
    // угасания состояний питомца:
    function startDecayTimer() {
        decayInterval = setInterval(function() {
            hunger = clamp(hunger - gameSettings.decayStep);
            happiness = clamp(happiness - gameSettings.decayStep);
            energy = clamp(energy - gameSettings.decayStep);
            
            updateUI();
            checkGameOver();
        }, gameSettings.decaySpeed * 1000);
    }
    
    return {
        init: init,
        feed: feed,
        play: play,
        sleep: sleep,
        train: train,
        reset: resetGame,
        updateSettings: updateSettings,
        getSettings: getSettings,
        getStats: getStats
    };
};

// иницализация DOM для интерфейса:
document.addEventListener('DOMContentLoaded', function() {
    const game = createTamagotchi();
    
    // элементы DOM
    const hungerSpan = document.getElementById('hunger');
    const happinessSpan = document.getElementById('happiness');
    const energySpan = document.getElementById('energy');
    const queueSpan = document.getElementById('queueCount');
    const messageDiv = document.getElementById('message');
    const petImage = document.getElementById('petImage');
    
    // кнопки
    const feedBtn = document.getElementById('feedBtn');
    const playBtn = document.getElementById('playBtn');
    const sleepBtn = document.getElementById('sleepBtn');
    const trainBtn = document.getElementById('trainBtn');
    const catchBtn = document.getElementById('catchBtn');
    const resetBtn = document.getElementById('resetGame');
    
    // панель откладки
    const debugToggle = document.getElementById('debugToggle');
    const debugPanel = document.getElementById('debugPanel');
    const decaySpeedInput = document.getElementById('decaySpeed');
    const decayStepInput = document.getElementById('decayStep');
    const actionTimeInput = document.getElementById('actionTime');

    let isWandering = false;
    let wanderTimeout = null;
    let wanderResolveFunction = null;
    
    // функции для смен эмоций у питомца:
    
    const petImages = {
        normal: 'pets/pet-normal.png',
        hungry: 'pets/pet-hungry.png',
        sad: 'pets/pet-sad.png',
        tired: 'pets/pet-tired.png',
        dead: 'pets/pet-dead.png',
        running: 'pets/pet-running.png'
    };
    
    function changePetImage(state) {
        switch(state) {
            case 'normal':
                petImage.src = petImages.normal;
                break;
            case 'hungry':
                petImage.src = petImages.hungry;
                break;
            case 'sad':
                petImage.src = petImages.sad;
                break;
            case 'tired':
                petImage.src = petImages.tired;
                break;
            case 'dead':
                petImage.src = petImages.dead;
                break;
            case 'running':
                petImage.src = petImages.running;
                break;
            default:
                petImage.src = petImages.normal;
        }
    }
    
    // функции обновления ui:
    
    function updateDisplay(stats) {
        hungerSpan.textContent = Math.floor(stats.hunger);
        happinessSpan.textContent = Math.floor(stats.happiness);
        energySpan.textContent = Math.floor(stats.energy);
        queueSpan.textContent = stats.queueLength;
    }
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type || '';
        
        setTimeout(function() {
            if (messageDiv.textContent === text) {
                messageDiv.textContent = '';
                messageDiv.className = '';
            }
        }, 3000);
    }
    
    function shakeAnimation() {
        petImage.classList.add('shake');
        setTimeout(function() {
            petImage.classList.remove('shake');
        }, 300);
    }

    game.init({
        onStatsUpdate: updateDisplay,
        onMessage: showMessage,
        onShake: shakeAnimation,
        onImageChange: changePetImage
    });
    
    // промис - побег питомца:
    
    function startWandering() {
        if (isWandering) return;        
        isWandering = true;
        showMessage('🏃 Питомец убегает! Поймайте за 3 секунды!', 'error');
        changePetImage('running');        
        const timerPromise = new Promise(function(resolve, reject) {
            wanderTimeout = setTimeout(function() {
                reject(new Error('Питомец убежал!'));
            }, 3000);
        });
        const catchPromise = new Promise(function(resolve) {
            wanderResolveFunction = resolve;
        });
        
        // промис:

        Promise.race([timerPromise, catchPromise])
            .then(function() {
                clearTimeout(wanderTimeout);
                showMessage('🎉 Вы поймали питомца!', 'success');
                changePetImage('normal');  
            })
            .catch(function() {
                const currentStats = game.getStats();
                const newHappiness = Math.max(0, currentStats.happiness - 20);
                currentStats.happiness = newHappiness;
                happinessSpan.textContent = newHappiness;
                showMessage('Питомец убежал! -20 счастья', 'error');
                changePetImage('sad');                  
                setTimeout(function() {
                    const stats = game.getStats();
                    if (stats.hunger > 0 && stats.happiness > 0 && stats.energy > 0) {
                        changePetImage('normal');
                    }
                }, 2000);
            })
            .finally(function() {
                isWandering = false;
                wanderResolveFunction = null;
                if (wanderTimeout) clearTimeout(wanderTimeout);
            });
    }
    
    function onCatchClick() {
        if (isWandering && wanderResolveFunction) {
            wanderResolveFunction();
            wanderResolveFunction = null;
        } else {
            showMessage('Питомец не убегает!', 'error');
        }
    }
    
    setInterval(function() {
        if (!isWandering && Math.random() < 0.2) {
            startWandering();
        }
    }, 30000);
    
    // обработчики кнопок:
    
    function onFeedClick() {
        if (isWandering) {
            showMessage('Сначала поймайте питомца!', 'error');
            return;
        }
        game.feed();
    }
    
    function onPlayClick() {
        if (isWandering) {
            showMessage('Сначала поймайте питомца!', 'error');
            return;
        }
        game.play();
    }
    
    function onSleepClick() {
        if (isWandering) {
            showMessage('Сначала поймайте питомца!', 'error');
            return;
        }
        game.sleep();
    }
    
    function onTrainClick() {
        if (isWandering) {
            showMessage('Сначала поймайте питомца!', 'error');
            return;
        }
        game.train();
    }
    
    function onResetClick() {
        game.reset();
        if (isWandering) {
            isWandering = false;
            if (wanderTimeout) clearTimeout(wanderTimeout);
            if (wanderResolveFunction) wanderResolveFunction = null;
        }
        changePetImage('normal');
    }
    
    feedBtn.onclick = onFeedClick;
    playBtn.onclick = onPlayClick;
    sleepBtn.onclick = onSleepClick;
    trainBtn.onclick = onTrainClick;
    catchBtn.onclick = onCatchClick;
    resetBtn.onclick = onResetClick;
    
    // панель откладки:
    
    function onDebugToggle() {
        if (debugPanel.style.display === 'none') {
            debugPanel.style.display = 'block';
            debugToggle.textContent = '🔧 Панель отладки ▲';
        } else {
            debugPanel.style.display = 'none';
            debugToggle.textContent = '🔧 Панель отладки ▼';
        }
    }
    
    function applySettings() {
        game.updateSettings({
            decaySpeed: parseInt(decaySpeedInput.value),
            decayStep: parseInt(decayStepInput.value),
            actionTime: parseInt(actionTimeInput.value)
        });
        showMessage('Настройки применены', 'success');
    }
    
    debugToggle.onclick = onDebugToggle;
    decaySpeedInput.onchange = applySettings;
    decayStepInput.onchange = applySettings;
    actionTimeInput.onchange = applySettings;
    
    // значения по умолчанию
    decaySpeedInput.value = 5;
    decayStepInput.value = 5;
    actionTimeInput.value = 2000;
});