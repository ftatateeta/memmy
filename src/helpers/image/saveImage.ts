import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import { writeToLog } from '@src/helpers';
import { setToast } from '@src/state';
import { getCachePath } from '@root/modules/expo-image-cache-path';

export const saveImage = async (source: string): Promise<void> => {
  // Use SDWebImage to get the cache path
  const localUri = getCachePath(source);

  // Make sure that we have a valid URI
  if (localUri == null) {
    setToast({
      text: 'Error saving image...',
    });

    return;
  }

  // Make sure we have permission to save images
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  if (status !== 'granted') {
    Alert.alert(
      'Permissions Error',
      'Please allow Memmy access to your camera roll to save images.',
    );

    return;
  }

  // Try to save the image
  try {
    await MediaLibrary.createAssetAsync(localUri);

    setToast({
      text: 'Image saved successfully!',
    });
  } catch (e: any) {
    writeToLog(e.toString());

    setToast({
      text: 'Error saving image...',
    });
  }
};
