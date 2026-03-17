import { Linking, Platform } from "react-native";

type LinkType = "email" | "sms" | "tel" | "video";

export async function openLink(data: string, type: LinkType): Promise<boolean> {
    let url = "";
    switch (type) {
        case "email":
            url = `mailto:${data}`;
            break;

        case "sms":
            url = `sms:${data}`;
            break;

        case "tel":
            url = `tel:${data}`;
            break;

        case "video":
            url = Platform.select({
                ios: `facetime:${data}`,
                android: `tel:${data}`,
            }) || "";
            
            // TODO: Get this working on Android
            // console.log(data.replaceAll(/\D/g, ""));
            // Linking.sendIntent("com.android.phone.videocall", [
            //     {
            //         key: "videoCall",
            //         value: true,
            //     },
            //     {
            //         key: "data",
            //         value: data,
            //     }
            // ]);

            break;

        default:
            break;
    }
    const isValidURL = await Linking.canOpenURL(url);
    if (isValidURL) {
        Linking.openURL(url);
    } else {
        console.log("invalid url!");
    }
    return isValidURL;
};