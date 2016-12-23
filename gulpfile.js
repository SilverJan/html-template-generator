var gulp = require('gulp');
var runSequence = require('run-sequence');
var replace = require('replace-in-file');
var del = require('del');
var copy = require('copy');
var mv = require('mv');
var read = require('read-file');

// ----------------------------------------------------------
// C O N F I G
// ---------------------------------------------------------- 

/* PATHS */
const src = './src';
const abstractTemplateNameHTML = 'template_abstract.html'
const abstractTemplateNamePlain = 'template_abstract.txt'
const srcFileHTML = `${src}/${abstractTemplateNameHTML}`;
const srcFilePlain = `${src}/${abstractTemplateNamePlain}`;
const buildPath = './build';

/* VARS */
const action = 'action';
const escalation = 'escalation';
const information = 'information';

const values = {
    abstract: {
        content: [
            "TEMPLATE_TYPE",
            "SALUTATION",
            "INTRODUCTION_TEXT",
            "PROCESS",
            "DESCRIPTION",
            "STATUS",
            "STARTED_BY",
            "ID",
            "DETAILS",
            "ACTION_CAN_BE_TAKEN",
            "DIRECT_ACTIONS",
            "APPROVE",
            "DECLINE",
            "USEFUL_LINKS",
            "DO_NOT_REPLY"
        ],
        sections: [
            "SECTION_DETAILS",
            "SECTION_ACTION_CAN_BE_TAKEN",
            "SECTION_DIRECT_ACTIONS"
        ]
    },
    en: {
        [action]: {
            content: {
                "TEMPLATE_TYPE": "Action Required",
                "SALUTATION": "Dear $PRENAME $LASTNAME",
                "INTRODUCTION_TEXT": "A work item is waiting for your approval. Please review and process accordingly.",
                "PROCESS": "Process",
                "DESCRIPTION": "Description",
                "STATUS": "Status",
                "STARTED_BY": "Started By",
                "ID": "ID",
                "DETAILS": "Details",
                "ACTION_CAN_BE_TAKEN": "Action can be taken via",
                "DIRECT_ACTIONS": "Direct Actions",
                "APPROVE": "Approve",
                "DECLINE": "Decline",
                "USEFUL_LINKS": "Useful Links",
                "DO_NOT_REPLY": "Please do not reply to this automatically generated email."
            },
            sections: {
                "SECTION_DETAILS": false,
                "SECTION_ACTION_CAN_BE_TAKEN": true,
                "SECTION_DIRECT_ACTIONS": true
            }
        },
        [escalation]: {
            content: {
                "TEMPLATE_TYPE": "Escalation",
                "SALUTATION": "Dear $PRENAME $LASTNAME",
                "INTRODUCTION_TEXT": "A work item has been overdue for <b>$DAYS_OVERDUE day(s)</b>.",
                "PROCESS": "Process",
                "DESCRIPTION": "Description",
                "STATUS": "Status",
                "STARTED_BY": "Started By",
                "ID": "ID",
                "DETAILS": "Details",
                "ACTION_CAN_BE_TAKEN": "Action can be taken via",
                "DIRECT_ACTIONS": "Direct Actions",
                "APPROVE": "Approve",
                "DECLINE": "Decline",
                "USEFUL_LINKS": "Useful Links",
                "DO_NOT_REPLY": "Please do not reply to this automatically generated email."
            },
            sections: {
                "SECTION_DETAILS": false,
                "SECTION_ACTION_CAN_BE_TAKEN": true,
                "SECTION_DIRECT_ACTIONS": true
            }
        },
        [information]: {
            content: {
                "TEMPLATE_TYPE": "Notification",
                "SALUTATION": "Dear $PRENAME $LASTNAME",
                "INTRODUCTION_TEXT": "A work item has been $LAST_ACTION [f.e. approved, declined, etc.]",
                "PROCESS": "Process",
                "DESCRIPTION": "Description",
                "STATUS": "Status",
                "STARTED_BY": "Started By",
                "ID": "ID",
                "DETAILS": "Details",
                "ACTION_CAN_BE_TAKEN": "Action can be taken via",
                "DIRECT_ACTIONS": "Direct Actions",
                "APPROVE": "Approve",
                "DECLINE": "Decline",
                "USEFUL_LINKS": "Useful Links",
                "DO_NOT_REPLY": "Please do not reply to this automatically generated email."
            },
            sections: {
                "SECTION_DETAILS": true,
                "SECTION_ACTION_CAN_BE_TAKEN": false,
                "SECTION_DIRECT_ACTIONS": false
            }
        }
    },
    de: {
        [action]: {
            content: {
                "TEMPLATE_TYPE": "Aktion erforderlich",
                "SALUTATION": "Sehr geehrte/r Frau/Herr $PRENAME $LASTNAME",
                "INTRODUCTION_TEXT": "eine Arbeitsaufgabe wartet auf Ihre Genehmigung. Bitte &uuml;berpr&uuml;fen Sie die Arbeitsaufgabe schnellstm&ouml;glich.",
                "PROCESS": "Prozess",
                "DESCRIPTION": "Beschreibung",
                "STATUS": "Status",
                "STARTED_BY": "Gestartet durch",
                "ID": "ID",
                "DETAILS": "Details",
                "ACTION_CAN_BE_TAKEN": "Aktion durchf&uuml;hren via",
                "DIRECT_ACTIONS": "Direkte Aktionen",
                "APPROVE": "Genehmigen",
                "DECLINE": "Ablehnen",
                "USEFUL_LINKS": "Hilfreiche Links",
                "DO_NOT_REPLY": "Bitte antworten Sie nicht auf diese automatisch generierte Email."
            },
            sections: {
                "SECTION_DETAILS": false,
                "SECTION_ACTION_CAN_BE_TAKEN": true,
                "SECTION_DIRECT_ACTIONS": true
            }
        },
        [escalation]: {
            content: {
                "TEMPLATE_TYPE": "Eskalation",
                "SALUTATION": "Sehr geehrte/r Frau/Herr $PRENAME $LASTNAME",
                "INTRODUCTION_TEXT": "eine Arbeitsaufgabe ist seit <b>$DAYS_OVERDUE Tag(en)</b> &uuml;berf&auml;llig.",
                "PROCESS": "Prozess",
                "DESCRIPTION": "Beschreibung",
                "STATUS": "Status",
                "STARTED_BY": "Gestartet durch",
                "ID": "ID",
                "DETAILS": "Details",
                "ACTION_CAN_BE_TAKEN": "Aktion durchf&uuml;hren via",
                "DIRECT_ACTIONS": "Direkte Aktionen",
                "APPROVE": "Genehmigen",
                "DECLINE": "Ablehnen",
                "USEFUL_LINKS": "Hilfreiche Links",
                "DO_NOT_REPLY": "Bitte antworten Sie nicht auf diese automatisch generierte Email."
            },
            sections: {
                "SECTION_DETAILS": false,
                "SECTION_ACTION_CAN_BE_TAKEN": true,
                "SECTION_DIRECT_ACTIONS": true
            }
        },
        [information]: {
            content: {
                "TEMPLATE_TYPE": "Benachrichtigung",
                "SALUTATION": "Sehr geehrte/r Frau/Herr $PRENAME $LASTNAME",
                "INTRODUCTION_TEXT": "eine Arbeitsaufgabe wurde $LAST_ACTION [f.e. approved, declined, etc.].",
                "PROCESS": "Prozess",
                "DESCRIPTION": "Beschreibung",
                "STATUS": "Status",
                "STARTED_BY": "Gestartet durch",
                "ID": "ID",
                "DETAILS": "Details",
                "ACTION_CAN_BE_TAKEN": "Aktion durchf&uuml;hren via",
                "DIRECT_ACTIONS": "Direkte Aktionen",
                "APPROVE": "Genehmigen",
                "DECLINE": "Ablehnen",
                "USEFUL_LINKS": "Hilfreiche Links",
                "DO_NOT_REPLY": "Bitte antworten Sie nicht auf diese automatisch generierte Email."
            },
            sections: {
                "SECTION_DETAILS": true,
                "SECTION_ACTION_CAN_BE_TAKEN": false,
                "SECTION_DIRECT_ACTIONS": false
            }
        }
    }
}

// ----------------------------------------------------------
// T A S K S
// ---------------------------------------------------------- 

gulp.task('clean', function () {
    return del(buildPath);
});

gulp.task('generate_en_action_html', function (cb) {
    return generateTemplate('en', action, true);
});

gulp.task('generate_en_escalation_html', function (cb) {
    return generateTemplate('en', escalation, true);
});

gulp.task('generate_en_information_html', function (cb) {
    return generateTemplate('en', information, true);
});

gulp.task('generate_en_action_plain', function (cb) {
    return generateTemplate('en', action, false);
});

gulp.task('generate_en_escalation_plain', function (cb) {
    return generateTemplate('en', escalation, false);
});

gulp.task('generate_en_information_plain', function (cb) {
    return generateTemplate('en', information, false);
});

gulp.task('generate_en', function (cb) {
    runSequence('generate_en_action_html', 'generate_en_escalation_html', 'generate_en_information_html',
        'generate_en_action_plain', 'generate_en_escalation_plain', 'generate_en_information_plain', cb);
});

gulp.task('generate_de_action_html', function (cb) {
    return generateTemplate('de', action, true);
});

gulp.task('generate_de_escalation_html', function (cb) {
    return generateTemplate('de', escalation, true);
});

gulp.task('generate_de_information_html', function (cb) {
    return generateTemplate('de', information, true);
});

gulp.task('generate_de_action_plain', function (cb) {
    return generateTemplate('de', action, false);
});

gulp.task('generate_de_escalation_plain', function (cb) {
    return generateTemplate('de', escalation, false);
});

gulp.task('generate_de_information_plain', function (cb) {
    return generateTemplate('de', information, false);
});

gulp.task('generate_de', function (cb) {
    runSequence('generate_de_action_html', 'generate_de_escalation_html', 'generate_de_information_html',
        'generate_de_action_plain', 'generate_de_escalation_plain', 'generate_de_information_plain', cb);
});

gulp.task('generate', function (cb) {
    runSequence('clean', 'generate_en', 'generate_de', cb);
});

// ----------------------------------------------------------
// U T I L S
// ---------------------------------------------------------- 

/**
 * Copies the abstract template to the build folder, renames it and does the wildcard replacement depending on lang.templateType.
 */
function generateTemplate(lang, templateType, html) {
    if (html) {
        let newFileName = `template_${templateType}_${lang}.html`;
        let newFilePath = `${buildPath}/${lang}/${newFileName}`;
        return new Promise(function (resolve, reject) {
            copy.one(srcFileHTML, buildPath, { flatten: true }, function (err, file) {
                if (err) throw err;
                mv(`${buildPath}/${abstractTemplateNameHTML}`, newFilePath, { mkdirp: true }, function (err) {
                    if (err) throw err;
                    replaceWildcards(lang, templateType, newFilePath);
                    resolve();
                });
            });
        });
    } else {
        let newFileName = `template_${templateType}_${lang}.txt`;
        let newFilePath = `${buildPath}/${lang}/${newFileName}`;
        return new Promise(function (resolve, reject) {
            copy.one(srcFilePlain, buildPath, { flatten: true }, function (err, file) {
                if (err) throw err;
                mv(`${buildPath}/${abstractTemplateNamePlain}`, newFilePath, { mkdirp: true }, function (err) {
                    if (err) throw err;
                    replaceWildcards(lang, templateType, newFilePath);
                    resolve();
                });
            });
        });
    }
}

/**
 * Replaces the wildcards in the given file with the values from lang.templateType.
 * Attention: The file itself will be modified. Never pass the abstract template as an argument!
 */
function replaceWildcards(lang, templateType, file) {
    // content replacement first
    values.abstract.content.forEach(function (content) {
        let newValue = values[lang][templateType].content[content];
        const options = {
            files: file,
            replace: `@${content}@`,
            with: newValue
        }

        try {
            while (fileContainsString(file, `@${content}@`)) {
                let changedFiles = replace.sync(options);
            }
        }
        catch (error) {
            console.error('Error occurred:', error);
        }
    }, this);

    // section replacement second
    values.abstract.sections.forEach(function (section) {
        let keepSection = values[lang][templateType].sections[section];
        let regExpString;
        if (keepSection) {
            regExpString = `(<!--@START@${section}@@-->)|(<!--@END@${section}@@-->)`; // remove the start and end wildcards
        } else {
            regExpString = `<!--@START@${section}@@-->[\\s\\S]*<!--@END@${section}@@-->`; // remove start and end wildcards and inbetween
        }
        let regExp = new RegExp(regExpString, 'g');
        const options = {
            files: file,
            replace: regExp,
            with: ''
        }

        try {
            while (fileContainsRegExp(file, regExp)) {
                let changedFiles = replace.sync(options);
            }
        }
        catch (error) {
            console.error('Error occurred:', error);
        }
    }, this);
}

/**
 * Returns true if the UTF-8 formatted file contains the given String value.
 */
function fileContainsString(file, str) {
    let fileContent = read.sync(file, 'utf8');
    return fileContent.includes(str) ? true : false;
}

/**
 * Returns true if the UTF-8 formatted file contains the given RegExp value.
 */
function fileContainsRegExp(file, regExp) {
    let fileContent = read.sync(file, 'utf8');
    return fileContent.match(regExp) !== null ? true : false;
}