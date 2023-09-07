interface ITheme {
    default: { [key: string]: string };
}

export const theme: ITheme = {
    default: {
      "backgroundColor": '#8053FF',
      "interactionPrimary": '#9F53FF',
      "interactionShadow": '#713BB2',
      "health": "rgba(255, 72, 72, 1)",
      "hunger": "rgba(243, 173, 97, 1)",
      "happiness": "rgba(2, 217, 160, 1)",
      "energy": "rgba(245, 216, 0, 1)",
    },
  };