
=======================Scripts===============================
<script src="assets/casino/js/sfs2x-api-1.7.4.js"></script>
<script src="assets/busino/js/geocoder.js"></script>

========================Native or Module===============================
1. Storage
ionic cordova plugin add cordova-sqlite-storage
npm install --save @ionic/storage

2. Statusbar
ionic cordova plugin add cordova-plugin-statusbar
npm install --save @ionic-native/status-bar

3. DatePicker
ionic cordova plugin add cordova-plugin-datepicker
npm install --save @ionic-native/date-picker

4. Device
ionic cordova plugin add cordova-plugin-device
npm install --save @ionic-native/device

5. GoogleMap
AiaStore : com.appinasia.appih  
ios : AIzaSyCo95hQWBk-OIdnONgEoeM4NJrl59tz9dU
android : AIzaSyASvGt1up7hzsulG6mJVKHlbX155jr2Pws

ionic cordova plugin add https://github.com/mapsplugin/cordova-plugin-googlemaps#multiple_maps --variable API_KEY_FOR_ANDROID="AIzaSyASvGt1up7hzsulG6mJVKHlbX155jr2Pws" --variable API_KEY_FOR_IOS="AIzaSyCo95hQWBk-OIdnONgEoeM4NJrl59tz9dU"
npm install --save @ionic-native/google-maps

    - Crosswalk: cordova plugin add cordova-plugin-crosswalk-webview
        Add the below two lines into the config.xml
            <preference name="xwalkZOrderOnTop" value="true" />
            <preference name="BackgroundColor" value="0" />

6. Keyboard
ionic cordova plugin add ionic-plugin-keyboard
npm install --save @ionic-native/keyboard

thay android:windowSoftInputMode="adjustPan" vào mainifest android của activity chính.
7. md5
npm install ts-md5

8. chartjs
npm install chart.js --save

9. NetworkInformation
ionic cordova plugin add cordova-plugin-network-information
npm install --save @ionic-native/network

10. Google Analytics
ionic cordova plugin add cordova-plugin-google-analytics
npm install --save @ionic-native/google-analytics

11. AdmobFree
ionic cordova plugin add cordova-plugin-admob-free
npm install --save @ionic-native/admob-free
