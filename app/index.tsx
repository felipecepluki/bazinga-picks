import { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  const data: ShowData = require('../assets/tbbt_episodes.json');

  // Load data of JSON
  const RandomEpisode = () => {
    const [episodeDetails, setEpisodeDetails] = useState<Episode | null>(null);
    const [seasonNumber, setSeasonNumber] = useState<string | null>(null);
    const [episodeNumber, setEpisodeNumber] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      async function loadFonts() {
        await Font.loadAsync({
          'Impact': require('@/assets/fonts/Impact.ttf'),
        });
        setFontsLoaded(true);
      }
      loadFonts();
    }, []);

    if (!fontsLoaded) {
      return null;
    }

    // Function to generate random episode
    const generateRandomEpisode = () => {
      try {
        // Step 1: Get seasons of the show
        const showName = "The Big Bang Theory";
        const seasons: string[] = Object.keys(data[showName]);

        // Step 2: Select random season
        const randomSeasonKey: string = seasons[Math.floor(Math.random() * seasons.length)];

        // Step 3: Get episodes from selected season
        const season: Season[] = data[showName][randomSeasonKey];

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
      <View style={{ backgroundColor: "#089BC1", flex: 1 }}>
        {!episodeDetails && (
          <>
            <ImageBackground resizeMode='cover' source={require('../assets/images/background_home.jpeg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width, height: Dimensions.get('window').height }} />


            <TouchableOpacity
              onPress={generateRandomEpisode}
              style={{
                borderWidth: 1,
                borderColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 58,
                marginRight: 10,
                marginLeft: 10,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: 'white', fontSize: 25, fontFamily: 'Impact' }}>Generate Random Episode</Text>
            </TouchableOpacity>
          </>
        )}
        {episodeDetails && (
          <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 35, fontFamily: 'Impact' }}>Season: {seasonNumber}</Text>
            <Text style={{ color: 'white', fontSize: 35, fontFamily: 'Impact', marginTop: 28 }}>Episode: {episodeNumber}</Text>
            <Text style={{ color: 'white', fontSize: 30, fontFamily: 'Impact', marginTop: 28 }}>Title: {episodeDetails.Title}</Text>
            <Text style={{ color: 'white', fontSize: 20, textAlign: 'justify', fontFamily: 'Impact', marginTop: 28 }}>Description: {episodeDetails.Description}</Text>
            <TouchableOpacity
              onPress={generateRandomEpisode}
              style={{
                borderWidth: 1,
                borderColor: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginTop: 55,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: 'white', fontSize: 25, fontFamily: 'Impact' }}>Generate Random Episode</Text>
            </TouchableOpacity>
          </View>
        )}
        <StatusBar backgroundColor='#089BC1' />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
      </View>
    );
  }

  return <RandomEpisode />;
}