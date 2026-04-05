export const grittyPersonalitiesMap = {
  Jax: {
    situations: {
      strongHand: 0.7,
      weakhand: 0.2,
      gloating: 0.5,
      sulking: 0.2,
      neutral: 0.4,
      nagging: 0.5,
      egging: 0.7,
      baiting: 0.6,
    },
    tells: {
      physical: "Rocco's eyes dart to your chip stack for a split second.",
      frequency: 0.1,
    },
    unique: {
      comment: "You're in my hood now.",
      frequency: 0.2,
    },
    tilt: {
      limit: 6,
      comment: "This is about to get ugly.",
      multiplier: 18,
    },
    pressure: {
      comment: "These big pots just belong with me.",
    },
  },
  Mickey: {
    situations: {
      strongHand: 0.8,
      weakhand: 0.1,
      gloating: 0.9,
      sulking: 0.2,
      neutral: 0.4,
      nagging: 0.5,
      egging: 0.8,
      baiting: 0.4,
    },
    tells: {
      physical: "Mickey twitches.",
      frequency: 0.1,
    },
    unique: {
      comment: "I feel a beating coming on.",
      frequency: 0.02,
    },
    tilt: {
      limit: 8,
      comment: "This is some dirty nonsense.",
      multiplier: 1.8,
    },
    pressure: {
      comment: "Cmon lady luck, I need you now.",
    },
  },

  Sloan: {
    situations: {
      strongHand: 0.4,
      weakhand: 0.6,
      gloating: 0.9,
      sulking: 0.6,
      neutral: 0.4,
      nagging: 0.7,
      egging: 0.8,
      baiting: 0.3,
    },
    tells: {
      physical: "Sloan slumps a little in her chair.",
      frequency: 0.2,
    },
    unique: {
      comment: "You look like you've never held a winning hand in your life.",
      frequency: 0.02,
    },
    tilt: {
      limit: 8,
      comment: "This is pathetic. Give me a real hand.",
      multiplier: 1.8,
    },
    pressure: {
      comment: "My blood is itchin now",
    },
  },
  Rocco: {
    situations: {
      strongHand: 0.8,
      weakhand: 0.2,
      gloating: 0.9,
      sulking: 0.1,
      neutral: 0.4,
      nagging: 0.7,
      egging: 0.8,
      baiting: 0.3,
    },
    tells: {
      physical: "Rocco's eyes dart to your chip stack for a split second.",
      frequency: 0.12,
    },
    unique: {
      comment: "You're playing with fire, kid. Don't get burned.",
      frequency: 0.02,
    },
    tilt: {
      limit: 8,
      comment: "Just deal the cards before I lose my cool.",
      multiplier: 1.8,
    },
    pressure: {
      comment: "This is more like it mates",
    },
  },
  Vinnie: {
    situations: {
      strongHand: 0.6,
      weakhand: 0.4,
      gloating: 0.6,
      sulking: 0.2,
      neutral: 0.1,
      nagging: 0.4,
      egging: 0.6,
      baiting: 0.8,
    },
    tells: {
      physical: "Vinnie starts tapping his foot.",
      frequency: 0.22,
    },
    unique: {
      comment: "I’ve seen guys like you disappear for less.",
      frequency: 0.02,
    },
    tilt: {
      limit: 6,
      comment: "Keep laughing. See where it gets you.",
      multiplier: 2.8,
    },
    pressure: {
      comment: "Don't get burned from this heat.",
    },
  },
  Ripley: {
    situations: {
      strongHand: 0.4,
      weakhand: 0.8,
      gloating: 0.2,
      sulking: 0.9,
      neutral: 0.1,
      nagging: 0.8,
      egging: 0.4,
      baiting: 0.2,
    },
    tells: {
      physical: "Ripley's eyes scan the room frantically, avoiding yours.",
      frequency: 0.2,
    },
    unique: {
      comment: "Lady luck's a fickle mistress, ain't she?",
      frequency: 0.02,
    },
    tilt: {
      limit: 6,
      comment: "The deck's stacked. Has to be.",
      multiplier: 2.8,
    },
    pressure: {
      comment: "This is big.",
    },
  },
  Moxie: {
    situations: {
      strongHand: 0.3,
      weakhand: 0.2,
      gloating: 0.5,
      sulking: 0.2,
      neutral: 0.6,
      nagging: 0.5,
      egging: 0.8,
      baiting: 0.9,
    },
    tells: {
      physical: "Moxie shifts her body in a wierd way",
      frequency: 0.17,
    },
    unique: {
      comment: "Cute play. Try it again and see what happens.",
      frequency: 0.02,
    },
    tilt: {
      limit: 8,
      comment: "I'm about five minutes from walking out of here.",
      multiplier: 1.8,
    },
    pressure: {
      comment: "The stakes are high here.",
    },
  },
  Gunmar: {
    situations: {
      strongHand: 0.1,
      weakhand: 0.3,
      gloating: 0.6,
      sulking: 0.1,
      neutral: 0.7,
      nagging: 0.4,
      egging: 0.5,
      baiting: 0.3,
    },
    tells: {
      physical:
        "Gunnar's grip on his cards tightens until his knuckles turn white.",
      frequency: 0.1,
    },
    unique: {
      comment: "My patience is as thin as your bankroll.",
      frequency: 0.02,
    },
    tilt: {
      limit: 8,
      comment: "SHUT UP AND DEAL.",
      multiplier: 1.8,
    },
    pressure: {
      comment: "Cook it.",
    },
  },

  Jinx: {
    situations: {
      strongHand: 0.6,
      weakhand: 0.7,
      gloating: 0.8,
      sulking: 0.8,
      neutral: 0.2,
      nagging: 0.5,
      egging: 0.9,
      baiting: 0.7,
    },
    tells: {
      physical:
        "Jinx adjusts her rings, a rhythmic tapping sound filling the silence.",
      frequency: 0.14,
    },
    unique: {
      comment: "Is it hot in here, or is it just your stack burning up?",
      frequency: 0.02,
    },
    tilt: {
      limit: 8,
      comment: "I'm losing my interest. And my temper.",
      multiplier: 1.8,
    },
    pressure: {
      comment: "This lot makes me nervous.",
    },
  },
  Aria: {
    situations: {
      strongHand: 0.1,
      weakhand: 0.1,
      gloating: 0.2,
      sulking: 0.1,
      neutral: 0.5,
      nagging: 0.1,
      egging: 0.2,
      baiting: 0.1,
    },
    tells: {
      physical: "Aria giggles to herself.",
      frequency: 0.02,
    },
    unique: {
      comment: "There's gonna be some violence if this doesn't change.",
      frequency: 0.05,
    },
    tilt: {
      limit: 6,
      comment: "I feel like I'm being picked on here.",
      multiplier: 1.8,
    },
    pressure: {
      comment: "Too much.",
    },
  },
  Sledge: {
    situations: {
      strongHand: 0.1,
      weakhand: 0.1,
      gloating: 0.2,
      sulking: 0.1,
      neutral: 0.9,
      nagging: 0.1,
      egging: 0.2,
      baiting: 0.1,
    },
    tells: {
      physical: "A faint smirk plays on Sledge's lips as he checks his cards.",
      frequency: 0.1,
    },
    unique: {
      comment: "We roll fat, that's how we roll.",
      frequency: 0.05,
    },
    tilt: {
      limit: 10,
      comment: "I'm getting pissed now.",
      multiplier: 2.8,
    },
    pressure: {
      comment: "The pressure is going to get to you, I know it.",
    },
  },
  Vanna: {
    situations: {
      strongHand: 0.2,
      weakhand: 0.4,
      gloating: 0.5,
      sulking: 0.3,
      neutral: 0.6,
      nagging: 0.4,
      egging: 0.7,
      baiting: 0.9,
    },
    tells: {
      physical: "Vanna exhales a cloud of smoke, with a bored look on her face",
      frequency: 0.14,
    },
    unique: {
      comment: "This is a solid group of thugs here.",
      frequency: 0.02,
    },
    tilt: {
      limit: 5,
      comment: "Again?!",
      multiplier: 1.5,
    },
    pressure: {
      comment: "Let's stop and think about this one.",
    },
  },
  Steel: {
    situations: {
      strongHand: 0.2,
      weakhand: 0.3,
      gloating: 0.4,
      sulking: 0.1,
      neutral: 0.8,
      nagging: 0.2,
      egging: 0.5,
      baiting: 0.8,
    },
    tells: {
      physical: "Steel slowly leans forward, casting a shadow over the pot.",
      frequency: 0.31,
    },
    unique: {
      comment: "Let's bash it up.",
      frequency: 0.02,
    },
    tilt: {
      limit: 7,
      comment: "This dealer better not be around later.",
      multiplier: 1.6,
    },
    pressure: {
      comment: "I don't like this one any more than you do.",
    },
  },
  Gutter: {
    situations: {
      strongHand: 0.3,
      weakhand: 0.2,
      gloating: 0.2,
      sulking: 0.1,
      neutral: 0.8,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.1,
    },
    tells: {
      physical: "Gutter gulps.",
      frequency: 0.21,
    },
    unique: {
      comment: "This makes me want to butt heads with someone. Good times.",
      frequency: 0.04,
    },
    tilt: {
      limit: 8,
      comment: "I can't believe how lucky you all are!",
      multiplier: 1.6,
    },
    pressure: {
      comment: "This is for the cheddar.",
    },
  },
  Tank: {
    situations: {
      strongHand: 0.1,
      weakhand: 0.1,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.9,
      nagging: 0.2,
      egging: 0.1,
      baiting: 0.1,
    },
    tells: {
      physical: "Tank's heavy breathing becomes noticeably rhythmic and deep.",
      frequency: 0.14,
    },
    unique: {
      comment: "I like you, I don't care what they say about you.",
      frequency: 0.02,
    },
    tilt: {
      limit: 4,
      comment: "WHY!",
      multiplier: 1.6,
    },
    pressure: {
      comment: "Big pot here. Don't fret, I'll take it.",
    },
  },
  Li: {
    situations: {
      strongHand: 0.1,
      weakhand: 0.1,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.9,
      nagging: 0.2,
      egging: 0.1,
      baiting: 0.1,
    },
    tells: {
      physical: "Li starts to shake a little.",
      frequency: 0.31,
    },
    unique: {
      comment: "I'm about to start crackin skulls.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "Get it out of my sight.",
      multiplier: 2.6,
    },
    pressure: {
      comment: "This is something.",
    },
  },
};
