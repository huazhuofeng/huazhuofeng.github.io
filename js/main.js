import { learningData, categoryNames } from './data.js';
import { applyPopAnimation, createStars } from './animations.js';

const state = {
    currentCategory: 'animals',
    currentIndex: 0,
    currentData: learningData.animals
};

let wordDisplay;
let imageDisplay;
let speechText;
let soundBtn;
let nextBtn;
let animalsBtn;
let fruitsBtn;
let colorsBtn;

function cacheElements() {
    wordDisplay = document.getElementById('word-display');
    imageDisplay = document.getElementById('image-display');
    speechText = document.getElementById('speech-text');
    soundBtn = document.getElementById('sound-btn');
    nextBtn = document.getElementById('next-btn');
    animalsBtn = document.getElementById('animals-btn');
    fruitsBtn = document.getElementById('fruits-btn');
    colorsBtn = document.getElementById('colors-btn');
}

function updateSpeechMessage(message) {
    if (speechText) {
        speechText.textContent = message;
    }
}

function updateDisplay() {
    const item = state.currentData[state.currentIndex];

    if (!wordDisplay || !imageDisplay || !item) {
        return;
    }

    wordDisplay.textContent = item.word;
    wordDisplay.style.color = item.color;
    imageDisplay.innerHTML = '';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'word-image';

    const icon = document.createElement('i');
    icon.className = `fas ${item.icon}`;
    icon.style.fontSize = '8rem';
    icon.style.color = item.color;
    iconWrapper.appendChild(icon);

    if (item.emoji) {
        const emoji = document.createElement('span');
        emoji.className = 'emoji-fallback';
        emoji.textContent = item.emoji;
        emoji.style.fontSize = '3.5rem';
        emoji.style.color = item.color;
        iconWrapper.appendChild(emoji);
    }

    imageDisplay.appendChild(iconWrapper);
    imageDisplay.style.borderColor = item.color;
}

function switchCategory(category) {
    if (state.currentCategory === category) {
        return;
    }

    state.currentCategory = category;
    state.currentIndex = 0;
    state.currentData = learningData[category];
    updateDisplay();

    updateSpeechMessage(`我们来学习${categoryNames[category]}单词吧！`);
    applyPopAnimation(wordDisplay, imageDisplay);
}

function playSound() {
    const item = state.currentData[state.currentIndex];

    if (!item) {
        return;
    }

    applyPopAnimation(soundBtn, imageDisplay);
    updateSpeechMessage(`这是 ${item.word}！`);

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(item.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

function nextItem() {
    state.currentIndex = (state.currentIndex + 1) % state.currentData.length;
    updateDisplay();
    applyPopAnimation(nextBtn, wordDisplay);
    updateSpeechMessage("点击喇叭听发音！");
}

function bindEvents() {
    if (animalsBtn) {
        animalsBtn.addEventListener('click', () => switchCategory('animals'));
    }

    if (fruitsBtn) {
        fruitsBtn.addEventListener('click', () => switchCategory('fruits'));
    }

    if (colorsBtn) {
        colorsBtn.addEventListener('click', () => switchCategory('colors'));
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', playSound);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextItem);
    }

    if (imageDisplay) {
        imageDisplay.addEventListener('click', playSound);
    }
}

function init() {
    cacheElements();
    createStars();
    bindEvents();
    updateDisplay();
    updateSpeechMessage("点击喇叭听发音！");
}

document.addEventListener('DOMContentLoaded', init);

