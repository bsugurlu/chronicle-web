// @flow

import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import matchAll from 'match-all';
import set from 'lodash/set';

import Translations from './translations';

import SupportedLanguages from '../../containers/tud/constants/SupportedLanguages';
import TranslationKeys from '../../containers/tud/constants/TranslationKeys';

const getArrayValueSizes = (obj :Object) => {
  const sizes = {};
  Object.entries(obj).forEach(([key, val]) => {
    if (isArray(val)) {
      set(sizes, key, val.length);
    }
  });
  return sizes;
};

const getInterpolationValues = (obj :Object) => {
  const lookup = {};
  const regexp = /\{\{(.*?)\}\}/g;

  Object.entries(obj).forEach(([key :string, value :string | Array | Object]) => {
    if (typeof value === 'string') {
      // 2022-10-14 - CHRONICLE-84 - activityDay english-only for now
      const matches = matchAll(value, regexp).toArray().filter((i) => i !== 'activityDay');
      lookup[key] = matches;
    }
  });

  return lookup;
};

describe('Translation files structure', () => {
  test('translation files should include all supported languages', () => {
    const languages = Object.keys(Translations);
    SupportedLanguages.forEach((lng) => {
      expect(languages).toContain(lng.code);
    });
  });

  test('translation values of type array should be match default size', () => {
    const { en, ...others } = Translations;
    const enSizes = getArrayValueSizes(en);

    Object.values(others).forEach((lng :Object) => {
      const testSizes = getArrayValueSizes(lng);
      expect(testSizes).toStrictEqual(enSizes);
    });
  });

  test('translation files should contain all keys in default language file', () => {
    const { en, ...others } = Translations;
    const engKeys = Object.keys(en);

    Object.values(others).forEach((lng :Object) => {
      expect(engKeys).toStrictEqual(Object.keys(lng));
    });
  });

  // special case: primary_activities is a nested object
  test('primary activities should be a plain object', () => {
    const { en, ...others } = Translations;
    const primaryActivities = en.primary_activities;
    expect(primaryActivities).toBeDefined();
    expect(isPlainObject(en.primary_activities)).toBeTruthy();

    // verify structure
    const keys = Object.keys(primaryActivities);
    Object.values(others).forEach((lng :Object) => {
      const testActivities = lng.primary_activities;
      expect(testActivities).toBeDefined();
      expect(isPlainObject(testActivities)).toBeTruthy();
      expect(Object.keys(testActivities)).toStrictEqual(keys);
    });
  });

  test('all keys in translation files should be defined in KeyMap', () => {
    const translationKeys = Object.values(TranslationKeys);

    Object.values(Translations).forEach((lng :Object) => {
      Object.keys(lng).forEach((key) => {
        expect(translationKeys).toContain(key);
      });
    });
  });

  test('should not modify interpolation values', () => {
    const { en, ...others } = Translations;

    const englishInterpolation = getInterpolationValues(en);

    Object.values(others).forEach((lng :Object) => {
      expect(getInterpolationValues(lng)).toStrictEqual(englishInterpolation);
    });
  });
});
