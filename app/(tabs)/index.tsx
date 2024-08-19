import { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

export default function HomeScreen() {

  interface Episode {
    Title: string;
    Description: string;
  }

  interface Season {
    [episodeId: string]: Episode;
  }

  interface ShowData {
    [showName: string]: {
      [seasonName: string]: Season[];
    };
  }

  const data: ShowData = require('../../assets/tbbt_episodes.json');
  console.log(data);

  // Load data of JSON
  const RandomEpisode = () => {
    const [episodeDetails, setEpisodeDetails] = useState<Episode | null>(null);
    const [seasonNumber, setSeasonNumber] = useState<string | null>(null);
    const [episodeNumber, setEpisodeNumber] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    // Function to generate random episode
    const generateRandomEpisode = () => {
      try {
        // Step 1: Get seasons of the show
        const showName = "The Big Bang Theory";
        const seasons: string[] = Object.keys(data[showName]);
        console.log("Seasons:", seasons);

        // Step 2: Select random season
        const randomSeasonKey: string = seasons[Math.floor(Math.random() * seasons.length)];
        console.log("Random Season Key", randomSeasonKey);

        // Step 3: Get episodes from selected season
        const season: Season[] = data[showName][randomSeasonKey];
        console.log("Season Data:", season);

        // Check if exist episodes in the season
        if (season.length > 0) {
          // Step 4: Select random season
          const randomEpisodeIndex: number = Math.floor(Math.random() * season.length);
          const episodeObject = season[randomEpisodeIndex];
          const episodeKey = `Episode ${randomEpisodeIndex + 1}`;
          const episode = episodeObject[episodeKey];
          console.log("Selected Episode:", episode);
          setEpisodeDetails(episode);
          setSeasonNumber(randomSeasonKey);
          setEpisodeNumber(episodeKey);
          setError(null);
        } else {
          setEpisodeDetails(null);
          setError('No episodes found for the selected season.');
        }
      } catch (error) {
        setEpisodeDetails(null);
        setError('An error occurred while fetching episode details.');
      }
    };

    return (
      <View style={{ backgroundColor: "black", flex: 1, justifyContent: "center", alignItems: "center" }}>
        {episodeDetails && (
          <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Season: {seasonNumber}</Text>
            <Text style={{ color: 'white', fontSize: 20 }}>Episode: {episodeNumber}</Text>
            <Text style={{ color: 'white', fontSize: 16 }}>Title: {episodeDetails.Title}</Text>
            <Text style={{ color: 'white', fontSize: 16 }}>Description: {episodeDetails.Description}</Text>
          </View>
        )}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}

        <TouchableOpacity
          onPress={generateRandomEpisode}
          style={{
            backgroundColor: 'blue',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Generate Random Episode</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <RandomEpisode />;
}