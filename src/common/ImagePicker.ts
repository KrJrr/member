import ImagePicker, { Image } from 'react-native-image-crop-picker';

export const openCropPicker = (width: number, height: number) => {
    return new Promise<PickerImageType>(resolve => {
        ImagePicker.openPicker({
            cropping: true,
            width: width,
            height: height,
            mediaType: 'photo'
        }).then(img =>{
            const castedImage = img as PickerImageType
            if(castedImage) {
                resolve(castedImage)
            } else 
                resolve(null)
        }).catch(err => {
            console.log(err);
            // 시간 좀 끌고 해야 제대로 나온다
            if (err != null && err.code && err.code == 'E_PICKER_CANCELLED') {
                resolve(null);
            } else {
                if (err.code) {
                    resolve(null);
                } else {
                    resolve(null);
                }
            }
        })
    })
}
