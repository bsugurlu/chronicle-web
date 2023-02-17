// @flow

const SURVEY_INSTRUCTION_TEXT = 'Thank you for taking the time to complete this survey! Below, you will'
+ ' find a list of apps that were used on this device today. Under each app, there will be a series of'
+ ' buttons you can click (you can click more than one) describing who in your family used that app today.'
+ ' Please answer these prompts to the best of your ability.'
+ ' For example, if you and your child both watched YouTube separately,'
+ ' you would click “Parent Alone” and “Child Alone.” If you both used this app together,'
+ ' as well as separately, you would click “Parent Alone,” “Child Alone,” and “Parent and Child Together.”';

const SELECT_CHILD_APPS = 'selectChildApps';
const SELECT_SHARED_APPS = 'selectSharedApps';
const RESOLVE_SHARED_APPS = 'resolveSharedApps';
const RESOLVE_OTHER_APPS = 'resolveOtherApps';
const INTRO = 'intro';

const SURVEY_STEPS = {
  INTRO,
  RESOLVE_OTHER_APPS,
  RESOLVE_SHARED_APPS,
  SELECT_CHILD_APPS,
  SELECT_SHARED_APPS,
};
export {
  SURVEY_INSTRUCTION_TEXT,
  SURVEY_STEPS
};
