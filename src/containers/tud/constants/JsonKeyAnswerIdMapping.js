// @flow

import {
  ACTIVITY_NAME,
  ADULT_MEDIA,
  BG_AUDIO_DAY,
  BG_AUDIO_NIGHT,
  BG_TV_DAY,
  CAREGIVER,
  CLOCK_FORMAT,
  DAY_OF_WEEK,
  NON_TYPICAL_DAY_REASON,
  NON_TYPICAL_SLEEP_PATTERN,
  PRIMARY_BOOK_TYPE,
  PRIMARY_MEDIA_ACTIVITY,
  PRIMARY_MEDIA_AGE,
  SLEEP_ARRANGEMENT,
  TYPICAL_DAY_FLAG,
  WAKE_UP_COUNT,
} from '../../../common/constants';
import TranslationKeys from './TranslationKeys';

export default {
  [TranslationKeys.ADULT_MEDIA]: ADULT_MEDIA,
  [TranslationKeys.BG_AUDIO_DAY]: BG_AUDIO_DAY,
  [TranslationKeys.BG_AUDIO_NIGHT]: BG_AUDIO_NIGHT,
  [TranslationKeys.BG_MEDIA_OPTIONS]: BG_TV_DAY,
  [TranslationKeys.BOOK_TYPE_OPTIONS]: PRIMARY_BOOK_TYPE,
  [TranslationKeys.CAREGIVER_OPTIONS]: CAREGIVER,
  [TranslationKeys.CLOCK_FORMATS]: CLOCK_FORMAT,
  [TranslationKeys.MEDIA_ACTIVITY_OPTIONS]: PRIMARY_MEDIA_ACTIVITY,
  [TranslationKeys.MEDIA_AGE_OPTIONS]: PRIMARY_MEDIA_AGE,
  [TranslationKeys.NON_TYPICAL_DAY_REASONS]: NON_TYPICAL_DAY_REASON,
  [TranslationKeys.NON_TYPICAL_SLEEP_OPTIONS]: NON_TYPICAL_SLEEP_PATTERN,
  [TranslationKeys.PRIMARY_ACTIVITIES]: ACTIVITY_NAME,
  [TranslationKeys.SLEEP_ARRANGEMENT_OPTIONS]: SLEEP_ARRANGEMENT,
  [TranslationKeys.TYPICAL_DAY_CHOICES]: TYPICAL_DAY_FLAG,
  [TranslationKeys.WAKE_UP_COUNT_OPTIONS]: WAKE_UP_COUNT,
  [TranslationKeys.WEEKDAY_OPTIONS]: DAY_OF_WEEK,
};
