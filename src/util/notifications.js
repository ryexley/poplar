import path from "path";
import notifier from "node-notifier";

export const notifyDeviceOff = device => {
    notifier.notify( {
        title: "Turn it on?",
        message: `Your camera is on, but "${ device.friendlyName }" is off. Do you wanna turn it on?`,
        icon: path.join( __dirname, "./app/icons/PlugIconTemplate@2x.png" ),
        sound: "Tink"
    } );
}

export const notifyDeviceOn = device => {
    notifier.notify( {
        title: "Turn it off?",
        message: `Your camera is off, but "${ device.friendlyName }" is on. Do you wanna turn it off?`,
        icon: path.join( __dirname, "./app/icons/PlugIconTemplate@2x.png" ),
        sound: "Tink"
    } );
}
