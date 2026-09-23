import { SentenceComposeResponse } from '../types';

const IDIOM_PATTERNS: Record<string, { sentence: string; alternatives: string[] }> = {
  'Hello|Help|Please': {
    sentence: 'Hello, I need help, please.',
    alternatives: ['Hello! Could you please help me?', 'Hello, can someone assist me?'],
  },
  'Hello|I|Help|Please': {
    sentence: 'Hello, I need assistance, please.',
    alternatives: ['Hello, could you please help me?', 'Hello! I am requesting help.'],
  },
  'Water|Please': {
    sentence: 'Could I please have some water?',
    alternatives: ['I would like some water, please.', 'Please give me water.'],
  },
  'Food|Please': {
    sentence: 'Could I please have some food?',
    alternatives: ['I am hungry and need some food, please.', 'Please provide food.'],
  },
  'Help|Please': {
    sentence: 'Please help me.',
    alternatives: ['I urgently need assistance, please.', 'Could you please help me?'],
  },
  'Stop|Please': {
    sentence: 'Please stop / wait a moment.',
    alternatives: ['Could you please stop?', 'Please wait right here.'],
  },
  'I|Water|Please': {
    sentence: 'I would like some water, please.',
    alternatives: ['Could I please have water?', 'I am thirsty and need water.'],
  },
  'I|Food|Please': {
    sentence: 'I would like some food, please.',
    alternatives: ['Could I please have food?', 'I need something to eat, please.'],
  },
  'I|Help|Please': {
    sentence: 'I need help, please.',
    alternatives: ['Could you please help me?', 'I require assistance.'],
  },
  'I|Sorry': {
    sentence: 'I am very sorry.',
    alternatives: ['I apologize sincerely.', 'Please forgive me.'],
  },
  'You|Good|Thank You': {
    sentence: 'You are very kind, thank you!',
    alternatives: ['Thank you, you did great!', 'You are good, thank you!'],
  },
  'You|Help|Please': {
    sentence: 'Could you please help me?',
    alternatives: ['Can you assist me, please?', 'Would you be able to help?'],
  },
  'Yes|Thank You': {
    sentence: 'Yes, thank you very much.',
    alternatives: ['Yes, thank you!', 'Yes, that would be wonderful.'],
  },
  'No|Thank You': {
    sentence: 'No, thank you.',
    alternatives: ['No thank you, I am okay.', 'No thanks.'],
  },
  'Sorry|Thank You': {
    sentence: 'I am sorry, but thank you.',
    alternatives: ['I apologize, and thank you.', 'Sorry for the trouble, thank you.'],
  },
  'OK|Thank You': {
    sentence: 'Everything is okay, thank you.',
    alternatives: ['I am fine, thank you!', 'All good, thank you.'],
  },
  'Food|Water|Please': {
    sentence: 'Could I please have food and water?',
    alternatives: ['I need food and water, please.', 'Please give me food and water.'],
  },
  'Hello|Thank You': {
    sentence: 'Hello, thank you for being here.',
    alternatives: ['Hello and thank you!', 'Greetings, thank you.'],
  },
  'Sorry|Help|Please': {
    sentence: 'Sorry to bother you, could you please help me?',
    alternatives: ['I am sorry, I need help please.', 'Excuse me, could you assist me?'],
  },
  'I Love You|Thank You': {
    sentence: 'I love you, thank you so much!',
    alternatives: ['I love you! Thank you!', 'Sending love and thanks!'],
  },
  'Hello|I Love You': {
    sentence: 'Hello, I love you!',
    alternatives: ['Greetings, I love you!', 'Hello! Sending you love.'],
  },
};

const SINGLE_TOKEN_MAP: Record<string, { sentence: string; alternatives: string[] }> = {
  Hello: { sentence: 'Hello! Welcome.', alternatives: ['Hi there!', 'Greetings!'] },
  'Thank You': { sentence: 'Thank you very much.', alternatives: ['Thanks a lot!', 'Thank you!'] },
  Yes: { sentence: 'Yes, I agree.', alternatives: ['Yes, absolutely.', 'Yes.'] },
  No: { sentence: 'No, thank you.', alternatives: ['No, I decline.', 'No.'] },
  Help: { sentence: 'I need assistance.', alternatives: ['Please help me.', 'Can someone help?'] },
  Please: { sentence: 'Please, if you could.', alternatives: ['Please.', 'Kindly assist.'] },
  Sorry: { sentence: 'I am sorry.', alternatives: ['My apologies.', 'I apologize.'] },
  Water: { sentence: 'I would like some water.', alternatives: ['Water, please.', 'Could I have water?'] },
  Food: { sentence: 'I need food.', alternatives: ['I would like something to eat.', 'Food, please.'] },
  Good: { sentence: 'That is good / well done.', alternatives: ['Very good!', 'Everything is good.'] },
  Stop: { sentence: 'Please stop / wait.', alternatives: ['Stop right there.', 'Hold on a moment.'] },
  I: { sentence: 'I / Me.', alternatives: ['Speaking about myself.', 'I am here.'] },
  You: { sentence: 'You / Yourself.', alternatives: ['Referring to you.', 'You.'] },
  OK: { sentence: 'Everything is okay.', alternatives: ['I am fine.', 'All good.'] },
  'I Love You': { sentence: 'I love you.', alternatives: ['I love you so much!', 'Love you!'] },
};

export function composeSentenceLocally(tokens: string[]): SentenceComposeResponse {
  const cleanTokens = tokens.filter((t) => t && t !== 'Ready' && t !== 'No Hand');

  if (cleanTokens.length === 0) {
    return {
      sentence: 'Position hand and hold sign to form words into a sentence.',
      tokens: [],
      alternatives: [],
      is_question: false,
    };
  }

  if (cleanTokens.length === 1) {
    const single = cleanTokens[0];
    if (SINGLE_TOKEN_MAP[single]) {
      return {
        sentence: SINGLE_TOKEN_MAP[single].sentence,
        tokens: cleanTokens,
        alternatives: SINGLE_TOKEN_MAP[single].alternatives,
        is_question: false,
      };
    }
    return {
      sentence: `${single}.`,
      tokens: cleanTokens,
      alternatives: [],
      is_question: false,
    };
  }

  // Check exact idiom match
  const key = cleanTokens.join('|');
  if (IDIOM_PATTERNS[key]) {
    const match = IDIOM_PATTERNS[key];
    return {
      sentence: match.sentence,
      tokens: cleanTokens,
      alternatives: match.alternatives,
      is_question: match.sentence.endsWith('?'),
    };
  }

  // Dynamic Rule-Based Synthesis
  const hasHello = cleanTokens.includes('Hello');
  const hasPlease = cleanTokens.includes('Please');
  const hasThanks = cleanTokens.includes('Thank You');
  const hasSorry = cleanTokens.includes('Sorry');
  const hasYes = cleanTokens.includes('Yes');
  const hasNo = cleanTokens.includes('No');
  const hasOk = cleanTokens.includes('OK');
  const hasGood = cleanTokens.includes('Good');
  const hasWater = cleanTokens.includes('Water');
  const hasFood = cleanTokens.includes('Food');
  const hasHelp = cleanTokens.includes('Help');
  const hasStop = cleanTokens.includes('Stop');
  const hasI = cleanTokens.includes('I');
  const hasYou = cleanTokens.includes('You');
  const hasILY = cleanTokens.includes('I Love You');

  const parts: string[] = [];
  let isQuestion = false;
  let intentClause = '';

  if (hasHello) parts.push('Hello');
  if (hasSorry && !hasHello) parts.push('I am sorry');

  const items = hasWater && hasFood ? 'some food and water' : hasWater ? 'some water' : hasFood ? 'some food' : '';

  if (hasHelp) {
    if (hasYou) {
      isQuestion = true;
      intentClause = 'could you please help me';
    } else if (hasI || !hasYou) {
      intentClause = 'I need assistance';
    } else {
      intentClause = 'help is needed';
    }
  } else if (hasStop) {
    intentClause = 'please wait / stop';
  } else if (items) {
    if (hasYou) {
      isQuestion = true;
      intentClause = `could you bring ${items}`;
    } else if (hasNo) {
      intentClause = `I do not need ${items}`;
    } else {
      intentClause = `I would like ${items}`;
    }
  } else if (hasGood) {
    if (hasYou) intentClause = 'you are doing very well';
    else if (hasI) intentClause = 'I am doing well';
    else intentClause = 'that is good';
  } else if (hasOk) {
    if (hasYou) {
      intentClause = 'are you okay';
      isQuestion = true;
    } else {
      intentClause = 'everything is okay';
    }
  } else if (hasYes) {
    intentClause = 'I agree';
  } else if (hasNo) {
    intentClause = 'I decline';
  } else if (hasILY) {
    intentClause = 'I love you';
  } else {
    const remaining = cleanTokens.filter((t) => !['Hello', 'Please', 'Thank You', 'Sorry'].includes(t));
    intentClause = remaining.join(' ').toLowerCase() || 'request received';
  }

  let mainSentence = parts.length > 0 ? `${parts[0]}, ${intentClause}` : intentClause;
  mainSentence = mainSentence.charAt(0).toUpperCase() + mainSentence.slice(1);

  if (hasPlease && !mainSentence.toLowerCase().includes('please')) {
    mainSentence += ', please';
  }
  if (hasThanks) {
    mainSentence += '. Thank you!';
  } else if (hasSorry && hasHello) {
    mainSentence += ' (apologies for the trouble).';
  } else if (isQuestion) {
    mainSentence += '?';
  } else if (!mainSentence.endsWith('.') && !mainSentence.endsWith('!')) {
    mainSentence += '.';
  }

  return {
    sentence: mainSentence,
    tokens: cleanTokens,
    alternatives: [cleanTokens.join(' '), `Sign translation: ${mainSentence}`],
    is_question: isQuestion,
  };
}
