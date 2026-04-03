export interface DialogueInterface {
  gritty: string[];
  classic: string[];
  modern: string[];
  classy: string[];
  pro: string[];
}

export interface SituationalDialogueInterface {
  strongHand: DialogueInterface;
  weakHand: DialogueInterface;
  bluffing: DialogueInterface;
  gloating: DialogueInterface;
  sulking: DialogueInterface;
  neutral: DialogueInterface;
  nagging: DialogueInterface;
  egging: DialogueInterface;
}
