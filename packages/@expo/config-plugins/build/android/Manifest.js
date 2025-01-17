"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMetaDataItemToMainApplication = addMetaDataItemToMainApplication;
exports.addUsesLibraryItemToMainApplication = addUsesLibraryItemToMainApplication;
exports.ensureToolsAvailable = ensureToolsAvailable;
exports.findMetaDataItem = findMetaDataItem;
exports.findUsesLibraryItem = findUsesLibraryItem;
exports.getMainActivity = getMainActivity;
exports.getMainActivityOrThrow = getMainActivityOrThrow;
exports.getMainApplication = getMainApplication;
exports.getMainApplicationMetaDataValue = getMainApplicationMetaDataValue;
exports.getMainApplicationOrThrow = getMainApplicationOrThrow;
exports.getRunnableActivity = getRunnableActivity;
exports.prefixAndroidKeys = prefixAndroidKeys;
exports.readAndroidManifestAsync = readAndroidManifestAsync;
exports.removeMetaDataItemFromMainApplication = removeMetaDataItemFromMainApplication;
exports.removeUsesLibraryItemFromMainApplication = removeUsesLibraryItemFromMainApplication;
exports.writeAndroidManifestAsync = writeAndroidManifestAsync;
function _assert() {
  const data = _interopRequireDefault(require("assert"));
  _assert = function () {
    return data;
  };
  return data;
}
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function () {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function () {
    return data;
  };
  return data;
}
function XML() {
  const data = _interopRequireWildcard(require("../utils/XML"));
  XML = function () {
    return data;
  };
  return data;
}
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
async function writeAndroidManifestAsync(manifestPath, androidManifest) {
  const manifestXml = XML().format(androidManifest);
  await _fs().default.promises.mkdir(_path().default.dirname(manifestPath), {
    recursive: true
  });
  await _fs().default.promises.writeFile(manifestPath, manifestXml);
}
async function readAndroidManifestAsync(manifestPath) {
  const xml = await XML().readXMLAsync({
    path: manifestPath
  });
  if (!isManifest(xml)) {
    throw new Error('Invalid manifest found at: ' + manifestPath);
  }
  return xml;
}
function isManifest(xml) {
  // TODO: Maybe more validation
  return !!xml.manifest;
}

/** Returns the `manifest.application` tag ending in `.MainApplication` */
function getMainApplication(androidManifest) {
  var _androidManifest$mani, _androidManifest$mani2;
  return (_androidManifest$mani = androidManifest === null || androidManifest === void 0 || (_androidManifest$mani2 = androidManifest.manifest) === null || _androidManifest$mani2 === void 0 || (_androidManifest$mani2 = _androidManifest$mani2.application) === null || _androidManifest$mani2 === void 0 ? void 0 : _androidManifest$mani2.filter(e => {
    var _e$$;
    return e === null || e === void 0 || (_e$$ = e.$) === null || _e$$ === void 0 ? void 0 : _e$$['android:name'].endsWith('.MainApplication');
  })[0]) !== null && _androidManifest$mani !== void 0 ? _androidManifest$mani : null;
}
function getMainApplicationOrThrow(androidManifest) {
  const mainApplication = getMainApplication(androidManifest);
  (0, _assert().default)(mainApplication, 'AndroidManifest.xml is missing the required MainApplication element');
  return mainApplication;
}
function getMainActivityOrThrow(androidManifest) {
  const mainActivity = getMainActivity(androidManifest);
  (0, _assert().default)(mainActivity, 'AndroidManifest.xml is missing the required MainActivity element');
  return mainActivity;
}
function getRunnableActivity(androidManifest) {
  var _androidManifest$mani3, _androidManifest$mani4;
  // Get enabled activities
  const enabledActivities = androidManifest === null || androidManifest === void 0 || (_androidManifest$mani3 = androidManifest.manifest) === null || _androidManifest$mani3 === void 0 || (_androidManifest$mani3 = _androidManifest$mani3.application) === null || _androidManifest$mani3 === void 0 || (_androidManifest$mani3 = _androidManifest$mani3[0]) === null || _androidManifest$mani3 === void 0 || (_androidManifest$mani3 = _androidManifest$mani3.activity) === null || _androidManifest$mani3 === void 0 || (_androidManifest$mani4 = _androidManifest$mani3.filter) === null || _androidManifest$mani4 === void 0 ? void 0 : _androidManifest$mani4.call(_androidManifest$mani3, e => e.$['android:enabled'] !== 'false' && e.$['android:enabled'] !== false);
  if (!enabledActivities) {
    return null;
  }

  // Get the activity that has a runnable intent-filter
  for (const activity of enabledActivities) {
    if (Array.isArray(activity['intent-filter'])) {
      for (const intentFilter of activity['intent-filter']) {
        var _intentFilter$action, _intentFilter$categor;
        if ((_intentFilter$action = intentFilter.action) !== null && _intentFilter$action !== void 0 && _intentFilter$action.find(action => action.$['android:name'] === 'android.intent.action.MAIN') && (_intentFilter$categor = intentFilter.category) !== null && _intentFilter$categor !== void 0 && _intentFilter$categor.find(category => category.$['android:name'] === 'android.intent.category.LAUNCHER')) {
          return activity;
        }
      }
    }
  }
  return null;
}
function getMainActivity(androidManifest) {
  var _androidManifest$mani5, _androidManifest$mani6, _mainActivity$;
  const mainActivity = androidManifest === null || androidManifest === void 0 || (_androidManifest$mani5 = androidManifest.manifest) === null || _androidManifest$mani5 === void 0 || (_androidManifest$mani5 = _androidManifest$mani5.application) === null || _androidManifest$mani5 === void 0 || (_androidManifest$mani5 = _androidManifest$mani5[0]) === null || _androidManifest$mani5 === void 0 || (_androidManifest$mani5 = _androidManifest$mani5.activity) === null || _androidManifest$mani5 === void 0 || (_androidManifest$mani6 = _androidManifest$mani5.filter) === null || _androidManifest$mani6 === void 0 ? void 0 : _androidManifest$mani6.call(_androidManifest$mani5, e => e.$['android:name'] === '.MainActivity');
  return (_mainActivity$ = mainActivity === null || mainActivity === void 0 ? void 0 : mainActivity[0]) !== null && _mainActivity$ !== void 0 ? _mainActivity$ : null;
}
function addMetaDataItemToMainApplication(mainApplication, itemName, itemValue, itemType = 'value') {
  let existingMetaDataItem;
  const newItem = {
    $: prefixAndroidKeys({
      name: itemName,
      [itemType]: itemValue
    })
  };
  if (mainApplication['meta-data']) {
    existingMetaDataItem = mainApplication['meta-data'].filter(e => e.$['android:name'] === itemName);
    if (existingMetaDataItem.length) {
      existingMetaDataItem[0].$[`android:${itemType}`] = itemValue;
    } else {
      mainApplication['meta-data'].push(newItem);
    }
  } else {
    mainApplication['meta-data'] = [newItem];
  }
  return mainApplication;
}
function removeMetaDataItemFromMainApplication(mainApplication, itemName) {
  const index = findMetaDataItem(mainApplication, itemName);
  if (mainApplication !== null && mainApplication !== void 0 && mainApplication['meta-data'] && index > -1) {
    mainApplication['meta-data'].splice(index, 1);
  }
  return mainApplication;
}
function findApplicationSubItem(mainApplication, category, itemName) {
  const parent = mainApplication[category];
  if (Array.isArray(parent)) {
    const index = parent.findIndex(e => e.$['android:name'] === itemName);
    return index;
  }
  return -1;
}
function findMetaDataItem(mainApplication, itemName) {
  return findApplicationSubItem(mainApplication, 'meta-data', itemName);
}
function findUsesLibraryItem(mainApplication, itemName) {
  return findApplicationSubItem(mainApplication, 'uses-library', itemName);
}
function getMainApplicationMetaDataValue(androidManifest, name) {
  const mainApplication = getMainApplication(androidManifest);
  if (mainApplication !== null && mainApplication !== void 0 && mainApplication.hasOwnProperty('meta-data')) {
    var _mainApplication$meta, _item$$$androidValue;
    const item = mainApplication === null || mainApplication === void 0 || (_mainApplication$meta = mainApplication['meta-data']) === null || _mainApplication$meta === void 0 ? void 0 : _mainApplication$meta.find(e => e.$['android:name'] === name);
    return (_item$$$androidValue = item === null || item === void 0 ? void 0 : item.$['android:value']) !== null && _item$$$androidValue !== void 0 ? _item$$$androidValue : null;
  }
  return null;
}
function addUsesLibraryItemToMainApplication(mainApplication, item) {
  let existingMetaDataItem;
  const newItem = {
    $: prefixAndroidKeys(item)
  };
  if (mainApplication['uses-library']) {
    existingMetaDataItem = mainApplication['uses-library'].filter(e => e.$['android:name'] === item.name);
    if (existingMetaDataItem.length) {
      existingMetaDataItem[0].$ = newItem.$;
    } else {
      mainApplication['uses-library'].push(newItem);
    }
  } else {
    mainApplication['uses-library'] = [newItem];
  }
  return mainApplication;
}
function removeUsesLibraryItemFromMainApplication(mainApplication, itemName) {
  const index = findUsesLibraryItem(mainApplication, itemName);
  if (mainApplication !== null && mainApplication !== void 0 && mainApplication['uses-library'] && index > -1) {
    mainApplication['uses-library'].splice(index, 1);
  }
  return mainApplication;
}
function prefixAndroidKeys(head) {
  // prefix all keys with `android:`
  return Object.entries(head).reduce((prev, [key, curr]) => ({
    ...prev,
    [`android:${key}`]: curr
  }), {});
}

/**
 * Ensure the `tools:*` namespace is available in the manifest.
 *
 * @param manifest AndroidManifest.xml
 * @returns manifest with the `tools:*` namespace available
 */
function ensureToolsAvailable(manifest) {
  return ensureManifestHasNamespace(manifest, {
    namespace: 'xmlns:tools',
    url: 'http://schemas.android.com/tools'
  });
}

/**
 * Ensure a particular namespace is available in the manifest.
 *
 * @param manifest `AndroidManifest.xml`
 * @returns manifest with the provided namespace available
 */
function ensureManifestHasNamespace(manifest, {
  namespace,
  url
}) {
  var _manifest$manifest;
  if (manifest !== null && manifest !== void 0 && (_manifest$manifest = manifest.manifest) !== null && _manifest$manifest !== void 0 && (_manifest$manifest = _manifest$manifest.$) !== null && _manifest$manifest !== void 0 && _manifest$manifest[namespace]) {
    return manifest;
  }
  manifest.manifest.$[namespace] = url;
  return manifest;
}
//# sourceMappingURL=Manifest.js.map