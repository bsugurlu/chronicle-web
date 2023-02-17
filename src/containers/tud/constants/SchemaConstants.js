// @flow

const PRIMARY_ACTIVITIES = {
  CHILDCARE: 'Attending school/childcare',
  NAPPING: 'Napping/sleeping',
  EATING_DRINKING: 'Eating/drinking',
  MEDIA_USE: 'Using screen media (videos, apps, chat, etc.)',
  READING: 'Reading or listening to a story (paper book, eBook, audiobook, etc.)',
  PLAYING_INDOORS: 'Playing indoors',
  PLAYING_OUTDOORS: 'Playing outdoors',
  GROOMING: 'Bathroom/grooming',
  OTHER: 'Doing other activities at home (cooking, chores, etc.)',
  OUTDOORS: 'Doing activities out of the house (errands, traveling, etc.)',
};

const MEDIA_ACTIVITY_CATEGORIES = [
  'Watched video content (TV, movie, YouTube, etc.)',
  'Played games (app, console game, etc.)',
  'Video chat (Facetime, Zoom, etc.)',
  'Communicated with others in another way (talked on phone, helped to write a text message, etc.)',
  'Created content (recorded video, took photographs, etc.)',
  'Looked up information on the internet'
];

const BG_MEDIA_OPTIONS = [
  'No',
  'Yes, some of the time',
  'Yes, half of the time',
  'Yes, most of the time',
  'Yes, the entire time',
  'Don\'t know'
];

const CAREGIVERS = [
  'A parent or parental figure',
  'A grandparent',
  'Another adult',
  'A sibling',
  'Another child',
];

const ADULT_MEDIA_USAGE_OPTIONS = [
  'None of the time',
  'Some of the time',
  'Half of the time',
  'Most of the time',
  'The entire time'
];

const NON_TYPICAL_SLEEP_REASONS = [
  'My child was sick',
  'We were traveling',
  'We had visitors'
];

const SLEEP_ARRANGEMENT_OPTIONS = [
  'Crib/cot/bed in their own, separate room (not shared with others)',
  'Crib/cot/bed in a parent\'s room',
  'Crib/cot/bed in a shared room with a sibling',
  'Co-sleeping in a parent\'s bed',
  'Co-sleeping in a sibling\'s bed'
];

const WAKE_UP_COUNT_OPTIONS = [
  'Didn\'t wake up',
  '1 time',
  '2 times',
  '3 times',
  '4 times',
  '5 or more times',
  'Don\'t know'
];

const BOOK_TYPES = [
  'Printed book (paper, cardboard, etc.)',
  'Electronic book (eBook)',
  'Audiobook'
];

const MEDIA_AGE_OPTIONS = [
  "Child's age",
  'Older children',
  'Younger children',
  'Adults',
  "Don't know"
];

const NON_TYPICAL_DAY_REASONS = [
  'My child was sick.',
  'School/childcare was closed.',
  'The weather was bad and we could not go outside.',
  'We were traveling.',
  'We had visitors.'
];

export {
  ADULT_MEDIA_USAGE_OPTIONS,
  BG_MEDIA_OPTIONS,
  BOOK_TYPES,
  CAREGIVERS,
  MEDIA_ACTIVITY_CATEGORIES,
  MEDIA_AGE_OPTIONS,
  NON_TYPICAL_DAY_REASONS,
  NON_TYPICAL_SLEEP_REASONS,
  PRIMARY_ACTIVITIES,
  SLEEP_ARRANGEMENT_OPTIONS,
  WAKE_UP_COUNT_OPTIONS,
};
