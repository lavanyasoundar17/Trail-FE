// import React, { useState } from "react";
// import { StyleSheet, View, Button, Text, Image, Alert } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as Location from "expo-location";
// import MapView, { Marker } from "react-native-maps";
// import Ionicons from "@expo/vector-icons/Ionicons";

// // Define types for location state
// interface LocationCoords {
//   latitude: number;
//   longitude: number;
// }

// export default function TestScreen() {
//   const [photoUri, setPhotoUri] = useState<string | null>(null);
//   const [location, setLocation] = useState<LocationCoords | null>(null);

//   const pickImage = async () => {
//     try {
//       const permissionResult =
//         await ImagePicker.requestCameraPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert("Camera access is required to take a photo.");
//         return;
//       }

//       const result: ImagePicker.ImagePickerResult =
//         await ImagePicker.launchCameraAsync({
//           mediaTypes: "images",
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//         });

//       if (result.assets && result.assets.length > 0) {
//         setPhotoUri(result.assets[0].uri);
//         getLocation();
//       } else {
//         Alert.alert("No photo taken.");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         Alert.alert("Error taking photo:", error.message);
//       } else {
//         Alert.alert("An unknown error occurred.");
//       }
//     }
//   };

//   const getLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission to access location was denied");
//         return;
//       }

//       const currentLocation = await Location.getCurrentPositionAsync({});
//       if (currentLocation && currentLocation.coords) {
//         setLocation({
//           latitude: currentLocation.coords.latitude,
//           longitude: currentLocation.coords.longitude,
//         });
//       } else {
//         Alert.alert("Could not fetch location.");
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         Alert.alert("Error fetching location:", error.message);
//       } else {
//         Alert.alert("An unknown error occurred.");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Take a Photo" onPress={pickImage} />

//       {photoUri && location && (
//         <View style={styles.imageContainer}>
//           <Text>Your photo and location:</Text>
//           <Image source={{ uri: photoUri }} style={styles.image} />
//         </View>
//       )}

//       {location ? (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}
//         >
//           <Marker
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             title={"Your Location"}
//             description={`Lat: ${location.latitude}, Long: ${location.longitude}`}
//           >
//             <Ionicons name="location" size={24} color="black" />
//           </Marker>
//         </MapView>
//       ) : (
//         <Text>Loading location...</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 50,
//   },
//   imageContainer: {
//     marginTop: 20,
//     alignItems: "center",
//   },
//   image: {
//     width: 300,
//     height: 300,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "black",
//   },
//   map: {
//     width: "100%",
//     height: "50%",
//     marginTop: 20,
//   },
// });

// //move into app tab

import React, { useState } from "react";
import { StyleSheet, View, Button, Text, Image, Alert, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";

// Define types for location state
interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface Post {
  image_uri: string;
  description: string;
  created_at: string;
}

export default function TestScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Camera access is required to take a photo.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
        getLocation();
      } else {
        Alert.alert("No photo taken.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error taking photo:", error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      if (currentLocation && currentLocation.coords) {
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        fetchNearbyPosts();
      } else {
        Alert.alert("Could not fetch location.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error fetching location:", error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };

  const fetchNearbyPosts = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `http://https://trail-tales-be.onrender.com/api/posts?latitude=${location.latitude}&longitude=${location.longitude}`
      );
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
      } else {
        Alert.alert("No posts found nearby");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error fetching posts: ", error.message);
      } else {
        Alert.alert("An unknown error occurred.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Photo" onPress={pickImage} />

      {photoUri && location && (
        <View style={styles.imageContainer}>
          <Text>Your photo and location:</Text>
          <Image source={{ uri: photoUri }} style={styles.image} />
        </View>
      )}

      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={"Your Location"}
            description={`Lat: ${location.latitude}, Long: ${location.longitude}`}
          >
            <Ionicons name="location" size={24} color="black" />
          </Marker>
        </MapView>
      ) : (
        <Text>Loading location...</Text>
      )}

      {posts.length > 0 && (
        <View style={styles.postsContainer}>
          <Text>Nearby Posts:</Text>
          <FlatList
            data={posts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <Image source={{ uri: item.image_uri }} style={styles.postImage} />
                <Text>{item.description}</Text>
                <Text>{item.created_at}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  map: {
    width: "100%",
    height: "50%",
    marginTop: 20,
  },
  postsContainer: {
    width: "100%",
    padding: 10,
  },
  postCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
});
