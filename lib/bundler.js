const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

async function getFileContent (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), (err, content) => {
      if (err) return reject(err);
      resolve(content);
    });
  });
}

function parseContent (content) {
  content = content.toString('utf8');
  try {
    return JSON.parse(content);
  } catch (e) {
    return YAML.safeLoad(content);
  }
}

async function dereference (json) {
  return RefParser.dereference(json, {
    dereference: {
      circular: 'ignore'
    }
  });
}

async function bundle (json) {
  return RefParser.bundle(json, {
    dereference: {
      circular: 'ignore'
    }
  });
}

async function bundler (filePath) {
  let content, parsedContent, dereferencedJSON, bundledJSON;

  try {
    content = await getFileContent(filePath);
  } catch (e) {
    console.error('Can not load the content of the Swagger specification file');
    console.error(e);
    return;
  }

  try {
    parsedContent = parseContent(content);
  } catch (e) {
    console.error('Can not parse the content of the Swagger specification file');
    console.error(e);
    return;
  }

  try {
    dereferencedJSON = await dereference(parsedContent);
  } catch (e) {
    console.error('Can not dereference the JSON obtained from the content of the Swagger specification file');
    console.error(e);
    return;
  }

  try {
    bundledJSON = await bundle(dereferencedJSON);
  } catch (e) {
    console.error('Can not bundle the JSON obtained from the content of the Swagger specification file');
    console.error(e);
    return;
  }

  return JSON.parse(JSON.stringify(bundledJSON));
}

module.exports = bundler;
