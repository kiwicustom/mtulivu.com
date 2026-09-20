#!/usr/bin/env node
/** Generate 999 original Mtulivu wisdom lines (not famous quotations). */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HAND = [
  "Peace is not later. It is the next unhurried breath.",
  "Sit as if the earth already knows your name.",
  "The mind will sprint. Let the body walk.",
  "A quiet chest can hold a loud day.",
  "Nothing you dropped in silence was truly lost.",
  "Breathe once more than you think you need.",
  "Stillness is not empty. It is crowded with enough.",
  "If the mind is loud, sit closer to the body.",
  "You do not have to finish becoming to begin resting.",
  "Let the morning arrive without a speech.",
  "The pause between thoughts is also a home.",
  "Kindness toward yourself is not a side practice.",
  "Hurry is a rumor. Breath is the news.",
  "Close the eyes. Open the hour.",
  "What you stop chasing often sits down beside you.",
  "The body keeps a slower clock. Trust it.",
  "Peace does not perform. It waits.",
  "A single honest breath outranks a clever plan.",
  "Let the jaw unlearn the day.",
  "You are allowed to be unfinished and still sit.",
  "The sky does not rush the cloud. Why should you?",
  "Meditation is not escape. It is returning the keys.",
  "Listen until listening becomes rest.",
  "Soft shoulders teach the mind manners.",
  "Enough is a place. Visit it often.",
  "The tea cools whether you worry or not.",
  "Let tonight be a shore, not a courtroom.",
  "Your worth is not a moving target.",
  "Sit with the ordinary. It is already sacred.",
  "A kind pause is a form of prayer.",
  "Do not decorate the silence. Inhabit it.",
  "The breath does not ask who you were yesterday.",
  "Walk as if the ground is a friend.",
  "Let one thought pass without a handshake.",
  "Quiet is not the absence of life. It is the room for it.",
  "You may put the armor down in this hour.",
  "The heart knows how to sit. Follow it.",
  "Rest is not a reward you earn from exhaustion.",
  "Let the hands be empty of proving.",
  "Peace begins where the argument with now ends.",
  "A slow exhale is a door.",
  "Be the weather, not the forecast.",
  "The body is not a project this morning.",
  "What is here is enough to begin.",
  "Let the eyes rest on one honest thing.",
  "Still water is still doing its work.",
  "You can be gentle and still be true.",
  "The night does not require a conclusion.",
  "Sit until the hurry becomes a rumor.",
  "Forgive the mind for being a mind.",
  "A candle does not compete with the dark. It simply is.",
  "Leave a little space around every yes.",
  "The quiet you seek is already breathing you.",
  "Let hunger for more take a seat outside.",
  "Presence is the only luggage you need.",
  "Even the restless heart can learn to sit.",
  "Do not wait for perfect calm. Sit inside the weather.",
  "A kind word to yourself counts as practice.",
  "The window is a teacher if you let it be.",
  "Let the spine be a quiet tree.",
  "You are not late for your own life.",
  "Breathe into the places that braced.",
  "Peace is a practice of returning, not arriving.",
  "Let the day be smaller than your breath.",
  "The unsaid can rest too.",
  "Sit with what is, not with what should have been.",
  "Your attention is a garden. Weed it kindly.",
  "The ocean does not apologize for its tides.",
  "Let one minute be a monastery.",
  "Soft eyes. Soft clock.",
  "What you water with worry grows. Water stillness instead.",
  "The body remembers peace longer than the story does.",
  "You may begin again in the middle of the sentence.",
  "Let the shoulders drop the invisible luggage.",
  "Silence is not a test you can fail.",
  "A warm cup is a complete philosophy.",
  "The path is the sitting. Not the after.",
  "Be on the side of your own nervous system.",
  "Let dusk arrive without a verdict.",
  "The mind collects. The breath releases.",
  "You do not owe the world a performance of calm.",
  "Stay until the inside catches up with the chair.",
  "Peace prefers small rooms and honest hours.",
  "Let the feet feel the floor as a vow.",
  "Nothing extra is required for this inhale.",
  "The guru in the head is often just a tired voice. Let it sit.",
  "Kindness is a posture. Begin at the neck.",
  "Let tomorrow stay uninvited for one more breath.",
  "A slow morning is not wasted.",
  "The heart can be a still pond and still be deep.",
  "You are allowed to need quiet without explaining why.",
  "Let the ribs widen like a small yes.",
  "Practice is returning when you notice you left.",
  "The world will keep spinning. You may sit.",
  "Do not argue with the breath. Join it.",
  "A gentle gaze is already meditation.",
  "Let the name of the worry float without a hook.",
  "Peace is closer than the next notification.",
  "The body is speaking. Lower the volume of the plan.",
  "Sit as if friendship with yourself is the point.",
  "Let the exhale take what the day piled on.",
  "You can love people and still need a closed door.",
  "The quiet ones are not empty. They are listening.",
  "Let rain be a metronome for the heart.",
  "A bowed head can be strength, not defeat.",
  "Stop auditioning for your own approval.",
  "The present does not need a caption.",
  "Let warmth in the belly be the altar.",
  "Meditation is hospitality toward this moment.",
  "You may be a beginner every time you sit. Good.",
  "Let the tongue rest from defending.",
  "The oldest wisdom is often the slowest breath.",
  "Be where the feet are.",
  "A held breath is a held life. Let it go.",
  "The room is enough. You are enough. Begin.",
  "Let evening undo the knot without a story.",
  "Peace is not a personality. It is a permission.",
  "Sit with the child inside until they unclench.",
  "The mountain is not impressed by your speed.",
  "Let one kind thought complete its sentence.",
  "You cannot miss a breath that is happening now.",
  "The work of peace is mostly not leaving.",
  "Let the forehead smooth like tide over sand.",
  "A quiet yes is louder than a crowded plan.",
  "Stillness will not mock your restlessness.",
  "Let the hands uncurl. The world can wait that long.",
  "What is simple is not small.",
  "Breathe as if you belong here. You do.",
  "The teacher is the next honest pause.",
  "Let the heart have an afternoon off from proving.",
  "Peace likes repetition. Return.",
  "You may put down the future for the length of a cup.",
  "Let the eyes close on mercy, not on escape.",
  "The body is the first monastery.",
  "Sit until gratitude finds a seat without being invited.",
  "A slow walk is a moving silence.",
  "Let the question rest before it becomes a trial.",
  "You are not required to be interesting while you rest.",
  "The night sky does not hustle the stars.",
  "Let kindness arrive before the critique.",
  "Peace is the art of not adding a second arrow.",
  "Sit with the breath until it sits with you.",
  "The door to now is never locked.",
  "Let your name be spoken only by this inhale.",
  "A soft belly is a revolutionary act.",
  "The mind writes novels. The breath writes one word: here.",
  "Let waiting become watching, then become rest.",
  "You can put the verdict down and keep the life.",
  "Stillness is loyal. It stays when you return.",
  "Let the shoulders hear they are not load-bearing walls.",
  "Peace does not require a scenic view. A chair will do.",
  "The simplest altar is two feet on the ground.",
  "Let the day end without a scoreboard.",
  "You are allowed to be held by ordinary light.",
  "Sit like the tree: no speech, plenty of life.",
  "Let the next breath be unambitious.",
  "The heart learns peace the way rivers learn stones: slowly.",
  "Do not outsource your calm to a future version of you.",
  "Let the room be dim and the attention warm.",
  "A quiet meal is a meditation with a spoon.",
  "The pause is not lazy. It is precise.",
  "Let go of the pose. Keep the sitting.",
  "You may love the world better after you rest inside it.",
  "Peace is contagious. Start the outbreak in your chest.",
  "Let the ankles, the wrists, the jaw — all of them — resign.",
  "The guru page is this breath. Read it slowly.",
  "Sit with the ones you miss without leaving the chair.",
  "Let dawn be a teacher who does not raise her voice.",
  "A clear table can clear a mind.",
  "The work is to notice, not to win noticing.",
  "Let your inner weather pass without a press conference.",
  "You do not have to become someone else to be still.",
  "Peace keeps no attendance sheet.",
  "Let the spine rise and the story sit.",
  "The kindest schedule includes empty minutes on purpose.",
  "Sit until the inside and the chair agree.",
  "Let water on the face be a small baptism of now.",
  "The future is a guest. Do not give it the keys tonight.",
  "Breathe through the soles. The earth is listening.",
  "Let the eyebrow unknit the argument.",
  "You are already in the temple. It is called a body.",
  "Peace is what remains when you stop decorating fear.",
  "Let one song play without a second screen.",
  "The quiet after laughter is also holy.",
  "Sit as if your ancestors would like a turn to rest too.",
  "Let the phone sleep. Let you wake.",
  "A slower swallow. A slower life.",
  "The mind will come back. Greet it like a dog, then sit.",
  "Let mercy be the first interpretation.",
  "You may be tired. Sit anyway. Especially then.",
  "Peace is not a mood. It is a way of placing the feet.",
  "Let the ribs count a kinder rhythm.",
  "The world is loud. Your inner room has a door.",
  "Sit with joy as carefully as you sit with ache.",
  "Let the unsolved remain unsolved until morning.",
  "A bowed breath is still a complete breath.",
  "The teacher you wanted may be the pause you keep skipping.",
  "Let heat leave the face. Let cool stay in the chest.",
  "You can stop climbing for the length of a sit.",
  "Peace likes people who return without drama.",
  "Let the fingers forget the keyboard for a minute.",
  "The horizon is a slow idea. Copy it.",
  "Sit until the inner narrator loses interest.",
  "Let this hour be untitled.",
  "A kind spine is a kind mind waiting to happen.",
  "The breath you ignored is still willing.",
  "Let the house be imperfect and the sitting be true.",
  "You are not behind. You are here.",
  "Peace is a small lamp. Shield it with your hours.",
  "Let the tongue rest on the floor of the mouth like a leaf.",
  "The only race is back to the body.",
  "Sit with the truth that you are already held.",
  "Let birds finish their sentence before you start yours.",
  "A quiet person can still move the room toward rest.",
  "The practice is to stop leaving yourself.",
  "Let the inhale be welcome and the exhale be trust.",
  "You may put down being impressive. Pick up being present.",
  "Peace does not bill by the hour.",
  "Let the knees remember they can bend without collapsing.",
  "The night is a blanket if you stop picking at it.",
  "Sit as if the chair is a friend who waited.",
  "Let your inner child find the adult breathing slowly.",
  "A single candle is a crowd of light.",
  "The guru is the gap. Visit often.",
  "Let steam from the cup be a cloud you do not chase.",
  "You can be ambitious tomorrow. Tonight, be breath.",
  "Peace is the decision to stop tightening.",
  "Let the skull be a sky, not a factory.",
  "Sit until the word enough feels like a name.",
  "The body will tell you when the sit is honest.",
  "Let no one, including you, rush this swallow.",
  "A slow blink is a tiny night. Take it.",
  "The path of peace is mostly repetition with kindness.",
  "Let the heart stay unarmored for one song.",
  "You are allowed to outgrow noise.",
  "Sit with water. Learn its patience.",
  "Let the day be a river, not a courtroom transcript.",
  "Peace arrives on time. We are the ones who are early with worry.",
  "The simplest wisdom: come back.",
  "Let your name mean rest as much as it means doing.",
  "A still mouth can be a kind mouth.",
  "The practice does not require incense. It requires returning.",
  "Let the shoulders melt toward the earth that wants them.",
  "You may be ordinary. Ordinary is a beautiful altar.",
  "Sit until the next kind action becomes obvious.",
  "Let the mind's theater run. You are the seat, not the play.",
  "Peace is homemade. Start with the breath you have.",
  "The closed eyes are not hiding. They are arriving.",
  "Let one honest yawn be the gong.",
  "You do not have to understand the quiet to deserve it.",
  "Sit like dusk: no announcement, complete change.",
  "Let the ribs be a cradle for the tired heart.",
  "A gentle routine is a temple you can carry.",
  "The wisdom is not elsewhere. It is under the next breath.",
  "Let your inner critic sit in the back row without a microphone.",
  "Peace prefers unclenched hands.",
  "You may end the day without a lesson. Rest is the lesson.",
  "Sit with the people you love by being here, not by spinning.",
  "Let the floor take more of you than the plan does.",
  "The quiet is not judging your technique.",
  "A long exhale is a love letter to the nervous system.",
  "Let Mtulivu mean: I can be still and still belong.",
  "The head is full. Let the bubbles leave.",
  "Sit until the inside becomes a wide field.",
  "Let tonight forgive today.",
  "You are the sky. Thoughts are weather. Wait.",
];

const nouns = [
  "the breath",
  "this hour",
  "the body",
  "the quiet",
  "the pause",
  "your hands",
  "the morning",
  "the night",
  "the window",
  "the tea",
  "the walking",
  "the chest",
  "the ground",
  "this chair",
  "the dusk",
  "the dawn",
  "the rain",
  "the river",
  "the mountain",
  "the candle",
  "the garden",
  "the shore",
  "the sky",
  "the heart",
  "the spine",
  "the room",
  "the cup",
  "the path",
  "the silence",
  "the light",
];

const verbs = [
  "be enough",
  "arrive without a speech",
  "teach you patience",
  "remain unnamed",
  "keep you company",
  "finish what hurry started",
  "sit with you",
  "ask nothing extra",
  "soften the jaw",
  "hold the day",
  "return you to now",
  "unclench the story",
  "be a small monastery",
  "outlast the worry",
  "welcome you home",
];

const duties = [
  "earn stillness",
  "explain your tiredness",
  "win the morning",
  "finish becoming",
  "prove you are calm",
  "solve the night",
  "perform peace",
  "hurry the heart",
  "caption this moment",
  "win your own approval",
  "outrun the body",
  "decorate the silence",
  "fix the weather inside",
  "become someone else first",
  "carry every tomorrow",
];

const gifts = [
  "sit",
  "rest",
  "begin again",
  "be here",
  "listen",
  "breathe",
  "soften",
  "stay",
  "belong",
  "let go",
  "come back",
  "be unfinished",
  "close the eyes",
  "put the armor down",
  "drink the tea slowly",
];

const places = [
  "the breath",
  "stillness",
  "this morning",
  "the body",
  "a quiet room",
  "the pause",
  "ordinary light",
  "the next exhale",
  "unhurried walking",
  "a warm cup",
  "closed eyes",
  "the ground under you",
  "this single minute",
  "a kind chest",
  "the shore of now",
];

const teachers = [
  "the breath",
  "the body",
  "the window",
  "the rain",
  "a slow cup",
  "the chair",
  "dusk",
  "dawn",
  "the feet",
  "silence",
  "the river",
  "a candle",
  "the garden",
  "the night sky",
  "a long blink",
];

const lessons = [
  "how to stay",
  "how to begin again",
  "that enough is already here",
  "that hurry is optional",
  "how to put the story down",
  "that rest is not a failure",
  "how to listen without fixing",
  "that you belong in this hour",
  "how to unclench",
  "that peace is a practice",
  "how to return",
  "that the body is wise",
  "how to be unfinished kindly",
  "that quiet is alive",
  "how to stop leaving yourself",
];

const inner = [
  "the forehead",
  "the jaw",
  "the shoulders",
  "the belly",
  "the hands",
  "the tongue",
  "the eyes",
  "the chest",
  "the spine",
  "the knees",
  "the throat",
  "the brow",
  "the wrists",
  "the ankles",
  "the ribs",
];

const soften = [
  "unlearn the day",
  "drop the invisible luggage",
  "become a wide field",
  "remember they are not walls",
  "rest from defending",
  "stop climbing",
  "become sky instead of factory",
  "let the weather pass",
  "choose mercy first",
  "become a shore",
  "stop auditioning",
  "sit like a friend",
  "belong without a speech",
  "be a small yes",
  "forgive the hurry",
];

const times = [
  "this morning",
  "tonight",
  "this hour",
  "this minute",
  "dusk",
  "dawn",
  "the long afternoon",
  "the middle of the day",
  "the edge of sleep",
  "the first sitting",
  "the last sitting",
  "a rainy hour",
  "a clear night",
  "the pause after laughter",
  "the quiet after work",
];

const practices = [
  "returning",
  "softening",
  "listening",
  "staying",
  "breathing",
  "unclenching",
  "beginning again",
  "not adding a second arrow",
  "putting the armor down",
  "letting the jaw go",
  "walking slowly",
  "sipping without a screen",
  "sitting without a scoreboard",
  "allowing the unsolved to wait",
  "greeting the mind kindly",
];

const set = new Set(HAND);

function add(s) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length < 24 || t.length > 108) return;
  if (/[.]{2,}|,,|  /.test(t)) return;
  set.add(t);
}

for (const n of nouns) {
  for (const v of verbs) add(`Let ${n} ${v}.`);
  add(`Nothing is late in ${n}.`);
  add(`${n[0].toUpperCase()}${n.slice(1)} is already a teacher.`);
  add(`${n[0].toUpperCase()}${n.slice(1)} does not need an audience.`);
  add(`Sit with ${n} until it sits with you.`);
  add(`Peace often looks like ${n}.`);
  add(`Begin again at ${n}.`);
  add(`You can meet ${n} without a plan.`);
  add(`Trust ${n} more than the forecast.`);
  add(`If you are lost, return to ${n}.`);
}

for (const d of duties) {
  for (const g of gifts) add(`You do not have to ${d} to ${g}.`);
}

for (const p of places) {
  add(`Nothing is late in ${p}.`);
  add(`You are already home in ${p}.`);
  add(`Let ${p} be enough for now.`);
  add(`Come back to ${p}.`);
  add(`The doorway is ${p}.`);
  add(`Rest inside ${p}.`);
}

for (const t of teachers) {
  for (const l of lessons) add(`Let ${t} teach you ${l}.`);
}

for (const i of inner) {
  for (const s of soften) add(`Let ${i} ${s}.`);
}

for (const t of times) {
  add(`Let ${t} arrive without a verdict.`);
  add(`${t[0].toUpperCase()}${t.slice(1)} does not require a performance.`);
  add(`Peace can live in ${t}.`);
  add(`Sit through ${t} without fixing it.`);
  add(`${t[0].toUpperCase()}${t.slice(1)} is already holy if you stay.`);
  add(`Give ${t} back its original slow.`);
}

for (const p of practices) {
  add(`The work of peace is mostly ${p}.`);
  add(`Today, practice is ${p}.`);
  add(`Wisdom looks like ${p}.`);
  add(`Return to ${p} when the mind sprints.`);
  add(`Choose ${p} over proving.`);
  add(`Let ${p} be the whole path for now.`);
}

const extra = [
  ["Hurry fades when", "the breath is counted kindly."],
  ["The mind will wander.", "That is how you know you have a mind."],
  ["Close the laptop.", "Open the hour."],
  ["If peace feels far,", "it is usually hiding in the next exhale."],
  ["Do not wait for silence.", "Sit in the almost-quiet."],
  ["A guru in the head", "is often just fatigue wearing a robe."],
  ["Let thoughts bubble up.", "You do not have to drink them."],
  ["The bubble leaves the head.", "The head remains."],
  ["Stillness is not a trophy.", "It is a chair you keep offering yourself."],
  ["When in doubt,", "lengthen the leaving of the breath."],
];

for (const [a, b] of extra) add(`${a} ${b}`);

const moreSeeds = [
  "Let the inner weather pass without a name.",
  "A slow spoon is a spiritual tool.",
  "The head can empty the way a sky empties of birds.",
  "You may be the quietest person in the room and still be complete.",
  "Sit until the next kind word is obvious.",
  "Peace is a spine that does not apologize for resting.",
  "Let the bubbles of thought rise and pop without a meeting.",
  "The wisdom you wanted is often the permission you withheld.",
  "Come back. That is the whole book.",
  "Let the quiet be enough. Write later.",
];

for (const s of moreSeeds) add(s);

const quotes = [...set].slice(0, 999);
if (quotes.length < 999) {
  let n = quotes.length;
  while (quotes.length < 999) {
    const i = nouns[n % nouns.length];
    const t = times[n % times.length];
    const p = practices[n % practices.length];
    add(`In ${t}, let ${i} remember ${p}.`);
    n += 1;
    if (n > 5000) break;
    quotes.length = 0;
    quotes.push(...set);
    if (quotes.length >= 999) break;
  }
}

const finalQuotes = [...set].slice(0, 999);
if (finalQuotes.length !== 999) {
  throw new Error(`expected 999 quotes, got ${finalQuotes.length}`);
}

const out = `export const QUOTES = ${JSON.stringify(finalQuotes, null, 2)};\n`;
const dir = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(dir, "quotes.js"), out.replace("export const QUOTES", "window.MTULIVU_QUOTES"));
writeFileSync(join(dir, "quotes.json"), JSON.stringify(finalQuotes, null, 2) + "\n");
console.log(`wrote ${finalQuotes.length} quotes`);
