# HTML Template Generator
This Gulp based tool will produce English and German HTML and plain text template files based on abstract templates.

This generator in its original state will produce Microsoft Outlook optimized email templates for workflow notifications (Types: Action required, Escalation, Information).

## I. Where can the Templates be found?
All templates in plain text and HTML and for all notification types in EN and DE can be found in the build/ directory. See the following detailed structure:
- build/ [contains the templates]
    - de/ [contains HTML and plain text templates in German]
    - en/ [contains HTML and plain text templates in English]

## II. Development and Generation of Templates
### II.1 Installation
To modify and generate templates, it is needed to install npm on the development machine: https://www.npmjs.com/

After successful installation, install gulp globally on the development machine

    $ npm install --global gulp-cli

Then install the dependencies for this project (in the root of this project directory) via

    $ npm install

Please check if the following commands are working

    $ npm -v
    $ gulp -v

Now everything is set for developing and generating templates!

### II.2 Modifying the Abstract Template
There are two abstract templates for HTML and plain text. Both templates use the same wildcards for
* Data Replacement (f.e. salutation)
* Section Replacement (f.e. Direct Actions section)

#### II.2.1 Modifying of Data Replacement Wildcards
To add a new wildcard, follow these steps:
1. Add a new wildcard with '@TEST@' scheme in the plain text and HTML abstract file in src/ dir
2. Add the wildcard element name ('TEST' in this example) to the abstract JSON element in the gulpfile.js
3. Add the wildcard element and its values (String) to the JSON file in the gulpfile.js for all languages and template types
4. Test if the replacement works

#### II.2.2 Modifying of Section Replacement Wildcards
To add a new wildcard, follow these steps:
1. Add two new wildcards with '< !--@START@SECTION_TEST@@-->' and < !--@END@SECTION_TEST@@--> scheme (HTML comments) in the plain text and HTML abstract file in src/ dir
2. Add the wildcard element name ('SECTION_TEST' in this example) to the abstract JSON element in the gulpfile.js
3. Add the wildcard element and its values (Boolean) to the JSON file in the gulpfile.js for all languages and template types
4. Test if the replacement works

### II.3 Generation of Templates
To generate all template files in all languages in plain text and HTML, execute the following commands

    $ gulp generate

The generated files can be found in the build/ directory.