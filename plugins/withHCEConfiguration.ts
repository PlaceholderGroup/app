import { ConfigPlugin, withAndroidManifest, withDangerousMod } from '@expo/config-plugins';
import fs from 'fs';
import path from 'path';

/**
 * Helper to create the aid_list.xml file in the res/xml folder
 */
const withAidListXml: ConfigPlugin = (config) => {
    return withDangerousMod(config, [
        'android',
        async (config) => {
            const resXmlDir = path.join(
                config.modRequest.platformProjectRoot,
                'app/src/main/res/xml'
            );

            // Ensure the directory exists
            if (!fs.existsSync(resXmlDir)) {
                fs.mkdirSync(resXmlDir, { recursive: true });
            }

            // Define the content of aid_list.xml
            const aidListContent = (
                `<?xml version="1.0" encoding="utf-8"?>
                <host-apdu-service xmlns:android="http://schemas.android.com/apk/res/android"
                                android:description="@string/app_name"
                                android:requireDeviceUnlock="false">
                    <aid-group android:category="other"
                                android:description="@string/app_name">
                        <aid-filter android:name="D2760000850101" />
                    </aid-group>
                </host-apdu-service>`
            );

            const filePath = path.join(resXmlDir, 'aid_list.xml');
            fs.writeFileSync(filePath, aidListContent);

            return config;
        },
    ]);
};

/**
 * Main Plugin: Updates AndroidManifest.xml
 */
const withHceManifest: ConfigPlugin = (config) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;
        const mainApplication = androidManifest.manifest.application?.[0];

        if (!mainApplication) {
            throw new Error('AndroidManifest.xml is missing the <application> tag');
        }

        // Helper to add unique elements to the manifest arrays
        const addUniqueTag = (array: any[], tagName: string, nameAttr: string, fullObj: any) => {
            const exists = array?.some((item: any) => item.$?.['android:name'] === nameAttr);
            if (!exists) {
                array.push(fullObj);
            }
        };

        // Add Permissions & Features safely
        androidManifest.manifest['uses-permission'] = androidManifest.manifest['uses-permission'] || [];
        addUniqueTag(androidManifest.manifest['uses-permission'], 'uses-permission', 'android.permission.NFC', {
            $: { 'android:name': 'android.permission.NFC' },
        });

        androidManifest.manifest['uses-feature'] = androidManifest.manifest['uses-feature'] || [];
        addUniqueTag(androidManifest.manifest['uses-feature'], 'uses-feature', 'android.hardware.nfc.hce', {
            $: { 'android:name': 'android.hardware.nfc.hce', 'android:required': 'true' },
        });

        // Add Service safely
        mainApplication.service = mainApplication.service || [];
        addUniqueTag(mainApplication.service, 'service', 'com.reactnativehce.services.CardService', {
            $: {
                'android:name': 'com.reactnativehce.services.CardService',
                'android:exported': 'true',
                'android:enabled': 'false',
                'android:permission': 'android.permission.BIND_NFC_SERVICE',
            },
            'intent-filter': [
                {
                    action: [{ $: { 'android:name': 'android.nfc.cardemulation.action.HOST_APDU_SERVICE' } }],
                    category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
                },
            ],
            'meta-data': [
                {
                    $: {
                        'android:name': 'android.nfc.cardemulation.host_apdu_service',
                        'android:resource': '@xml/aid_list',
                    },
                },
            ],
        });

        return config;
    });
};

const withHCEConfiguration: ConfigPlugin = (config) => {
    config = withAidListXml(config);
    config = withHceManifest(config);
    return config;
};

export default withHCEConfiguration;