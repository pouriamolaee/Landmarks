import * as FileSystem from 'expo-file-system';
import ENV from '../../env';

import { insertPlace, fetchPlaces } from '../../helpers/db';

export const ADD_PLACE = 'ADD_PLACE';
export const SET_PLACES = 'SET_PLACES';

export const addPlace = (title, image, location) => {
  return async dispatch => {
    const fileName = image.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;

    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location.longitude},${location.latitude}.json?access_token=${ENV.mapBoxToken}`);
    if (!res.ok) throw new Error('Something went wrong!');
    const resData = await res.json();
    if (!resData.features) throw new Error('Something went wrong!');
    const address = resData.features[0].place_name;

    try {
      await FileSystem.moveAsync({
        from: image,
        to: newPath
      });
      const dbResult = await insertPlace(
        title,
        newPath,
        address,
        location.latitude,
        location.longitude,
      );
      dispatch({
        type: ADD_PLACE, placeData: {
          id: dbResult.insertId,
          title: title,
          image: newPath,
          address,
          location
        }
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const loadPlaces = () => {
  return async dispatch => {
    try {
      const dbResult = await fetchPlaces();
      dispatch({ type: SET_PLACES, places: dbResult.rows._array });
    } catch (err) {
      throw err;
    }
  };
};