const textToTranslate = document.querySelector('#textToTranslate');
const translatedText = document.querySelector('#translatedText');
const ddlFromLanguages = document.querySelector('#ddlFromLanguages');
const ddlToLanguages = document.querySelector('#ddlToLanguages');
const listenFromLanguage = document.querySelector('#listenFromLanguage');
const listenToLanguage = document.querySelector('#listenToLanguage');
const voiceInput = document.querySelector('#speak');


const languages = [
    { language: 'af', name: 'Afrikaans' },
    { language: 'ar', name: 'Arabic' },
    { language: 'az', name: 'Azerbaijani' },
    { language: 'ba', name: 'Bashkir' },
    { language: 'be', name: 'Belarusian' },
    { language: 'bg', name: 'Bulgarian' },
    { language: 'bn', name: 'Bengali' },
    { language: 'bs', name: 'Bosnian' },
    { language: 'ca', name: 'Catalan' },
    { language: 'cs', name: 'Czech' },
    { language: 'cv', name: 'Chuvash' },
    { language: 'da', name: 'Danish' },
    { language: 'de', name: 'German' },
    { language: 'el', name: 'Greek' },
    { language: 'en', name: 'English' },
    { language: 'eo', name: 'Esperanto' },
    { language: 'es', name: 'Spanish' },
    { language: 'et', name: 'Estonian' },
    { language: 'eu', name: 'Basque' },
    { language: 'fa', name: 'Persian' },
    { language: 'fi', name: 'Finnish' },
    { language: 'fr', name: 'French' },
    { language: 'gu', name: 'Gujarati' },
    { language: 'he', name: 'Hebrew' },
    { language: 'hi', name: 'Hindi' },
    { language: 'ht', name: 'Haitian' },
    { language: 'hu', name: 'Hungarian' },
    { language: 'hy', name: 'Armenian' },
    { language: 'id', name: 'Indonesian' },
    { language: 'is', name: 'Icelandic' },
    { language: 'it', name: 'Italian' },
    { language: 'ja', name: 'Japanese' },
    { language: 'ka', name: 'Georgian' },
    { language: 'kk', name: 'Kazakh' },
    { language: 'km', name: 'Central Khmer' },
    { language: 'ko', name: 'Korean' },
    { language: 'ku', name: 'Kurdish' },
    { language: 'ky', name: 'Kirghiz' },
    { language: 'lt', name: 'Lithuanian' },
    { language: 'lv', name: 'Latvian' },
    { language: 'ml', name: 'Malayalam' },
    { language: 'mn', name: 'Mongolian' },
    { language: 'nb', name: 'Norwegian Bokmal' },
    { language: 'nl', name: 'Dutch' },
    { language: 'nn', name: 'Norwegian Nynorsk' },
    { language: 'pa', name: 'Panjabi' },
    { language: 'pl', name: 'Polish' },
    { language: 'ps', name: 'Pushto' },
    { language: 'pt', name: 'Portuguese' },
    { language: 'ro', name: 'Romanian' },
    { language: 'ru', name: 'Russian' },
    { language: 'sk', name: 'Slovakian' },
    { language: 'so', name: 'Somali' },
    { language: 'sq', name: 'Albanian' },
    { language: 'sv', name: 'Swedish' },
    { language: 'ta', name: 'Tamil' },
    { language: 'te', name: 'Telugu' },
    { language: 'tr', name: 'Turkish' },
    { language: 'uk', name: 'Ukrainian' },
    { language: 'ur', name: 'Urdu' },
    { language: 'vi', name: 'Vietnamese' },
    { language: 'zh', name: 'Simplified Chinese' },
    { language: 'zh-TW', name: 'Traditional Chinese' }
]
const availableTranslations = [
    'en-tr',
    'en-he',
    'en-da',
    'ca-es',
    'es-en',
    'en-hi',
    'en-de',
    'en-pt',
    'en-zh-TW',
    'nl-en',
    'fr-de',
    'en-hu',
    'de-fr',
    'zh-TW-en',
    'ja-en',
    'zh-en',
    'en-el',
    'es-fr',
    'en-it',
    'en-es',
    'en-zh',
    'da-en',
    'en-ar',
    'en-nb',
    'es-ca',
    'fr-en',
    'de-it',
    'nb-en',
    'de-en',
    'en-ja',
    'fr-es',
    'en-nl',
    'en-fi',
    'en-ru',
    'ko-en',
    'en-fr',
    'it-en',
    'fi-en',
    'tr-en',
    'pl-en',
    'en-ko',
    'hu-en',
    'en-sv',
    'cs-en',
    'ru-en',
    'pt-en',
    'ar-en',
    'el-en',
    'he-en',
    'en-cs',
    'sv-en',
    'hi-en',
    'en-pl',
    'it-de'
];

document.addEventListener('DOMContentLoaded', fillDropdownListWithLanguages);
ddlFromLanguages.addEventListener('change', fillDropdownListToLanguage);
ddlToLanguages.addEventListener('change', onChange);
textToTranslate.addEventListener('keyup', onKeyUp);
textToTranslate.addEventListener('keydown', onKeyDown);
voiceInput.addEventListener('click', speak);
listenFromLanguage.addEventListener('click', () => listen(textToTranslate.value, ddlFromLanguages.options[ddlFromLanguages.selectedIndex].value));
listenToLanguage.addEventListener('click', () => listen(translatedText.value, ddlToLanguages.options[ddlToLanguages.selectedIndex].value));

async function translate(text, fromLanguage, toLanguage) {
    const uri = 'http://localhost:3000/translate';
    const myInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fromLanguage, toLanguage })
    };

    const response = await fetch(uri, myInit);
    const data = await response.json();
    translatedText.innerText = data.translations[0].translation;
}

async function identify(text) {
    const uri = 'http://localhost:3000/identify';
    const myInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    };

    const response = await fetch(uri, myInit);
    const data = await response.json();
    identifyLanguage(data);
}

async function identifyLanguage(data) {
    await resetDropdownList();

    languages.forEach((value, index) => {
        if (data.languages[0].language == languages[index].language) {
            ddlFromLanguages.options[index + 1].setAttribute('selected', true);
        }
    });

    fillDropdownListToLanguage();
}

async function onKeyUp() {
    // if (len == 50) textToTranslate.classList.add('txa-x-large');
    // else if (len == 96) textToTranslate.classList.add('txa-larger');
    // else if (len > 172) textToTranslate.classList.add('txa-large');

    if (textToTranslate.value && ddlFromLanguages.options[ddlFromLanguages.selectedIndex].value == 'detect' || ddlFromLanguages.options[ddlFromLanguages.selectedIndex].text == 'Detecting language...') {
        ddlFromLanguages.options[0].text = 'Detecting language...';
        await identify(textToTranslate.value);
        await translate(textToTranslate.value, ddlFromLanguages.value, ddlToLanguages.value);
    } else
        await translate(textToTranslate.value, ddlFromLanguages.value, ddlToLanguages.value);
}

function resetDropdownList() {
    for (let option = 0; option < ddlFromLanguages.length; option++)
        ddlFromLanguages.options[option].removeAttribute('selected');
}

function clearDropdownList() {
    ddlToLanguages.innerHTML = null;
}

function sortAvailableTranslations() {
    availableTranslations.sort();
}

function onKeyDown() {
    resetDropdownList();
    ddlFromLanguages.options[0].text = 'Choose a Language';
    fillDropdownListToLanguage();
    translatedText.textContent = '';
}

function onChange() {
    if (textToTranslate.value)
        translate(textToTranslate.value, ddlFromLanguages.value, ddlToLanguages.value);
    else
        translatedText.textContent = '';
}

function createOption(nameToAppend, parentElementToAppend, attributeName, attributeValue) {
    let option = document.createElement('option');
    option.setAttribute(attributeName, attributeValue);
    option.append(nameToAppend);
    parentElementToAppend.appendChild(option);
}

function fillDropdownListWithLanguages() {
    for (const language of languages)
        createOption(language.name, ddlFromLanguages, 'value', language.language);
}

function fillDropdownListToLanguage() {
    clearDropdownList();
    sortAvailableTranslations();

    for (let languageToTranslation = 0; languageToTranslation < availableTranslations.length; languageToTranslation++) {
        const target = availableTranslations[languageToTranslation].replace(/\-/, ';').split(';');

        for (let availableLanguages = 0; availableLanguages < languages.length; availableLanguages++) {
            if (target[0] == ddlFromLanguages.value && target[1] === languages[availableLanguages].language)
                createOption(languages[availableLanguages].name, ddlToLanguages, 'value', target[1]);
        }
    }

    if (ddlToLanguages.innerHTML == '')
        createOption('No languages available', ddlToLanguages, 'selected', true);
}

function listen(text, lang) {
    const msg = new SpeechSynthesisUtterance();
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.text = text;
    msg.lang = lang;
    speechSynthesis.speak(msg);
}

function speak() {
    const recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = ddlFromLanguages.options[ddlFromLanguages.selectedIndex].value;
    recognition.start();
    // This event happens when you talk in the microphone
    recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                // Here you can get the string of what you told
                const content = event.results[i][0].transcript.trim();
                textToTranslate.textContent = content;
                onKeyUp();
            }
        }
    }
}