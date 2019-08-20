const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('./public'));

const languageTranslator = new LanguageTranslatorV3({
    iam_apikey: process.env.API_KEY,
    url: process.env.URL,
    version: process.env.VERSION
});

app.post('/translate', (req, res) => {
    const { text, fromLanguage, toLanguage } = req.body;

    const params = {
        text: text,
        source: fromLanguage,
        target: toLanguage
    };

    languageTranslator.translate(params, (err, response) => {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        } else {
            res.json(response);
        }
    });
});

app.post('/identify', (req, res) => {
    const { text } = req.body;
    const params = { text: text };

    languageTranslator.identify(params, (err, response) => {
        if (err) {
            console.error(err);
            res.status(500).json(err);
        } else {
            res.json(response);
        }
    });
})

app.listen(3000, () => console.log(`Running`));