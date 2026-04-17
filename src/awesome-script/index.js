
const cardParent = document.querySelector('.lox7wq0');
function observeForLoad(mutationList) {
  console.log('observe thing go off');
  iterateMutations: for (const mutation of mutationList) {
    for (let i = 0; i < mutation.addedNodes.length; i++) {
      // is this the same as for...of?
      setTimeout(() => {
        solveLearnQuestion();
      }, 200);
      // NEED. TO TEST. 0 MS.
      // scared to test 0ms. The lower I go, the laggier it gets, but it seems to function alright. Requires more testing.

      break iterateMutations;
    }
  }
}
const cardSwitchObserver = new MutationObserver(observeForLoad);

let looping = false;

function toggleLooping() {
  if (looping) {
    console.log('looping toggled off.');
    looping = false;
    cardSwitchObserver.disconnect();
  } else if (!looping) {
    console.log('looping toggled on.');
    looping = true;
    cardSwitchObserver.observe(cardParent, {
      childList: true,
      subtree: true,
    });
    solveLearnQuestion();
  } else {
    console.log('looping is neither truthy nor falsy.');
  }
}

document.addEventListener('keydown', (key) => {
  if (document.activeElement.prototype instanceof HTMLInputElement) {
    console.log('Rightshift pressed, but active element is an input.');
    return;
  }
  if (key.code === 'ShiftRight') {
    toggleLooping();
  }
});

// BELOW HERE LIES THE LOGIC

let cards = getCardSides();

// BELOW HERE LIES THE LOGIC FUNCTIONS

function getCardSides() {
  // creates an object containing term-definition pairs to the cards
  const text = document.querySelector('#__NEXT_DATA__').textContent;
  const json = JSON.parse(text);
  console.log(json);

  let cardSides = {};
  for (let obj of json.props.pageProps.studyModesCommon.studiableDocumentData
    .studiableItems) {
    cardSides[obj.cardSides[0].media[0].plainText] =
      obj.cardSides[1].media[0].plainText;
  }
  return cardSides;
}

function getCardHint() {
  let classElement;
  if (document.querySelector('div.tztbvpx.c10andea')) {
    classElement = document.querySelector('div.tztbvpx.c10andea');
  } else if (document.querySelector('.t1qxthpf')) {
    classElement = document.querySelector('div.t1qxthpf');
  }
  const hint = classElement.firstElementChild.firstElementChild.textContent;
  return hint;
}

function getCardChoiceElements() {
  return document.querySelectorAll('.c10andea:not(.tztbvpx)');
}

function getMCQMatchType() {
  const MCQType = document.querySelector('.l2mud40').textContent;
  return MCQType;
}

function solveLearnMCQTermQuestion(choices, definition) {
  for (let element of choices) {
    if (cards[element.firstElementChild.textContent] === definition) {
      element.parentElement.parentElement.click();
      break;
    } else {
      console.log(
        `Term does not match: ${element.firstElementChild.textContent}`,
      );
      continue;
    }
  }
}

function solveLearnMCQDefinitionQuestion(choices, definition) {
  const term = Object.keys(cards).find((term) => cards[term] === definition);
  for (let element of choices) {
    if (element.firstElementChild.textContent === term) {
      element.parentElement.parentElement.click();
      break;
    } else {
      console.log(
        `Definition does not match: ${element.firstElementChild.textContent}`,
      );
      continue;
    }
  }
}

function solveLearnMCQQuestion() {
  const cardHint = getCardHint();
  // can match use this scope? (no... ok...)
  // fuck the other function cant have it either
  const choiceElements = getCardChoiceElements();
  const match = getMCQMatchType();
  if (match === 'Term') {
    solveLearnMCQTermQuestion(choiceElements, cardHint);
  } else if (match === 'Definition') {
    solveLearnMCQDefinitionQuestion(choiceElements, cardHint);
  } else {
    console.log("Question type is neither 'Definition' nor 'Term'");
  }
}

function solveLearnTypingQuestion() {
  const cardHint = getCardHint();
  const answerButton = document.querySelector(
    '.bzw8vcf.al737zk.m1uk72q9.a1pkfvc7',
  );
  const input = document.querySelector('input.i1gvzg80');
  const choice = Object.keys(cards).find((t) => cards[t] === cardHint);
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  ).set;
  setter.call(input, choice);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  answerButton.click();
}

// ADD SUPPORT FOR THE ASSIGNED WEIRD ONE?
// fuck does this comment mean?
// oh
function solveLearnQuestion() {
  if (document.querySelector('.c10andea:not(.tztbvpx)')) {
    solveLearnMCQQuestion();
  } else if (document.querySelector('input.i1gvzg80')) {
    solveLearnTypingQuestion();
  } else {
    console.log('No question detected!');
  }
}
