import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Animated,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import "../global.css";

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const SHOW_ID = 1418;

interface Episode {
  season: number;
  episodeNumber: number;
  title: string;
  overview: string;
  image: string | null;
  runtime: number;
  characters: Array<{
    name: string;
    actor: string;
    profile: string | null;
  }>;
  imdb_id: string;
}

interface TvDetailsResponse {
  number_of_seasons: number;
}

interface SeasonResponse {
  episodes: Array<{
    episode_number: number;
    name: string;
    still_path: string | null;
    overview: string;
    runtime: number;
    season_number: number;
  }>;
}

interface CreditsResponse {
  cast: Array<{
    name: any;
    character: string;
    profile_path: string | null;
  }>;
}

interface ShowExternalIds {
  imdb_id: string;
}

export default function App() {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const api = axios.create({
    baseURL: BASE_URL,
    params: { api_key: API_KEY },
    headers: { "Cache-Control": "public, max-age=86400" }, // Cache de 24h
  });

  const fetchRandomEpisode = async () => {
    try {
      setLoading(true);
      setError(null);
      fadeAnim.setValue(0);

      // Get show external IDs
      const externalIds = await axios.get<ShowExternalIds>(
        `${BASE_URL}/tv/${SHOW_ID}/external_ids?api_key=${API_KEY}`
      );

      // Get show details
      const showDetails = await axios.get<TvDetailsResponse>(
        `${BASE_URL}/tv/${SHOW_ID}?api_key=${API_KEY}`
      );

      const totalSeasons = showDetails.data.number_of_seasons;
      const randomSeason = Math.floor(Math.random() * totalSeasons) + 1;

      // Get season data
      const seasonResponse = await axios.get<SeasonResponse>(
        `${BASE_URL}/tv/${SHOW_ID}/season/${randomSeason}?api_key=${API_KEY}`
      );

      const episodes = seasonResponse.data.episodes;
      const randomEpisode =
        episodes[Math.floor(Math.random() * episodes.length)];

      // Get credits
      const creditsResponse = await axios.get<CreditsResponse>(
        `${BASE_URL}/tv/${SHOW_ID}/season/${randomSeason}/episode/${randomEpisode.episode_number}/credits?api_key=${API_KEY}`
      );

      // Format data
      const episodeData: Episode = {
        season: randomSeason,
        episodeNumber: randomEpisode.episode_number,
        title: randomEpisode.name,
        overview: randomEpisode.overview || "No description available",
        image: randomEpisode.still_path
          ? `https://image.tmdb.org/t/p/w500${randomEpisode.still_path}`
          : null,
        runtime: randomEpisode.runtime,
        characters: creditsResponse.data.cast.slice(0, 10).map((member) => ({
          name: member.character,
          actor: member.name,
          profile: member.profile_path
            ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
            : null,
        })),
        imdb_id: externalIds.data.imdb_id,
      };

      setEpisode(episodeData);
      if (episodeData.image) {
        Image.prefetch(episodeData.image);
      }
      episodeData.characters.forEach((char) => {
        if (char.profile) Image.prefetch(char.profile);
      });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError("Error loading episode. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openStreaming = () => {
    const streamingURL = `https://play.hbomax.com/page/urn:hbo:page:${episode?.imdb_id}`;
    Linking.openURL(streamingURL).catch(() =>
      alert("HBO Max link unavailable. Please check your region availability.")
    );
  };

  return (
    <ScrollView className="flex-1 p-5 bg-gray-900">
      {episode && (
        <View className="bg-gray-800 rounded-2xl p-4 mb-5 shadow-xl shadow-black/40">
          {episode.image && (
            <Image
              source={{ uri: episode.image }}
              className="w-full h-64 rounded-xl mb-4 bg-gray-700"
              resizeMode="cover"
            />
          )}

          <Text className="text-white text-2xl font-bold mb-3 text-center">
            {episode.title}
          </Text>

          <View className="flex-row justify-between mb-4">
            <View className="bg-gray-700 px-3 py-2 rounded-lg flex-row items-center">
              <MaterialIcons name="tv" size={16} color="white" />
              <Text className="text-gray-200 ml-2">
                Season {episode.season}
              </Text>
            </View>

            <View className="bg-gray-700 px-3 py-2 rounded-lg flex-row items-center">
              <MaterialIcons name="access-time" size={16} color="white" />
              <Text className="text-gray-200 ml-2">{episode.runtime} mins</Text>
            </View>
          </View>

          <Text className="text-purple-400 text-xl font-bold mb-2">
            SYNOPSIS
          </Text>
          <Text className="text-gray-300 text-base mb-4 leading-6">
            {episode.overview}
          </Text>

          <TouchableOpacity
            className="bg-purple-600 p-3 rounded-xl flex-row items-center justify-center mb-4"
            onPress={openStreaming}
          >
            <Text className="text-white font-semibold text-lg">Watch on</Text>
            <Image
              source={require("../assets/images/Max.png")}
              className="h-full w-1/3 m-2"
            />
          </TouchableOpacity>

          <Text className="text-purple-400 text-xl font-bold mb-3">
            FEATURING
          </Text>

          <FlatList
            horizontal
            data={episode.characters}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="bg-gray-700 mr-3 p-2 rounded-xl items-center w-32">
                {item.profile ? (
                  <Image
                    source={{ uri: item.profile }}
                    className="w-20 h-20 rounded-full bg-gray-600"
                  />
                ) : (
                  <MaterialIcons name="person" size={60} color="#888" />
                )}
                <View className="mt-2">
                  <Text className="text-white text-sm font-bold text-center">
                    {item.actor}
                  </Text>
                  <Text className="text-gray-400 text-xs text-center mt-1">
                    as {item.name}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {!episode && !loading && (
        <Text className="text-gray-400 text-center text-lg mt-20">
          Press the button to generate a random episode!
        </Text>
      )}
      <TouchableOpacity
        className="bg-purple-600 p-4 rounded-2xl mb-5 items-center shadow-lg shadow-purple-800/50 flex-row justify-center"
        onPress={fetchRandomEpisode}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <MaterialIcons name="casino" size={24} color="white" />
            <Text className="text-white font-bold ml-2 text-lg">
              GENERATE RANDOM EPISODE
            </Text>
          </>
        )}
      </TouchableOpacity>

      {error && (
        <Text className="text-red-400 text-center mb-5 text-base">{error}</Text>
      )}
    </ScrollView>
  );
}
