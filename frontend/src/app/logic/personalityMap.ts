export const personalityMap = {
  classic: {
    Arthur: {
      situations: {
        strongHand: 0.5,
        weakhand: 0.5,
        gloating: 0.5,
        sulking: 0.5,
        neutral: 0.5,
        nagging: 0.5,
        egging: 0.5,
        baiting: 0.5,
      },
      tells: {
        physical: "Arthur sits up firmly in his chair.",
      },
      unique: {
        comment: "Cheers everyone",
        frequency: 0.05,
      },
      tilt: {
        limit: 5,
        comment: "Oh, another wonderful hand for you. Splendid.",
        multiplier: 1.5,
      },
      pressure: {
        comment: "Things are really cooking up now!",
      },
    },
    Eleanor: {
      situations: {
        strongHand: 0.7,
        weakhand: 0.6,
        gloating: 0.4,
        sulking: 0.8,
        neutral: 0.7,
        nagging: 0.9,
        egging: 0.8,
        baiting: 0.9,
      },
      tells: {
        physical: "Eleanor seems pretty comfortable right now.",
      },
      unique: {
        comment: "Splendid shindig here.",
        frequency: 0.03,
      },
      tilt: {
        limit: 7,
        comment: "Great, that's just great.",
        multiplier: 1.4,
      },
      pressure: {
        comment: "It's getting pretty tense now.",
      },
    },
    Raymond: {
      situations: {
        strongHand: 0.1,
        weakhand: 0.2,
        gloating: 0.2,
        sulking: 0.3,
        neutral: 0.1,
        nagging: 0.2,
        egging: 0.2,
        baiting: 0.2,
      },
      tells: {
        physical: "Raymond sratches the table.",
      },
      unique: {
        comment: "Fun times.",
        frequency: 0.06,
      },
      tilt: {
        limit: 4,
        comment: "You've got to be kidding me.",
        multiplier: 1.4,
      },
      pressure: {
        comment: "This is a pretty big one.",
      },
    },
    Martha: {
      situations: {
        strongHand: 0.7,
        weakhand: 0.5,
        gloating: 0.4,
        sulking: 0.5,
        neutral: 0.7,
        nagging: 0.4,
        egging: 0.3,
        baiting: 0.5,
      },
      tells: {
        physical: "Martha takes a deep breath.",
      },
      unique: {
        comment: "Maybe I need a break.",
        frequency: 0.04,
      },
      tilt: {
        limit: 6,
        comment: "Just take it.",
        multiplier: 1.6,
      },
      pressure: {
        comment: "Anyone nervous?",
      },
    },
    Harvey: {
      situations: {
        strongHand: 0.5,
        weakhand: 0.3,
        gloating: 0.4,
        sulking: 0.2,
        neutral: 0.4,
        nagging: 0.3,
        egging: 0.5,
        baiting: 0.3,
      },
      tells: {
        physical: "Harvey bites his lip.",
      },
      unique: {
        comment: "You are all ok in my book.",
        frequency: 0.1,
      },
      tilt: {
        limit: 10,
        comment: "I've tried to keep my composure, but it's not working.",
        multiplier: 2,
      },
      pressure: {
        comment: "I don't handle pressure well.",
      },
    },
    Janet: {
      situations: {
        strongHand: 0.5,
        weakhand: 0.3,
        gloating: 0.3,
        sulking: 0.4,
        neutral: 0.5,
        nagging: 0.3,
        egging: 0.5,
        baiting: 0.3,
      },
      tells: {
        physical: "Janet grunts to herself.",
      },
      unique: {
        comment: "Okie dokie.",
        frequency: 0.3,
      },
      tilt: {
        limit: 6,
        comment: "You guys are killing me.",
        multiplier: 1.3,
      },
      pressure: {
        comment: "Finally, a decent pot.",
      },
    },
    Greg: {
      situations: {
        strongHand: 0.7,
        weakhand: 0.7,
        gloating: 0.8,
        sulking: 0.9,
        neutral: 0.8,
        nagging: 0.6,
        egging: 0.8,
        baiting: 0.9,
      },
      tells: {
        physical: "Greg is suddenly quiet.",
      },
      unique: {
        comment: "I'll be coming back.",
        frequency: 0.02,
      },
      tilt: {
        limit: 6,
        comment: "I've about had it with these cards.",
        multiplier: 1.6,
      },
      pressure: {
        comment: "The heat is on.",
      },
    },
    Bonnie: {
      situations: {
        strongHand: 0.6,
        weakhand: 0.4,
        gloating: 0.1,
        sulking: 0.2,
        neutral: 0.4,
        nagging: 0.3,
        egging: 0.5,
        baiting: 0.3,
      },
      tells: {
        physical: "Bonnie's eyes get large for a split second.",
      },
      unique: {
        comment: "I am holding out til the end of the night.",
        frequency: 0.05,
      },
      tilt: {
        limit: 8,
        comment: "Sheesh.",
        multiplier: 1.4,
      },
      pressure: {
        comment: "This is my kind of hand.",
      },
    },
    Kyle: {
      situations: {
        strongHand: 0.6,
        weakhand: 0.4,
        gloating: 0.1,
        sulking: 0.2,
        neutral: 0.4,
        nagging: 0.3,
        egging: 0.5,
        baiting: 0.3,
      },
      tells: {
        physical: "Kyle is uneasy.",
      },
      unique: {
        comment: "This has been good so far.",
        frequency: 0.08,
      },
      tilt: {
        limit: 5,
        comment: "What did I do to deserve this?",
        multiplier: 1.8,
      },
      pressure: {
        comment: "This is going to change things.",
      },
    },
    Mary: {
      situations: {
        strongHand: 0.3,
        weakhand: 0.4,
        gloating: 0.2,
        sulking: 0.1,
        neutral: 0.5,
        nagging: 0.4,
        egging: 0.5,
        baiting: 0.3,
      },
      tells: {
        physical: "Mary sighs.",
      },
      unique: {
        comment: "Gotta admit, I'm enjoying myself.",
        frequency: 0.04,
      },
      tilt: {
        limit: 4,
        comment: "What? What?",
        multiplier: 1.9,
      },
      pressure: {
        comment: "Look at all these chips.",
      },
    },
    Clark: {
      situations: {
        strongHand: 0.5,
        weakhand: 0.5,
        gloating: 0.5,
        sulking: 0.5,
        neutral: 0.5,
        nagging: 0.5,
        egging: 0.5,
        baiting: 0.5,
      },
      tells: {
        physical: "Clark quickly gives the dealer with a look of dismay",
      },
      unique: {
        comment: "Chillin like a villain.",
        frequency: 0.12,
      },
      tilt: {
        limit: 11,
        comment: "What is going on?",
        multiplier: 2.2,
      },
      pressure: {
        comment: "I need this pot, cmon.",
      },
    },
    Donna: {
      situations: {
        strongHand: 0.5,
        weakhand: 0.4,
        gloating: 0.2,
        sulking: 0.2,
        neutral: 0.5,
        nagging: 0.4,
        egging: 0.4,
        baiting: 0.3,
      },
      tells: {
        physical: "Donna starts to hum to herself.",
      },
      unique: {
        comment: "Kicking it with my peeps.",
        frequency: 0.1,
      },
      tilt: {
        limit: 5,
        comment: "Why is this happening to me?",
        multiplier: 1.2,
      },
      pressure: {
        comment: "This one's got me thinking.",
      },
    },
  },
  gritty: {
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
      },
      unique: {
        comment: "You're in my hood now.",
        frequency: 0.2,
      },
      tilt: {
        limit: 6,
        comment: "This is about to get ugly.",
        multiplier: 1.8,
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
        physical:
          "A faint smirk plays on Sledge's lips as he checks his cards.",
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
        physical:
          "Vanna exhales a cloud of smoke, with a bored look on her face",
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
        physical:
          "Tank's heavy breathing becomes noticeably rhythmic and deep.",
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
  },

  modern: {
    Leo: {
      situations: {
        strongHand: 0.7,
        weakhand: 0.4,
        gloating: 0.8,
        sulking: 0.6,
        neutral: 0.2,
        nagging: 0.4,
        egging: 0.7,
        baiting: 0.5,
      },
      tells: {
        physical: "Leo stomps his foot quietly",
      },
      unique: {
        comment: "I'm clip-hunting right now and you're making it too easy.",
        frequency: 0.08,
      },
      tilt: {
        limit: 5,
        comment: "This table is literally lagging. Unbelievable.",
        multiplier: 1.6,
      },
      pressure: {
        comment: "No need for a panic attack anyone.",
      },
    },
    Sienna: {
      situations: {
        strongHand: 0.7,
        weakhand: 0.4,
        gloating: 0.8,
        sulking: 0.6,
        neutral: 0.2,
        nagging: 0.4,
        egging: 0.7,
        baiting: 0.5,
      },
      tells: {
        physical: "Sienna looks at her wrist.",
      },
      unique: {
        comment: "Is it my turn? I was busy checking my portfolio.",
        frequency: 0.04,
      },
      tilt: {
        limit: 12,
        comment: "I'm actually bored.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "All my followers are probably worried about this one.",
      },
    },
    Kai: {
      situations: {
        strongHand: 0.7,
        weakhand: 0.4,
        gloating: 0.8,
        sulking: 0.6,
        neutral: 0.2,
        nagging: 0.4,
        egging: 0.7,
        baiting: 0.5,
      },
      tells: {
        physical: "Kai taps a rapid, restless beat on the edge of the table.",
      },
      unique: {
        comment: "That play was mid at best, but okay.",
        frequency: 0.12,
      },
      tilt: {
        limit: 4,
        comment: "You're just clicking buttons. There's no logic.",
        multiplier: 1.6,
      },
      pressure: {
        comment: "Tension is at an all time high right now.",
      },
    },
    Ezra: {
      situations: {
        strongHand: 0.4,
        weakhand: 0.1,
        gloating: 0.2,
        sulking: 0.1,
        neutral: 0.1,
        nagging: 0.3,
        egging: 0.2,
        baiting: 0.1,
      },
      tells: {
        physical: "Ezra taps his thumbs.",
      },
      unique: {
        comment: "I've seen better AI than your strategy.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "Wow. Peak variance. Just wow.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Huge ramifications here.",
      },
    },
    Luna: {
      situations: {
        strongHand: 0.3,
        weakhand: 0.3,
        gloating: 0.5,
        sulking: 0.4,
        neutral: 0.5,
        nagging: 0.2,
        egging: 0.4,
        baiting: 0.7,
      },
      tells: {
        physical:
          "Luna's gaze lingers on the community cards a fraction too long.",
      },
      unique: {
        comment: "The vibes are shiftin'... and not in your favor.",
        frequency: 0.03,
      },
      tilt: {
        limit: 10,
        comment: "I need a new seat. The energy here is toxic.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Nice energy in this one.",
      },
    },
    Ryker: {
      situations: {
        strongHand: 0.4,
        weakhand: 0.1,
        gloating: 0.2,
        sulking: 0.2,
        neutral: 0.4,
        nagging: 0.3,
        egging: 0.2,
        baiting: 0.1,
      },
      tells: {
        physical: "Ryker looks intently at his hand.",
      },
      unique: {
        comment: "You need some inline style.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "Rngesus is mad at me.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Big results from this one.",
      },
    },
    Nova: {
      situations: {
        strongHand: 0.3,
        weakhand: 0.2,
        gloating: 0.3,
        sulking: 0.2,
        neutral: 0.2,
        nagging: 0.5,
        egging: 0.4,
        baiting: 0.3,
      },
      tells: {
        physical: "Nova nods her head.",
      },
      unique: {
        comment: "Are we playing poker or are you just donating?",
        frequency: 0.04,
      },
      tilt: {
        limit: 5,
        comment: "I'm literally being griefed by the deck.",
        multiplier: 1.4,
      },
      pressure: {
        comment: "Big stakes. Are we ready?",
      },
    },
    Xiomara: {
      situations: {
        strongHand: 0.8,
        weakhand: 0.8,
        gloating: 0.6,
        sulking: 0.8,
        neutral: 0.7,
        nagging: 0.8,
        egging: 0.6,
        baiting: 0.8,
      },
      tells: {
        physical: "Xiomara snaps the dealer a quick glaring look.",
      },
      unique: {
        comment:
          "You’re playing like someone who hasn't seen the sun in weeks.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "This is such a waste of my time.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "This is a good one.",
      },
    },

    Rhodes: {
      situations: {
        strongHand: 0.6,
        weakhand: 0.7,
        gloating: 0.4,
        sulking: 0.3,
        neutral: 0.6,
        nagging: 0.3,
        egging: 0.2,
        baiting: 0.3,
      },
      tells: {
        physical: "Rhodes looks at his chips.",
      },
      unique: {
        comment: "My node is functioning. How about yours?",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "I'm getting tilted now.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Finally, a hand that matters.",
      },
    },
    Zadie: {
      situations: {
        strongHand: 0.1,
        weakhand: 0.1,
        gloating: 0.2,
        sulking: 0.1,
        neutral: 0.3,
        nagging: 0.2,
        egging: 0.2,
        baiting: 0.1,
      },
      tells: {
        physical: "Zadie plays with her hair.",
      },
      unique: {
        comment: "I'm about to add you to my clean out list.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "Looks like I'm getting cleaned out here.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "I smell the excitement this hand is bringing!",
      },
    },
    Merrick: {
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
        physical: "Merrick glances away.",
      },
      unique: {
        comment: "I like you guys.",
        frequency: 0.03,
      },
      tilt: {
        limit: 10,
        comment: "OK OK",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Ok I'm nervous, and you should be too.",
      },
    },
    Lana: {
      situations: {
        strongHand: 0.4,
        weakhand: 0.6,
        gloating: 0.5,
        sulking: 0.4,
        neutral: 0.6,
        nagging: 0.6,
        egging: 0.7,
        baiting: 0.3,
      },
      tells: {
        physical: "Lana looks up at the ceiling.",
      },
      unique: {
        comment: "Are you syncing up with your cards? Doesn't seem like it.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "I'm having some computational errors apparently.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "I hope I can bring home the chicken dinner.",
      },
    },
    Vaughn: {
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
        physical: "Vaughn scratches her chin.",
      },
      unique: {
        comment:
          "I've got a side-hustle more exciting than your betting range.",
        frequency: 0.02,
      },
      tilt: {
        limit: 4,
        comment: "Everything about this hand was a disaster.",
        multiplier: 1.2,
      },
      pressure: {
        comment: "It's getting hot in here, isn't it?",
      },
    },
  },

  classy: {
    Julian: {
      situations: {
        strongHand: 0.5,
        weakhand: 0.1,
        gloating: 0.4,
        sulking: 0.3,
        neutral: 0.4,
        nagging: 0.3,
        egging: 0.2,
        baiting: 0.3,
      },
      tells: {
        physical: "Julian eyes flutter for a brief moment.",
      },
      unique: {
        comment: "A fascinating choice. Wrong, but fascinating.",
        frequency: 0.02,
      },
      tilt: {
        limit: 9,
        comment: "The standards of this establishment have truly fallen.",
        multiplier: 1.8,
      },
      pressure: {
        comment: "This is not going matter. Pay attention.",
      },
    },
    Beatrice: {
      situations: {
        strongHand: 0.4,
        weakhand: 0.2,
        gloating: 0.4,
        sulking: 0.2,
        neutral: 0.2,
        nagging: 0.3,
        egging: 0.6,
        baiting: 0.4,
      },
      tells: {
        physical: "Beatrice smiles.",
      },
      unique: {
        comment: "One must learn when to fold with grace, darling.",
        frequency: 0.02,
      },
      tilt: {
        limit: 12,
        comment: "I find your lack of etiquette... exhausting.",
        multiplier: 1.8,
      },
      pressure: {
        comment: "Big hand here.",
      },
    },

    Bob: {
      situations: {
        strongHand: 0.8,
        weakhand: 0.7,
        gloating: 0.9,
        sulking: 0.6,
        neutral: 0.3,
        nagging: 0.4,
        egging: 0.8,
        baiting: 0.9,
      },
      tells: {
        physical: "Bob takes quick sip of his drink.",
      },
      unique: {
        comment: "All this winning is making me thirsty.",
        frequency: 0.02,
      },
      tilt: {
        limit: 7,
        comment: "Are you guys in on something I'm not right now?",
        multiplier: 1.2,
      },
      pressure: {
        comment: "Some real cheddar finally.",
      },
    },
    Madelaine: {
      situations: {
        strongHand: 0.4,
        weakhand: 0.2,
        gloating: 0.4,
        sulking: 0.2,
        neutral: 0.4,
        nagging: 0.2,
        egging: 0.2,
        baiting: 0.3,
      },
      tells: {
        physical: "Madelaine has a look of confusion for a second.",
      },
      unique: {
        comment: "Quality over quantity, dear. Remember that.",
        frequency: 0.02,
      },
      tilt: {
        limit: 3,
        comment: "How dreadfully common of you to win like that.",
        multiplier: 1.6,
      },
      pressure: {
        comment: "This one is worth some real estate.",
      },
    },
    Gemma: {
      situations: {
        strongHand: 0.2,
        weakhand: 0.2,
        gloating: 0.2,
        sulking: 0.2,
        neutral: 0.1,
        nagging: 0.2,
        egging: 0.2,
        baiting: 0.2,
      },
      tells: {
        physical: "Gemma scratches her nose.",
      },
      unique: {
        comment:
          "I've made the proper caluclations here. You all need to worry.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "Seems like I miscalculated.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "This one is mine. I can see the math already.",
      },
    },
    Hubert: {
      situations: {
        strongHand: 0.4,
        weakhand: 0.1,
        gloating: 0.2,
        sulking: 0.1,
        neutral: 0.1,
        nagging: 0.3,
        egging: 0.2,
        baiting: 0.1,
      },
      tells: {
        physical: "Hubert twiddles his thumbs.",
      },
      unique: {
        comment: "I remember when this game required a certain... stature.",
        frequency: 0.04,
      },
      tilt: {
        limit: 10,
        comment: "I am quite finished being 'patient' with you.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "What an interesting turn of events.",
      },
    },
    Lindsay: {
      situations: {
        strongHand: 0.3,
        weakhand: 0.2,
        gloating: 0.3,
        sulking: 0.2,
        neutral: 0.2,
        nagging: 0.5,
        egging: 0.4,
        baiting: 0.3,
      },
      tells: {
        physical: "Lindsay shifts uneasily.",
      },
      unique: {
        comment: "Lovely to meet all of your aquaintances.",
        frequency: 0.1,
      },
      tilt: {
        limit: 13,
        comment: "I was trying to be nice. Apparently too nice.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "This may be fortuitous.",
      },
    },
    Veronica: {
      situations: {
        strongHand: 0.8,
        weakhand: 0.8,
        gloating: 0.6,
        sulking: 0.8,
        neutral: 0.7,
        nagging: 0.8,
        egging: 0.6,
        baiting: 0.8,
      },
      tells: {
        physical: "Veronica cracks her knuckles.",
      },
      unique: {
        comment: "I'm about to start crackin skulls.",
        frequency: 0.02,
      },
      tilt: {
        limit: 6,
        comment: "Wealth is quiet. You, however, are very loud.",
        multiplier: 2,
      },
      pressure: {
        comment: "Ok, good.",
      },
    },

    Winthrop: {
      situations: {
        strongHand: 0.6,
        weakhand: 0.7,
        gloating: 0.4,
        sulking: 0.3,
        neutral: 0.6,
        nagging: 0.3,
        egging: 0.2,
        baiting: 0.3,
      },
      tells: {
        physical: "Winthrop spins a chip in his hand.",
      },
      unique: {
        comment: "I need my stock updates please.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "Bad day at the office.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Lovely numbers on this one.",
      },
    },
    Joseph: {
      situations: {
        strongHand: 0.1,
        weakhand: 0.1,
        gloating: 0.2,
        sulking: 0.1,
        neutral: 0.3,
        nagging: 0.2,
        egging: 0.2,
        baiting: 0.1,
      },
      tells: {
        physical: "Joseph pulls his hair back.",
      },
      unique: {
        comment: "I'm liking these odds today.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "Ok I am not happy now.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Big deal in the works here.",
      },
    },
    Gerald: {
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
        physical: "Gerald snarls at the dealer really quickly.",
      },
      unique: {
        comment: "I suppose even a broken clock is right twice a day.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "Simply atrocious. Absolutely atrocious.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "My word this is tense.",
      },
    },
    Kathleen: {
      situations: {
        strongHand: 0.4,
        weakhand: 0.6,
        gloating: 0.5,
        sulking: 0.4,
        neutral: 0.6,
        nagging: 0.6,
        egging: 0.7,
        baiting: 0.3,
      },
      tells: {
        physical: "Kathleen looks to her right really quickly.",
      },
      unique: {
        comment: "You have the luck of a man with nothing to lose.",
        frequency: 0.01,
      },
      tilt: {
        limit: 10,
        comment: "I believe I’ve had quite enough of this nonsense.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "This is big people.",
      },
    },
    Derek: {
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
        physical: "Derek rubs his belly.",
      },
      unique: {
        comment: "I'm feeling it today.",
        frequency: 0.02,
      },
      tilt: {
        limit: 10,
        comment: "I've never seen so much luck in all my life.",
        multiplier: 2.6,
      },
      pressure: {
        comment: "Huge. I want it.",
      },
    },
  },
  pro: {
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
        physical:
          "Stu's breathing hitches, a microscopic shift in his posture.",
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
      },
      unique: {
        comment:
          "You couldn't even spell 'poker' if I gave you the P and the R.",
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
  },
};
