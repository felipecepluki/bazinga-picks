export interface Episode {
  Title: string;
  Description: string;
}

export interface Season {
  [episodeId: string]: Episode;
}

export interface ShowData {
  [showName: string]: {
    [seasonName: string]: Season[];
  };
}

export type RootStackParamList = {
  Welcome: undefined;
  Index: undefined;
};
