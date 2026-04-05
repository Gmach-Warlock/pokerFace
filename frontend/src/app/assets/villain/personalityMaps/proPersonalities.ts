export const proPersonalitiesMap = {
  Doyle: {
    situations: {
      strongHand: 0.05,
      weakhand: 0.05,
      gloating: 0.05,
      sulking: 0.01,
      neutral: 0.9,
      nagging: 0.05,
      egging: 0.1,
      baiting: 0.2,
    },
    tells: {
      physical: "Doyle's expression is as still as carved stone.",
      frequency: 0.04,
    },
    unique: {
      comment: "You're playing the player, kid. Not the cards.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "Variance is a nightmare, but you're just lucky.",
      multiplier: 2,
    },
    pressure: {
      comment: "Ok Good stuff.",
    },
  },
  Stu: {
    situations: {
      strongHand: 0.05,
      weakhand: 0.05,
      gloating: 0.05,
      sulking: 0.01,
      neutral: 0.9,
      nagging: 0.05,
      egging: 0.1,
      baiting: 0.2,
    },
    tells: {
      physical: "Stu's breathing hitches, a microscopic shift in his posture.",
      frequency: 0.03,
    },
    unique: {
      comment: "I can see your cards in your eyes. Try harder.",
      frequency: 0.02,
    },
    tilt: {
      limit: 8,
      comment: "I'm playing against an amateur. This is insulting.",
      multiplier: 1.6,
    },
    pressure: {
      comment: "I like this one.",
    },
  },
  Phil: {
    situations: {
      strongHand: 0.2,
      weakhand: 0.1,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.5,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.3,
    },
    tells: {
      physical: "Phil's jaw tightens for a nearly imperceptible second.",
      frequency: 0.02,
    },
    unique: {
      comment: "You couldn't even spell 'poker' if I gave you the P and the R.",
      frequency: 0.02,
    },
    tilt: {
      limit: 9,
      comment: "Are you serious? That's the play you make?!",
      multiplier: 1.9,
    },
    pressure: {
      comment: "Maybe this will make you play a little harder.",
    },
  },
  Johnny: {
    situations: {
      strongHand: 0.3,
      weakhand: 0.2,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.2,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.4,
    },
    tells: {
      physical: "Johnny adjusts his cards slightly.",
      frequency: 0.02,
    },
    unique: {
      comment: "I've won rings with worse hands than this.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "Don't get used to that feeling, kid.",
      multiplier: 2.6,
    },
    pressure: {
      comment: "No worries.",
    },
  },
  Annette: {
    situations: {
      strongHand: 0.4,
      weakhand: 0.2,
      gloating: 0.2,
      sulking: 0.1,
      neutral: 0.4,
      nagging: 0.1,
      egging: 0.3,
      baiting: 0.3,
    },
    tells: {
      physical: "Annette slightly shifts her posture.",
      frequency: 0.02,
    },
    unique: {
      comment: "I'm not worried about my execution. You should be.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "There was no skill involved in that show.",
      multiplier: 2.6,
    },
    pressure: {
      comment: "I'm not worried.",
    },
  },
  Barbara: {
    situations: {
      strongHand: 0.1,
      weakhand: 0.1,
      gloating: 0.1,
      sulking: 0.05,
      neutral: 0.8,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.4,
    },
    tells: {
      physical:
        "Barbara briefly adjusts her glasses, the light reflecting off the lenses.",
      frequency: 0.02,
    },
    unique: {
      comment: "Silly mistake there.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "Sometimes even the lowest odds hit.",
      multiplier: 2.6,
    },
    pressure: {
      comment: "Let's have some fun.",
    },
  },
  Linda: {
    situations: {
      strongHand: 0.3,
      weakhand: 0.2,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.4,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.3,
    },
    tells: {
      physical:
        "Barbara briefly adjusts her glasses, the light reflecting off the lenses.",
      frequency: 0.02,
    },
    unique: {
      comment: "I feel bad for you.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "Nice one. It won't happen again",
      multiplier: 2.6,
    },
    pressure: {
      comment: "Ok.",
    },
  },
  Carlos: {
    situations: {
      strongHand: 0.3,
      weakhand: 0.2,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.4,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.3,
    },
    tells: {
      physical: "Carlos' breathing is extremely calm and relaxed.",
      frequency: 0.02,
    },
    unique: {
      comment: "It's interesting that you would make that move.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "Something to factor in for the next game.",
      multiplier: 2.6,
    },
    pressure: {
      comment: "Carlos grins.",
    },
  },
  Jennifer: {
    situations: {
      strongHand: 0.3,
      weakhand: 0.2,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.4,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.3,
    },
    tells: {
      physical: "Jennifer has a little uneasiness in her eyes.",
      frequency: 0.02,
    },
    unique: {
      comment: "You're over-representing your hand. It's a classic mistake.",
      frequency: 0.02,
    },
    tilt: {
      limit: 10,
      comment: "I'm done being 'polite' at this table.",
      multiplier: 2.6,
    },
    pressure: {
      comment: "This is something.",
    },
  },
  Michael: {
    situations: {
      strongHand: 0.3,
      weakhand: 0.2,
      gloating: 0.3,
      sulking: 0.1,
      neutral: 0.4,
      nagging: 0.1,
      egging: 0.1,
      baiting: 0.3,
    },
    tells: {
      physical:
        "Michael sternly stares at everyone waiting to see what they do.",
      frequency: 0.02,
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
